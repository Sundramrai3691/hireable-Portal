# PlaceMate Backend API

Express + MongoDB backend for PlaceMate, a placement intelligence platform for engineering students.

## Stack

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- bcrypt password hashing
- `natural` for resume/JD analysis

## Setup

### Install

```bash
cd backend
npm install
```

### Environment

Create `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/placemate
JWT_SECRET=replace_with_a_secure_random_secret
PORT=5000
CLIENT_URL=http://localhost:5173
```

### Run

```bash
npm run dev
```

Other commands:

```bash
npm start
npm test
```

## Data Model Overview

### User

Stores auth data plus placement profile data:

- `email`
- `passwordHash`
- `name`
- `role`
- `profileCompleted`
- `studentProfile`
- `latestReadinessScore`
- `latestReadinessLevel`

### Job

Acts as a company drive record:

- `title`
- `company`
- `companyLogo`
- `location`
- `type`
- `salary`
- `description`
- `tags`
- `eligibleBranches`
- `minCGPA`
- `typicalRounds`
- `ctcRange`
- `driveType`
- `expectedDriveMonth`
- `allowsAllBranches`
- `hasBond`
- `bondDetails`
- `historicallyVisited`
- `topicsAsked`
- `difficulty`

### Application

Tracks direct job applications:

- `user`
- `job`
- `applicantName`
- `phone`
- `college`
- `graduationYear`
- `resumeUrl`
- `appliedAt`

### TrackerApplication

Placement tracker board entity:

- `userId`
- `companyId`
- `companyName`
- `role`
- `appliedDate`
- `currentStage`
- `stageHistory`
- `nextAction`
- `nextActionDate`
- `notes`
- `offerCTC`

### Experience

Interview experience submission:

- `userId`
- `companyName`
- `role`
- `year`
- `month`
- `branch`
- `college`
- `outcome`
- `rounds`
- `topicsAsked`
- `tips`
- `isAnonymous`
- `upvotes`

## Automatic Seed Behavior

On startup, the backend seeds:

- Sample company drives
- Sample interview experiences

This only happens when the relevant collections are empty.

## Route Summary

### Health

- `GET /api/health`

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`

Example signup:

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "name": "Student Name"
  }'
```

### User

- `GET /api/users/me`
- `PUT /api/users/me/profile`
- `GET /api/users/:id/applications`

Example profile update:

```bash
curl -X PUT http://localhost:5000/api/users/me/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "college": "NIT Trichy",
    "branch": "CS",
    "year": 3,
    "cgpa": 8.4,
    "leetcodeRating": 1550,
    "problemsSolved": 320,
    "skills": ["React", "Node.js", "MongoDB"],
    "projectCount": 3,
    "deployedProjectCount": 2,
    "hasInternship": true,
    "systemDesign": "basic",
    "targetCompanies": ["Oracle", "MathWorks"]
  }'
```

### Jobs / Companies

- `GET /api/jobs`
- `POST /api/jobs`
- `POST /api/jobs/:id/apply`

Example company drive creation:

```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "SDE Intern",
    "company": "Oracle",
    "location": "Bengaluru",
    "type": "Internship",
    "salary": "8-12 LPA",
    "description": "Campus internship role",
    "eligibleBranches": ["CS", "EE", "ECE"],
    "minCGPA": 7.5,
    "typicalRounds": ["OA", "Technical Round 1", "HR"],
    "ctcRange": { "min": 8, "max": 12 },
    "driveType": "on-campus",
    "expectedDriveMonth": "July 2025",
    "topicsAsked": ["Arrays", "DP", "OS"],
    "difficulty": "Medium"
  }'
```

Example application:

```bash
curl -X POST http://localhost:5000/api/jobs/JOB_ID/apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "applicantName": "Student Name",
    "phone": "9999999999",
    "college": "NIT Trichy",
    "graduationYear": 2026,
    "resumeUrl": "https://example.com/resume.pdf"
  }'
```

### Resume Scorer

- `POST /api/scorer/analyze`

Example:

```bash
curl -X POST http://localhost:5000/api/scorer/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "resumeText": "React Node MongoDB JWT projects...",
    "jobDescription": "Looking for JavaScript, React, Docker, SQL..."
  }'
```

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

Example:

```bash
curl -X POST http://localhost:5000/api/readiness/score \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "leetcodeRating": 1600,
    "problemsSolved": 350,
    "projectCount": 3,
    "deployedCount": 2,
    "hasInternship": true,
    "cgpa": 8.2,
    "skillsCount": 8,
    "systemDesign": "basic",
    "targetCompanies": ["Oracle", "BlackRock"]
  }'
```

## Security Notes

- Passwords are hashed with bcrypt
- JWTs expire in 7 days
- Protected endpoints require `Authorization: Bearer <token>`
- User-specific routes validate ownership
- CORS is enabled using `CLIENT_URL` with credentials support

## Smoke Test

Run:

```bash
npm test
```

This verifies:

- MongoDB connection
- User creation
- Job creation
- Application creation
- Cleanup
