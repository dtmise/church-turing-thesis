import getAgent from 'supertest';

const port  = process.env.PORT;
const agent = await getAgent(`http://localhost:${port}`);
const url   = '/api/profile';

describe(`API: PUT ${url}`, () => {
    let token;

    beforeAll(async () => {
        const res = await agent
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ email: 'ivan@example.com', password: 'StrongPass123!' });

        token = res.body.token;
    });

    it('update user', async () => {
        const res = await agent.put(url)
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json')
            .send({
                "fullName": "Иванов Иван Иванович",
                "group": "25201"
            })
            .expect(200)
            .expect('Content-Type', /json/);

        expect(res.body).toEqual({
            "id": expect.any(Number),
            "fullName": "Иванов Иван Иванович",
            "email": "ivan@example.com",
            "group": "25201"
        });
    });

    it('returns 401 with no token', async () => {
        await agent
            .put(url)
            .expect(401);
    });

    it('returns 401 with invalid token', async () => {
        await agent
            .put(url)
            .set('Authorization', 'Bearer invalid.token.here')
            .expect(401);
    });
});