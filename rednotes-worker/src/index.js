// rednotes Worker: receives clients' notes from the rednotes page and keeps them for the
// Glyphs plug-in (File › rednotes › Sync Notes). Notes arrive encrypted in the browser
// with a key only the proof file and the designer have; this Worker never sees them in
// the clear. It checks a per-proof write token, stores the encrypted message per sender,
// and pings Telegram (through the telegram-worker's Notifier entrypoint).
//
// Secrets: REDNOTES_SECRET. Write tokens and the admin key are derived from it, so
// no proof has to be registered:
//   write token = base64url(HMAC-SHA256(secret, "write:" + proofId))
//   admin key   = base64url(HMAC-SHA256(secret, "admin"))

const MAX_BODY = 600_000;          // bytes
const MAX_CT = 500_000;            // base64 characters of one encrypted message
const MAX_SENDERS = 200;           // browser + proof combinations per proof folder
const MIN_INTERVAL = 5;            // seconds between two sends from one browser
const NOTIFY_INTERVAL = 60;        // seconds between two Telegram messages for one proof

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function allowedOrigins(env) {
  return (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim().replace(/\/$/, '').toLowerCase())
    .filter(Boolean);
}

function cors(request, env) {
  const origin = request.headers.get('Origin');
  if (!origin) return {};
  const ok = allowedOrigins(env).includes(origin.replace(/\/$/, '').toLowerCase());
  if (!ok) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function b64url(bytes) {
  let bin = '';
  for (const b of new Uint8Array(bytes)) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function derive(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(message)));
}

async function sameText(a, b) {
  // hash first so the comparison takes the same time whatever the input
  const enc = new TextEncoder();
  const [x, y] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(a)), crypto.subtle.digest('SHA-256', enc.encode(b))]);
  const va = new Uint8Array(x);
  const vb = new Uint8Array(y);
  let diff = 0;
  for (let i = 0; i < va.length; i += 1) diff |= va[i] ^ vb[i];
  return diff === 0;
}

async function hasToken(request, env, expectedMessage) {
  if (!env.REDNOTES_SECRET) return false;
  const match = (request.headers.get('Authorization') || '').match(/^Bearer\s+([A-Za-z0-9_-]{20,100})$/);
  if (!match) return false;
  return sameText(match[1], await derive(env.REDNOTES_SECRET, expectedMessage));
}

const isB64 = (s, max) => typeof s === 'string' && s.length > 0 && s.length <= max && /^[A-Za-z0-9+/=]+$/.test(s);
const PROOF = /^[A-Za-z0-9_-]{6,64}$/;
const SENDER = /^[A-Za-z0-9_-]{8,64}$/;

async function notify(env, text) {
  try {
    if (env.TELEGRAM && typeof env.TELEGRAM.send === 'function') await env.TELEGRAM.send(text);
  } catch (err) {
    console.log('telegram notify failed', String(err));
  }
}

async function receive(request, env, headers, ctx) {
  const length = Number(request.headers.get('Content-Length') || 0);
  if (length > MAX_BODY) return json({ error: 'too large' }, 413, headers);
  const raw = await request.text();
  if (raw.length > MAX_BODY) return json({ error: 'too large' }, 413, headers);
  let body;
  try {
    body = JSON.parse(raw);
  } catch (err) {
    return json({ error: 'invalid JSON' }, 400, headers);
  }
  const { proof, sender, iv, ct, tag } = body || {};
  if (!PROOF.test(proof || '') || !SENDER.test(sender || '')) return json({ error: 'invalid proof or sender' }, 400, headers);
  if (!(await hasToken(request, env, `write:${proof}`))) return json({ error: 'unauthorized' }, 401, headers);
  if (!isB64(iv, 64) || !isB64(ct, MAX_CT) || !isB64(tag, 64)) return json({ error: 'invalid message' }, 400, headers);
  const count = Math.max(0, Math.min(100000, Number.parseInt(body.count, 10) || 0));
  const now = Math.floor(Date.now() / 1000);

  const prev = await env.DB.prepare('select count, updated from notes where proof = ? and sender = ?').bind(proof, sender).first();
  if (prev && now - prev.updated < MIN_INTERVAL) return json({ error: 'too many requests' }, 429, headers);
  if (!prev) {
    const senders = await env.DB.prepare('select count(*) as n from notes where proof = ?').bind(proof).first();
    if (senders && senders.n >= MAX_SENDERS) return json({ error: 'too many senders' }, 429, headers);
  }
  await env.DB.prepare(
    `insert into notes (proof, sender, count, iv, ct, tag, created, updated)
     values (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?7)
     on conflict (proof, sender) do update set count = ?3, iv = ?4, ct = ?5, tag = ?6, updated = ?7`,
  ).bind(proof, sender, count, iv, ct, tag, now).run();

  const p = await env.DB.prepare('select notified from proofs where proof = ?').bind(proof).first();
  if (!p || now - p.notified >= NOTIFY_INTERVAL) {
    await env.DB.prepare('insert into proofs (proof, notified) values (?1, ?2) on conflict (proof) do update set notified = ?2').bind(proof, now).run();
    const added = prev ? count - prev.count : count;
    const delta = added > 0 ? ` (+${added})` : '';
    const text = `🖍 rednotes: ${count} ${count === 1 ? 'note' : 'notes'} received${delta} · proof ${proof.slice(0, 8)}`;
    ctx.waitUntil(notify(env, text));
  }
  return json({ ok: true }, 200, headers);
}

async function list(request, env, headers, url) {
  if (!(await hasToken(request, env, 'admin'))) return json({ error: 'unauthorized' }, 401, headers);
  const proofs = url.searchParams.getAll('proof').filter((p) => PROOF.test(p)).slice(0, 50);
  if (!proofs.length) return json({ error: 'missing proof' }, 400, headers);
  const marks = proofs.map(() => '?').join(',');
  const { results } = await env.DB.prepare(
    `select proof, sender, count, iv, ct, tag, created, updated from notes where proof in (${marks}) order by updated`,
  ).bind(...proofs).all();
  const notes = results.map((r) => ({ ...r, updated_at: new Date(r.updated * 1000).toISOString() }));
  return json({ notes }, 200, headers);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const headers = cors(request, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    try {
      if (url.pathname === '/v1/notes' && request.method === 'POST') return await receive(request, env, headers, ctx);
      if (url.pathname === '/v1/notes' && request.method === 'GET') return await list(request, env, headers, url);
      return json({ error: 'not found' }, 404, headers);
    } catch (err) {
      console.log('error', String(err && err.stack || err));
      return json({ error: 'server error' }, 500, headers);
    }
  },
};
