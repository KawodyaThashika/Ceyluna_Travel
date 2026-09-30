# Ceyluna Travels — Frontend

React + Vite + TypeScript + Tailwind frontend for the Ceyluna Travels travel
platform. This version is wired up to the real backend in `../ceylon-backend`
instead of using `localStorage` for accounts, bookings, and inquiries.

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` and point `VITE_API_URL` at your backend:

```
VITE_API_URL=http://localhost:5000/api
```

(or your deployed backend URL, e.g. `https://ceyluna-travels-api.onrender.com/api`)

```bash
npm run dev      # http://localhost:5173
```

## What changed from the original demo

- **`src/lib/api.ts`** — talks to the backend over HTTP.
- **`src/context/AuthContext.tsx`** — real login/session state (JWT stored
  in localStorage, validated against the backend on load).
- **`src/components/ProtectedRoute.tsx`** — guards `/customer-dashboard`
  (any logged-in user) and `/admin` (admin role only).
- **`AuthPages.tsx`** — calls `/api/auth/login` and `/api/auth/register`;
  the hardcoded admin credentials banner has been removed.
- **`BuildTourPage.tsx`** — "Confirm & Save Tour" now requires sign-in and
  saves the quote to the database via `/api/bookings`.
- **`CustomTourRequestPage.tsx`** / **`ContactPage.tsx`** — submit to
  `/api/inquiries`, which emails `ceylunatravelstours@gmail.com`.
- **`CustomerDashboard.tsx`** / **`AdminDashboard.tsx`** — fetch live data
  from the backend instead of reading `localStorage`.
- **`Navbar.tsx`** — shows Login / Dashboard depending on auth state.

## Deploying

Any static host works (Vercel, Netlify, Cloudflare Pages):

```bash
npm run build     # outputs to dist/
```

Set `VITE_API_URL` as an environment variable in your hosting provider's
dashboard (pointing at your deployed backend), then deploy the `dist/`
folder (or connect the Git repo and let the platform build it).

**Important:** deploy the backend first and grab its URL before deploying
the frontend, and make sure the backend's `CLIENT_ORIGINS` includes your
frontend's final URL — otherwise the browser will block API requests (CORS).
