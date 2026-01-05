-- Enhance projects table
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    -- active, completed, archived
    priority TEXT DEFAULT 'medium',
    -- low, medium, high
    budget REAL DEFAULT 0,
    spent REAL DEFAULT 0,
    start_date INTEGER,
    end_date INTEGER,
    created_at INTEGER,
    updated_at INTEGER,
    owner_id TEXT
);
-- Enhance users table if needed
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    name TEXT,
    picture TEXT,
    role TEXT DEFAULT 'member',
    -- member, admin, owner
    created_at INTEGER
);