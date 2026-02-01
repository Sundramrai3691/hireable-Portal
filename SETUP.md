# Hireable Setup Guide

Complete setup guide for the Hireable job portal with backend.

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend will start on http://localhost:5000

### 2. Frontend Setup

In a new terminal:

```bash
npm install
npm run dev
```

The frontend will start on http://localhost:8080

### 3. Test the API

Health check:
```bash
curl http://localhost:5000/api/health
```

Expected response: `{"status":"ok"}`

## Environment Variables

The backend `.env` file is already configured with Supabase credentials. The file contains:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Public anonymous key
- `SUPABASE_SERVICE_KEY` - Service role key for backend operations
- `JWT_SECRET` - Secret for signing JWT tokens
- `PORT` - Backend server port (default: 5000)

## Database

The database is already set up with the following tables:

- **users** - User accounts with authentication
- **jobs** - Job postings
- **applications** - Job applications linking users to jobs

Tables include proper indexes and Row Level Security (RLS) policies.

## Testing the Full Flow

### 1. Create a user account

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

Save the `token` from the response.

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Create a job

```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Senior React Developer",
    "company": "Tech Corp",
    "location": "Remote",
    "type": "Full-time",
    "salary": "$120,000 - $150,000",
    "description": "Looking for an experienced React developer",
    "skills": "React, TypeScript, Node.js"
  }'
```

### 4. Get all jobs

```bash
curl http://localhost:5000/api/jobs
```

### 5. Apply to a job

```bash
curl -X POST http://localhost:5000/api/jobs/JOB_ID/apply \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. View your applications

```bash
curl http://localhost:5000/api/users/USER_ID/applications \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Architecture

```
hireable-portal/
├── backend/                 # Node.js + Express API
│   ├── config/             # Supabase configuration
│   ├── middleware/         # JWT authentication
│   ├── routes/             # API endpoints
│   │   ├── auth.js        # Signup & Login
│   │   ├── jobs.js        # Job CRUD & Apply
│   │   └── users.js       # User applications
│   ├── index.js           # Server entry point
│   └── package.json
│
└── src/                    # React frontend
    ├── components/         # UI components
    ├── pages/             # Page components
    ├── lib/
    │   └── api.ts         # API client for backend
    └── data/              # Mock data (can be removed)
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/health | No | Health check |
| POST | /api/auth/signup | No | Create account |
| POST | /api/auth/login | No | Login |
| POST | /api/jobs | Yes | Create job |
| GET | /api/jobs | No | List jobs |
| POST | /api/jobs/:id/apply | Yes | Apply to job |
| GET | /api/users/:id/applications | Yes | Get applications |

## Frontend Integration

The frontend uses the API client at `src/lib/api.ts`:

```typescript
import { apiClient } from '@/lib/api';

// Signup
await apiClient.signup({ email, password, name });

// Login
await apiClient.login({ email, password });

// Get jobs
const jobs = await apiClient.getJobs();

// Create job
await apiClient.createJob({ title, company, ... });

// Apply to job
await apiClient.applyToJob(jobId);

// Get user applications
const applications = await apiClient.getUserApplications(userId);
```

## Security

- Passwords are hashed with bcrypt (10 rounds)
- JWT tokens expire in 7 days
- Protected endpoints require valid JWT in Authorization header
- Users can only access their own application data
- CORS enabled for localhost:5173 and localhost:8080
- Row Level Security (RLS) enabled on all database tables

## Troubleshooting

### Backend won't start

1. Check if port 5000 is available
2. Verify `.env` file exists in backend folder
3. Check database connection with the health endpoint

### Frontend can't connect to backend

1. Ensure backend is running on http://localhost:5000
2. Check browser console for CORS errors
3. Verify API_BASE_URL in `src/lib/api.ts`

### Authentication issues

1. Clear localStorage in browser DevTools
2. Generate new JWT token by logging in again
3. Check token expiration (7 days)

## Production Deployment

### Backend

1. Update `.env` with production values
2. Change JWT_SECRET to a strong random value
3. Update CORS origin to production frontend URL
4. Deploy to a Node.js hosting service (Heroku, Railway, Render)

### Frontend

1. Update API_BASE_URL in `src/lib/api.ts` to production backend URL
2. Build: `npm run build`
3. Deploy `dist` folder to static hosting (Vercel, Netlify)

### Database

Supabase is already production-ready. Just ensure:
- RLS policies are properly configured
- Connection pooling is enabled
- Backups are scheduled
