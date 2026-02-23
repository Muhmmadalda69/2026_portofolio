#!/bin/sh
set -e

# Run database setup
echo "Starting database setup..."
if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL is not set."
  exit 1
fi

echo "Syncing database with schema (npx prisma db push)..."
npx prisma db push --accept-data-loss

# Start the application
echo "Starting Next.js standalone server..."
exec node server.js

