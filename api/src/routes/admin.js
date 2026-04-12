import { Router } from 'express';
import {
    getAllUsers, getAllTeamsWithMembers, getAllNews,
    createNews, updateNews, deleteNews, setAdmin, getAllContacts,
    getAllTasks, createTask, updateTask, deleteTask,
    getAllScores, upsertScore, getAllTeams, findTaskById,
    getAllSettings, setSetting, getResults,
    createPipelineToken, getAllPipelineTokens, revokePipelineToken,
    clearTeamMembers, deleteTeam
} from '../db.js';

const router = Router();

// Admin guard middleware
router.use((req, res, next) => {
    if (!req.user?.isAdmin) {
        return res.status(403).json({ error: 'Доступ запрещён' });
    }
    next();
});

// Users
router.get('/users', async (req, res) => {
    const users = await getAllUsers();
    res.json(users);
});

router.patch('/users/:id/admin', async (req, res) => {
    const userId = parseInt(req.params.id);
    if (userId === req.user.id) {
        return res.status(400).json({ error: 'Нельзя изменить свой статус админа' });
    }
    const { isAdmin } = req.body;
    if (typeof isAdmin !== 'boolean') {
        return res.status(400).json({ error: 'Укажите isAdmin (true/false)' });
    }
    const result = await setAdmin(userId, isAdmin);
    if (!result) return res.status(404).json({ error: 'Пользователь не найден' });
    res.json(result);
});

// Contacts
router.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    res.json(contacts);
});

// Teams with members
router.get('/teams', async (req, res) => {
    const teams = await getAllTeamsWithMembers();
    res.json(teams);
});

router.delete('/teams/:id', async (req, res) => {
    const teamId = parseInt(req.params.id);
    await clearTeamMembers(teamId);
    await deleteTeam(teamId);
    res.json({ success: true });
});

// News CRUD
router.get('/news', async (req, res) => {
    const news = await getAllNews();
    res.json(news);
});

router.post('/news', async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: 'Укажите заголовок и содержание' });
    }
    const news = await createNews(title, content);
    res.status(201).json(news);
});

router.put('/news/:id', async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: 'Укажите заголовок и содержание' });
    }
    const news = await updateNews(req.params.id, title, content);
    if (!news) return res.status(404).json({ error: 'Новость не найдена' });
    res.json(news);
});

router.delete('/news/:id', async (req, res) => {
    const result = await deleteNews(req.params.id);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Новость не найдена' });
    res.json({ message: 'Новость удалена' });
});

// Tasks CRUD
router.get('/tasks', async (req, res) => {
    const tasks = await getAllTasks();
    res.json(tasks);
});

router.post('/tasks', async (req, res) => {
    const { number, name, description, link, maxPoints } = req.body;
    if (number == null || !name) {
        return res.status(400).json({ error: 'Укажите номер и название задания' });
    }
    const task = await createTask({ number, name, description, link, maxPoints });
    res.status(201).json(task);
});

router.put('/tasks/:id', async (req, res) => {
    const { number, name, description, link, maxPoints } = req.body;
    if (number == null || !name) {
        return res.status(400).json({ error: 'Укажите номер и название задания' });
    }
    const task = await updateTask(req.params.id, { number, name, description, link, maxPoints });
    if (!task) return res.status(404).json({ error: 'Задание не найдено' });
    res.json(task);
});

router.delete('/tasks/:id', async (req, res) => {
    const result = await deleteTask(req.params.id);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Задание не найдено' });
    res.json({ message: 'Задание удалено' });
});

// Scores
router.get('/scores', async (req, res) => {
    const [teams, tasks, scores] = await Promise.all([
        getAllTeams(),
        getAllTasks(),
        getAllScores()
    ]);
    res.json({ teams, tasks, scores });
});

router.put('/scores', async (req, res) => {
    const { teamId, taskId, points } = req.body;
    if (teamId == null || taskId == null || points == null) {
        return res.status(400).json({ error: 'Укажите teamId, taskId и points' });
    }
    let pts = parseInt(points);
    if (pts < 0) pts = 0;
    const task = await findTaskById(taskId);
    if (!task) return res.status(404).json({ error: 'Задание не найдено' });
    if (pts > task.maxPoints) pts = task.maxPoints;
    const score = await upsertScore(teamId, taskId, pts);
    res.json(score);
});

// Settings
router.get('/settings', async (req, res) => {
    const settings = await getAllSettings();
    res.json(settings);
});

router.put('/settings', async (req, res) => {
    const { key, value } = req.body;
    if (!key) return res.status(400).json({ error: 'Укажите key' });
    await setSetting(key, value);
    res.json({ key, value });
});

// Freeze / unfreeze results
router.post('/settings/freeze', async (req, res) => {
    const results = await getResults();
    await setSetting('frozen_snapshot', JSON.stringify(results));
    await setSetting('results_frozen', 'true');
    res.json({ message: 'Результаты заморожены' });
});

router.post('/settings/unfreeze', async (req, res) => {
    await setSetting('results_frozen', 'false');
    await setSetting('frozen_snapshot', '');
    res.json({ message: 'Результаты разморожены' });
});

// Pipeline tokens
router.get('/pipeline-tokens', async (req, res) => {
    const tokens = await getAllPipelineTokens();
    res.json(tokens);
});

router.post('/pipeline-tokens', async (req, res) => {
    const token = await createPipelineToken();
    res.json(token);
});

router.delete('/pipeline-tokens/:id', async (req, res) => {
    await revokePipelineToken(parseInt(req.params.id));
    res.json({ message: 'Токен отозван' });
});

export default router;
