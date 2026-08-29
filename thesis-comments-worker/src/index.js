const MAX_BODY = 8000;
const MAX_AUTHOR = 100;
const MAX_ANCHOR = 2000;

function jsonResponse(data, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set('Content-Type', 'application/json; charset=utf-8');
  return new Response(JSON.stringify(data), { ...init, headers });
}

function normalizeOrigin(value) {
  if (!value) {
    return null;
  }
  return value.replace(/\/$/, '').toLowerCase();
}

function getAllowedOrigins(env) {
  const raw = env.ALLOWED_ORIGINS || '';
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map((origin) => origin.replace(/\/$/, '').toLowerCase());
}

function getCorsHeaders(origin, allowedOrigins) {
  if (!origin) {
    return {};
  }

  if (!allowedOrigins.length) {
    return {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    };
  }

  const normalizedOrigin = normalizeOrigin(origin);
  if (normalizedOrigin && allowedOrigins.includes(normalizedOrigin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    };
  }

  return {};
}

async function timingSafeEqual(a, b) {
  // Hashing first gives equal-length inputs, so the comparison leaks nothing.
  const enc = new TextEncoder();
  const [da, db] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(a)),
    crypto.subtle.digest('SHA-256', enc.encode(b)),
  ]);
  const va = new Uint8Array(da);
  const vb = new Uint8Array(db);
  let diff = 0;
  for (let i = 0; i < va.length; i += 1) {
    diff |= va[i] ^ vb[i];
  }
  return diff === 0;
}

async function authorized(request, env) {
  if (!env.PASSWORD) {
    return false;
  }
  const header = request.headers.get('Authorization') || '';
  const match = header.match(/^Bearer\s+(.+)$/);
  if (!match) {
    return false;
  }
  return timingSafeEqual(match[1], env.PASSWORD);
}

function clip(value, max) {
  if (typeof value !== 'string') {
    return null;
  }
  return value.length > max ? value.slice(0, max) : value;
}

async function listComments(env, doc) {
  const { results } = await env.DB.prepare(
    'select id, doc, parent, author, body, exact, prefix, suffix, section, resolved, created_at from comments where doc = ? order by id',
  )
    .bind(doc)
    .all();
  return results;
}

async function createComment(env, payload) {
  const doc = clip(payload.doc, 10);
  const author = clip(payload.author, MAX_AUTHOR);
  const body = clip(payload.body, MAX_BODY);
  if (!doc || !author || !author.trim() || !body || !body.trim()) {
    return { error: 'doc, author and body are required' };
  }

  const parent = Number.isInteger(payload.parent) ? payload.parent : null;
  const exact = clip(payload.exact, MAX_ANCHOR);
  const prefix = clip(payload.prefix, 200);
  const suffix = clip(payload.suffix, 200);
  const section = clip(payload.section, 300);

  const result = await env.DB.prepare(
    'insert into comments (doc, parent, author, body, exact, prefix, suffix, section) values (?, ?, ?, ?, ?, ?, ?, ?) returning id, doc, parent, author, body, exact, prefix, suffix, section, resolved, created_at',
  )
    .bind(doc, parent, author.trim(), body, exact, prefix, suffix, section)
    .first();
  return { comment: result };
}

async function setResolved(env, id, resolved) {
  const result = await env.DB.prepare(
    'update comments set resolved = ? where id = ? returning id, resolved',
  )
    .bind(resolved ? 1 : 0, id)
    .first();
  return result || null;
}

async function deleteComment(env, id) {
  await env.DB.prepare('delete from comments where id = ? or parent = ?').bind(id, id).run();
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');
    const corsHeaders = getCorsHeaders(origin, getAllowedOrigins(env));

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (!(await authorized(request, env))) {
      return jsonResponse({ error: 'unauthorized' }, { status: 401, headers: corsHeaders });
    }

    try {
      if (url.pathname === '/comments' && request.method === 'GET') {
        const doc = url.searchParams.get('doc') || 'en';
        return jsonResponse({ comments: await listComments(env, doc) }, { headers: corsHeaders });
      }

      if (url.pathname === '/comments' && request.method === 'POST') {
        const payload = await request.json().catch(() => null);
        if (!payload) {
          return jsonResponse({ error: 'invalid JSON' }, { status: 400, headers: corsHeaders });
        }
        const outcome = await createComment(env, payload);
        if (outcome.error) {
          return jsonResponse(outcome, { status: 400, headers: corsHeaders });
        }
        return jsonResponse(outcome, { status: 201, headers: corsHeaders });
      }

      const action = url.pathname.match(/^\/comments\/(\d+)\/(resolve|reopen|delete)$/);
      if (action && request.method === 'POST') {
        const id = Number(action[1]);
        if (action[2] === 'delete') {
          await deleteComment(env, id);
          return jsonResponse({ ok: true }, { headers: corsHeaders });
        }
        const result = await setResolved(env, id, action[2] === 'resolve');
        if (!result) {
          return jsonResponse({ error: 'not found' }, { status: 404, headers: corsHeaders });
        }
        return jsonResponse(result, { headers: corsHeaders });
      }

      return jsonResponse({ error: 'not found' }, { status: 404, headers: corsHeaders });
    } catch (error) {
      return jsonResponse({ error: String(error) }, { status: 500, headers: corsHeaders });
    }
  },
};
