# Hireable Backend API

Minimal backend for the Hireable job portal. Built with Node.js, Express, and MongoDB (Mongoose).

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
MONGO_URI=mongodb://localhost:27017/hireable
JWT_SECRET=your_random_secret_key
PORT=5000
```

4. Ensure MongoDB is running locally or provide a remote connection string.

5. Start the server:

```bash
npm run dev
```

## Database Setup

The backend uses MongoDB with Mongoose. The database name is `hireable` (or as specified in `MONGO_URI`).

Models:

- **User**: `email`, `passwordHash`, `name`, `role`, `createdAt`
- **Job**: `title`, `company`, `location`, `type`, `salary`, `description`, `tags`, `isActive`, `postedBy`, `createdAt`
- **Application**: `user`, `job`, `appliedAt`

The application will automatically create the necessary collections when data is inserted.

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
