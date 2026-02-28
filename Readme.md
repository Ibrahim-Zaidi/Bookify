# Bookify

A full-stack room booking web application.

## Tech Stack

- **Client:** React, TypeScript, Vite, Tailwind CSS, CSS Modules
- **Server:** Node.js, Express, TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** JWT (cookies), Google OAuth, Passport
- **Deployment:** Docker, Nginx

## Features

- User registration and login (email/password or Google OAuth)
- Browse available rooms by category
- Book rooms with date selection
- Leave reviews and ratings on rooms
- Protected routes for authenticated users

## Pages

- Welcome
- Sign In
- Sign Up
- Home (room listing)
- Room (details and reviews)
- Bookings (user bookings, protected)
- Error

## Prerequisites

- Node.js 20+
- PostgreSQL (or Docker)

## Local Development

```
git clone https://github.com/Ibrahim-Zaidi/Bookify.git
cd Bookify/Bookify
npm install
```

Create `Server/.env`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/bookify
PORT=3000
JWT_SECRET_KEY=your_jwt_secret
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
CALLBACK_URL=http://localhost:3000/api/public/google/callback
BASE_API_URL=http://localhost:5173
```

Create `Client/.env`:

```
VITE_CLIENT_ID=your_google_client_id
```

Run database migrations and start:

```
cd Server && npx prisma migrate dev && cd ..
npm run dev
```

## Docker

Create a `.env` file at the root:

```
JWT_SECRET_KEY=your_jwt_secret
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
CALLBACK_URL=http://localhost/api/public/google/callback
```

Build and run:

```
docker compose up --build
```

The app will be available at `http://localhost`.

## Project Structure

```
Bookify/
  Client/          React frontend (Vite)
  Server/          Express API
    prisma/        Database schema and migrations
    src/
      controllers/ Route handlers
      Middlewares/  JWT auth middleware
      routes/      API route definitions
      config/      Environment config
  docker-compose.yml
```
