#!/bin/bash
sudo service postgresql start
sudo -u postgres psql -c "CREATE DATABASE edubuilder;"
sudo -u postgres psql -c "CREATE USER edubuilder_user WITH PASSWORD 'edubuilder_pass';"
sudo -u postgres psql -c "ALTER ROLE edubuilder_user SET client_encoding TO 'utf8';"
sudo -u postgres psql -c "ALTER ROLE edubuilder_user SET default_transaction_isolation TO 'read committed';"
sudo -u postgres psql -c "ALTER ROLE edubuilder_user SET timezone TO 'UTC';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE edubuilder TO edubuilder_user;"
sudo -u postgres psql -c "ALTER DATABASE edubuilder OWNER TO edubuilder_user;"
echo "Database initialized successfully!"
