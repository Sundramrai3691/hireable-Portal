# Hireable – Job Portal

A modern job portal built using **React**, **Vite**, **Tailwind CSS**, **TypeScript**, and a **Node.js + Express** backend with **MongoDB**.

## Features

- User authentication (signup/login)
- Browse job listings with filters
- Post and manage jobs
- Apply to jobs
- View application history
- Responsive UI built with **shadcn/ui**
- Fast performance using **Vite** as the bundler

## Tech Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui (Radix UI + Tailwind variants)

### Backend
- Node.js + Express
- MongoDB (Mongoose)
- JWT authentication
- bcrypt password hashing

## Quick Start

### Prerequisites

- Node.js 18+ installed
- MongoDB installed or Atlas connection string

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd hireable-portal

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Configure Environment

Update `backend/.env` with your credentials:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_key
PORT=5000
```

### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Backend runs on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Frontend runs on http://localhost:8080

## Project Structure

```
hireable-portal/
├── backend/                 # Node.js + Express API
│   ├── config/             # Database configuration
│   ├── middleware/         # Auth middleware
│   ├── routes/             # API routes
│   │   ├── auth.js        # Signup & login
│   │   ├── jobs.js        # Job CRUD & applications
│   │   └── users.js       # User data
│   ├── index.js           # Server entry
│   ├── test.js            # DB connection test
│   └── README.md          # Backend docs
│
├── src/                    # React frontend
│   ├── components/        # UI components
│   ├── pages/            # Page components
│   ├── lib/
│   │   ├── api.ts        # API client
│   │   └── utils.ts      # Utilities
│   └── data/             # Mock data (legacy)
│
├── SETUP.md              # Detailed setup guide
└── README.md             # This file
```

## API Documentation

See `backend/README.md` for complete API documentation.

### Key Endpoints

- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/jobs` - List jobs (with filters)
- `POST /api/jobs` - Create job (auth required)
- `POST /api/jobs/:id/apply` - Apply to job (auth required)
- `GET /api/users/:id/applications` - View applications (auth required)

## Usage Examples

### Create Account

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepass123",
    "name": "John Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepass123"
  }'
```

### Browse Jobs

```bash
# All jobs
curl http://localhost:5000/api/jobs

# Filter by location
curl "http://localhost:5000/api/jobs?location=Remote"

# Filter by type
curl "http://localhost:5000/api/jobs?type=Full-time"
```

### Post a Job

```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Senior Developer",
    "company": "Tech Corp",
    "location": "Remote",
    "type": "Full-time",
    "salary": "$100k - $150k",
    "description": "We need an experienced developer",
    "skills": "React, Node.js, TypeScript"
  }'
```

## Development

### Frontend Development

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Development

```bash
cd backend
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start production server
node test.js         # Test database connection
```

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT-based authentication (7-day expiry)
- Protected API endpoints
- Row Level Security (RLS) on database
- CORS configuration
- Input validation

## Deployment

### Frontend Deployment (Vercel)

```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Backend Deployment (Railway/Render/Heroku)

1. Set environment variables on hosting platform
2. Update CORS origins in `backend/index.js`
3. Deploy backend folder

### Environment Variables

Make sure to set these in production:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `JWT_SECRET` (use a strong random value)
- `PORT`

Update frontend API URL in `src/lib/api.ts` to production backend URL.

## Troubleshooting

### Backend won't start

- Check `.env` file exists in backend folder
- Verify Supabase credentials are correct
- Ensure port 5000 is available

### Database connection errors

- Run `node test.js` to verify connection
- Check Supabase project is active
- Verify Service Role key (not Anon key) is used

### Frontend API errors

- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify token is stored in localStorage

See `SETUP.md` for detailed troubleshooting steps.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Author

Sundram Rai

---

For detailed setup instructions, see [SETUP.md](./SETUP.md)

For backend API documentation, see [backend/README.md](./backend/README.md)

For deployment guide, see [backend/DEPLOYMENT.md](./backend/DEPLOYMENT.md)
