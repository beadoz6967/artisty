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

type SpotifyTrackSearchItem = {
  id: string;
  name: string;
  duration_ms: number;
  track_number: number;
  artists: SpotifyArtistRef[];
  album: {
    name: string;
    album_type: 'album' | 'single' | 'compilation' | string;
    release_date: string;
    release_date_precision: 'day' | 'month' | 'year' | string;
    total_tracks: number;
    images: SpotifyImage[];
  };
};

type SpotifyTrackSearchResponse = {
  tracks: {
    items: SpotifyTrackSearchItem[];
  };
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
const SONG_DESCRIPTION_VERSION = 3;
const SPOTIFY_REQUEST_TIMEOUT_MS = 12_000;
const SPOTIFY_MAX_PAGES = 200;
const SPOTIFY_AUTH_ERROR_CODE = 'SPOTIFY_AUTH_INVALID';
const REDIRECT_URI = process.env.NODE_ENV === 'production'
  ? 'https://www.beadoz.dev/api/songs'
  : 'http://localhost:3000/api/songs';

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
    return 'The title reads like a sequence marker, built to set atmosphere as much as to stand alone.';
  }

  if (/night|dark|moon|dream|sleep|dusk|midnight/.test(t)) {
    return 'Its language points to late-night haze: low light, slow pulse, and after-hours drift.';
  }

  if (/xbox|halo|lag|online|game|party|red ring/.test(t)) {
    return 'The naming pulls from internet-native and gaming-coded references that define this catalog memory lane.';
  }

  if (/nike|goyard|socks|bape|shirt|ferragamo|foamposite/.test(t)) {
    return 'The phrase works like style shorthand, using brands and materials as visual language.';
  }

  if (/truck|drank|glock|ball|smoke|high|lean|trap/.test(t)) {
    return 'The wording leans into motion-and-flex imagery over explicit linear storytelling.';
  }

  return 'The naming follows clipped codewords that keep the mood suggestive rather than fully spelled out.';
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

  let durationFact = 'near the project runtime average';
  if (durationSecs === minDurationSecs) durationFact = 'the shortest runtime on the release';
  else if (durationSecs === maxDurationSecs) durationFact = 'the longest runtime on the release';
  else if (durationSecs < avgDurationSecs - 18) durationFact = 'on the quicker side of the tracklist';
  else if (durationSecs > avgDurationSecs + 18) durationFact = 'on the longer side of the tracklist';

  const lead = isPrimaryArtist
    ? `${title} appears on ${albumName} as ${positionLabel} (track ${trackNumber} of ${totalTracks}).`
    : `${title} places smokedope2016 on ${albumName} as ${positionLabel} (track ${trackNumber} of ${totalTracks}).`;

  const timing = `Released ${prettyDate} (${season}), it runs ${runtime} and sits ${durationFact}.`;

  const featureFact = features.length > 0
    ? `Feature signal: ${features.join(', ')} ${features.length === 1 ? 'is listed' : 'are listed'} on this cut.`
    : 'No listed guest features; this track is presented as a solo performance.';

  const visualFact = hasDedicatedSingleCover
    ? 'Visual note: Spotify assigns dedicated single artwork, separating it from the parent album palette.'
    : `Visual note: Spotify uses ${albumName} cover art, keeping the track inside that era palette.`;

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

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isSpotifyUnauthorizedError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return message.includes('spotify unauthorized (401)') || message.includes('(401)');
}

function createTimeoutSignal(timeoutMs: number, parentSignal?: AbortSignal): {
  signal: AbortSignal;
  cleanup: () => void;
} {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const onParentAbort = () => controller.abort();

  if (parentSignal) {
    if (parentSignal.aborted) {
      controller.abort();
    } else {
      parentSignal.addEventListener('abort', onParentAbort, { once: true });
    }
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timeoutId);
      if (parentSignal) {
        parentSignal.removeEventListener('abort', onParentAbort);
      }
    },
  };
}

export function isSpotifyAuthError(error: unknown): boolean {
  return getErrorMessage(error).includes(SPOTIFY_AUTH_ERROR_CODE);
}

async function spotifyJson<T>(url: string, init?: RequestInit, retries = 2): Promise<T> {
  const { signal, cleanup } = createTimeoutSignal(SPOTIFY_REQUEST_TIMEOUT_MS, init?.signal ?? undefined);
  let response: Response;

  try {
    response = await fetch(url, {
      ...init,
      signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Spotify request timed out after ${SPOTIFY_REQUEST_TIMEOUT_MS}ms: ${url}`);
    }
    throw error;
  } finally {
    cleanup();
  }

  if (response.status === 429 && retries > 0) {
    const retryAfterHeader = Number(response.headers.get('retry-after') || '0');
    const retryAfter = retryAfterHeader > 0 ? Math.min(retryAfterHeader, 2) : 1;
    await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
    return spotifyJson<T>(url, init, retries - 1);
  }

  if (response.status === 401) {
    const text = await response.text();
    throw new Error(`Spotify unauthorized (401): ${text}`);
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

  let tokenPayload: { access_token: string; expires_in: number };
  try {
    tokenPayload = await spotifyJson<{ access_token: string; expires_in: number }>(SPOTIFY_ACCOUNTS, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
  } catch (error) {
    if (isSpotifyUnauthorizedError(error)) {
      throw new Error(
        `${SPOTIFY_AUTH_ERROR_CODE}: Invalid Spotify credentials. Verify SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET.`
      );
    }
    throw error;
  }

  if (!tokenPayload.access_token) {
    throw new Error(`${SPOTIFY_AUTH_ERROR_CODE}: Spotify token response is missing access_token.`);
  }

  globalSpotify.__spotifyTokenCache = {
    token: tokenPayload.access_token,
    expiresAt: now + tokenPayload.expires_in * 1000 - TOKEN_SAFETY_BUFFER_MS,
  };

  return tokenPayload.access_token;
}

async function spotifyApiRequest<T>(url: string): Promise<T> {
  const token = await getSpotifyAccessToken(false);

  try {
    return await spotifyJson<T>(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    if (isSpotifyUnauthorizedError(error)) {
      throw new Error(
        `${SPOTIFY_AUTH_ERROR_CODE}: Spotify API rejected client credentials. Redirect=${REDIRECT_URI}`
      );
    }
    throw error;
  }
}

async function searchSmokedopeSongsFromSpotify(query: string): Promise<SpotifySong[]> {
  const q = encodeURIComponent(`artist:smokedope2016 ${query}`.trim());
  const url = `${SPOTIFY_API}/search?type=track&limit=25&market=US&q=${q}`;
  const payload = await spotifyApiRequest<SpotifyTrackSearchResponse>(url);

  return payload.tracks.items
    .filter((track) => track.id && track.name)
    .filter((track) => track.artists.some((artist) => artist.id === SPOTIFY_ARTIST_ID))
    .map((track) => {
      const features = track.artists
        .filter((artist) => artist.id !== SPOTIFY_ARTIST_ID)
        .map((artist) => artist.name.trim())
        .filter(Boolean);
      const dedupedFeatures = [...new Set(features)];
      const title = track.name.trim();
      const releaseDate = normalizeReleaseDate(track.album.release_date, track.album.release_date_precision);
      const durationSecs = Math.max(1, Math.round(track.duration_ms / 1000));
      const albumCover = track.album.images[0]?.url ?? '';
      const hasDedicatedSingleCover = track.album.album_type === 'single';
      const totalTracks = Math.max(track.album.total_tracks || 1, track.track_number || 1);

      return {
        id: track.id,
        slug: `${slugify(title)}--${track.id}`,
        title,
        features: JSON.stringify(dedupedFeatures),
        album: track.album.name,
        year: Number(releaseDate.slice(0, 4)) || 0,
        releaseDate,
        durationSecs,
        singleCover: hasDedicatedSingleCover ? albumCover : null,
        albumCover,
        description: buildSongDescription({
          title,
          albumName: track.album.name,
          releaseDate,
          durationSecs,
          features: dedupedFeatures,
          isPrimaryArtist: track.artists[0]?.id === SPOTIFY_ARTIST_ID,
          trackNumber: Math.max(1, track.track_number || 1),
          totalTracks,
          minDurationSecs: durationSecs,
          maxDurationSecs: durationSecs,
          avgDurationSecs: durationSecs,
          hasDedicatedSingleCover,
        }),
      };
    });
}

async function fetchArtistAlbumSummaries(): Promise<SpotifyAlbumSummary[]> {
  const albums = new Map<string, SpotifyAlbumSummary>();
  let nextUrl: string | null = `${SPOTIFY_API}/artists/${SPOTIFY_ARTIST_ID}/albums?include_groups=album,single,appears_on&market=US`;
  let pageCount = 0;

  while (nextUrl) {
    pageCount += 1;
    if (pageCount > SPOTIFY_MAX_PAGES) {
      throw new Error(`Spotify album pagination exceeded ${SPOTIFY_MAX_PAGES} pages.`);
    }

    const currentUrl: string = nextUrl;
    const page: SpotifyArtistAlbumsPage = await spotifyApiRequest<SpotifyArtistAlbumsPage>(currentUrl);
    for (const item of page.items) {
      if (!albums.has(item.id)) {
        albums.set(item.id, item);
      }
    }

    nextUrl = page.next;
    if (nextUrl && nextUrl === currentUrl) {
      throw new Error('Spotify album pagination returned a repeated next URL.');
    }
  }

  return Array.from(albums.values());
}

async function fetchAlbumDetailsWithAllTracks(albumId: string): Promise<SpotifyAlbumDetails & { allTracks: SpotifyTrack[] }> {
  const album = await spotifyApiRequest<SpotifyAlbumDetails>(`${SPOTIFY_API}/albums/${albumId}?market=US`);
  const allTracks = [...album.tracks.items];

  let nextUrl: string | null = album.tracks.next;
  let pageCount = 0;
  while (nextUrl) {
    pageCount += 1;
    if (pageCount > SPOTIFY_MAX_PAGES) {
      throw new Error(`Spotify track pagination exceeded ${SPOTIFY_MAX_PAGES} pages for album ${albumId}.`);
    }

    const currentUrl: string = nextUrl;
    const trackPage: SpotifyAlbumTracksPage = await spotifyApiRequest<SpotifyAlbumTracksPage>(currentUrl);
    allTracks.push(...trackPage.items);
    nextUrl = trackPage.next;
    if (nextUrl && nextUrl === currentUrl) {
      throw new Error(`Spotify track pagination returned a repeated next URL for album ${albumId}.`);
    }
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

  let songs: SpotifySong[];
  try {
    songs = await getAllSmokedopeSongs(false);
  } catch (error) {
    if (isSpotifyAuthError(error)) {
      throw error;
    }

    console.warn('Catalog fetch failed during search, falling back to direct Spotify search.', error);
    return searchSmokedopeSongsFromSpotify(q);
  }

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
