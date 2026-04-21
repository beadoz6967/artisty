// GET /api/songs?q=<query> — returns matching songs for the search dropdown.
import { NextRequest, NextResponse } from 'next/server';
import { isSpotifyAuthError, searchSmokedopeSongs } from '@/lib/spotify';

const SONG_SEARCH_TIMEOUT_MS = 20_000;

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim();
  if (!q || q.length > 100) return NextResponse.json([]);

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Song search timed out after ${SONG_SEARCH_TIMEOUT_MS}ms`)), SONG_SEARCH_TIMEOUT_MS)
  );

  try {
    const songs = await Promise.race([searchSmokedopeSongs(q), timeoutPromise]);

    return NextResponse.json(
      songs.map((song) => ({
        id: song.id,
        slug: song.slug,
        title: song.title,
        features: JSON.parse(song.features) as string[],
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
