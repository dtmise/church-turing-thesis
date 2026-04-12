import { Router } from 'express';
import { getResults, getSetting } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
    const deadline = await getSetting('results_deadline');
    const serverTime = new Date().toISOString();

    const visible = await getSetting('results_visible');
    if (visible !== 'true') {
        return res.json({ hidden: true, deadline, serverTime });
    }

    const frozen = await getSetting('results_frozen');
    if (frozen === 'true') {
        const snapshot = await getSetting('frozen_snapshot');
        if (snapshot) {
            return res.json({ ...JSON.parse(snapshot), frozen: true, deadline, serverTime });
        }
    }

    const results = await getResults();
    res.json({ ...results, deadline, serverTime });
});

export default router;
