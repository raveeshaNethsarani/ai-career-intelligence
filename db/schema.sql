-- AI Career Intelligence Platform: database schema
-- Safe to run more than once (IF NOT EXISTS).

CREATE TABLE IF NOT EXISTS candidate_profile (
    id                  SERIAL PRIMARY KEY,
    display_name        TEXT NOT NULL DEFAULT 'Candidate',
    target_roles        TEXT[] NOT NULL DEFAULT '{}',
    skills              TEXT[] NOT NULL DEFAULT '{}',
    must_have           TEXT[] NOT NULL DEFAULT '{}',
    avoid_keywords      TEXT[] NOT NULL DEFAULT '{}',
    experience_years    NUMERIC(4,1) NOT NULL DEFAULT 0 CHECK (experience_years >= 0),
    preferred_locations TEXT[] NOT NULL DEFAULT '{}',
    work_modes          TEXT[] NOT NULL DEFAULT '{}',
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS jobs (
    id              BIGSERIAL PRIMARY KEY,
    source          TEXT NOT NULL,
    external_id     TEXT,
    source_url      TEXT NOT NULL,
    title           TEXT NOT NULL CHECK (length(trim(title)) > 0),
    company         TEXT,
    location        TEXT,
    work_mode       TEXT NOT NULL DEFAULT 'unknown'
                    CHECK (work_mode IN ('remote','hybrid','onsite','unknown')),
    employment_type TEXT,
    min_experience  NUMERIC(4,1),
    description     TEXT NOT NULL,
    skills_extracted TEXT[] NOT NULL DEFAULT '{}',
    posted_at       TIMESTAMPTZ,
    fetched_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_jobs_source_url UNIQUE (source_url)
);
CREATE INDEX IF NOT EXISTS idx_jobs_fetched_at ON jobs (fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_work_mode ON jobs (work_mode);

CREATE TABLE IF NOT EXISTS job_matches (
    id              BIGSERIAL PRIMARY KEY,
    job_id          BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    profile_id      INTEGER NOT NULL REFERENCES candidate_profile(id) ON DELETE CASCADE,
    rules_score     NUMERIC(5,2) CHECK (rules_score BETWEEN 0 AND 100),
    ai_score        NUMERIC(5,2) CHECK (ai_score BETWEEN 0 AND 100),
    final_score     NUMERIC(5,2) NOT NULL CHECK (final_score BETWEEN 0 AND 100),
    matched_skills  TEXT[] NOT NULL DEFAULT '{}',
    missing_skills  TEXT[] NOT NULL DEFAULT '{}',
    reasoning       TEXT,
    red_flags       TEXT[] NOT NULL DEFAULT '{}',
    needs_review    BOOLEAN NOT NULL DEFAULT FALSE,
    model_name      TEXT,
    scoring_version TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_match_per_version UNIQUE (job_id, profile_id, scoring_version)
);
CREATE INDEX IF NOT EXISTS idx_matches_final_score ON job_matches (final_score DESC);
CREATE INDEX IF NOT EXISTS idx_matches_created_at ON job_matches (created_at DESC);

CREATE TABLE IF NOT EXISTS job_actions (
    job_id     BIGINT PRIMARY KEY REFERENCES jobs(id) ON DELETE CASCADE,
    saved      BOOLEAN NOT NULL DEFAULT FALSE,
    status     TEXT NOT NULL DEFAULT 'new'
               CHECK (status IN ('new','saved','applied','interview','offer','rejected')),
    notes      TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rejected_jobs (
    id          BIGSERIAL PRIMARY KEY,
    source      TEXT,
    raw         JSONB,
    reason      TEXT NOT NULL,
    rejected_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workflow_runs (
    id            BIGSERIAL PRIMARY KEY,
    workflow_name TEXT NOT NULL,
    status        TEXT NOT NULL CHECK (status IN ('success','partial','failed')),
    fetched       INTEGER NOT NULL DEFAULT 0,
    rejected      INTEGER NOT NULL DEFAULT 0,
    duplicates    INTEGER NOT NULL DEFAULT 0,
    inserted      INTEGER NOT NULL DEFAULT 0,
    started_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    finished_at   TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS error_logs (
    id            BIGSERIAL PRIMARY KEY,
    workflow_name TEXT,
    failed_node   TEXT,
    error_message TEXT,
    execution_id  TEXT,
    occurred_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved      BOOLEAN NOT NULL DEFAULT FALSE
);
