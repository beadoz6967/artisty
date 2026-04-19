// Song detail page — fetches song by slug and renders the detail view.
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import SongPage from '@/components/characters/smokedope/SongPage';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const song = await prisma.song.findUnique({ where: { slug } });
  if (!song) notFound();
  return <SongPage song={song} />;
}
