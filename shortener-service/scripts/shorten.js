#!/usr/bin/env node

const url = process.env.SHORTENER_API_BASE;
const token = process.env.SHORTENER_TOKEN;

if (!url || !token) {
  console.error('Missing SHORTENER_API_BASE or SHORTENER_TOKEN.');
  process.exit(1);
}

const [, , driveUrl, name] = process.argv;

if (!driveUrl) {
  console.error('Usage: SHORTENER_API_BASE=... SHORTENER_TOKEN=... node scripts/shorten.js <driveUrl> [name]');
  process.exit(1);
}

async function run() {
  const response = await fetch(`${url.replace(/\/$/, '')}/shorten`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      driveUrl,
      name,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`Request failed (${response.status}): ${text}`);
    process.exit(1);
  }

  const data = await response.json();
  console.log(data.shortUrl);
}

run().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
