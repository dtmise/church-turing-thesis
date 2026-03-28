import { Router } from 'express';
import { getAllTeams, findTeamById, getTeamMembers } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, (req, res) => {
    res.json(getAllTeams());
});

router.get('/:id', authMiddleware, (req, res) => {
    const teamId = parseInt(req.params.id, 10);
    const team = findTeamById(teamId);
    if (!team) {
        return res.status(404).json({ error: 'Команда не найдена' });
    }

    const members = getTeamMembers(teamId).map(m => ({
        id: m.id,
        fullName: m.fullName,
        group: m.group,
        email: m.email
    }));

    res.json({ id: team.id, name: team.name, members });
});

export default router;
