// Legacy song route kept for compatibility; redirects to canonical /songs/[slug].
import { permanentRedirect } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  permanentRedirect(`/songs/${slug}`);
}
