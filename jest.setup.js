import app from './src/app.js';

let server;

beforeAll(async () => {
    server = app.listen(1904);
    await new Promise((resolve) => server.on('listening', resolve));
});

afterAll(async () => {
    if (server) {
        await new Promise((resolve) => server.close(resolve));
    }
});
