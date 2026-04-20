// GET /api/songs?q=<query> — returns matching songs for the search dropdown.
import { NextRequest, NextResponse } from 'next/server';
import { isSpotifyAuthError, searchSmokedopeSongs } from '@/lib/spotify';

const SONG_SEARCH_TIMEOUT_MS = 20_000;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>;

  return new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`Song search timed out after ${timeoutMs}ms`)), timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

export async function GET(req: NextRequest) {
  console.log('Using ID:', process.env.SPOTIFY_CLIENT_ID?.slice(0,5));

  const q = req.nextUrl.searchParams.get('q')?.trim();
  if (!q) return NextResponse.json([]);

  try {
    const songs = await withTimeout(searchSmokedopeSongs(q), SONG_SEARCH_TIMEOUT_MS);

    return NextResponse.json(
      songs.map((song) => ({
        id: song.id,
        slug: song.slug,
        title: song.title,
        features: song.features,
        year: song.year,
        singleCover: song.singleCover,
        albumCover: song.albumCover,
      }))
    );
  } catch (error) {
    console.error('[api/songs] Spotify search failed', error);

    if (isSpotifyAuthError(error)) {
      return NextResponse.json(
        { error: 'Spotify authentication failed. Verify credentials and redirect URI.' },
        { status: 500 }
      );
    }

    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message.toLowerCase().includes('timed out')) {
      return NextResponse.json({ error: 'Spotify request timed out.' }, { status: 500 });
    }

    return NextResponse.json({ error: 'Failed to fetch songs from Spotify.' }, { status: 500 });
  }
}
