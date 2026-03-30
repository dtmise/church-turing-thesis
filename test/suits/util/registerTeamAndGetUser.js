import registerTeam from "./registerTeam"

export default async (agent) => {
    const teamData = registerTeam(agent);
    return teamData.members[0];
}