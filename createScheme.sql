DROP TABLE IF EXISTS scores;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS news;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS teams;

CREATE TABLE contacts (
    id              SERIAL       PRIMARY KEY,
    telegram        VARCHAR(255),
    vk              VARCHAR(255),
    created_at      TIMESTAMP    NOT NULL    DEFAULT NOW()
);

CREATE TABLE news (
    id              SERIAL       PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    content         TEXT         NOT NULL,
    published_at    TIMESTAMP    NOT NULL    DEFAULT NOW()
);

CREATE TABLE teams (
    id              SERIAL       PRIMARY KEY,
    name            VARCHAR(255) NOT NULL    UNIQUE,
    invite_code     VARCHAR(36)  UNIQUE,
    score           INTEGER      DEFAULT 0,
    hash            VARCHAR(8)   NOT NULL    UNIQUE
);

CREATE TABLE users (
    id              SERIAL       PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL    UNIQUE,
    university_group VARCHAR(255) NOT NULL,
    password_hash   TEXT         NOT NULL,
    role            VARCHAR(50),
    is_admin        BOOLEAN      DEFAULT false,
    team_id         INTEGER      REFERENCES teams(id) ON DELETE SET NULL
);

CREATE TABLE tasks (
    id              SERIAL       PRIMARY KEY,
    number          INTEGER      NOT NULL    UNIQUE,
    name            VARCHAR(255) NOT NULL,
    description     TEXT         NOT NULL    DEFAULT '',
    link            TEXT         NOT NULL    DEFAULT '',
    max_points      INTEGER      NOT NULL    DEFAULT 0
);

CREATE TABLE scores (
    team_id         INTEGER      NOT NULL    REFERENCES teams(id) ON DELETE CASCADE,
    task_id         INTEGER      NOT NULL    REFERENCES tasks(id) ON DELETE CASCADE,
    points          INTEGER      NOT NULL    DEFAULT 0,
    PRIMARY KEY (team_id, task_id)
);

CREATE TABLE settings (
    key             VARCHAR(100) PRIMARY KEY,
    value           TEXT         NOT NULL    DEFAULT ''
);

INSERT INTO settings(key, value) VALUES
    ('results_visible', 'false'),
    ('tasks_visible', 'false'),
    ('results_frozen', 'false'),
    ('frozen_snapshot', '');

CREATE TABLE pipeline_tokens (
    id              SERIAL       PRIMARY KEY,
    token           VARCHAR(64)  NOT NULL UNIQUE,
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    active          BOOLEAN      NOT NULL DEFAULT true
);