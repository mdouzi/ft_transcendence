#!/bin/sh

echo "Starting entrypoint script..."

echo "Checking if PostgreSQL is ready..."
until pg_isready -h  postgres -p 5432 -U $DB_USER; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

echo "PostgreSQL is ready."

echo "Applying database migrations..."
python manage.py migrate
python manage.py migrate --noinput --run-syncdb

if [ $? -eq 0 ]; then
    echo "Database migrations applied successfully."
else
    echo "Error: Database migrations failed."
    exit 1
fi

echo "Starting Django server..."
exec python manage.py runserver 0.0.0.0:8000

