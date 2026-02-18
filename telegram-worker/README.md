# Cloudflare Worker Telegram Notifier

This worker accepts a POST request from the static site and sends a Telegram
message without exposing the bot token or chat ID in the client bundle.

## Endpoints

- `POST /notify` body:
  - `fileName` (string, optional)
  - no auth fields (CORS + origin allowlist only)

## Deploy

```bash
wrangler deploy telegram-worker/src/index.js --config telegram-worker/wrangler.toml
```

## Environment variables (secrets)

```bash
wrangler secret put TELEGRAM_BOT_TOKEN --config telegram-worker/wrangler.toml
wrangler secret put TELEGRAM_CHAT_ID --config telegram-worker/wrangler.toml
wrangler secret put ALLOWED_ORIGINS --config telegram-worker/wrangler.toml
```

Recommended values:
- `ALLOWED_ORIGINS` = `https://sebastiancarewe.com,https://www.sebastiancarewe.com`

## Client config

Set this in your GitHub Actions / local env:
- `NEXT_PUBLIC_TELEGRAM_WORKER_URL` = your worker URL
