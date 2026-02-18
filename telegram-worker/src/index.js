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
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
  }

  const normalizedOrigin = normalizeOrigin(origin);
  if (normalizedOrigin && allowedOrigins.includes(normalizedOrigin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
  }

  return {};
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
    const allowedOrigins = getAllowedOrigins(env);
    const origin = request.headers.get('Origin');
    const corsHeaders = getCorsHeaders(origin, allowedOrigins);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (pathname !== '/notify' || request.method !== 'POST') {
      return jsonResponse({ error: 'not found' }, { status: 404, headers: corsHeaders });
    }

    const botToken = env.TELEGRAM_BOT_TOKEN;
    const chatId = env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return jsonResponse({ error: 'missing server configuration' }, { status: 500, headers: corsHeaders });
    }

    if (allowedOrigins.length) {
      const normalizedOrigin = normalizeOrigin(origin);
      if (!normalizedOrigin || !allowedOrigins.includes(normalizedOrigin)) {
        return jsonResponse({ error: 'origin not allowed' }, { status: 403, headers: corsHeaders });
      }
    }

    let payload;
    try {
      payload = await request.json();
    } catch (err) {
      return jsonResponse({ error: 'invalid JSON' }, { status: 400, headers: corsHeaders });
    }

    const fileName = String(payload?.fileName || 'Download File').trim() || 'Download File';
    const time = new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Europe/Berlin',
    });
    const message = `📥 ${fileName} was downloaded at ${time}`;

    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    if (!telegramResponse.ok) {
      return jsonResponse({ error: 'telegram request failed' }, { status: 502, headers: corsHeaders });
    }

    return jsonResponse({ ok: true }, { status: 200, headers: corsHeaders });
  },
};
