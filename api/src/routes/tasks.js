import { Router } from 'express';
import { getAllTasks, getSetting } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
    const visible = await getSetting('tasks_visible');
    if (visible !== 'true') {
        return res.json({ hidden: true });
    }
    res.json(await getAllTasks());
});

export default router;
