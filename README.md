# Job Portal

This repository contains a full MERN job portal application with:

- Backend: Node.js, Express, MongoDB, JWT authentication
- Frontend: React, React Router, Tailwind CSS, Axios

## Run locally

### Backend

1. Open a terminal in `backend`
2. Install dependencies: `npm install`
3. Create `.env` with:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/jobportal
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   CLIENT_URL=http://localhost:5173
   ```
4. Start backend server: `npm run start`

### Frontend

1. Open a terminal in `frontend`
2. Install dependencies: `npm install`
3. Create `.env` with:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start frontend: `npm run dev`

### Access the app

Open `http://localhost:5173` in your browser.

## Available features

- Candidate and recruiter authentication
- Browsing, searching, and filtering jobs
- Applying for jobs and viewing application status
- Posting, editing, deleting jobs
- Viewing applicants and updating application status
- Profile editing and role-based dashboards

## Notes

- Backend API is available at `http://localhost:5000/api`
- Frontend React app talks to the backend via the `VITE_API_URL` environment variable
