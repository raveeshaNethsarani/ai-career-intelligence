#!/usr/bin/env bash
# Removes non-tech Arbeitnow jobs. Dry run by default; pass --apply to delete.
# Jobs you saved or changed the status of are never touched.
set -euo pipefail
cd "$(dirname "$0")/.."

PATTERN='(software|developer|engineer|devops|backend|back-end|frontend|front-end|full[- ]?stack|programmer|data scientist|machine learning|cloud|security|kubernetes)'
FILTER="source = 'arbeitnow' AND title !~* '$PATTERN' AND NOT EXISTS (SELECT 1 FROM job_actions a WHERE a.job_id = jobs.id AND (a.saved OR a.status <> 'new'))"
run() { docker compose exec -T postgres sh -c 'psql -P pager=off -U "$POSTGRES_USER" -d "$POSTGRES_DB"'; }

if [ "${1:-}" = "--apply" ]; then
  echo "DELETE FROM jobs WHERE $FILTER;" | run
else
  echo "Dry run. Jobs that would be deleted:"
  echo "SELECT count(*) AS would_delete FROM jobs WHERE $FILTER;" | run
  echo "SELECT id, left(title, 60) AS title FROM jobs WHERE $FILTER ORDER BY id LIMIT 15;" | run
  echo "Run again with --apply to delete them."
fi
