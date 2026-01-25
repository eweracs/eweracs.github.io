const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json({ limit: '64kb' }));

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
const PUBLIC_SITE_BASE = process.env.PUBLIC_SITE_BASE;
const SHORTENER_TOKEN = process.env.SHORTENER_TOKEN;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)
  .map((origin) => origin.replace(/\/$/, '').toLowerCase());

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

if (!PUBLIC_SITE_BASE) {
  throw new Error('PUBLIC_SITE_BASE is required');
}

if (!SHORTENER_TOKEN) {
  throw new Error('SHORTENER_TOKEN is required');
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL.includes('sslmode=require') ? { rejectUnauthorized: false } : undefined,
});

const SHORT_ID_LENGTH = 6;
const SHORT_ID_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function setCorsHeaders(req, res) {
  if (!ALLOWED_ORIGINS.length) {
    return;
  }

  const origin = req.headers.origin;
  const normalizedOrigin = origin ? origin.replace(/\/$/, '').toLowerCase() : null;
  if (normalizedOrigin && ALLOWED_ORIGINS.includes(normalizedOrigin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
}

app.use((req, res, next) => {
  setCorsHeaders(req, res);
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

function randomShortId(length = SHORT_ID_LENGTH) {
  let result = '';
  for (let i = 0; i < length; i += 1) {
    const index = Math.floor(Math.random() * SHORT_ID_ALPHABET.length);
    result += SHORT_ID_ALPHABET[index];
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

function getAuthToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice('Bearer '.length);
  }

  const headerToken = req.headers['x-shortener-token'];
  if (Array.isArray(headerToken)) {
    return headerToken[0];
  }

  return headerToken;
}

async function ensureSchema() {
  const client = await pool.connect();
  try {
    await client.query(`
      create table if not exists short_links (
        id serial primary key,
        short_id varchar(6) unique not null,
        drive_id text not null,
        name text,
        created_at timestamp with time zone default now()
      );
    `);
  } finally {
    client.release();
  }
}

async function createShortLink({ driveId, name }) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const shortId = randomShortId();
    try {
      const result = await pool.query(
        `
          insert into short_links (short_id, drive_id, name)
          values ($1, $2, $3)
          returning short_id, drive_id, name
        `,
        [shortId, driveId, name || null]
      );
      return result.rows[0];
    } catch (err) {
      if (err.code === '23505') {
        continue;
      }
      throw err;
    }
  }

  throw new Error('Failed to create unique short id');
}

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/resolve/:shortId', async (req, res) => {
  const shortId = req.params.shortId;
  if (!shortId) {
    return res.status(400).json({ error: 'shortId is required' });
  }

  try {
    const result = await pool.query(
      'select drive_id, name from short_links where short_id = $1',
      [shortId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'not found' });
    }

    const row = result.rows[0];
    return res.json({ driveId: row.drive_id, name: row.name || undefined });
  } catch (err) {
    console.error('Resolve failed', err);
    return res.status(500).json({ error: 'resolve failed' });
  }
});

app.post('/shorten', async (req, res) => {
  const authToken = getAuthToken(req);
  if (authToken !== SHORTENER_TOKEN) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const { driveUrl, driveId: rawDriveId, name } = req.body || {};
  const driveId = rawDriveId || parseDriveId(driveUrl);

  if (!driveId) {
    return res.status(400).json({ error: 'driveId or driveUrl is required' });
  }

  try {
    const link = await createShortLink({ driveId, name });
    const base = PUBLIC_SITE_BASE.replace(/\/$/, '');
    const shortUrl = `${base}/download?${link.short_id}`;
    const shortUrlLong = `${base}/download?short=${link.short_id}`;
    return res.json({
      shortId: link.short_id,
      driveId: link.drive_id,
      name: link.name || undefined,
      shortUrl,
      shortUrlLong,
    });
  } catch (err) {
    console.error('Shorten failed', err);
    return res.status(500).json({ error: 'shorten failed' });
  }
});

ensureSchema()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Shortener service listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start', err);
    process.exit(1);
  });
