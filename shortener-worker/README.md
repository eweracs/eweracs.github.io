# Cloudflare Worker Shortener (Free)

This is a Cloudflare Worker + D1 version of the shortener service. It is free on the Cloudflare free tier.

## What it does

- `POST /shorten` creates a 6-character short ID.
- `GET /resolve/:shortId` returns the Drive ID and name.

## Setup (one-time)

1) Install Wrangler (Cloudflare CLI) on your Mac:

```bash
npm install -g wrangler
```

2) Log in:

```bash
wrangler login
```

3) Create a D1 database:

```bash
wrangler d1 create shortener-db
```

Copy the `database_id` value and paste it into `shortener-worker/wrangler.toml`.

4) Initialize the schema:

```bash
wrangler d1 execute shortener-db --file=shortener-worker/schema.sql
```

## Deploy

```bash
wrangler deploy shortener-worker/src/index.js --config shortener-worker/wrangler.toml
```

## Environment variables (secrets)

```bash
wrangler secret put SHORTENER_TOKEN --config shortener-worker/wrangler.toml
wrangler secret put PUBLIC_SITE_BASE --config shortener-worker/wrangler.toml
wrangler secret put ALLOWED_ORIGINS --config shortener-worker/wrangler.toml
```

Recommended values:
- `PUBLIC_SITE_BASE` = `https://sebastiancarewe.com`
- `ALLOWED_ORIGINS` = `https://sebastiancarewe.com,https://www.sebastiancarewe.com`
- `SHORTENER_TOKEN` = a long random string

## Update your Alfred workflow

Set `SHORTENER_API_BASE` to the Worker URL:

```
https://<your-worker-name>.<your-account>.workers.dev
```

## Notes

- If you want a custom domain, add it in the Cloudflare dashboard for Workers.
- If `ALLOWED_ORIGINS` is not set, the Worker allows all origins for CORS.
