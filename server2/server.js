const http = require('http');
const { Client } = require('pg');
require('dotenv').config();


const connectionString = process.env.DATABASE_URL;
console.log(connectionString);

const client = new Client({
    connectionString: connectionString,
});

// Connect to the PostgreSQL database
client.connect((err) => {
    if (err) {
        console.error('Connection error', err.stack);
    } else {
        console.log('Connected to PostgreSQL');
    }
});

// Create the 'patient' table if it doesn't exist
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
            if (req.method === 'POST' && req.url === '/query') {
                let body = '';

                // Collect incoming data
                req.on('data', chunk => {
                    body += chunk.toString();
                });

                // Process the complete request
                req.on('end', async () => {
                    try {
                        const { query } = JSON.parse(body);  // Parse the incoming SQL query
                        console.log('Received query:', query);

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

// Start the server
const server = new Server(3000);
server.start();
