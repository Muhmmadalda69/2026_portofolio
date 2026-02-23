#!/bin/sh

# Seed the database or run migrations if needed
# Since it's SQLite, we can use prisma db push for simplicity in some cases,
# or prisma migrate deploy if using migrations.
echo "Running database migrations..."
npx prisma db push --accept-data-loss

# Start the application
echo "Starting application..."
node server.js
