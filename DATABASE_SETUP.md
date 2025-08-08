# Database Setup Guide

## Overview
This project uses PostgreSQL as the database. The database schema is defined in `server/Database/final/db.sql`.

## Setup Instructions

### 1. Install PostgreSQL
- Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
- Make sure to remember your password during installation

### 2. Create the Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE websiteDB;

# Exit psql
\q
```

### 3. Run the Schema
```bash
# Apply the database schema
psql -U postgres -d websiteDB -f server/Database/final/db.sql
```

### 4. Configure Environment Variables
Create a `.env` file in the `server` directory:
```env
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=5432
DB_NAME=websiteDB
```

## Database Schema
The database contains the following tables:
- `users` - User account information

## Development vs Production
- **Development**: Use the schema files in `server/Database/final/`
- **Production**: Never commit production data to Git
- **Testing**: Use the test database in `server/Database/testing/`

## Backup and Restore
```bash
# Create backup
pg_dump -U postgres websiteDB > backup.sql

# Restore from backup
psql -U postgres websiteDB < backup.sql
```
