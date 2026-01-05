-- Create sessions table for authentication
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    email TEXT,
    name TEXT,
    picture TEXT,
    provider TEXT,
    created_at INTEGER,
    expires_at INTEGER
);
-- Ensure projects table exists (for dashboard stats)
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    created_at INTEGER
);
-- Ensure users table exists
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    name TEXT,
    role TEXT DEFAULT 'member'
);
-- Ensure tasks table exists
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'todo',
    project_id TEXT,
    assigned_to TEXT
);