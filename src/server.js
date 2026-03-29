import app from './app.js';

let server;

if (process.env.NODE_ENV == 'production') {
    try {
        const https   = await import('https');
        const fs      = await import('fs');
        const options = {
            key: fs.readFileSync('./sns/server.key'),
            cert: fs.readFileSync('./sns/server.cert')
        };
        server = https.createServer(options, app);
    } catch (err) {
        throw new Error('Https is not allowed. ' + err.message);
    }
} else {
    const http = await import('http');
    server = http.createServer(app);
}

const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server running on localhost:${PORT}`);
});
