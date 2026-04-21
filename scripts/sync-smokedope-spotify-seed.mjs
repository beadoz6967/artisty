#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

const ARTIST_ID = '3hGJ4nHdF99Vs0gQdXz5Nw';
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env');
}

let fetchFn = globalThis.fetch;

try {
  const mod = await import('node-fetch');
  fetchFn = mod.default;
} catch {
  if (!fetchFn) {
    throw new Error('No fetch implementation found. Install node-fetch or use Node 18+');
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeReleaseDate(releaseDate, precision) {
  if (!releaseDate) return '1970-01-01';
  if (precision === 'day') return releaseDate;
  if (precision === 'month') return `${releaseDate}-01`;
  return `${releaseDate}-01-01`;
}

function escapeSingleQuotes(value) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

async function spotifyRequest(url, options = {}, retries = 3) {
  const response = await fetchFn(url, options);

  if (response.status === 429 && retries > 0) {
    const retryAfterSeconds = Number(response.headers.get('retry-after') || '1');
    console.warn(`Rate limited by Spotify. Retrying in ${retryAfterSeconds}s...`);
    await sleep(retryAfterSeconds * 1000);
    return spotifyRequest(url, options, retries - 1);
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Spotify request failed (${response.status}): ${body}`);
  }

  return response.json();
}

async function getAccessToken() {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const payload = new URLSearchParams({ grant_type: 'client_credentials' });

  const tokenResponse = await spotifyRequest('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: payload,
  });

  return tokenResponse.access_token;
}

async function fetchArtistAlbums(accessToken) {
  const headers = { Authorization: `Bearer ${accessToken}` };
  const uniqueAlbums = new Map();
  let nextUrl = `https://api.spotify.com/v1/artists/${ARTIST_ID}/albums?include_groups=album,single,appears_on&market=US`;

  while (nextUrl) {
    const data = await spotifyRequest(nextUrl, { headers });

    for (const album of data.items ?? []) {
      if (album.album_group === 'appears_on') continue;
      if (!uniqueAlbums.has(album.id)) {
        uniqueAlbums.set(album.id, album);
      }
    }

    nextUrl = data.next;
  }

  return Array.from(uniqueAlbums.values());
}

async function fetchAlbumWithTracks(accessToken, albumId) {
  const headers = { Authorization: `Bearer ${accessToken}` };

  const album = await spotifyRequest(
    `https://api.spotify.com/v1/albums/${albumId}?market=US`,
    { headers }
  );

  const tracks = [...(album.tracks?.items ?? [])];
  let next = album.tracks?.next;

  while (next) {
    const page = await spotifyRequest(next, { headers });
    tracks.push(...(page.items ?? []));
    next = page.next;
  }

  return { album, tracks };
}

function buildTrackRecord(track, album) {
  const title = (track.name || '').trim();
  const featureArtists = (track.artists || [])
    .filter((artist) => artist.id !== ARTIST_ID && artist.name?.toLowerCase() !== 'smokedope2016')
    .map((artist) => artist.name)
    .filter(Boolean);

  const uniqueFeatures = [...new Set(featureArtists)];
  const releaseDate = normalizeReleaseDate(album.release_date, album.release_date_precision);
  const albumCover = album.images?.[0]?.url || '';
  const isSingle = album.album_type === 'single';

  return {
    title,
    slug: slugify(title),
    features: JSON.stringify(uniqueFeatures),
    album: album.name,
    year: Number(releaseDate.slice(0, 4)),
    releaseDate,
    durationSecs: Math.max(1, Math.round((track.duration_ms || 0) / 1000)),
    albumCover,
    singleCover: isSingle ? albumCover : null,
    description: '',
    sourceAlbumType: album.album_type,
  };
}

function isBetterCandidate(next, current) {
  const rank = { album: 2, single: 1 };
  const nextRank = rank[next.sourceAlbumType] ?? 0;
  const currentRank = rank[current.sourceAlbumType] ?? 0;

  if (nextRank !== currentRank) {
    return nextRank > currentRank;
  }

  if (next.releaseDate !== current.releaseDate) {
    return next.releaseDate < current.releaseDate;
  }

  return next.durationSecs > current.durationSecs;
}

function extractTitlesFromSeed(seedContent) {
  const titles = [];
  const titleRegex = /title:\s*(["'])(.*?)\1/g;
  let match;

  while ((match = titleRegex.exec(seedContent)) !== null) {
    titles.push(match[2]);
  }

  return titles;
}

function renderSongsFile(songs) {
  const rows = songs
    .map((song) => {
      const singleCoverValue = song.singleCover ? `'${escapeSingleQuotes(song.singleCover)}'` : 'null';
      return [
        '  {',
        `    title: '${escapeSingleQuotes(song.title)}',`,
        `    slug: '${escapeSingleQuotes(song.slug)}',`,
        `    features: '${escapeSingleQuotes(song.features)}',`,
        `    album: '${escapeSingleQuotes(song.album)}',`,
        `    year: ${song.year},`,
        `    releaseDate: '${song.releaseDate}',`,
        `    durationSecs: ${song.durationSecs},`,
        `    albumCover: '${escapeSingleQuotes(song.albumCover)}',`,
        `    singleCover: ${singleCoverValue},`,
        `    description: '',`,
        '  },',
      ].join('\n');
    })
    .join('\n\n');

  return [
    '// Auto-generated from Spotify Web API for smokedope2016.',
    '// Review this file before replacing prisma/seed.ts.',
    '',
    'const songs = [',
    rows,
    '];',
    '',
    'export default songs;',
    '',
  ].join('\n');
}

async function main() {
  const repoRoot = process.cwd();
  const seedPath = path.join(repoRoot, 'prisma', 'seed.ts');
  const outputPath = path.join(repoRoot, 'prisma', 'seed-spotify.ts');

  const currentSeed = await readFile(seedPath, 'utf8');
  const currentTitles = extractTitlesFromSeed(currentSeed);
  const currentTitleSet = new Set(currentTitles.map(normalizeTitle));

  console.log('Authenticating with Spotify...');
  const accessToken = await getAccessToken();

  console.log('Fetching artist albums...');
  const albums = await fetchArtistAlbums(accessToken);
  console.log(`Fetched ${albums.length} albums/singles (appears_on excluded).`);

  const dedupedByTrackName = new Map();

  for (const album of albums) {
    const { album: fullAlbum, tracks } = await fetchAlbumWithTracks(accessToken, album.id);

    for (const track of tracks) {
      const record = buildTrackRecord(track, fullAlbum);
      if (!record.title) continue;

      const key = normalizeTitle(record.title);
      const existing = dedupedByTrackName.get(key);

      if (!existing || isBetterCandidate(record, existing)) {
        dedupedByTrackName.set(key, record);
      }
    }
  }

  const songs = Array.from(dedupedByTrackName.values())
    .map((entry) => {
      const { sourceAlbumType, ...song } = entry;
      void sourceAlbumType;
      return song;
    })
    .sort((a, b) => {
      if (a.releaseDate !== b.releaseDate) return a.releaseDate.localeCompare(b.releaseDate);
      return a.title.localeCompare(b.title);
    });

  await writeFile(outputPath, renderSongsFile(songs), 'utf8');

  const missingFromCurrentSeed = songs.filter((song) => !currentTitleSet.has(normalizeTitle(song.title)));

  console.log(`Wrote ${songs.length} deduplicated songs to prisma/seed-spotify.ts`);

  if (missingFromCurrentSeed.length === 0) {
    console.log('No new titles compared to current prisma/seed.ts');
  } else {
    console.log('Songs found on Spotify but missing from current prisma/seed.ts:');
    for (const song of missingFromCurrentSeed) {
      console.log(`- ${song.title} (${song.releaseDate})`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
