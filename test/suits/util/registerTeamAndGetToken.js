import logInUserAndGetToken from "./logInUserAndGetToken";
import registerTeamAndGetUser from "./registerTeamAndGetUser";

export default async (agent) => {
    const user = registerTeamAndGetUser(agent);
    return logInUserAndGetToken(agent, user.email, user.password);
}