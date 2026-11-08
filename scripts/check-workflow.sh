#!/usr/bin/env bash
# Usage: scripts/check-workflow.sh n8n/workflows/*.json
# Checks exported n8n workflows before they are committed.
cd "$(dirname "$0")/.." || exit 1
status=0
secret="$(grep '^POSTGRES_PASSWORD=' .env 2>/dev/null | cut -d= -f2-)"

for f in "$@"; do
  echo "== $f"
  if grep -q -i -E '"(password|apikey|api_key|secret|accesstoken)"' "$f"; then
    echo "  WARNING: secret-like key name found, check it by hand"
  fi
  if [ -n "$secret" ] && grep -q -F "$secret" "$f"; then
    echo "  FAIL: database password found"; status=1
  fi
  if grep -q -E 'remotive.com/remote-jobs/|arbeitnow.com/jobs/' "$f"; then
    echo "  FAIL: real job data found (unpin the HTTP node and export again)"; status=1
  fi
  pinned=$(python3 -c 'import json,sys; d=json.load(open(sys.argv[1])); print(1 if d.get("pinData") else 0)' "$f")
  if [ "$pinned" = "1" ]; then
    echo "  FAIL: pinned data found"; status=1
  fi
done

[ $status -eq 0 ] && echo "All checks passed."
exit $status
