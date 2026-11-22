# rednotes Worker

Receives clients' notes from the rednotes page (`/rednotes/`, built from the rednotes
repo with `tools/build.py --site public/rednotes`) and keeps them for the Glyphs
plug-in's *Sync Notes*.

- Notes arrive **encrypted in the browser** with the proof's key. The Worker stores only
  ciphertext, a count and a label ("Mona Sans Proof 3") for the Telegram message.
- `POST /v1/notes` needs the proof's write token, `HMAC(REDNOTES_SECRET, "write:" + proofId)`,
  which is in the proof file. There is one row per proof and browser, and a new send
  replaces that browser's previous one. It is rate-limited and size-limited.
- `GET /v1/notes?proof=<id>` needs the admin key, `HMAC(REDNOTES_SECRET, "admin")`, which
  only the designer's Mac derives (from the Keychain item "rednotes").
- Telegram messages go through `telegram-worker`'s `Notifier` entrypoint (service
  binding), so the bot token stays there. At most one message a minute per proof.

## Set up

```bash
npx wrangler login
sh rednotes-worker/setup.sh
```

The script deploys `telegram-worker` (for the `Notifier` entrypoint), creates the D1
database and fills in its id, applies `schema.sql`, deploys this Worker, creates the
shared secret (Keychain + Worker) and writes the plug-in's
`~/Library/Application Support/rednotes/config.json`. It's safe to run again.

## Local test

```bash
cd rednotes-worker
printf 'REDNOTES_SECRET=test-secret\n' > .dev.vars
npx wrangler d1 execute rednotes --local --file schema.sql -y
npx wrangler dev --local --port 8787
```

Give a test proof file `"url": "http://127.0.0.1:8787"` and serve the page on port 8765,
which is in `ALLOWED_ORIGINS`. Locally the Telegram binding isn't connected; the Worker
logs that and still accepts the notes.
