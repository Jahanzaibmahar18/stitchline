# StitchLane E-Commerce

Frontend and backend are fully separated:

| App | Folder | Local URL | Deploy as |
|-----|--------|-----------|-----------|
| Frontend (storefront + admin UI) | `client/` | http://localhost:5173 | Vercel (static Vite app) |
| Backend API | `server/` | http://localhost:5000 | Node host (Render / Railway / VPS) |

They communicate only through HTTP APIs (`/api/*`) and media URLs (`/media/*`).

Admin dashboard lives inside the same frontend at `/admin` (not a separate app).

## Project structure

```
stitchlane/
  client/                 # React + Vite + Tailwind frontend
    src/
      apps/               # StorefrontApp + AdminApp
      pages/storefront/
      pages/admin/
      components/
      api/
      context/
      data/
      styles/
    vercel.json
  server/                 # Express + MongoDB backend
    src/
      config/
      controllers/
      models/
      routes/
      middleware/
      seeds/
      utils/
    public/products/      # served as /media/*
  package.json            # convenience scripts only
  vercel.json             # builds client/ for Vercel monorepo deploys
```

## Prerequisites

- Node.js 18+
- MongoDB (`mongodb://127.0.0.1:27017/stitchlane`)

## Setup

```bash
npm install --prefix client
npm install --prefix server
Copy-Item server\.env.example server\.env
# Adds starter records only; existing database records are left unchanged.
npm run seed --prefix server
```

## Run locally (2 terminals)

```bash
npm run dev:server     # API :5000
npm run dev:client     # Frontend :5173 (proxies /api + /media → :5000)
```

- Storefront: http://localhost:5173
- Admin: http://localhost:5173/admin/login
  - Email: `admin@thestitchlane.com`
  - Password: `ChangeMe123!`

## Production deployment

### Frontend (Vercel)

1. Set **Root Directory** to `client` (recommended), **or** deploy from repo root using root `vercel.json`.
2. Add environment variable:
   - `VITE_API_URL` = your deployed API base URL (example: `https://api.yourdomain.com`)
   - Do **not** leave this empty in production, or API calls go to the Vercel domain and 404.
3. Redeploy after setting `VITE_API_URL`.

SPA routes (`/products`, `/admin/...`) are handled by `vercel.json` rewrites.

### Backend (separate Node host)

1. Deploy the `server/` folder.
2. Set environment variables from `server/.env.example`, including:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_URL=https://stitchline-zeta.vercel.app`
   - `CORS_ORIGINS=https://stitchline-zeta.vercel.app`
3. Ensure `/api` and `/media` are publicly reachable from the frontend origin.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev:client` | Frontend (store + admin) |
| `npm run dev:server` | Express API |
| `npm run seed` | Add missing starter settings, admin, and catalog records without overwriting existing records |
| `npm run build` | Build frontend for production |

See `BACKEND_ROADMAP.md` for architecture notes.
