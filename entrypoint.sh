#!/bin/sh
set -e

DB_PATH="/app/data/db.sqlite"

# Check if the database has tables (not just exists but is properly initialized)
needs_seed=false

if [ ! -f "$DB_PATH" ] || [ ! -s "$DB_PATH" ]; then
  needs_seed=true
fi

if [ "$needs_seed" = true ]; then
  echo "Database not found or empty, running seed to create schema and initial data..."
  npx tsx src/seed.ts
  echo "Seed complete"
fi

exec "$@"
