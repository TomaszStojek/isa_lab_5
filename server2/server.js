const http = require('http');


class Server {
    constructor(port = 3000){
        this.port = port;
    }

    start(){
        const server = http.createServer((req,res) =>{
            res.writeHead(200,{'Content-Type':'text/plain'});
            res.end('Hello World\n');
        }).listen(this.port,() => {
            console.log(`Server running at http://localhost:${this.port}/`);
        });
    }
}