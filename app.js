// Import required Node.js modules
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Define MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg'
};

// Create the HTTP server
const server = http.createServer((req, res) => {
    // Log the incoming request
    console.log(`${req.method} ${req.url}`);

    // Restrict to GET requests only
    if (req.method !== 'GET') {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
        return;
    }

    // Parse the request URL to get the pathname
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;

    // Define the public directory and construct the requested file path
    const publicDir = path.resolve(__dirname, 'public');
    let requestedPath = pathname === '/' ? 'index.html' : pathname.slice(1);
    let filePath = path.join(publicDir, requestedPath);

    // Prevent directory traversal by ensuring filePath stays within publicDir
    if (!filePath.startsWith(publicDir + path.sep)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }

    // Check if the requested path is a file and serve it
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // File not found or not a file (e.g., a directory)
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        } else {
            // Determine the content type based on file extension
            const extname = path.extname(filePath);
            const contentType = mimeTypes[extname] || 'application/octet-stream';

            // Read and serve the file
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(data);
                }
            });
        }
    });
});

// Start the server on a configurable port
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});