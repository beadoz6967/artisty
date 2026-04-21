// Song detail page layout for smokedope2016 tracks.
import Image from 'next/image';
import Link from 'next/link';
import type { Song } from '@/lib/types';
import { smokedope } from '@/data/characters/smokedope';

const { palette } = smokedope;

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
  const cover = song.singleCover ?? song.albumCover;
  const description = song.description?.trim() ||
    `${song.title} appears on ${song.album} (${song.year}). Full archive note is temporarily unavailable, but track metadata is loaded.`;

  return (
    <div
      style={{
        '--color-bg': palette.bg,
        '--color-surface': palette.surface,
        '--color-accent': palette.accent,
        '--color-text': palette.text,
        '--color-muted': palette.muted,
        '--color-border': palette.border,
        background: palette.bg,
        color: palette.text,
        minHeight: '100vh',
      } as React.CSSProperties}
      className="smoke-song-shell"
    >
      <div className="smoke-content smoke-virtualized mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-12">
        <Link
          href="/"
          className="mono text-xs uppercase tracking-widest transition-opacity hover:opacity-80"
          style={{ color: '#c2d0e6' }}
        >
          ← back to smokedope2016 archive
        </Link>

        <div className="smoke-panel smoke-glass mt-6 border p-4 sm:p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
            <div className="smoke-frame relative w-full sm:w-[280px] flex-shrink-0 overflow-hidden border aspect-square">
              <Image
                src={cover}
                alt={song.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 280px"
                unoptimized
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="mono text-xs uppercase tracking-[0.24em]" style={{ color: '#bfd0ea' }}>
                {song.album} · {song.year}
              </p>
              <h1 className="smoke-heading text-3xl font-black leading-tight sm:text-4xl" style={{ color: palette.text }}>
                {song.title}
              </h1>
              {song.features.length > 0 && (
                <p className="mono text-sm uppercase tracking-[0.08em]" style={{ color: '#cad6eb' }}>
                  feature signal: {song.features.join(', ')}
                </p>
              )}

              <div className="smoke-panel mt-4 space-y-1 p-3 text-sm" style={{ color: '#d3dbeb' }}>
                <p><span style={{ color: '#f2f6ff' }}>Release date</span> {formatDate(song.releaseDate)}</p>
                <p><span style={{ color: '#f2f6ff' }}>Runtime</span> {formatDuration(song.durationSecs)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="smoke-panel mt-6 max-w-3xl p-4 sm:p-5">
          <p className="mono text-[0.6rem] uppercase tracking-[0.22em]" style={{ color: palette.accent }}>
            Archive note
          </p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: '#d4dbea' }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
