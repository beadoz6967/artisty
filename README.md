# Artisty

A Next.js 16 character archive focused on smokedope2016, with:

- a custom character page design system
- Spotify-backed song search and detail pages
- Prisma schema + seed scripts for local catalog workflows

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript (strict)
- Tailwind CSS 4
- Prisma + SQLite

## Required Environment Variables

Create a local environment file and set:

- SPOTIFY_CLIENT_ID
- SPOTIFY_CLIENT_SECRET
- DATABASE_URL

Example DATABASE_URL for local Prisma SQLite:

- file:./prisma/dev.db

## Install

npm install

## Run

- Dev server: npm run dev
- Production build: npm run build
- Start production server: npm run start
- Lint: npm run lint

## Routes

- / -> smokedope2016 archive home
- /[character] -> dynamic character route (currently smokedope2016)
- /songs/[slug] -> canonical song detail page
- /api/songs?q=query -> Spotify-powered search endpoint

Legacy route /smokedope2016/songs/[slug] permanently redirects to /songs/[slug].

## Prisma

- Schema: prisma/schema.prisma
- Seed command: npx prisma db seed
- Main seed file: prisma/seed.ts
- Spotify sync helper: scripts/sync-smokedope-spotify-seed.mjs

## Notes

- Song features are stored as serialized JSON in source records and safely parsed at route boundaries.
- Spotify auth uses client_credentials flow (no redirect URI needed).
