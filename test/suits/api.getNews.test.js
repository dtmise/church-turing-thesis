import getAgent from 'supertest';

const port  = process.env.PORT;
const agent = await getAgent(`http://localhost:${port}`);

describe('GET /api/news', () => {
    let token;

    beforeAll(async () => {
        const res = await agent
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ email: 'ivan@example.com', password: 'StrongPass123!' });

        token = res.body.token;
    });

    it('get list of news', async () => {
        const res = await agent.get('/api/news')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(res.body).toEqual([
            {
                "id": 1,
                "title": "Старт регистрации",
                "content": "Регистрация открыта до 10 апреля.",
                "publishedAt": "2026-03-27T09:00:00Z"
            },
            {
                "id": 2,
                "title": "Обновление правил",
                "content": "Добавлены требования к командам.",
                "publishedAt": "2026-03-28T12:00:00Z"
            }
        ]);
    });

    it('returns 401 with no token', async () => {
        await agent
            .get('/api/news')
            .expect(401);
    });

    it('returns 401 with invalid token', async () => {
        await agent
            .get('/api/news')
            .set('Authorization', 'Bearer invalid.token.here')
            .expect(401);
    });
});