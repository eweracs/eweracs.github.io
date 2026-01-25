const SHORT_ID_LENGTH = 6;
const SHORT_ID_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

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
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Shortener-Token',
    };
  }

  const normalizedOrigin = normalizeOrigin(origin);
  if (normalizedOrigin && allowedOrigins.includes(normalizedOrigin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Shortener-Token',
    };
  }

  return {};
}

function randomShortId() {
  const bytes = new Uint8Array(SHORT_ID_LENGTH);
  crypto.getRandomValues(bytes);
  let result = '';
  for (let i = 0; i < SHORT_ID_LENGTH; i += 1) {
    result += SHORT_ID_ALPHABET[bytes[i] % SHORT_ID_ALPHABET.length];
  }
  return result;
}

function parseDriveId(input) {
  if (!input) {
    return null;
  }

  try {
    const url = new URL(input);
    const idParam = url.searchParams.get('id');
    if (idParam) {
      return idParam;
    }

    const match = url.pathname.match(/\/d\/([^/]+)/);
    if (match) {
      return match[1];
    }
  } catch (err) {
    return null;
  }

  return null;
}

function getAuthToken(request) {
  const headerToken = request.headers.get('X-Shortener-Token');
  if (headerToken) {
    return headerToken;
  }

  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice('Bearer '.length);
  }

  return null;
}

async function resolveShortId(db, shortId) {
  const statement = db.prepare(
    'select drive_id, name from short_links where short_id = ?1'
  );
  const result = await statement.bind(shortId).first();
  return result || null;
}

async function createShortLink(db, driveId, name) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const shortId = randomShortId();
    try {
      const statement = db.prepare(
        'insert into short_links (short_id, drive_id, name) values (?1, ?2, ?3)'
      );
      await statement.bind(shortId, driveId, name || null).run();
      return { shortId, driveId, name: name || null };
    } catch (err) {
      if (String(err).includes('UNIQUE constraint failed')) {
        continue;
      }
      throw err;
    }
  }

  throw new Error('Failed to create unique short id');
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
    const allowedOrigins = getAllowedOrigins(env);
    const corsHeaders = getCorsHeaders(request.headers.get('Origin'), allowedOrigins);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (pathname === '/health') {
      return jsonResponse({ ok: true }, { headers: corsHeaders });
    }

    if (pathname.startsWith('/resolve/')) {
      const shortId = pathname.replace('/resolve/', '');
      if (!shortId) {
        return jsonResponse({ error: 'shortId is required' }, { status: 400, headers: corsHeaders });
      }

      try {
        const result = await resolveShortId(env.DB, shortId);
        if (!result) {
          return jsonResponse({ error: 'not found' }, { status: 404, headers: corsHeaders });
        }

        return jsonResponse(
          { driveId: result.drive_id, name: result.name || undefined },
          { headers: corsHeaders }
        );
      } catch (err) {
        return jsonResponse({ error: 'resolve failed' }, { status: 500, headers: corsHeaders });
      }
    }

    if (pathname === '/shorten' && request.method === 'POST') {
      const authToken = getAuthToken(request);
      if (!env.SHORTENER_TOKEN || authToken !== env.SHORTENER_TOKEN) {
        return jsonResponse({ error: 'unauthorized' }, { status: 401, headers: corsHeaders });
      }

      let payload;
      try {
        payload = await request.json();
      } catch (err) {
        return jsonResponse({ error: 'invalid JSON' }, { status: 400, headers: corsHeaders });
      }

      const driveId = payload.driveId || parseDriveId(payload.driveUrl);
      if (!driveId) {
        return jsonResponse(
          { error: 'driveId or driveUrl is required' },
          { status: 400, headers: corsHeaders }
        );
      }

      try {
        const link = await createShortLink(env.DB, driveId, payload.name);
        const base = (env.PUBLIC_SITE_BASE || '').replace(/\/$/, '');
        const shortUrl = `${base}/download?${link.shortId}`;
        const shortUrlLong = `${base}/download?short=${link.shortId}`;

        return jsonResponse(
          {
            shortId: link.shortId,
            driveId: link.driveId,
            name: link.name || undefined,
            shortUrl,
            shortUrlLong,
          },
          { headers: corsHeaders }
        );
      } catch (err) {
        return jsonResponse({ error: 'shorten failed' }, { status: 500, headers: corsHeaders });
      }
    }

    return jsonResponse({ error: 'not found' }, { status: 404, headers: corsHeaders });
  },
};
