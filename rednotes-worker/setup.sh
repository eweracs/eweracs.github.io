#!/bin/sh
# Set up rednotes on Cloudflare and on this Mac. Run once, after `npx wrangler login`:
#   sh rednotes-worker/setup.sh
# It is safe to run again: existing parts are reused.
set -eu
cd "$(dirname "$0")"
W="npx --yes wrangler"

echo "1/5 telegram-worker: deploy it with the Notifier entrypoint rednotes uses"
(cd ../telegram-worker && $W deploy)

echo "2/5 Database"
if grep -q 'database_id = "SET-BY-SETUP"' wrangler.toml; then
  out=$($W d1 create rednotes 2>&1) || { echo "$out"; exit 1; }
  id=$(printf '%s' "$out" | grep -Eo '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | head -1)
  [ -n "$id" ] || { echo "$out"; echo "Could not read the database id."; exit 1; }
  sed -i '' "s/SET-BY-SETUP/$id/" wrangler.toml
fi
$W d1 execute rednotes --remote --file schema.sql -y

echo "3/5 Deploy rednotes-worker"
out=$($W deploy 2>&1) || { echo "$out"; exit 1; }
echo "$out"
url=$(printf '%s' "$out" | grep -Eo 'https://rednotes-worker\.[A-Za-z0-9.-]+\.workers\.dev' | head -1)
[ -n "$url" ] || { echo "Could not read the Worker address."; exit 1; }

echo "4/5 Shared secret: Keychain item \"rednotes\" on this Mac, REDNOTES_SECRET on the Worker"
if ! security find-generic-password -s rednotes -a secret -w >/dev/null 2>&1; then
  secret=$(openssl rand -base64 32 | tr '+/' '-_' | tr -d '=\n')
  # through stdin, so the secret is not in the process list
  printf 'add-generic-password -s rednotes -a secret -l rednotes -w %s\n' "$secret" | security -i
fi
secret=$(security find-generic-password -s rednotes -a secret -w)
[ -n "$secret" ] || { echo "The Keychain returned an empty secret."; exit 1; }
printf '%s' "$secret" | $W secret put REDNOTES_SECRET
unset secret

echo "5/5 Settings for the Glyphs plug-in"
mkdir -p "$HOME/Library/Application Support/rednotes"
printf '{\n  "url": "%s",\n  "viewer": "https://www.sebastiancarewe.com/rednotes/"\n}\n' "$url" > "$HOME/Library/Application Support/rednotes/config.json"
echo "Done. Worker: $url"
