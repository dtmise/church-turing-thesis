export default async (agent, email, password) => {
    const res = agent.post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ email, password });

    return res.body.token;
}