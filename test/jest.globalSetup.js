export default async (globalConfig, projectConfig) => {
    process.loadEnvFile('./sns/test.env');

    const { default: app } = await import('../src/app.js');
    const port = process.env.PORT;
    const server = await app.listen(port);

    await new Promise(res => server.on('listening', res));
    globalThis.__SERVER__ = server;
}