import { Router } from 'express';
import { saveContact } from '../db.js';

const router = Router();

router.post('/', async (req, res) => {
    const { email, telegram, vk } = req.body;

    if (!email && !telegram && !vk) {
        return res.status(400).json({ error: 'Укажите хотя бы один способ связи' });
    }

    const contact = await saveContact({ email, telegram, vk });
    res.status(201).json({ message: 'Контакт сохранён', contact });
});

export default router;
