# Backend Deployment Guide

## Environment Setup

Before running the backend, you need to configure your environment variables.

### 1. Get Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings > API
4. Copy the following:
   - Project URL
   - Anon/Public key
   - Service Role key (keep this secret!)

### 2. Configure Environment

Edit `backend/.env` and update with your actual Supabase credentials:

```env
SUPABASE_URL=your_actual_supabase_url
SUPABASE_ANON_KEY=your_actual_anon_key
SUPABASE_SERVICE_KEY=your_actual_service_role_key
JWT_SECRET=change_this_to_a_random_secret
PORT=5000
```

**IMPORTANT**: The `.env` file currently contains placeholder values. You MUST update it with your actual Supabase credentials.

### 3. Test Database Connection

After configuring your `.env`, test the connection:

```bash
cd backend
node test.js
```

You should see:
```
✓ Users table accessible
✓ Jobs table accessible
✓ Applications table accessible
```

### 4. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Verifying Setup

1. Health check:
```bash
curl http://localhost:5000/api/health
```

Expected: `{"status":"ok"}`

2. Test signup:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }'
```

Expected: A JSON response with `token` and `user` fields.

## Troubleshooting

### "Missing Supabase credentials"

- Check that `backend/.env` exists
- Verify all required variables are set
- Make sure there are no typos in variable names

### "Database connection failed"

- Verify your Supabase URL is correct
- Check that your Service Role key is valid
- Ensure your Supabase project is active

### "fetch failed" or "ENOTFOUND"

- Verify network connectivity
- Check if Supabase URL is correct
- Ensure you're using the Service Role key, not the Anon key

### Port already in use

Change the PORT in `.env` to a different number (e.g., 5001)

## Production Checklist

- [ ] Update `.env` with production Supabase credentials
- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Update CORS origins in `index.js` to match your frontend URL
- [ ] Enable SSL/HTTPS
- [ ] Set up environment variables in your hosting platform
- [ ] Never commit `.env` to version control
- [ ] Set up logging and monitoring
- [ ] Configure database backups in Supabase
