# thesis-comments-worker

Comment backend for the password-protected thesis review pages at
`sebastiancarewe.com/thesis/` (built by `materials/build_web.py` in the thesis
repo). Stores anchored comments in a D1 database; every request — reads
included — must carry the shared review password as `Authorization: Bearer …`,
the same password that decrypts the pages themselves.

## Endpoints

| method | path | body |
|---|---|---|
| GET | `/comments?doc=en\|fr` | – |
| POST | `/comments` | `{doc, author, body, exact?, prefix?, suffix?, section?, parent?}` |
| POST | `/comments/:id/resolve` | – |
| POST | `/comments/:id/reopen` | – |
| POST | `/comments/:id/delete` | – (also deletes replies) |

## First deploy

```sh
cd thesis-comments-worker
npx wrangler d1 create thesis-comments-db        # copy the database_id into wrangler.toml
npx wrangler d1 execute thesis-comments-db --remote --file schema.sql
npx wrangler secret put PASSWORD                 # the review password, same as the pages
npx wrangler deploy                              # prints the workers.dev URL
```

Then rebuild the pages with that URL:
`python3 materials/build_web.py --api https://thesis-comments-worker.<account>.workers.dev`.

## Local dev

```sh
echo 'PASSWORD=dev' > .dev.vars
npx wrangler d1 execute thesis-comments-db --local --file schema.sql
npx wrangler dev        # serves on http://localhost:8787
```

The review pages talk to `localhost:8787` automatically when they are served
from `localhost`.

## Export

Comments are pulled back into the thesis repo with
`python3 materials/fetch_comments.py`, which maps each anchored quote to the
`chapters/*.md` line it came from.
