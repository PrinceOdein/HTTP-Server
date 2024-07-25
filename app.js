// Step 1: Import the HTTP module
const http = require('http');

// Step 2: Create the server
const server = http.createServer((req, res) => {
    // Step 3: Set the response HTTP header with HTTP status and content type
    res.writeHead(200, {'Content-Type': 'text/plain'});

    // Step 4: Send the response body
    res.end('Hello World!\n');
});

// Step 5: Listen on port 3000
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});