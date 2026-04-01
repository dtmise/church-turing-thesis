import express from 'express';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import https from 'https';
import { createProxyMiddleware } from 'http-proxy-middleware';

const apiPort = process.env.API_PORT || 1904;
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
app.use(morgan('combined'));

// Проксируем /api на API-сервер (HTTP)
app.use('/api', createProxyMiddleware({
    target: `http://127.0.0.1:${apiPort}`,
    changeOrigin: true,
    secure: false,
    pathRewrite: (path) => `/api${path}`,
    on: {
        error: (err, req, res) => {
            console.error('Proxy error:', err.message);
            res.status(502).json({ error: 'API недоступен' });
        }
    }
}));

// Serve Vue SPA build
const distDir = path.join(__dirname, 'frontend-dist');
app.use(express.static(distDir));

// SPA fallback — all non-API routes go to index.html
app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
        res.sendFile(path.join(distDir, 'index.html'));
    } else {
        next();
    }
});

const keyPath = process.env.KEY_PATH,
      crtPath = process.env.CRT_PATH;
const options = { 
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(crtPath)
};
const server = https.createServer(options, app);
const port   = process.env.WEB_PORT;
server.listen(port, () => console.log(`https://localhost:${port}`));