-- Migration: Brands, URLs, Apps, and Resources Management
-- Purpose: Unified tracking of all brands, URLs, apps, and Cloudflare resources

-- Brands Table
CREATE TABLE IF NOT EXISTS brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT, -- 'core', 'ecommerce', 'energy', 'events', 'portfolio', 'client'
    status TEXT DEFAULT 'active', -- 'active', 'archived', 'deprecated'
    website_url TEXT,
    parent_brand_id INTEGER, -- For brand hierarchy
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (parent_brand_id) REFERENCES brands(id)
);

-- URLs/Domains Table
CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand_id INTEGER,
    url TEXT NOT NULL UNIQUE,
    url_type TEXT, -- 'domain', 'worker', 'pages', 'custom'
    cloudflare_zone_id TEXT,
    cloudflare_worker_id TEXT,
    cloudflare_pages_id TEXT,
    status TEXT DEFAULT 'active', -- 'active', '404', 'redirect', 'archived'
    plan TEXT, -- 'free', 'pro', 'business', 'enterprise'
    last_checked INTEGER,
    http_status INTEGER,
    notes TEXT,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (brand_id) REFERENCES brands(id)
);

-- Apps/Modules Table
CREATE TABLE IF NOT EXISTS apps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand_id INTEGER,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    app_type TEXT, -- 'dashboard', 'api', 'worker', 'pages', 'module'
    status TEXT DEFAULT 'active', -- 'active', 'deprecated', 'archived'
    github_repo TEXT,
    cloudflare_worker_name TEXT,
    cloudflare_pages_project TEXT,
    primary_url TEXT,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (brand_id) REFERENCES brands(id)
);

-- Cloudflare Resources Table
CREATE TABLE IF NOT EXISTS cloudflare_resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resource_type TEXT NOT NULL, -- 'worker', 'pages', 'd1', 'r2', 'kv', 'hyperdrive'
    resource_name TEXT NOT NULL,
    resource_id TEXT,
    brand_id INTEGER,
    app_id INTEGER,
    status TEXT DEFAULT 'active',
    metadata TEXT, -- JSON string of additional data
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (brand_id) REFERENCES brands(id),
    FOREIGN KEY (app_id) REFERENCES apps(id),
    UNIQUE(resource_type, resource_name)
);

-- Projects Table (existing, but linking to brands)
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    owner_id INTEGER,
    brand_id INTEGER,
    app_id INTEGER,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (brand_id) REFERENCES brands(id),
    FOREIGN KEY (app_id) REFERENCES apps(id)
);

-- URL Health Checks Table
CREATE TABLE IF NOT EXISTS url_health_checks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url_id INTEGER NOT NULL,
    http_status INTEGER,
    response_time_ms INTEGER,
    error_message TEXT,
    checked_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (url_id) REFERENCES urls(id)
);

-- Duplicates Tracking Table
CREATE TABLE IF NOT EXISTS duplicate_resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resource_type TEXT NOT NULL, -- 'worker', 'url', 'app'
    resource_name TEXT NOT NULL,
    duplicate_of_id INTEGER, -- ID of the canonical resource
    status TEXT DEFAULT 'pending', -- 'pending', 'merged', 'deleted', 'kept'
    notes TEXT,
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (duplicate_of_id) REFERENCES cloudflare_resources(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_status ON brands(status);
CREATE INDEX IF NOT EXISTS idx_urls_brand ON urls(brand_id);
CREATE INDEX IF NOT EXISTS idx_urls_status ON urls(status);
CREATE INDEX IF NOT EXISTS idx_apps_brand ON apps(brand_id);
CREATE INDEX IF NOT EXISTS idx_apps_status ON apps(status);
CREATE INDEX IF NOT EXISTS idx_resources_type ON cloudflare_resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_resources_brand ON cloudflare_resources(brand_id);
CREATE INDEX IF NOT EXISTS idx_health_checks_url ON url_health_checks(url_id);

