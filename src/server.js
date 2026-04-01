import app from './app.js';

const mode = process.env.NODE_ENV ?? 'test';
let server;

if (mode === 'production') {
    const https   = await import('https');
    const fs      = await import('fs');
    const options = {
        key: fs.readFileSync('./sns/server.key'),
        cert: fs.readFileSync('./sns/server.crt')
    };
    server = https.createServer(options, app);
} else {
    const http = await import('http');
    server = http.createServer(app);
}
const port = process.env.PORT ?? 1904;
server.listen(port, () => {
    console.log(`Server in ${mode} mode, running on localhost:${port}`);
});
