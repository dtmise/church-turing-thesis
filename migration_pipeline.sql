-- Migration: add pipeline support (team hashes + pipeline tokens)

-- Add hash column to teams
ALTER TABLE teams ADD COLUMN IF NOT EXISTS hash VARCHAR(8);

-- Generate hashes for existing teams that don't have one
UPDATE teams SET hash = substr(md5(random()::text || id::text), 1, 8) WHERE hash IS NULL;

-- Make it NOT NULL + UNIQUE
ALTER TABLE teams ALTER COLUMN hash SET NOT NULL;
ALTER TABLE teams ADD CONSTRAINT teams_hash_unique UNIQUE (hash);

-- Pipeline tokens table
CREATE TABLE IF NOT EXISTS pipeline_tokens (
    id          SERIAL       PRIMARY KEY,
    token       VARCHAR(64)  NOT NULL UNIQUE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    active      BOOLEAN      NOT NULL DEFAULT true
);
