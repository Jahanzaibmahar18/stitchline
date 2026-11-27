# stitchlane-server

Backend API for [StitchLane](https://stitchline-zeta.vercel.app/) — Express + MongoDB.

## Stack

- Express
- MongoDB / Mongoose
- JWT auth
- Multer (image uploads)

## Setup

```bash
npm install
cp .env.example .env
npm run seed
npm run dev
```

API runs on `http://localhost:5000` by default.

## Important env vars

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `CLIENT_URL` | Frontend origin (CORS) |
| `CORS_ORIGINS` | Extra allowed origins (comma-separated) |

## Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Check the API entrypoint syntax (no compilation is required) |
| `npm run dev` | Start API with nodemon |
| `npm start` | Start API |
| `npm run seed` | Seed admin user + catalog |

For Render, use `npm run build` as the build command and `npm start` as the start command.

## Main routes

- `GET /api/health`
- `GET /api/products`
- `POST /api/orders`
- `POST /api/auth/login`
- `GET /api/admin/*` (JWT protected)
- `GET /media/*` product images
