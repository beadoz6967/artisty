// Spotify data provider for smokedope2016 songs used by search and detail pages.

type SpotifyTokenCache = {
  token: string;
  expiresAt: number;
};

type SpotifySongsCache = {
  songs: SpotifySong[];
  expiresAt: number;
  version: number;
};

type GlobalSpotifyState = typeof globalThis & {
  __spotifyTokenCache?: SpotifyTokenCache;
  __spotifySongsCache?: SpotifySongsCache;
  __spotifySongsPromise?: Promise<SpotifySong[]>;
};

type SpotifyArtistRef = {
  id: string;
  name: string;
};

type SpotifyImage = {
  url: string;
  width: number | null;
  height: number | null;
};

type SpotifyAlbumSummary = {
  id: string;
  album_group: 'album' | 'single' | 'appears_on' | string;
};

type SpotifyArtistAlbumsPage = {
  items: SpotifyAlbumSummary[];
  next: string | null;
};

type SpotifyTrack = {
  id: string;
  name: string;
  duration_ms: number;
  track_number: number;
  artists: SpotifyArtistRef[];
};

type SpotifyAlbumTracksPage = {
  items: SpotifyTrack[];
  next: string | null;
};

type SpotifyAlbumDetails = {
  id: string;
  name: string;
  album_type: 'album' | 'single' | 'compilation' | string;
  release_date: string;
  release_date_precision: 'day' | 'month' | 'year' | string;
  images: SpotifyImage[];
  tracks: SpotifyAlbumTracksPage;
};

type SpotifySongCandidate = SpotifySong & {
  sourceRank: number;
  searchText: string;
};

export type SpotifySong = {
  id: string;
  slug: string;
  title: string;
  features: string;
  album: string;
  year: number;
  releaseDate: string;
  durationSecs: number;
  singleCover: string | null;
  albumCover: string;
  description: string;
};

const SPOTIFY_ARTIST_ID = '3hGJ4nHdF99Vs0gQdXz5Nw';
const SPOTIFY_ACCOUNTS = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API = 'https://api.spotify.com/v1';
const TOKEN_SAFETY_BUFFER_MS = 30_000;
const SONG_CACHE_TTL_MS = 6 * 60 * 60_000;
const SONG_DESCRIPTION_VERSION = 2;

const globalSpotify = globalThis as GlobalSpotifyState;

function slugify(title: string): string {
  const cleaned = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  return cleaned || 'track';
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeReleaseDate(
  releaseDate: string,
  precision: SpotifyAlbumDetails['release_date_precision']
): string {
  if (!releaseDate) return '1970-01-01';
  if (precision === 'day') return releaseDate;
  if (precision === 'month') return `${releaseDate}-01`;
  return `${releaseDate}-01-01`;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatReleaseDateForHumans(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function monthToSeason(month: number): string {
  if ([12, 1, 2].includes(month)) return 'winter';
  if ([3, 4, 5].includes(month)) return 'spring';
  if ([6, 7, 8].includes(month)) return 'summer';
  return 'autumn';
}

function getTrackPositionLabel(trackNumber: number, totalTracks: number): string {
  if (trackNumber <= 1) return 'the opener';
  if (trackNumber >= totalTracks) return 'the closer';
  if (trackNumber === Math.ceil(totalTracks / 2)) return 'the midpoint anchor';
  if (trackNumber <= 3) return 'an early-sequence cut';
  if (trackNumber >= totalTracks - 2) return 'a late-sequence cut';
  return 'a mid-sequence cut';
}

function inferImageryFromTitle(title: string): string {
  const t = title.toLowerCase();

  if (/intro|interlude|outro|closing/.test(t)) {
    return 'It functions like a framing moment in the release, shaping the atmosphere around it.';
  }

  if (/night|dark|moon|dream|sleep|dusk|midnight/.test(t)) {
    return 'The title suggests a late-night mood with hazy, after-hours imagery.';
  }

  if (/xbox|halo|lag|online|game|party|red ring/.test(t)) {
    return 'Its naming leans into internet-era and gaming-coded references, a big part of this catalog tone.';
  }

  if (/nike|goyard|socks|bape|shirt|ferragamo|foamposite/.test(t)) {
    return 'The title reads like style-language: fashion and object details driving the visual identity.';
  }

  if (/truck|drank|glock|ball|smoke|high|lean|trap/.test(t)) {
    return 'The wording points to street-level motion and flex imagery rather than abstract storytelling.';
  }

  return 'The naming follows the clipped, coded style that gives smokedope2016 tracks their distinct visual feel.';
}

function buildSongDescription(input: {
  title: string;
  albumName: string;
  releaseDate: string;
  durationSecs: number;
  features: string[];
  isPrimaryArtist: boolean;
  trackNumber: number;
  totalTracks: number;
  minDurationSecs: number;
  maxDurationSecs: number;
  avgDurationSecs: number;
  hasDedicatedSingleCover: boolean;
}): string {
  const {
    title,
    albumName,
    releaseDate,
    durationSecs,
    features,
    isPrimaryArtist,
    trackNumber,
    totalTracks,
    minDurationSecs,
    maxDurationSecs,
    avgDurationSecs,
    hasDedicatedSingleCover,
  } = input;

  const prettyDate = formatReleaseDateForHumans(releaseDate);
  const month = Number(releaseDate.slice(5, 7)) || 1;
  const season = monthToSeason(month);
  const runtime = formatDuration(durationSecs);
  const positionLabel = getTrackPositionLabel(trackNumber, totalTracks);

  let durationFact = 'around the project average in length';
  if (durationSecs === minDurationSecs) durationFact = 'the shortest cut on the release';
  else if (durationSecs === maxDurationSecs) durationFact = 'the longest cut on the release';
  else if (durationSecs < avgDurationSecs - 18) durationFact = 'one of the quicker cuts on the release';
  else if (durationSecs > avgDurationSecs + 18) durationFact = 'one of the more extended cuts on the release';

  const lead = isPrimaryArtist
    ? `${title} lands on ${albumName} as ${positionLabel} (track ${trackNumber} of ${totalTracks}).`
    : `${title} places smokedope2016 on ${albumName} as ${positionLabel} (track ${trackNumber} of ${totalTracks}).`;

  const timing = `It dropped on ${prettyDate} during ${season} and runs ${runtime}, making it ${durationFact}.`;

  const featureFact = features.length > 0
    ? `Feature note: ${features.join(', ')} ${features.length === 1 ? 'appears' : 'appear'} on this record.`
    : 'It is carried as a solo smokedope2016 performance.';

  const visualFact = hasDedicatedSingleCover
    ? 'Visually, Spotify gives it dedicated single artwork, so it stands apart from album-era cover sets.'
    : `Visually, it uses the ${albumName} release artwork on Spotify, tying it to that project's era and look.`;

  return [lead, timing, inferImageryFromTitle(title), featureFact, visualFact].join(' ');
}

function rankAlbumGroup(group: SpotifyAlbumSummary['album_group']): number {
  if (group === 'album') return 3;
  if (group === 'single') return 2;
  if (group === 'appears_on') return 1;
  return 0;
}

function shouldReplaceSong(next: SpotifySongCandidate, current: SpotifySongCandidate): boolean {
  if (next.sourceRank !== current.sourceRank) {
    return next.sourceRank > current.sourceRank;
  }

  if (next.releaseDate !== current.releaseDate) {
    return next.releaseDate > current.releaseDate;
  }

  return next.durationSecs > current.durationSecs;
}

async function spotifyJson<T>(url: string, init?: RequestInit, retries = 6): Promise<T> {
  const response = await fetch(url, init);

  if (response.status === 429 && retries > 0) {
    const retryAfterHeader = Number(response.headers.get('retry-after') || '0');
    const retryAfter = retryAfterHeader > 0 ? retryAfterHeader : 2;
    await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
    return spotifyJson<T>(url, init, retries - 1);
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Spotify request failed (${response.status}): ${text}`);
  }

  return response.json() as Promise<T>;
}

async function getSpotifyAccessToken(forceRefresh = false): Promise<string> {
  const now = Date.now();
  const cached = globalSpotify.__spotifyTokenCache;

  if (!forceRefresh && cached && cached.expiresAt > now) {
    return cached.token;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in environment');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const body = new URLSearchParams({ grant_type: 'client_credentials' });

  const tokenPayload = await spotifyJson<{ access_token: string; expires_in: number }>(SPOTIFY_ACCOUNTS, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  globalSpotify.__spotifyTokenCache = {
    token: tokenPayload.access_token,
    expiresAt: now + tokenPayload.expires_in * 1000 - TOKEN_SAFETY_BUFFER_MS,
  };

  return tokenPayload.access_token;
}

async function spotifyApiRequest<T>(url: string): Promise<T> {
  const withAuth = async (token: string): Promise<T> => {
    return spotifyJson<T>(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const token = await getSpotifyAccessToken(false);

  try {
    return await withAuth(token);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes('(401)')) throw error;

    const refreshedToken = await getSpotifyAccessToken(true);
    return withAuth(refreshedToken);
  }
}

async function fetchArtistAlbumSummaries(): Promise<SpotifyAlbumSummary[]> {
  const albums = new Map<string, SpotifyAlbumSummary>();
  let nextUrl: string | null = `${SPOTIFY_API}/artists/${SPOTIFY_ARTIST_ID}/albums?include_groups=album,single,appears_on&market=US`;

  while (nextUrl) {
    const page: SpotifyArtistAlbumsPage = await spotifyApiRequest<SpotifyArtistAlbumsPage>(nextUrl);
    for (const item of page.items) {
      if (!albums.has(item.id)) {
        albums.set(item.id, item);
      }
    }
    nextUrl = page.next;
  }

  return Array.from(albums.values());
}

async function fetchAlbumDetailsWithAllTracks(albumId: string): Promise<SpotifyAlbumDetails & { allTracks: SpotifyTrack[] }> {
  const album = await spotifyApiRequest<SpotifyAlbumDetails>(`${SPOTIFY_API}/albums/${albumId}?market=US`);
  const allTracks = [...album.tracks.items];

  let nextUrl = album.tracks.next;
  while (nextUrl) {
    const trackPage: SpotifyAlbumTracksPage = await spotifyApiRequest<SpotifyAlbumTracksPage>(nextUrl);
    allTracks.push(...trackPage.items);
    nextUrl = trackPage.next;
  }

  return { ...album, allTracks };
}

async function fetchAllSmokedopeSongsFromSpotify(): Promise<SpotifySong[]> {
  const albumSummaries = await fetchArtistAlbumSummaries();
  const dedupedSongs = new Map<string, SpotifySongCandidate>();

  for (const summary of albumSummaries) {
    const album = await fetchAlbumDetailsWithAllTracks(summary.id);
    const albumCover = album.images[0]?.url ?? '';
    const sourceRank = rankAlbumGroup(summary.album_group);
    const durationSecsByTrack = album.allTracks
      .map((track) => Math.max(1, Math.round(track.duration_ms / 1000)))
      .filter((secs) => Number.isFinite(secs));
    const minDurationSecs = durationSecsByTrack.length > 0 ? Math.min(...durationSecsByTrack) : 0;
    const maxDurationSecs = durationSecsByTrack.length > 0 ? Math.max(...durationSecsByTrack) : 0;
    const avgDurationSecs = durationSecsByTrack.length > 0
      ? Math.round(durationSecsByTrack.reduce((sum, secs) => sum + secs, 0) / durationSecsByTrack.length)
      : 0;
    const totalTracks = Math.max(1, album.allTracks.length);

    for (const track of album.allTracks) {
      if (!track.id || !track.name) continue;
      if (!track.artists.some((artist) => artist.id === SPOTIFY_ARTIST_ID)) continue;

      const releaseDate = normalizeReleaseDate(album.release_date, album.release_date_precision);
      const durationSecs = Math.max(1, Math.round(track.duration_ms / 1000));
      const featuresList = track.artists
        .filter((artist) => artist.id !== SPOTIFY_ARTIST_ID)
        .map((artist) => artist.name.trim())
        .filter(Boolean);
      const features = [...new Set(featuresList)];
      const title = track.name.trim();
      const dedupeKey = normalizeTitle(title);
      const isPrimaryArtist = track.artists[0]?.id === SPOTIFY_ARTIST_ID;
      const trackNumber = Math.max(1, track.track_number || 1);
      const hasDedicatedSingleCover = summary.album_group === 'single' || album.album_type === 'single';

      const candidate: SpotifySongCandidate = {
        id: track.id,
        slug: `${slugify(title)}--${track.id}`,
        title,
        features: JSON.stringify(features),
        album: album.name,
        year: Number(releaseDate.slice(0, 4)) || 0,
        releaseDate,
        durationSecs,
        singleCover: hasDedicatedSingleCover ? albumCover : null,
        albumCover,
        description: buildSongDescription({
          title,
          albumName: album.name,
          releaseDate,
          durationSecs,
          features,
          isPrimaryArtist,
          trackNumber,
          totalTracks,
          minDurationSecs,
          maxDurationSecs,
          avgDurationSecs,
          hasDedicatedSingleCover,
        }),
        sourceRank,
        searchText: `${title} ${album.name} ${features.join(' ')}`.toLowerCase(),
      };

      const existing = dedupedSongs.get(dedupeKey);
      if (!existing || shouldReplaceSong(candidate, existing)) {
        dedupedSongs.set(dedupeKey, candidate);
      }
    }
  }

  return Array.from(dedupedSongs.values())
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return a.title.localeCompare(b.title);
    })
    .map(({ sourceRank, searchText, ...song }) => song);
}

export async function getAllSmokedopeSongs(forceRefresh = false): Promise<SpotifySong[]> {
  const now = Date.now();
  const cached = globalSpotify.__spotifySongsCache;
  const cacheHasMissingDescriptions = cached?.songs.some((song) => !song.description?.trim()) ?? false;
  const cacheVersionMismatch = (cached?.version ?? 0) !== SONG_DESCRIPTION_VERSION;

  if (!forceRefresh && cached && cached.expiresAt > now && !cacheHasMissingDescriptions && !cacheVersionMismatch) {
    return cached.songs;
  }

  if (!forceRefresh && globalSpotify.__spotifySongsPromise) {
    return globalSpotify.__spotifySongsPromise;
  }

  const refreshPromise = (async () => {
    try {
      const songs = await fetchAllSmokedopeSongsFromSpotify();

      globalSpotify.__spotifySongsCache = {
        songs,
        expiresAt: Date.now() + SONG_CACHE_TTL_MS,
        version: SONG_DESCRIPTION_VERSION,
      };

      return songs;
    } catch (error) {
      if (cached?.songs?.length) {
        console.warn('Spotify refresh failed, serving cached songs instead.', error);
        return cached.songs;
      }
      throw error;
    } finally {
      globalSpotify.__spotifySongsPromise = undefined;
    }
  })();

  globalSpotify.__spotifySongsPromise = refreshPromise;
  return refreshPromise;
}

export async function searchSmokedopeSongs(query: string): Promise<SpotifySong[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const songs = await getAllSmokedopeSongs(false);

  return songs
    .filter((song) => {
      const featureText = song.features.replace(/[\[\]"]/g, '').toLowerCase();
      return (
        song.title.toLowerCase().includes(q) ||
        song.album.toLowerCase().includes(q) ||
        featureText.includes(q)
      );
    })
    .slice(0, 25);
}

export async function getSmokedopeSongBySlug(slug: string): Promise<SpotifySong | null> {
  const songs = await getAllSmokedopeSongs(false);
  const idFromSlug = slug.includes('--') ? slug.split('--').pop() : null;

  if (idFromSlug) {
    const byId = songs.find((song) => song.id === idFromSlug);
    if (byId) return byId;
  }

  return songs.find((song) => song.slug === slug) ?? null;
}
