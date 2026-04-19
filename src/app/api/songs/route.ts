// GET /api/songs?q=<query> — returns matching songs for the search dropdown.
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim();
  if (!q) return NextResponse.json([]);

  const songs = await prisma.song.findMany({
    where: { title: { contains: q } },
    select: { id: true, slug: true, title: true, features: true, year: true, singleCover: true, albumCover: true },
    take: 10,
  });

  return NextResponse.json(songs);
}
