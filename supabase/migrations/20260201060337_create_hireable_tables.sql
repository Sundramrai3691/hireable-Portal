/*
  # Create Hireable Job Portal Tables

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique, not null)
      - `password_hash` (text, not null)
      - `name` (text, not null)
      - `role` (text, default 'candidate')
      - `created_at` (timestamptz)
    
    - `jobs`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `company` (text, not null)
      - `location` (text, default 'Remote')
      - `type` (text, default 'Full-time')
      - `salary` (text)
      - `description` (text)
      - `tags` (text array)
      - `is_active` (boolean, default true)
      - `posted_by` (uuid, references users)
      - `created_at` (timestamptz)
    
    - `applications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users, not null)
      - `job_id` (uuid, references jobs, not null)
      - `applied_at` (timestamptz)
      - Unique constraint on (user_id, job_id)

  2. Security
    - Enable RLS on all tables
    - Add service role policies for API access
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'candidate',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT DEFAULT 'Remote',
  type TEXT DEFAULT 'Full-time',
  salary TEXT DEFAULT 'Not specified',
  description TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  posted_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  job_id UUID REFERENCES jobs(id) NOT NULL,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for service role access
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' AND policyname = 'Service role full access to users'
  ) THEN
    CREATE POLICY "Service role full access to users" 
      ON users FOR ALL 
      USING (true) 
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'jobs' AND policyname = 'Service role full access to jobs'
  ) THEN
    CREATE POLICY "Service role full access to jobs" 
      ON jobs FOR ALL 
      USING (true) 
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'applications' AND policyname = 'Service role full access to applications'
  ) THEN
    CREATE POLICY "Service role full access to applications" 
      ON applications FOR ALL 
      USING (true) 
      WITH CHECK (true);
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
