const Pool = require("pg").Pool;
require("dotenv").config();

// Provide fallback values for missing environment variables
const dbConfig = {
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'postgres'
};

// Validate that password is a string
if (typeof dbConfig.password !== 'string') {
    console.warn("Warning: DB_PASSWORD is not set or is not a string. Using empty string.");
    dbConfig.password = '';
}

const pool = new Pool(dbConfig);

// Test the connection
pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = pool;
