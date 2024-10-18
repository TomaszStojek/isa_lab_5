// This the following files/classes were helped made with the help of ChatGPT: Server, QueryController, Router
const http = require('http');
const url = require('url');
const messages = require('./lang/messages/en/user');  // Correctly importing the messages
const connection = require('./modules/connection');  // Importing the connection module
require('dotenv').config();

const PORT = 3000;
const QUERY_ROUTE = '/query';
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS patient (
        patientid INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        dateOfBirth DATE NOT NULL
    );
`;

// DatabaseManager class to handle the connection and table creation
class DatabaseManager {
    constructor(connection, tableCreationQuery) {
        this.connection = connection;
        this.tableCreationQuery = tableCreationQuery;
    }

    connect() {
        this.connection.connect((err) => {
            if (err) {
                console.error(messages.connectionError, err.stack);  // Using message from messages.js
            } else {
                console.log(messages.dbConnected);  // Using message from messages.js
            }
        });
    }

    createTable() {
        this.connection.query(this.tableCreationQuery, (err, results) => {
            if (err) {
                console.error(messages.sqlTableError, err.stack);  // Using message from messages.js
            } else {
                console.log(messages.successMessage);  // Using message from messages.js
            }
        });
    }
}

// Controller class to handle the logic for GET and POST requests
class QueryController {
    constructor(connection) {
        this.connection = connection;
    }

    handleGet(req, res) {
        const queryObject = url.parse(req.url, true).query;
        const sqlQuery = queryObject.sql;

        if (!sqlQuery) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end(messages.queryMissing);  // Using message from messages.js
            return;
        }

        console.log(`${messages.queryReceived} ${sqlQuery}`);  // Using message from messages.js

        this.connection.query(sqlQuery, (err, results) => {
            if (err) {
                console.error(`${messages.sqlExecutionError}`, err.stack);  // Using message from messages.js
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`${messages.sqlExecutionError}: ${err.message}`);  // Using message from messages.js
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(results));
            }
        });
    }

    handlePost(req, res) {
        let body = '';

        // Collect incoming data
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const { query } = JSON.parse(body);  // Parse the incoming SQL query
                console.log(`${messages.postQueryReceived} ${query}`);  // Using message from messages.js

                this.connection.query(query, (err, results) => {
                    if (err) {
                        console.error(`${messages.sqlExecutionError}`, err.stack);  // Using message from messages.js
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end(`${messages.sqlExecutionError}: ${err.message}`);  // Using message from messages.js
                    } else {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(results));
                    }
                });

            } catch (err) {
                console.error(`${messages.processingError}: ${err.stack}`);  // Using message from messages.js
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`${messages.processingError}: ${err.message}`);  // Using message from messages.js
            }
        });
    }
}

// Router class to manage the routes
class Router {
    constructor(queryController, queryRoute) {
        this.queryController = queryController;
        this.queryRoute = queryRoute;
    }

    route(req, res) {
        // Handle CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            res.writeHead(204); // No Content
            res.end();
            return;
        }

        if (req.method === 'GET' && req.url.startsWith(this.queryRoute)) {
            this.queryController.handleGet(req, res);
        } else if (req.method === 'POST' && req.url === this.queryRoute) {
            this.queryController.handlePost(req, res);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(messages.notFound);  // Using message from messages.js
        }
    }
}

// Server class to start the HTTP server
class Server {
    constructor(port, router) {
        this.port = port;
        this.router = router;
    }

    start() {
        const server = http.createServer((req, res) => {
            this.router.route(req, res);  // Delegate the request to the Router
        });

        server.listen(this.port, () => {
            console.log(`Server running at http://localhost:${this.port}/`);
        });
    }
}

// Initialize and start the application
const dbManager = new DatabaseManager(connection, createTableQuery);
dbManager.connect();
dbManager.createTable();

// Initialize the QueryController and Router
const queryController = new QueryController(connection);
const router = new Router(queryController, QUERY_ROUTE);

// Start the server using the constant PORT
const server = new Server(PORT, router);
server.start();
