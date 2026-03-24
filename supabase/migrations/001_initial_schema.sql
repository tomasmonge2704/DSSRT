-- Accounts table (dynamic, replaces hardcoded AccountHandle)
CREATE TABLE accounts (
  handle TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  color_hsl TEXT,
  tiktok_open_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Weekly metrics (replaces data/metrics.json)
CREATE TABLE weekly_metrics (
  id TEXT PRIMARY KEY,
  account_handle TEXT NOT NULL REFERENCES accounts(handle),
  week_label TEXT NOT NULL,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  views BIGINT NOT NULL DEFAULT 0,
  likes BIGINT NOT NULL DEFAULT 0,
  comments BIGINT NOT NULL DEFAULT 0,
  shares BIGINT NOT NULL DEFAULT 0,
  followers BIGINT NOT NULL DEFAULT 0,
  profile_visits BIGINT NOT NULL DEFAULT 0,
  reach BIGINT NOT NULL DEFAULT 0,
  interactions BIGINT NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT 'excel' CHECK (source IN ('excel', 'tiktok_api')),
  synced_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(account_handle, week_start_date, source)
);

-- TikTok OAuth tokens
CREATE TABLE tiktok_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_handle TEXT NOT NULL REFERENCES accounts(handle),
  open_id TEXT NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  access_token_expires_at TIMESTAMPTZ NOT NULL,
  refresh_token_expires_at TIMESTAMPTZ NOT NULL,
  scope TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sync log for tracking cron runs
CREATE TABLE sync_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_handle TEXT NOT NULL REFERENCES accounts(handle),
  started_at TIMESTAMPTZ DEFAULT now(),
  finished_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'success', 'error')),
  metrics_count INT DEFAULT 0,
  error_message TEXT
);

-- Seed existing accounts
INSERT INTO accounts (handle, display_name, color_hsl) VALUES
  ('@elosodebresh', 'El Oso de Bresh', 'hsl(221, 83%, 53%)'),
  ('@mundobresh', 'Mundo Bresh', 'hsl(142, 71%, 45%)');

-- Indexes
CREATE INDEX idx_weekly_metrics_account ON weekly_metrics(account_handle);
CREATE INDEX idx_weekly_metrics_dates ON weekly_metrics(week_start_date, week_end_date);
CREATE INDEX idx_weekly_metrics_source ON weekly_metrics(source);
