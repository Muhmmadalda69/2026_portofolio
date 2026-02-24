#!/bin/sh
set -e

# Run database setup
echo "Starting database setup..."
if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL is not set."
  exit 1
fi

# Start the application
echo "Starting Next.js standalone server..."
exec node server.js

