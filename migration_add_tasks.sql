-- Migration: add tasks and scores tables (safe to run on existing DB)

CREATE TABLE IF NOT EXISTS tasks (
    id          SERIAL       PRIMARY KEY,
    number      INTEGER      NOT NULL UNIQUE,
    name        VARCHAR(255) NOT NULL,
    description TEXT         NOT NULL DEFAULT '',
    link        TEXT         NOT NULL DEFAULT '',
    max_points  INTEGER      NOT NULL DEFAULT 0
);

-- Add link column if table already exists
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS link TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS scores (
    team_id     INTEGER      NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    task_id     INTEGER      NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    points      INTEGER      NOT NULL DEFAULT 0,
    PRIMARY KEY (team_id, task_id)
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    key         VARCHAR(100) PRIMARY KEY,
    value       TEXT         NOT NULL DEFAULT ''
);

-- Default settings (ignore if already exist)
INSERT INTO settings(key, value) VALUES
    ('results_visible', 'false'),
    ('tasks_visible', 'false'),
    ('results_frozen', 'false'),
    ('frozen_snapshot', '')
ON CONFLICT (key) DO NOTHING;
