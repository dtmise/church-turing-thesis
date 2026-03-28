import { assert } from 'node:console';
import request from 'supertest'

const agent = request('https://localhost:1904');

/* -------------------------------------------------------------------------- */
/*                            API REGISTER NEW TEAM                           */
/* -------------------------------------------------------------------------- */

it('registering new team', async () => {
    await agent.post('/api/auth/register-team')
        .set('Content-Type', 'applicaton/json')
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
        .expect('Content-Type', 'application/json')
        .expect(res => {
            const expectedObject = {
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
            };
            expect(JSON.parse(res)).toBe(expectedObject);
        });
});

/* -------------------------------------------------------------------------- */
/*                                  API LOGIN                                 */
/* -------------------------------------------------------------------------- */

it('login using email and password', async () => {
    await agent.post('/api/auth/login')
        .set('Content-Type', 'applicaton/json')
        .send({
            "email": "ivan@example.com",
            "password": "StrongPass123!"
        })
        .expect(200)
        .expect('Content-Type', 'application/json')
        .expect(res => {
            const expectedObject = {
                "token": "jwt-token",
                "user": {
                    "id": 1,
                    "fullName": "Иванов Иван Иванович",
                    "email": "ivan@example.com",
                    "group": "ИВТ-21",
                    "teamId": 10,
                    "role": "captain"
                }
            };
            expect(JSON.parse(res)).toBe(expectedObject);
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
            group: 'ИВТ-21',
            email: 'ivan@example.com',
            role: 'captain',
            team: {
                id: 10,
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

describe('GET /api/auth/login', () => {
    let token;

    beforeAll(async () => {
        const res = await agent
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ email: 'ivan@example.com', password: 'StrongPass123!' });

        token = res.body.token;
    });

    it('get user', async () => {
        await agent.get('/api/profile')
            .expect(200)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', 'application/json')
            .expect(res => {
                const expectedObject = {
                    "id": 1,
                    "fullName": "Иванов Иван Иванович",
                    "group": "ИВТ-21",
                    "email": "ivan@example.com",
                    "role": "captain",
                    "team": {
                        "id": 10,
                        "name": "Code Masters",
                        "members": [
                        {
                            "id": 1,
                            "fullName": "Иванов Иван Иванович",
                            "group": "ИВТ-21",
                            "email": "ivan@example.com"
                        },
                        {
                            "id": 2,
                            "fullName": "Петров Петр Петрович",
                            "group": "ИВТ-21",
                            "email": "petr@example.com"
                        }
                        ]
                    }
                    };
                expect(JSON.parse(res)).toBe(expectedObject);
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

describe('GET /api/profile', () => {
    let token;

    beforeAll(async () => {
        const res = await agent
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ email: 'ivan@example.com', password: 'StrongPass123!' });

        token = res.body.token;
    });

    it('update user', async () => {
        await agent.put('/api/profile')
            .set('Authorization', `Bearer ${token}`)    
            .set('Content-Type', 'applicaton/json')
            .send({
                "fullName": "Иванов Иван Иванович",
                "group": "ИВТ-31"
            })
            .expect(200)
            .expect('Content-Type', 'application/json')
            .expect(res => {
                const expectedObject = {
                    "token": "jwt-token",
                    "user": {
                        "id": 1,
                        "fullName": "Иванов Иван Иванович",
                        "email": "ivan@example.com",
                        "group": "ИВТ-21",
                        "teamId": 10,
                        "role": "captain"
                    }
                };
                expect(JSON.parse(res)).toBe(expectedObject);
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
        await agent.get('/api/teams')
            .set('Authorization', `Bearer ${token}`)    
            .set('Content-Type', 'applicaton/json')
            .expect(200)
            .expect('Content-Type', 'application/json')
            .expect(res => {
                const expectedObject = [
                {
                    "id": 10,
                    "name": "Code Masters",
                    "membersCount": 3
                },
                {
                    "id": 11,
                    "name": "Bug Hunters",
                    "membersCount": 2
                }
                ];
                expect(JSON.parse(res)).toBe(expectedObject);
            });
    });

    it('returns 401 with no token', async () => {
        await agent
            .get('/api/teams')
            .expect(401);
    });

    it('returns 401 with invalid token', async () => {
        await agent
            .api('/api/teams')
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
        await agent.get('/api/teams/1')
            .set('Authorization', `Bearer ${token}`)    
            .expect(200)
            .expect('Content-Type', 'application/json')
            .expect(res => {
                const expectedObject = {
                    "id": 1,
                    "name": "Code Masters",
                    "members": [
                        {
                        "id": 1,
                        "fullName": "Иванов Иван Иванович",
                        "group": "ИВТ-21",
                        "email": "ivan@example.com"
                        },
                        {
                        "id": 2,
                        "fullName": "Петров Петр Петрович",
                        "group": "ИВТ-21",
                        "email": "petr@example.com"
                        }
                    ]
                };
                expect(JSON.parse(res)).toBe(expectedObject);
            });
    });

    it('returns 401 with no token', async () => {
        await agent
            .get('/api/teams/1')
            .expect(401);
    });

    it('returns 401 with invalid token', async () => {
        await agent
            .api('/api/teams/1')
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
        await agent.get('/api/news')
            .set('Authorization', `Bearer ${token}`)    
            .set('Content-Type', 'applicaton/json')
            .expect(200)
            .expect('Content-Type', 'application/json')
            .expect(res => {
                const expectedObject = [
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
                ];
                expect(JSON.parse(res)).toBe(expectedObject);
            });
    });

    it('returns 401 with no token', async () => {
        await agent
            .get('/api/news')
            .expect(401);
    });

    it('returns 401 with invalid token', async () => {
        await agent
            .api('/api/news')
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

    it('get team', async () => {
        await agent.get('/api/news/1')
            .set('Authorization', `Bearer ${token}`)    
            .expect(200)
            .expect('Content-Type', 'application/json')
            .expect(res => {
                const expectedObject = {
                    "id": 1,
                    "title": "Старт регистрации",
                    "content": "Регистрация открыта до 10 апреля.",
                    "publishedAt": "2026-03-27T09:00:00Z"
                };
                expect(JSON.parse(res)).toBe(expectedObject);
            });
    });

    it('returns 401 with no token', async () => {
        await agent
            .get('/api/news/1')
            .expect(401);
    });

    it('returns 401 with invalid token', async () => {
        await agent
            .api('/api/news/1')
            .set('Authorization', 'Bearer invalid.token.here')
            .expect(401);
    });

});