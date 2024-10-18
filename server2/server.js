// ChatGPT was used to help generate the code in this file
// Changing back to MySQL from PostgreSQL

const http = require('http');
const url = require('url');
const mysql = require('mysql2');
require('dotenv').config();

// Use the connection details from the .env file
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Connect to MySQL database
connection.connect((err) => {
    if (err) {
        console.error('Connection error', err.stack);
    } else {
        console.log('Connected to MySQL');
    }
});

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS patient (
        patientid INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        dateOfBirth DATE NOT NULL
    );
`;

connection.query(createTableQuery, (err, results) => {
    if (err) {
        console.error('Error creating table', err.stack);
    } else {
        console.log('Patient table created or already exists');
    }
});

class Server {
    constructor(port = 3000) {
        this.port = port;
    }

    start() {
        const server = http.createServer(async (req, res) => {
            // Handle CORS
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

            // Handle OPTIONS requests (for preflight CORS)
            if (req.method === 'OPTIONS') {
                res.writeHead(204); // No Content
                res.end();
                return;
            }

            if (req.method === 'GET' && req.url.startsWith('/query')) {
                // Handle GET request to execute the SQL query from the URL
                const queryObject = url.parse(req.url, true).query;
                const sqlQuery = queryObject.sql;

                if (!sqlQuery) {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('SQL query missing from URL');
                    return;
                }

                console.log('Received GET query:', sqlQuery);

                connection.query(sqlQuery, (err, results) => {
                    if (err) {
                        console.error('Error executing query:', err.stack);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end(`Error executing query: ${err.message}`);
                    } else {
                        // Send the results back as a JSON response
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(results));
                    }
                });

            } else if (req.method === 'POST' && req.url === '/query') {
                let body = '';

                // Collect incoming data
                req.on('data', chunk => {
                    body += chunk.toString();
                });

                // Process the complete request
                req.on('end', () => {
                    try {
                        const { query } = JSON.parse(body);  // Parse the incoming SQL query
                        console.log('Received POST query:', query);

                        connection.query(query, (err, results) => {
                            if (err) {
                                console.error('Error executing query:', err.stack);
                                res.writeHead(500, { 'Content-Type': 'text/plain' });
                                res.end(`Error executing query: ${err.message}`);
                            } else {
                                // Send the results back as a JSON response
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify(results));
                            }
                        });

                    } catch (err) {
                        console.error('Error processing request:', err.stack);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end(`Error processing request: ${err.message}`);
                    }
                });

            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
            }
        }).listen(this.port, () => {
            console.log(`Server running at http://localhost:${this.port}/`);
        });
    }
}

const server = new Server(3000);
server.start();
