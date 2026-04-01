import { Router } from 'express';
import { getAllTeams, findTeamById, getTeamMembers } from '../db.js';
import { clearSensInfo } from './users.js';

const router = Router();

router.get('/', async (req, res) => {
    const teams = await getAllTeams();
    const result = [];
    for (const t of teams) { 
        const users = await getTeamMembers(t.id);
        const usersWoutSensInfo = users.map(clearSensInfo);
        result.push({ 
            ...t, 
            membersCount: usersWoutSensInfo.length,
            members: usersWoutSensInfo
        });
    };
    res.json(result);
});

router.get('/:id', async (req, res) => {
    const teamId = parseInt(req.params.id, 10);
    const team = await findTeamById(teamId);
    if (!team) {
        return res.status(404).json({ error: 'Команда не найдена' });
    }

    const members = await getTeamMembers(teamId);
    const membersWoutSensInfo = members.map(clearSensInfo);

    res.json({ 
        ...team, 
        membersCount: membersWoutSensInfo.length, 
        members: membersWoutSensInfo 
    });
});

export default router;
