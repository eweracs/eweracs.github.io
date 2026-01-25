# Shortener Service (Railway)

This service generates 6-character short IDs for Google Drive downloads and resolves them for your static `/download` page.

## Endpoints

### `POST /shorten`

Creates a short ID from a Drive URL or Drive ID.

Request:

```json
{
  "driveUrl": "https://drive.google.com/file/d/FILE_ID/view?usp=sharing",
  "name": "My File"
}
```

Response:

```json
{
  "shortId": "a1B2c3",
  "driveId": "FILE_ID",
  "name": "My File",
  "shortUrl": "https://myurl.com/download?short=a1B2c3"
}
```

### `GET /resolve/:shortId`

Resolves a short ID to a Drive ID and name.

Response:

```json
{
  "driveId": "FILE_ID",
  "name": "My File"
}
```

## Railway setup

1. Create a new Railway project.
2. Add a PostgreSQL database in Railway.
3. Create a new service from this repository and set the root directory to `shortener-service`.
4. Set environment variables:
   - `DATABASE_URL` (from Railway Postgres)
   - `PUBLIC_SITE_BASE` (e.g. `https://myurl.com`)
   - `ALLOWED_ORIGINS` (comma-separated origins, e.g. `https://myurl.com`)
   - `SHORTENER_TOKEN` (a long random string)
5. Deploy. The service will auto-create the `short_links` table on startup.

## Wiring the static site

Set the API base for the static Next.js build:

```bash
NEXT_PUBLIC_SHORTENER_API_BASE=https://your-railway-app.up.railway.app
```

Then rebuild and redeploy the static site.

## Creating short links securely

The `/shorten` endpoint requires a token. You can call it from your Mac using the included script:

```bash
cd shortener-service
SHORTENER_API_BASE=https://your-railway-app.up.railway.app \
SHORTENER_TOKEN=your-secret-token \
node scripts/shorten.js "https://drive.google.com/file/d/FILE_ID/view" "My File"
```

It prints the short URL you can share.

## Local run

```bash
cd shortener-service
npm install
npm start
```
