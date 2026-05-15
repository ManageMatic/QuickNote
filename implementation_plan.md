# Free Deployment Plan for QuickNote

This plan outlines the steps to deploy both the frontend (React/Vite) and backend (Node/Express) of QuickNote for free.

## User Review Required

> [!IMPORTANT]
> You will need to create accounts on the following platforms if you haven't already:
> 1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) (For the Database)
> 2. [Render](https://render.com/) (For the Backend)
> 3. [Vercel](https://vercel.com/) (For the Frontend)

> [!WARNING]
> Your backend on Render (Free Tier) will "go to sleep" after 15 minutes of inactivity. This means the first request after a break might take 30-50 seconds to respond.

## Proposed Changes

### Frontend Refactoring
Currently, the API `host` is hardcoded as `http://localhost:5000` in multiple files. We need to refactor this to use an environment variable so it can point to the production backend URL when deployed.

#### [MODIFY] [NoteState.js](file:///c:/Ishan/NODE%20JS/REACT/quicknote/src/context/notes/NoteState.js)
- Use `import.meta.env.VITE_API_URL` instead of hardcoded `localhost`.

#### [MODIFY] [refreshToken.js](file:///c:/Ishan/NODE%20JS/REACT/quicknote/src/utils/refreshToken.js)
- Use `import.meta.env.VITE_API_URL`.

#### [MODIFY] [AppContent.jsx](file:///c:/Ishan/NODE%20JS/REACT/quicknote/src/components/layout/AppContent.jsx)
- Use `import.meta.env.VITE_API_URL`.

#### [MODIFY] [UserAvatar.jsx](file:///c:/Ishan/NODE%20JS/REACT/quicknote/src/components/profile/UserAvatar.jsx)
- Use `import.meta.env.VITE_API_URL`.

#### [MODIFY] [Login.jsx](file:///c:/Ishan/NODE%20JS/REACT/quicknote/src/components/auth/Login.jsx)
- Use `import.meta.env.VITE_API_URL`.

#### [MODIFY] [Signup.jsx](file:///c:/Ishan/NODE%20JS/REACT/quicknote/src/components/auth/Signup.jsx)
- Use `import.meta.env.VITE_API_URL`.

#### [MODIFY] [ForgotPassword.jsx](file:///c:/Ishan/NODE%20JS/REACT/quicknote/src/components/auth/ForgotPassword.jsx)
- Use `import.meta.env.VITE_API_URL`.

### Backend Configuration

#### [MODIFY] [package.json](file:///c:/Ishan/NODE%20JS/REACT/quicknote/backend/package.json)
- Add `"start": "node index.js"` to the scripts section.

---

## Step-by-Step Deployment Guide

### Phase 1: MongoDB Atlas (Database)
1. Create a free Shared Cluster on [MongoDB Atlas](https://www.mongodb.com/).
2. Create a Database User (Username & Password).
3. Whitelist IP `0.0.0.0/0` (Allow access from anywhere).
4. Get your Connection String (SRV). It will look like `mongodb+srv://<username>:<password>@cluster.mongodb.net/quicknote`.

### Phase 2: Render (Backend)
1. Connect your GitHub repository to Render.
2. Create a **New Web Service**.
3. Set **Root Directory** to `backend`.
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add Environment Variables:
   - `MONGO_URI`: (Your MongoDB Connection String)
   - `JWT_SECRET`: (A long random string)
   - `CLIENT_ORIGIN`: (Leave blank for now, you'll update this after deploying the frontend)
   - `PORT`: `5000` (Render will handle this, but setting it doesn't hurt)
7. Once deployed, copy your Render URL (e.g., `https://quicknote-backend.onrender.com`).

### Phase 3: Vercel (Frontend)
1. Connect your GitHub repository to Vercel.
2. The Root Directory should be the project root.
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`
5. Output Directory: `dist`.
6. Add Environment Variables:
   - `VITE_API_URL`: (Your Render Backend URL from Phase 2)
7. Once deployed, copy your Vercel URL (e.g., `https://quicknote.vercel.app`).

### Phase 4: Linking them back
1. Go back to your **Render** dashboard.
2. Update the `CLIENT_ORIGIN` environment variable with your Vercel URL.
3. Redeploy the backend.

## Verification Plan

### Manual Verification
- Sign up for a new account.
- Log in and verify that notes are fetched from the production database.
- Create, update, and delete a note.
- Verify that cookies (JWT) are being sent and received correctly in production.
