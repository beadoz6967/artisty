// Song detail page — fetches song by slug and renders the detail view.
import { notFound } from 'next/navigation';
import SongPage from '@/components/characters/smokedope/SongPage';
import { getSmokedopeSongBySlug } from '@/lib/spotify';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const raw = await getSmokedopeSongBySlug(slug);
  if (!raw) notFound();

  const song = { ...raw, features: JSON.parse(raw.features) as string[] };
  return <SongPage song={song} />;
}
