#!/bin/sh

echo "Waiting for database to be ready..."
while ! nc -z $DATABASE_HOST $DATABASE_PORT; do
  sleep 1
done
echo "Database is ready!"

echo "Running database migrations..."
npm run migration:run

echo "Starting the application..."
npm run start:prod 