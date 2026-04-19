// Song detail page layout for smokedope2016 tracks.
import Image from 'next/image';
import Link from 'next/link';
import type { Song } from '@/lib/types';

const palette = {
  bg: '#0f0d0b',
  surface: '#1a1510',
  accent: '#c8a96e',
  text: '#e8dcc8',
  muted: '#8fa89c',
  border: '#2d2518',
};

function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function SongPage({ song }: { song: Song }) {
  const features: string[] = JSON.parse(song.features);
  const cover = song.singleCover ?? song.albumCover;

  return (
    <div style={{ background: palette.bg, color: palette.text, minHeight: '100vh' }}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <Link
          href="/smokedope2016"
          className="text-xs uppercase tracking-widest hover:opacity-70 transition-opacity"
          style={{ color: palette.muted }}
        >
          ← smokedope2016
        </Link>

        <div className="mt-8 flex flex-col sm:flex-row gap-8">
          <div className="flex-shrink-0">
            <Image
              src={cover}
              alt={song.title}
              width={280}
              height={280}
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-widest" style={{ color: palette.accent }}>
              {song.album} · {song.year}
            </p>
            <h1 className="text-3xl sm:text-4xl font-black leading-tight" style={{ color: palette.text }}>
              {song.title}
            </h1>
            {features.length > 0 && (
              <p className="text-sm" style={{ color: palette.muted }}>
                feat. {features.join(', ')}
              </p>
            )}

            <div className="mt-4 space-y-1 text-sm" style={{ color: palette.muted }}>
              <p><span style={{ color: palette.text }}>Released</span> {formatDate(song.releaseDate)}</p>
              <p><span style={{ color: palette.text }}>Duration</span> {formatDuration(song.durationSecs)}</p>
            </div>
          </div>
        </div>

        {song.description && (
          <p className="mt-10 text-sm leading-relaxed max-w-2xl" style={{ color: palette.muted }}>
            {song.description}
          </p>
        )}
      </div>
    </div>
  );
}
