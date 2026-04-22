// Song detail page layout for smokedope2016 tracks.
import Image from 'next/image';
import Link from 'next/link';
import type { Song } from '@/lib/types';
import { smokedope } from '@/data/characters/smokedope';
import { LenisProvider } from '@/components/motion/LenisProvider';

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

function buildSpotifyTrackUrl(song: Song): string | null {
  const idFromSlug = song.slug.includes('--') ? song.slug.split('--').pop() : null;
  const trackId = song.id?.trim() || idFromSlug?.trim() || '';

  if (!trackId) return null;
  return `https://open.spotify.com/track/${encodeURIComponent(trackId)}`;
}

export default function SongPage({ song }: { song: Song }) {
  const cover = song.singleCover ?? song.albumCover;
  const description = song.description?.trim() ||
    `${song.title} appears on ${song.album} (${song.year}). Full archive note is temporarily unavailable, but track metadata is loaded.`;
  const spotifyUrl = buildSpotifyTrackUrl(song);

  return (
    <LenisProvider>
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
          {spotifyUrl && (
            <a
              href={spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Listen to ${song.title} on Spotify`}
              className="mt-4 inline-flex w-fit items-center gap-3 rounded-[14px] border px-3 py-2 transition-transform hover:-translate-y-0.5 hover:opacity-95"
              style={{
                background: '#000000',
                borderColor: '#455061',
                boxShadow: '0 8px 18px rgba(0, 0, 0, 0.35)',
              }}
            >
              <span
                aria-hidden
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: '#1ED760' }}
              >
                <svg viewBox="0 0 168 168" width="22" height="22" role="img" aria-label="Spotify logo">
                  <path
                    fill="#000000"
                    d="M83.99 0a84 84 0 1 0 .02 168 84 84 0 0 0-.02-168zm38.5 121.2a5.22 5.22 0 0 1-7.18 1.73c-19.66-12.01-44.4-14.72-73.54-8.06a5.23 5.23 0 0 1-2.33-10.2c31.91-7.3 59.22-4.2 81.31 9.29a5.22 5.22 0 0 1 1.74 7.24zm10.24-21.98a6.53 6.53 0 0 1-8.99 2.16c-22.52-13.84-56.84-17.85-83.47-9.75a6.53 6.53 0 1 1-3.8-12.5c30.4-9.24 68.2-4.76 94.12 11.18a6.53 6.53 0 0 1 2.14 8.91zm.88-22.86c-27-16.03-71.57-17.5-97.34-9.64a7.84 7.84 0 1 1-4.58-14.99c29.57-9 78.73-7.27 109.92 11.24a7.84 7.84 0 0 1-7.99 13.39z"
                  />
                </svg>
              </span>
              <span className="leading-none">
                <span className="block text-[0.68rem] uppercase tracking-[0.15em]" style={{ color: '#ffffff' }}>
                  Listen on
                </span>
                <span className="block text-2xl font-black" style={{ color: '#1ED760' }}>
                  Spotify
                </span>
              </span>
            </a>
          )}
        </div>
        </div>
      </div>
    </LenisProvider>
  );
}
