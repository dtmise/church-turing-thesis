import getAgent from 'supertest';

const port  = process.env.PORT;
const agent = await getAgent(`http://localhost:${port}`);

describe('GET /api/teams', () => {
    let token;

    beforeAll(async () => {
        const res = await agent
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ email: 'ivan@example.com', password: 'StrongPass123!' });

        token = res.body.token;
    });

    it('get list of teams', async () => {
        const res = await agent.get('/api/teams')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(res.body).toEqual([
            {
                "id": expect.any(Number),
                "name": "RegisterTeamTest",
                "membersCount": 3
            }
        ]);
    });

    it('returns 401 with no token', async () => {
        await agent
            .get('/api/teams')
            .expect(401);
    });

    it('returns 401 with invalid token', async () => {
        await agent
            .get('/api/teams')
            .set('Authorization', 'Bearer invalid.token.here')
            .expect(401);
    });
});