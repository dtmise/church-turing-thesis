import getAgent from 'supertest';

const port  = process.env.PORT;
const agent = await getAgent(`http://localhost:${port}`);

describe('GET /api/teams/1', () => {
    let token;

    beforeAll(async () => {
        const res = await agent
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ email: 'ivan@example.com', password: 'StrongPass123!' });

        token = res.body.token;
    });

    it('get team', async () => {
        const res = await agent.get('/api/teams/1')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(res.body).toEqual({
            "id": expect.any(Number),
            "name": "RegisterTeamTest",
            "members": [
                {
                    "id": expect.any(Number),
                    "fullName": "Иванов Иван Иванович",
                    "group": "25201",
                    "email": "ivan@example.com"
                },
                {
                    "id": expect.any(Number),
                    "fullName": "Петров Петр Петрович",
                    "group": "25202",
                    "email": "petr@example.com"
                },
                {
                    "id": expect.any(Number),
                    "fullName": "Сидоров Сидор Сидорович",
                    "group": "25203",
                    "email": "sidor@example.com"
                }
            ]
        });
    });

    it('returns 401 with no token', async () => {
        await agent
            .get('/api/teams/1')
            .expect(401);
    });

    it('returns 401 with invalid token', async () => {
        await agent
            .get('/api/teams/1')
            .set('Authorization', 'Bearer invalid.token.here')
            .expect(401);
    });
});