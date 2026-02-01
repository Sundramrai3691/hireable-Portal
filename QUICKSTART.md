# Quick Start Guide

Get Hireable running in 5 minutes.

## Step 1: Install Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

## Step 2: Configure Database

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or select existing
3. Go to Settings > API
4. Copy these values:
   - **URL** (looks like: https://xxx.supabase.co)
   - **anon public** key
   - **service_role** secret key

## Step 3: Update Backend Config

Edit `backend/.env`:

```env
SUPABASE_URL=paste_your_url_here
SUPABASE_ANON_KEY=paste_anon_key_here
SUPABASE_SERVICE_KEY=paste_service_key_here
JWT_SECRET=any_random_string_here
PORT=5000
```

## Step 4: Verify Database

The database tables are already created. Test the connection:

```bash
cd backend
node test.js
```

Expected output:
```
✓ Users table accessible
✓ Jobs table accessible
✓ Applications table accessible
```

If you see errors, double-check your Supabase credentials.

## Step 5: Start Backend

```bash
cd backend
npm run dev
```

You should see:
```
✓ Database connected successfully
✓ Server running on http://localhost:5000
✓ Health check: http://localhost:5000/api/health
```

## Step 6: Start Frontend

Open a new terminal:

```bash
npm run dev
```

Frontend will open at http://localhost:8080

## Step 7: Test It Out

1. Open http://localhost:8080 in your browser
2. Click around the UI
3. Try posting a job (note: you'll need to implement auth UI first)

## Test Backend API

Health check:
```bash
curl http://localhost:5000/api/health
```

Create account:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User"}'
```

Get jobs:
```bash
curl http://localhost:5000/api/jobs
```

## What's Next?

1. Integrate the API client in your frontend components
2. Add authentication UI for signup/login
3. Connect job posting form to backend
4. Enable job applications
5. Show user's applied jobs

## Troubleshooting

**Backend won't start:**
- Check `.env` file exists in backend folder
- Verify all credentials are correct
- Make sure port 5000 is available

**Database errors:**
- Verify Supabase project is active
- Check you're using Service Role key (not anon key)
- Run migration if tables don't exist

**Frontend can't connect:**
- Ensure backend is running
- Check http://localhost:5000/api/health
- Look for CORS errors in browser console

## Next Steps

Read the full documentation:
- [SETUP.md](./SETUP.md) - Complete setup guide
- [backend/README.md](./backend/README.md) - API documentation
- [backend/DEPLOYMENT.md](./backend/DEPLOYMENT.md) - Deployment guide
