// ChatGPT was used to help generate the code in this file

const http = require('http');
const url = require('url');
const { Client } = require('pg');
require('dotenv').config();

// Use the connection string from the .env file
const connectionString = process.env.DATABASE_URL;

const client = new Client({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect((err) => {
    if (err) {
        console.error('Connection error', err.stack);
    } else {
        console.log('Connected to PostgreSQL');
    }
});

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS patient (
        patientid SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        dateOfBirth DATE NOT NULL
    );
`;

client.query(createTableQuery, (err, res) => {
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

                try {
                    // Run the SQL query
                    const result = await client.query(sqlQuery);

                    // Send the results back as a JSON response
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result.rows));  // Use result.rows to send back the rows
                } catch (err) {
                    console.error('Error executing query:', err.stack);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end(`Error executing query: ${err.message}`);
                }

            } else if (req.method === 'POST' && req.url === '/query') {
                let body = '';

                // Collect incoming data
                req.on('data', chunk => {
                    body += chunk.toString();
                });

                // Process the complete request
                req.on('end', async () => {
                    try {
                        const { query } = JSON.parse(body);  // Parse the incoming SQL query
                        console.log('Received POST query:', query);

                        // Run the SQL query
                        const result = await client.query(query);

                        // Send the results back as a JSON response
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result.rows));  // Use result.rows to send back the rows

                    } catch (err) {
                        console.error('Error executing query:', err.stack);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end(`Error executing query: ${err.message}`);
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
