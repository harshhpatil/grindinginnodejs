# Basic MERN Music Player

Minimal full-stack music player with Express + MongoDB + React.

## Folder Structure

- `server` - Node.js + Express + MongoDB backend
- `client` - React frontend (Vite)
- `server/audio` - put your `.mp3` files here
- `server/images` - put album image files here

## Backend Setup

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Backend runs at `http://localhost:5000`.

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Notes

- On first backend start, sample albums are auto-created in MongoDB if collection is empty.
- Add these files for sample data to work directly:
  - `server/images/morning-vibes.jpg`
  - `server/images/night-chill.jpg`
  - `server/audio/sunrise.mp3`
  - `server/audio/coffee-time.mp3`
  - `server/audio/moonlight.mp3`
  - `server/audio/late-walk.mp3`
- API routes:
  - `GET /albums`
  - `GET /albums/:id`
