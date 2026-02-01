# Hireable Backend API

Minimal backend for the Hireable job portal. Built with Node.js, Express, and Supabase.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your credentials to `.env`:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
JWT_SECRET=your_random_secret_key
PORT=5000
```

4. Run database migrations (see Database Setup below)

5. Start the server:
```bash
npm run dev
```

## Database Setup

The backend uses Supabase. Create these tables:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'candidate',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT DEFAULT 'Remote',
  type TEXT DEFAULT 'Full-time',
  salary TEXT,
  description TEXT,
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  posted_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications table
CREATE TABLE applications (
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

-- RLS Policies (permissive for API use with service key)
CREATE POLICY "Allow service role full access to users" ON users FOR ALL USING (true);
CREATE POLICY "Allow service role full access to jobs" ON jobs FOR ALL USING (true);
CREATE POLICY "Allow service role full access to applications" ON applications FOR ALL USING (true);
```

## API Endpoints

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Authentication

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Jobs

**Create Job (requires auth):**
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Senior React Developer",
    "company": "Tech Corp",
    "location": "Remote",
    "type": "Full-time",
    "salary": "$120,000 - $150,000",
    "description": "We are looking for an experienced React developer",
    "skills": "React, TypeScript, Node.js"
  }'
```

**Get Jobs:**
```bash
# All jobs
curl http://localhost:5000/api/jobs

# Filter by location
curl "http://localhost:5000/api/jobs?location=Remote"

# Filter by type
curl "http://localhost:5000/api/jobs?type=Full-time"

# Filter by tag
curl "http://localhost:5000/api/jobs?tag=React"
```

**Apply to Job (requires auth):**
```bash
curl -X POST http://localhost:5000/api/jobs/JOB_ID/apply \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### User Applications

**Get Applied Jobs (requires auth):**
```bash
curl http://localhost:5000/api/users/USER_ID/applications \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Development

Run in development mode with auto-reload:
```bash
npm run dev
```

Run in production:
```bash
npm start
```

## Tech Stack

- Node.js + Express
- Supabase (PostgreSQL)
- JWT for authentication
- bcrypt for password hashing

## Security

- Passwords are hashed with bcrypt
- JWT tokens expire in 7 days
- Protected routes require valid JWT
- Users can only access their own application data
- CORS enabled for frontend (localhost:5173, localhost:8080)
