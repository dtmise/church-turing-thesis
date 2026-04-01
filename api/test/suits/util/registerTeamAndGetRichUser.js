import registerTeam from "./registerTeam"

export default async (agent) => {
    const userGenerator = (function* () {
        while (true) {
            const fullName = faker.person.firstName()
                + ' ' + faker.person.middleName()
                + ' ' + faker.person.lastName();
            yield {
                fullName,
                group: faker.string.numeric(5),
                email: faker.internet.email(),
                password: faker.internet.password()
            };
        }
    })();
    const members = Array.from({ length: 3 }, (_, __) => userGenerator.next().value);
    const teamName = faker.string.alphanumeric();
    const reqData = { teamName, members };
    const { message, team, users  } = await agent.post('/api/auth/register-team')
        .set('Content-Type', 'application/json')
        .send(reqData);
    const resUser = user[0];
    return { ...resUser, team, teamId: team.id };
}