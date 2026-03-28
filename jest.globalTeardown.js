export default async function globalTeardown() {
    if (globalThis.__SERVER__) {
        await new Promise((resolve) => globalThis.__SERVER__.close(resolve));
    }
}
