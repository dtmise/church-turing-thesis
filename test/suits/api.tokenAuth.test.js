import getAgent from 'supertest';

const port  = process.env.PORT;
const agent = await getAgent(`http://localhost:${port}`);
const url   = '/api/auth/me';

describe(`API: GET ${url}`, () => {
    let token;

    beforeAll(async () => {
        const res = await agent
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ email: 'ivan@example.com', password: 'StrongPass123!' });

        token = res.body.token;
    });

    it('returns current user with valid token', async () => {
        const res = await agent
            .get(url)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(res.body).toEqual({
            id: expect.any(Number),
            fullName: 'Иванов Иван Иванович',
            group: '25201',
            email: 'ivan@example.com',
            role: 'captain',
            team: {
                id: 1,
                name: 'RegisterTeamTest'
            }
        });
    });

    it('returns 401 with no token', async () => {
        await agent
            .get(url)
            .expect(401);
    });

    it('returns 401 with invalid token', async () => {
        await agent
            .get(url)
            .set('Authorization', 'Bearer invalid.token.here')
            .expect(401);
    });
});