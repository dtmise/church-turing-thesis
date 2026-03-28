import request from 'supertest'
import app from '../src/app.js'

const agent = request(app);

/* -------------------------------------------------------------------------- */
/*                            API REGISTER NEW TEAM                           */
/* -------------------------------------------------------------------------- */

it('registering new team', async () => {
    const res = await agent.post('/api/auth/register-team')
        .set('Content-Type', 'application/json')
        .send({
            "teamName": "Code Masters",
            "members": [
                {
                    "fullName": "Иванов Иван Иванович",
                    "group": "25201",
                    "email": "ivan@example.com",
                    "password": "StrongPass123!"
                },
                {
                    "fullName": "Петров Петр Петрович",
                    "group": "25202",
                    "email": "petr@example.com",
                    "password": "StrongPass123!"
                },
                {
                    "fullName": "Сидоров Сидор Сидорович",
                    "group": "25203",
                    "email": "sidor@example.com",
                    "password": "StrongPass123!"
                }
            ]
        })
        .expect(201)
        .expect('Content-Type', /json/);

    expect(res.body).toEqual({
        "message": "Команда успешно зарегистрирована",
        "team": {
            "id": 1,
            "name": "Code Masters"
        },
        "users": [
            {
                "id": 1,
                "fullName": "Иванов Иван Иванович",
                "email": "ivan@example.com"
            },
            {
                "id": 2,
                "fullName": "Петров Петр Петрович",
                "email": "petr@example.com"
            },
            {
                "id": 3,
                "fullName": "Сидоров Сидор Сидорович",
                "email": "sidor@example.com"
            }
        ]
    });
});

/* -------------------------------------------------------------------------- */
/*                                  API LOGIN                                 */
/* -------------------------------------------------------------------------- */

it('login using email and password', async () => {
    const res = await agent.post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({
            "email": "ivan@example.com",
            "password": "StrongPass123!"
        })
        .expect(200)
        .expect('Content-Type', /json/);

    expect(res.body).toEqual({
        "token": expect.any(String),
        "user": {
            "id": 1,
            "fullName": "Иванов Иван Иванович",
            "email": "ivan@example.com",
            "group": "25201",
            "teamId": 1,
            "role": "captain"
        }
    });
});

/* -------------------------------------------------------------------------- */
/*                      API GETTING CURRENT USER VIA JWT                      */
/* -------------------------------------------------------------------------- */

describe('GET /api/auth/me', () => {
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
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(res.body).toEqual({
            id: 1,
            fullName: 'Иванов Иван Иванович',
            group: '25201',
            email: 'ivan@example.com',
            role: 'captain',
            team: {
                id: 1,
                name: 'Code Masters'
            }
        });
    });

    it('returns 401 with no token', async () => {
        await agent
            .get('/api/auth/me')
            .expect(401);
    });

    it('returns 401 with invalid token', async () => {
        await agent
            .get('/api/auth/me')
            .set('Authorization', 'Bearer invalid.token.here')
            .expect(401);
    });
});

/* -------------------------------------------------------------------------- */
/*                                API GET USER                                */
/* -------------------------------------------------------------------------- */

describe('GET /api/profile', () => {
    let token;

    beforeAll(async () => {
        const res = await agent
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ email: 'ivan@example.com', password: 'StrongPass123!' });

        token = res.body.token;
    });

    it('get user', async () => {
        const res = await agent.get('/api/profile')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(res.body).toEqual({
            "id": 1,
            "fullName": "Иванов Иван Иванович",
            "group": "25201",
            "email": "ivan@example.com",
            "role": "captain",
            "team": {
                "id": 1,
                "name": "Code Masters",
                "members": [
                    {
                        "id": 1,
                        "fullName": "Иванов Иван Иванович",
                        "group": "25201",
                        "email": "ivan@example.com"
                    },
                    {
                        "id": 2,
                        "fullName": "Петров Петр Петрович",
                        "group": "25202",
                        "email": "petr@example.com"
                    },
                    {
                        "id": 3,
                        "fullName": "Сидоров Сидор Сидорович",
                        "group": "25203",
                        "email": "sidor@example.com"
                    }
                ]
            }
        });
    });

    it('returns 401 with no token', async () => {
        await agent
            .get('/api/profile')
            .expect(401);
    });

    it('returns 401 with invalid token', async () => {
        await agent
            .get('/api/profile')
            .set('Authorization', 'Bearer invalid.token.here')
            .expect(401);
    });
});

/* -------------------------------------------------------------------------- */
/*                               API UPDATE USER                              */
/* -------------------------------------------------------------------------- */

describe('PUT /api/profile', () => {
    let token;

    beforeAll(async () => {
        const res = await agent
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ email: 'ivan@example.com', password: 'StrongPass123!' });

        token = res.body.token;
    });

    it('update user', async () => {
        const res = await agent.put('/api/profile')
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json')
            .send({
                "fullName": "Иванов Иван Иванович",
                "group": "ИВТ-31"
            })
            .expect(200)
            .expect('Content-Type', /json/);

        expect(res.body).toEqual({
            "id": 1,
            "fullName": "Иванов Иван Иванович",
            "email": "ivan@example.com",
            "group": "ИВТ-31"
        });
    });

    it('returns 401 with no token', async () => {
        await agent
            .put('/api/profile')
            .expect(401);
    });

    it('returns 401 with invalid token', async () => {
        await agent
            .put('/api/profile')
            .set('Authorization', 'Bearer invalid.token.here')
            .expect(401);
    });
});

/* -------------------------------------------------------------------------- */
/*                            API GET LIST of TEAMS                           */
/* -------------------------------------------------------------------------- */

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
                "id": 1,
                "name": "Code Masters",
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

/* -------------------------------------------------------------------------- */
/*                                API GET TEAM                                */
/* -------------------------------------------------------------------------- */

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
            "id": 1,
            "name": "Code Masters",
            "members": [
                {
                    "id": 1,
                    "fullName": "Иванов Иван Иванович",
                    "group": "ИВТ-31",
                    "email": "ivan@example.com"
                },
                {
                    "id": 2,
                    "fullName": "Петров Петр Петрович",
                    "group": "25202",
                    "email": "petr@example.com"
                },
                {
                    "id": 3,
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

/* -------------------------------------------------------------------------- */
/*                            API GET LIST OF NEWS                            */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                            API GET NEWS WITH ID                            */
/* -------------------------------------------------------------------------- */

describe('GET /api/news/1', () => {
    let token;

    beforeAll(async () => {
        const res = await agent
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ email: 'ivan@example.com', password: 'StrongPass123!' });

        token = res.body.token;
    });

    it('get news item', async () => {
        const res = await agent.get('/api/news/1')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/);

        expect(res.body).toEqual({
            "id": 1,
            "title": "Старт регистрации",
            "content": "Регистрация открыта до 10 апреля.",
            "publishedAt": "2026-03-27T09:00:00Z"
        });
    });

    it('returns 401 with no token', async () => {
        await agent
            .get('/api/news/1')
            .expect(401);
    });

    it('returns 401 with invalid token', async () => {
        await agent
            .get('/api/news/1')
            .set('Authorization', 'Bearer invalid.token.here')
            .expect(401);
    });
});
