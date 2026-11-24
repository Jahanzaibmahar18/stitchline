# StitchLane Backend & Admin Roadmap

Living document. Update phase status as work completes.

## Frontend analysis (baseline)

| Area | Current state |
|------|----------------|
| Stack | Vite + React 19 + Tailwind 4 (repo root) |
| Routing | Custom history router (`src/utils/router.jsx`) |
| Products | Static fallback in `src/data/products.js` + API fetch |
| Cart | `localStorage` via `CartContext` |
| Checkout | COD via `POST /api/orders` (server totals) |
| Delivery | Rs. 250 (from Settings API / fallback) |
| Contact | Bahawalpur, 03121825417, thestitchlane404@gmail.com |

### Product shape to preserve

- `id` / slug, name, category (Storage | Kitchen), optional size
- price, compareAt, discount
- primary `image` + `gallery[]` variations
- description, details[]

---

## Architecture

```
stitchlane/
  src/          # storefront (existing)
  admin/        # admin Vite app :5174
  server/       # Express API :5000
  BACKEND_ROADMAP.md
```

```
Storefront ──public REST──► Express API ──► MongoDB
Admin ──────JWT REST──────► Express API ──► MongoDB
```

### Server folder structure

```
server/
  src/
    config/
    controllers/
    models/
    routes/
    middleware/
    services/
    validators/
    utils/
    seeds/
  public/products/
  .env.example
  package.json
```

---

## Database models

- **User** — name, email, phone, password, role (admin|staff|customer), status
- **Category** — name, slug, description, image, isActive
- **Product** — slug, name, description, category, price, compareAt, discount, size, details, image, gallery, stock, status (active|draft)
- **Order** — orderNumber, customer snapshot, items (frozen price/name/image), shipping, fees, COD paymentStatus, status
- **Review** — product, author, rating, comment, status
- **Settings** — store info, deliveryCharge (250), COD flags, currency PKR

---

## API plan

### Public

- `GET /api/health`
- `GET /api/products` — list, filter, search, pagination
- `GET /api/products/:slug`
- `GET /api/categories`
- `POST /api/orders` — COD create (server-side totals)
- `GET /api/settings/public`

### Auth

- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Admin (JWT + admin|staff)

- Products / Categories / Orders / Customers / Inventory / Reviews / Settings CRUD
- `GET /api/admin/stats`

---

## Auth strategy

- bcrypt password hashing
- JWT Bearer tokens
- Roles: admin, staff, customer
- `protect` + `authorize` middleware
- Rate limit on auth routes
- Seed admin from env

---

## Development phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Roadmap & architecture | Completed |
| 2 | Admin dashboard UI | Completed |
| 3 | Backend Express setup | Completed |
| 4 | Authentication | Completed |
| 5 | Database models | Completed |
| 6 | Product management APIs | Completed |
| 7–8 | Cart/checkout + COD orders | Completed |
| 9 | Admin API wiring | Completed |
| 10 | Storefront API integration | Completed |
| 11 | Testing & verification | Completed |

---

## Run locally

```bash
# Terminal 1 — API
npm run dev:server

# Seed once
npm run seed

# Terminal 2 — storefront
npm run dev:store

# Terminal 3 — admin
npm run dev:admin
```

Admin login (from `.env`):
- Email: `admin@thestitchlane.com`
- Password: `ChangeMe123!`

---

## Testing strategy / verification log

1. Health + Mongo connection — OK
2. Admin login / protected routes — OK
3. Seed products match catalog (8) — OK
4. Product list API — OK
5. COD order with server totals + stock decrement — OK (`SL-00001`, total 1350 = 1100+250)
6. Admin stats — OK
7. Storefront/admin builds — see Phase 11
8. Secrets not committed (`.env` gitignored) — OK

---

## Defaults

- MongoDB: `mongodb://127.0.0.1:27017/stitchlane`
- API: `http://localhost:5000`
- Admin: `http://localhost:5174`
- Storefront: `http://localhost:5173`
