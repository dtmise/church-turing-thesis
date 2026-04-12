import { Router } from 'express';
import {
    findActivePipelineToken, findTeamByHash, findTaskByNumber,
    pipelineUpsertScore, getSetting
} from '../db.js';

const router = Router();

// GET /api/pipeline?team=<hash>&task=<number>&score=<points>&token=<token>
router.get('/', async (req, res) => {
    const { team, task, score, token } = req.query;

    if (!token || !team || task == null || score == null) {
        return res.status(400).json({ error: 'Required params: token, team, task, score' });
    }

    // Validate token
    const validToken = await findActivePipelineToken(token);
    if (!validToken) {
        return res.status(403).json({ error: 'Invalid or revoked token' });
    }

    const deadline = await getSetting('results_deadline');
    if (deadline) {
        const deadlineDate = new Date(deadline);
        if (!Number.isNaN(deadlineDate.getTime()) && Date.now() > deadlineDate.getTime()) {
            return res.status(403).json({ error: 'Прием результатов завершен' });
        }
    }

    // Find team by hash
    const teamRow = await findTeamByHash(team);
    if (!teamRow) {
        return res.status(404).json({ error: 'Team not found' });
    }

    // Find task by number
    const taskRow = await findTaskByNumber(parseInt(task));
    if (!taskRow) {
        return res.status(404).json({ error: 'Task not found' });
    }

    // Clamp score to [0, maxPoints]
    let pts = parseInt(score);
    if (isNaN(pts) || pts < 0) pts = 0;
    if (pts > taskRow.maxPoints) pts = taskRow.maxPoints;

    // Upsert (only increases)
    const result = await pipelineUpsertScore(teamRow.id, taskRow.id, pts);

    res.json({
        team: teamRow.name,
        task: taskRow.number,
        score: result.points
    });
});

export default router;
