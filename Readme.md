# Bookify

A fullstack room booking web application built with React, Express, and PostgreSQL.
containerized with Docker and deployed to heroku via a csutom CI/CD pipeline.

## Tech Stack

| Layer            | Technology                              |
| ---------------- | --------------------------------------- |
| Frontend         | React 18, TypeScript, Vite, CSS Modules |
| Backend          | Node.js, Express, TypeScript            |
| Database         | PostgreSQL, Prisma ORM                  |
| Auth             | JWT, Google OAuth 2.0, Passport.js      |
| Containerization | Docker (multi-stage builds)             |
| niginx (RP)      | Nginx which serves the routes           |
| CI/CD            | GitHub Actions                          |
| Hosting          | Heroku via Docker Registery             |

## Features

- User registration and login (email/password or Google OAuth)
- Browse available rooms by category
- Book rooms with date selection
- Leave reviews and ratings on rooms
- Protected routes for authenticated users
- Responsive design

## CI/CD Pipeline

Every push to `main` triggers the GitHub Actions workflow defined in `.github/workflows/ci-cd.yml`. The pipeline rnus the tests and builds Docker images and then pushes them to heroku's container registry and releases.

```
 git push main
      │
      ▼
┌─────────────────────────────────────────────────────┐
│              Quality Gate                            │
│                                                     │
│  Client:  npm ci → npm run lint (ESLint)            │
│  Server:  npm ci → prisma generate → tsc --noEmit   │
│                                                     │
│  ✅ Pass → deploy     ❌ Fail → blocked             │
└────────────────────────┬────────────────────────────┘
                         │
                    ┌────┴────┐
                    ▼         ▼
              ┌────────┐ ┌────────┐
              │ Server │ │ Client │     ← parallel jobs
              └───┬────┘ └───┬────┘
                  │          │
        For each app, the job runs:
        ┌─────────────────────────────────────────┐
        │  1. Install Heroku CLI                  │
        │  2. heroku container:login              │
        │  3. heroku container:push web           │
        │     └─ Builds Docker image              │
        │     └─ Pushes to registry.heroku.com    │
        │  4. heroku container:release web        │
        │     └─ Heroku stops old dyno            │
        │     └─ Starts new dyno with new image   │
        └─────────────────────────────────────────┘
                  │          │
                  ▼          ▼
                 🟢         🟢
               Live!      Live!
```

### Docker Builds

**Server** (`Server/Dockerfile`):

- Multi-stage build: TypeScript compilation in builder, only `dist/` copied to production image
- Runs `prisma migrate deploy` on startup to apply pending migrations
- Uses `--ignore-scripts` to avoid native module compilation issues

**Client** (`Client/Dockerfile`):

- Multi-stage build: Vite builds static assets, served by Nginx in production
- `VITE_API_URL_PROD` and `VITE_CLIENT_ID` are passed as build args and baked into the JS bundle at build time
- Nginx dynamically binds to Heroku's `$PORT` at runtime

### Github Secrets (used in GitHub actions)

| Secret              | Purpose                                        |
| ------------------- | ---------------------------------------------- |
| `HEROKU_API_KEY`    | Long-lived Heroku authorization token          |
| `VITE_API_URL_PROD` | API base URL baked into client build           |
| `VITE_CLIENT_ID`    | Google OAuth client ID baked into client build |

### Runtime Config Vars (Heroku)

**bookify-api1 (Server):**
| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (auto-set by Heroku Postgres) |
| `JWT_SECRET_KEY` | JWT signing secret |
| `CLIENT_ID` | Google OAuth client ID |
| `CLIENT_SECRET` | Google OAuth client secret |
| `CALLBACK_URL` | Google OAuth callback URL |
| `BASE_API_URL` | Client URL (used for CORS) |
| `NODE_ENV` | `production` |

**bookify-client1 (Client):**
No runtime config needed — all env vars are baked into the static bundle during Docker build.

## Local Development

you can either use the docker set up at the root (option 2), or stick with creating the env inside the client and the server (option 1)

### Prerequisites

- Node.js 20+
- PostgreSQL (or Docker)

# option 1 :

### Setup

```bash
git clone https://github.com/Ibrahim-Zaidi/Bookify.git
cd Bookify
```

Create `Server/.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/bookify
PORT=3000
JWT_SECRET_KEY=your_jwt_secret
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
CALLBACK_URL=http://localhost:3000/api/public/google/callback
BASE_API_URL=http://localhost:5173
```

Create `Client/.env`:

```env
VITE_CLIENT_ID=your_google_client_id
```

Run:

```bash
cd Server
npm install
npx prisma migrate dev
npm run dev

cd Client
npm install
npm run dev
```

# Option 2

### Docker (Local)

Create a `.env` file at the root:

```env
JWT_SECRET_KEY=your_jwt_secret
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
CALLBACK_URL=http://localhost/api/public/google/callback
```

```bash
docker compose up --build
```
