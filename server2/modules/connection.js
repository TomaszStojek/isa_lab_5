const mysql = require('mysql2');
require('dotenv').config();

// Create and export the MySQL connection using details from the .env file
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

module.exports = connection;
