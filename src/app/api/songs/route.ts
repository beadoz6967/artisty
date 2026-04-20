// GET /api/songs?q=<query> — returns matching songs for the search dropdown.
import { NextRequest, NextResponse } from 'next/server';
import { searchSmokedopeSongs } from '@/lib/spotify';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim();
  if (!q) return NextResponse.json([]);

  const songs = await searchSmokedopeSongs(q);

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
}
