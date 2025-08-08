# Server Setup Guide

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Database Configuration
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name

# JWT Configuration
jwtSecret=your_jwt_secret_key_here_make_it_long_and_secure

# Server Configuration
PORT=5000
```

## Database Setup

1. Make sure PostgreSQL is installed and running
2. Create a database with the name specified in `DB_NAME`
3. Update the `.env` file with your actual database credentials

## Installation

```bash
npm install
```

## Running the Server

```bash
nodemon index
```

## Troubleshooting

- If you see "secretOrPrivateKey must have a value", make sure `jwtSecret` is set in your `.env` file
- If you see "client password must be a string", make sure `DB_PASSWORD` is set correctly
- The server will now use fallback values if environment variables are missing, but it's recommended to set them properly for production
