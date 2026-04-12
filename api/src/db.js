import dbFactory from './dbFactory.js';

import crypto from 'crypto';

const db = await dbFactory.getDb();

function generateHash() {
    return crypto.randomBytes(4).toString('hex');
}

function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

export async function createTeam(teamName, inviteCode = null) {
    const hash = generateHash();
    return db.one('INSERT INTO teams(name, invite_code, hash) VALUES($1, $2, $3) RETURNING *', [teamName, inviteCode, hash]);
}

export async function createUser({ fullName, group, email, passwordHash, teamId = null, role = null }) {
    const res = await db.one(`INSERT INTO users(name, university_group, email, password_hash, team_id, role) 
        VALUES($<fullName>,$<group>,$<email>,$<passwordHash>,$<teamId>,$<role>) RETURNING id`,
        { fullName, group, email, passwordHash, teamId, role }
    );
    return { id: res.id, fullName, group, email, passwordHash, teamId, role };
}

export async function findUserByEmail(email) {
    return db.oneOrNone(`SELECT 
        id, 
        name AS "fullName",
        university_group AS group, 
        email, 
        password_hash AS "passwordHash",
        team_id AS "teamId",
        role,
        is_admin AS "isAdmin"
        FROM users WHERE email = $1`, [email]);
}

export async function findUserById(id) {
        return db.oneOrNone(`SELECT 
        id, 
        name AS "fullName",
        university_group AS group, 
        email, 
        password_hash AS "passwordHash",
        team_id AS "teamId",
        role,
        is_admin AS "isAdmin"
        FROM users WHERE id = $1`, [id]);
}

export async function findTeamById(id) {
    return db.oneOrNone(`SELECT * FROM teams WHERE id = $1`, [id]);
}

export async function findTeamByName(name) {
    return db.oneOrNone(`SELECT * FROM teams WHERE name = $1`, [name]);
}

export async function getTeamMembers(teamId) {
    return db.any(`SELECT 
        id, 
        name AS "fullName",
        university_group AS group, 
        email, 
        password_hash AS "passwordHash",
        team_id AS "teamId",
        role,
        is_admin AS "isAdmin"
        FROM users WHERE team_id = $1`, teamId);
}

export async function getAllTeams() {
    return db.any('SELECT id, name, hash FROM teams');
}

export async function updateUser(id, { newFullName, newGroup }) {
    console.log('user.id, newFullName, newGroup', id, newFullName, newGroup);
    const user = await db.oneOrNone(
        `UPDATE users 
        SET name = COALESCE($1, name), 
        university_group = COALESCE($2, university_group) 
        WHERE id = $3 
        RETURNING
        id, 
        name AS "fullName",
        university_group AS group, 
        email, 
        password_hash AS "passwordHash",
        team_id AS "teamId",
        role,
        is_admin AS "isAdmin"`,
        [newFullName, newGroup, id]
    );
    if (!user) {
        return null;
    } else {
        return user;
    }
}

export async function getAllNews() {
    return db.any('SELECT id, title, content, published_at AS "publishedAt" FROM news ORDER BY published_at DESC');
}

export async function findNewsById(id) {
    return db.oneOrNone(`SELECT 
        id, title, content, published_at AS "publishedAt" 
        FROM news 
        WHERE id = $1;`, 
        [id]
    );
}

export async function updateTeamName(teamId, newName) {
    return db.oneOrNone(
        'UPDATE teams SET name = $1 WHERE id = $2 RETURNING *',
        [newName, teamId]
    );
}

export async function updateUserEmail(userId, newEmail) {
    return db.oneOrNone(
        `UPDATE users SET email = $1 WHERE id = $2
        RETURNING id, name AS "fullName", university_group AS group, email, team_id AS "teamId", role`,
        [newEmail, userId]
    );
}

export async function updateUserPassword(userId, newPasswordHash) {
    return db.oneOrNone(
        'UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id',
        [newPasswordHash, userId]
    );
}

export async function getAllContacts() {
    return db.any('SELECT id, telegram, vk, created_at AS "createdAt" FROM contacts ORDER BY created_at DESC');
}

export async function saveContact({ telegram, vk }) {
    return db.one(
        'INSERT INTO contacts(telegram, vk) VALUES($1, $2) RETURNING *',
        [telegram || null, vk || null]
    );
}

export async function findTeamByInviteCode(inviteCode) {
    return db.oneOrNone('SELECT * FROM teams WHERE invite_code = $1', [inviteCode]);
}

export async function setUserTeam(userId, teamId, role) {
    return db.oneOrNone(
        `UPDATE users SET team_id = $1, role = $2 WHERE id = $3
        RETURNING id, name AS "fullName", university_group AS group, email, team_id AS "teamId", role`,
        [teamId, role, userId]
    );
}

export async function clearTeamMembers(teamId) {
    return db.none('UPDATE users SET team_id = NULL, role = NULL WHERE team_id = $1', [teamId]);
}

export async function deleteTeam(teamId) {
    return db.none('DELETE FROM teams WHERE id = $1', [teamId]);
}

// Admin functions
export async function getAllUsers() {
    return db.any(`SELECT 
        id, name AS "fullName", university_group AS group, email, 
        team_id AS "teamId", role, is_admin AS "isAdmin"
        FROM users ORDER BY id`);
}

export async function setAdmin(userId, isAdmin) {
    return db.oneOrNone(
        'UPDATE users SET is_admin = $1 WHERE id = $2 RETURNING id, is_admin AS "isAdmin"',
        [isAdmin, userId]
    );
}

export async function getAllTeamsWithMembers() {
    const teams = await db.any('SELECT id, name, invite_code AS "inviteCode", score, hash FROM teams ORDER BY id');
    for (const team of teams) {
        team.members = await db.any(`SELECT 
            id, name AS "fullName", university_group AS group, email, role
            FROM users WHERE team_id = $1 ORDER BY id`, [team.id]);
    }
    return teams;
}

export async function createNews(title, content) {
    return db.one(
        'INSERT INTO news(title, content) VALUES($1, $2) RETURNING id, title, content, published_at AS "publishedAt"',
        [title, content]
    );
}

export async function updateNews(id, title, content) {
    return db.oneOrNone(
        'UPDATE news SET title = $1, content = $2 WHERE id = $3 RETURNING id, title, content, published_at AS "publishedAt"',
        [title, content, id]
    );
}

export async function deleteNews(id) {
    return db.result('DELETE FROM news WHERE id = $1', [id]);
}

// Tasks
export async function getAllTasks() {
    return db.any('SELECT id, number, name, description, link, max_points AS "maxPoints" FROM tasks ORDER BY number');
}

export async function findTaskById(id) {
    return db.oneOrNone('SELECT id, number, name, description, link, max_points AS "maxPoints" FROM tasks WHERE id = $1', [id]);
}

export async function createTask({ number, name, description, link, maxPoints }) {
    return db.one(
        'INSERT INTO tasks(number, name, description, link, max_points) VALUES($1, $2, $3, $4, $5) RETURNING id, number, name, description, link, max_points AS "maxPoints"',
        [number, name, description || '', link || '', maxPoints || 0]
    );
}

export async function updateTask(id, { number, name, description, link, maxPoints }) {
    return db.oneOrNone(
        'UPDATE tasks SET number=$1, name=$2, description=$3, link=$4, max_points=$5 WHERE id=$6 RETURNING id, number, name, description, link, max_points AS "maxPoints"',
        [number, name, description || '', link || '', maxPoints || 0, id]
    );
}

export async function deleteTask(id) {
    return db.result('DELETE FROM tasks WHERE id = $1', [id]);
}

// Scores
export async function getScoresForTeam(teamId) {
    return db.any('SELECT task_id AS "taskId", points FROM scores WHERE team_id = $1', [teamId]);
}

export async function getAllScores() {
    return db.any('SELECT team_id AS "teamId", task_id AS "taskId", points FROM scores');
}

export async function upsertScore(teamId, taskId, points) {
    return db.one(
        `INSERT INTO scores(team_id, task_id, points) VALUES($1, $2, $3)
         ON CONFLICT (team_id, task_id) DO UPDATE SET points = $3
         RETURNING team_id AS "teamId", task_id AS "taskId", points`,
        [teamId, taskId, points]
    );
}

// Results (public scoreboard)
export async function getResults() {
    const teams = await db.any('SELECT id, name FROM teams ORDER BY name');
    const tasks = await db.any('SELECT id, number, name, max_points AS "maxPoints" FROM tasks ORDER BY number');
    const scores = await db.any('SELECT team_id AS "teamId", task_id AS "taskId", points FROM scores');

    const scoreMap = {};
    for (const s of scores) {
        if (!scoreMap[s.teamId]) scoreMap[s.teamId] = {};
        scoreMap[s.teamId][s.taskId] = s.points;
    }

    const rows = teams.map(t => ({
        teamId: t.id,
        teamName: t.name,
        scores: tasks.map(task => scoreMap[t.id]?.[task.id] || 0),
        total: tasks.reduce((sum, task) => sum + (scoreMap[t.id]?.[task.id] || 0), 0)
    }));

    rows.sort((a, b) => b.total - a.total);

    return { tasks, rows };
}

// Settings
export async function getSetting(key) {
    const row = await db.oneOrNone('SELECT value FROM settings WHERE key = $1', [key]);
    return row?.value ?? '';
}

export async function setSetting(key, value) {
    return db.none(
        `INSERT INTO settings(key, value) VALUES($1, $2)
         ON CONFLICT (key) DO UPDATE SET value = $2`,
        [key, value]
    );
}

export async function getAllSettings() {
    const rows = await db.any('SELECT key, value FROM settings');
    const map = {};
    for (const r of rows) map[r.key] = r.value;
    return map;
}

// Pipeline tokens
export async function createPipelineToken() {
    const token = generateToken();
    return db.one('INSERT INTO pipeline_tokens(token) VALUES($1) RETURNING id, token, created_at AS "createdAt", active', [token]);
}

export async function getAllPipelineTokens() {
    return db.any('SELECT id, token, created_at AS "createdAt", active FROM pipeline_tokens ORDER BY created_at DESC');
}

export async function revokePipelineToken(id) {
    return db.oneOrNone('UPDATE pipeline_tokens SET active = false WHERE id = $1 RETURNING id', [id]);
}

export async function findActivePipelineToken(token) {
    return db.oneOrNone('SELECT id FROM pipeline_tokens WHERE token = $1 AND active = true', [token]);
}

// Pipeline: find team by hash
export async function findTeamByHash(hash) {
    return db.oneOrNone('SELECT id, name, hash FROM teams WHERE hash = $1', [hash]);
}

// Pipeline: find task by number
export async function findTaskByNumber(number) {
    return db.oneOrNone('SELECT id, number, name, max_points AS "maxPoints" FROM tasks WHERE number = $1', [number]);
}

// Pipeline: upsert score (only increase)
export async function pipelineUpsertScore(teamId, taskId, points) {
    return db.one(
        `INSERT INTO scores(team_id, task_id, points) VALUES($1, $2, $3)
         ON CONFLICT (team_id, task_id) DO UPDATE SET points = GREATEST(scores.points, $3)
         RETURNING team_id AS "teamId", task_id AS "taskId", points`,
        [teamId, taskId, points]
    );
}