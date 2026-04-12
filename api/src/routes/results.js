import { Router } from 'express';
import { getResults, getSetting } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
    const visible = await getSetting('results_visible');
    if (visible !== 'true') {
        return res.json({ hidden: true });
    }

    const frozen = await getSetting('results_frozen');
    if (frozen === 'true') {
        const snapshot = await getSetting('frozen_snapshot');
        if (snapshot) {
            return res.json({ ...JSON.parse(snapshot), frozen: true });
        }
    }

    const results = await getResults();
    res.json(results);
});

export default router;
