# PlaceMate

PlaceMate is a placement intelligence platform for engineering students navigating campus placement season. It turns the original Hireable job portal into a student-first command center for placement prep, company tracking, interview experience sharing, readiness scoring, and application management.

## What It Does

- Student profile setup with branch, year, CGPA, skills, DSA stats, projects, and target companies
- Placement dashboard with personalized feed, readiness score, eligible drives, and tracker activity
- Resume-JD scorer powered by keyword extraction and TF-IDF using `natural`
- Company drive browser with branch and CGPA eligibility logic
- Application tracker with kanban-style stage management using `@hello-pangea/dnd`
- Interview experience board with filters, submission flow, and upvotes
- Readiness diagnostic with scoring breakdown and company fit suggestions
- Authenticated backend with JWT, MongoDB, and seeded sample placement data

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui + Radix UI
- React Router
- TanStack Query
- Recharts
- `@hello-pangea/dnd`

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- bcrypt
- `natural` for resume/JD text analysis

## Core Product Surfaces

### Student-facing pages

- `/` - PlaceMate landing page
- `/auth` - login and signup
- `/profile/setup` - one-time student profile onboarding
- `/dashboard` - placement command center
- `/companies` - company drive discovery and eligibility filtering
- `/jobs` - alias of the companies flow for compatibility
- `/scorer` - resume vs JD analysis
- `/experiences` - interview experience feed and submission
- `/tracker` - application kanban board
- `/readiness` - readiness diagnostic and score breakdown

### Admin-style flow

- `/post-job` - add a company drive with placement-specific metadata

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

### 1. Install dependencies

```bash
npm install

cd backend
npm install
cd ..
```

### 2. Configure environment

Create `backend/.env` from `backend/.env.example`:

```env
MONGO_URI=mongodb://localhost:27017/placemate
JWT_SECRET=replace_with_a_secure_random_secret
PORT=5000
CLIENT_URL=http://localhost:5173
```

Optional frontend environment:

```env
VITE_API_URL=http://localhost:5000
```

### 3. Run the app

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`

## Seeded Data

On backend startup, PlaceMate seeds sample company drives and interview experiences if the collections are empty. This helps avoid blank states on a fresh database.

Seeded sample companies include flows like Oracle, MathWorks, BlackRock, Texas Instruments, Atlassian, and others.

## Main Features

### 1. Profile setup

Students can save:

- College
- Branch
- Year
- CGPA
- LeetCode rating
- Problems solved
- Skills
- Project counts
- Internship status
- Open source contributions
- System design comfort
- Strong and weak topics
- Target companies

### 2. Dashboard

The dashboard combines:

- Readiness score ring
- Student profile summary
- Eligible upcoming drives
- Recent interview experiences
- Tracker activity
- Quick actions to the key tools

### 3. Resume-JD scorer

The scorer accepts raw resume text and a job description, then returns:

- Match score
- Matched keywords
- Missing keywords
- Suggestions based on repeated JD requirements

### 4. Companies flow

Company cards support:

- Branch eligibility
- CGPA cutoff visibility
- Rounds overview
- Topics asked
- Drive type and month
- Add-to-tracker action

### 5. Application tracker

Applications can be moved across stages:

- Applied
- OA
- Tech Round 1
- Tech Round 2
- HR
- Offer
- Rejected

### 6. Interview experiences

Students can:

- Browse experiences with filters
- Submit anonymized or named experiences
- Add round-by-round notes
- Tag topics asked
- Upvote helpful experiences

### 7. Readiness diagnostic

The readiness flow scores:

- DSA
- Projects
- Academics
- Skills

It also returns:

- Action items
- Readiness label
- Company fit suggestions

## Project Structure

```text
hireable-Portal/
|-- backend/
|   |-- config/
|   |-- middleware/
|   |-- models/
|   |   |-- Application.js
|   |   |-- Experience.js
|   |   |-- Job.js
|   |   |-- TrackerApplication.js
|   |   `-- User.js
|   |-- routes/
|   |   |-- auth.js
|   |   |-- experiences.js
|   |   |-- jobs.js
|   |   |-- readiness.js
|   |   |-- scorer.js
|   |   |-- tracker.js
|   |   `-- users.js
|   |-- scripts/
|   |   |-- seed.js
|   |   `-- set-default-logo.js
|   |-- utils/
|   |   |-- readiness.js
|   |   `-- serializeUser.js
|   |-- index.js
|   `-- test.js
|-- src/
|   |-- components/
|   |-- contexts/
|   |-- data/
|   |-- lib/
|   `-- pages/
|-- index.html
`-- README.md
```

## Scripts

### Frontend

```bash
npm run dev
npm run build
npm run build:dev
npm run preview
npm run lint
```

### Backend

```bash
cd backend
npm run dev
npm start
npm test
```

## API Summary

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`

### User

- `GET /api/users/me`
- `PUT /api/users/me/profile`
- `GET /api/users/:id/applications`

### Jobs / Companies

- `GET /api/jobs`
- `POST /api/jobs`
- `POST /api/jobs/:id/apply`

### Resume Scorer

- `POST /api/scorer/analyze`

### Tracker

- `GET /api/tracker`
- `POST /api/tracker`
- `PATCH /api/tracker/:id`
- `DELETE /api/tracker/:id`

### Experiences

- `GET /api/experiences`
- `POST /api/experiences`
- `POST /api/experiences/:id/upvote`

### Readiness

- `POST /api/readiness/score`

For request and response details, see [backend/README.md](./backend/README.md).

## Verification

Useful checks:

```bash
npm run build

cd backend
npm test
```

## Notes

- JWT auth middleware and MongoDB connection flow are preserved from the original app and extended rather than replaced.
- `src/lib/api.ts` uses `VITE_API_URL` when provided, otherwise defaults to `http://localhost:5000`.
- The backend allows CORS from `CLIENT_URL` and still includes the old deployed frontend origin for compatibility.

## Known Follow-up Opportunities

- Persist per-company resume match history so companies can show prior scorer results directly
- Add browser-level QA or screenshot-based verification for the new flows
- Refresh `SETUP.md` if you want a fully synchronized long-form setup guide in addition to this README
