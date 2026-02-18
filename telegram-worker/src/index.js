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

async function verifyTurnstile(token, secret, remoteip) {
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (remoteip) {
    form.append('remoteip', remoteip);
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  });

  if (!response.ok) {
    return { success: false };
  }

  return response.json();
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

    if (pathname !== '/notify' || request.method !== 'POST') {
      return jsonResponse({ error: 'not found' }, { status: 404, headers: corsHeaders });
    }

    const botToken = env.TELEGRAM_BOT_TOKEN;
    const chatId = env.TELEGRAM_CHAT_ID;
    const turnstileSecret = env.TURNSTILE_SECRET_KEY;

    if (!botToken || !chatId || !turnstileSecret) {
      return jsonResponse({ error: 'missing server configuration' }, { status: 500, headers: corsHeaders });
    }

    let payload;
    try {
      payload = await request.json();
    } catch (err) {
      return jsonResponse({ error: 'invalid JSON' }, { status: 400, headers: corsHeaders });
    }

    const token = payload?.turnstileToken;
    if (!token) {
      return jsonResponse({ error: 'missing turnstile token' }, { status: 400, headers: corsHeaders });
    }

    const verification = await verifyTurnstile(
      token,
      turnstileSecret,
      request.headers.get('CF-Connecting-IP')
    );

    if (!verification?.success) {
      return jsonResponse({ error: 'verification failed' }, { status: 403, headers: corsHeaders });
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
