'use client';
// Searchable song selector with a smokedope-style glitchy dropdown.
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Palette } from '@/lib/types';

interface SongResult {
  id: string;
  slug: string;
  title: string;
  features: string[];
  year: number;
  singleCover: string | null;
  albumCover: string;
}

interface Props {
  palette: Palette;
}

export default function SongSearch({ palette }: Props) {
  const { accent, border, text } = palette;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SongResult[]>([]);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/songs?q=${encodeURIComponent(trimmedQuery)}`);
        if (!res.ok) {
          setResults([]);
          setOpen(true);
          return;
        }

        const data: unknown = await res.json();
        setResults(Array.isArray(data) ? (data as SongResult[]) : []);
        setOpen(true);
      } catch {
        setResults([]);
        setOpen(true);
      }
    }, 200);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [query]);

  const pick = (slug: string) => {
    setOpen(false);
    setQuery('');
    router.push(`/songs/${slug}`);
  };

  return (
    <div className="smoke-content relative max-w-2xl">
      <div
        className="smoke-glass smoke-panel relative overflow-hidden border"
        style={{
          borderColor: focused ? accent : border,
          boxShadow: focused
            ? `inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.66), 0 0 0 1px ${accent}55`
            : 'inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.66)',
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'linear-gradient(to bottom, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 12%, rgba(0,0,0,0.22) 100%)',
          }}
        />

        <div
          className="relative border-b px-3 py-2"
          style={{
            borderColor: `${border}cc`,
            background: `linear-gradient(to bottom, ${accent}99 0%, ${accent}44 55%, rgba(10,12,19,0.35) 100%)`,
          }}
        >
          <p className="mono text-[0.56rem] uppercase tracking-[0.28em] text-[#e8efff]">Track index // aero vault</p>
        </div>

        <div className="relative flex items-center gap-3 px-3 py-3 sm:px-4">
          <div
            aria-hidden="true"
            className="h-3 w-3 shrink-0 border"
            style={{
              borderColor: '#0a0f19',
              background: focused
                ? `linear-gradient(to bottom, ${accent}, #f04040)`
                : 'linear-gradient(to bottom, #8ea2c5, #40506e)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.6)',
            }}
          />

          <div className="min-w-0 flex-1">
            <p className="mono text-[0.54rem] uppercase tracking-[0.2em]" style={{ color: '#ced8ec' }}>
              Search tracks
            </p>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                const nextQuery = e.target.value;
                setQuery(nextQuery);

                if (!nextQuery.trim()) {
                  setResults([]);
                  setOpen(false);
                }
              }}
              onBlur={() => {
                setFocused(false);
                setTimeout(() => setOpen(false), 150);
              }}
              onFocus={() => {
                setFocused(true);
                if (results.length > 0) setOpen(true);
              }}
              placeholder="type title, album, or feature"
              aria-label="Search smokedope2016 songs"
              className="mt-1 w-full border px-2 py-1 text-sm sm:text-base outline-none"
              style={{
                color: text,
                borderColor: focused ? accent : `${border}bb`,
                background: `linear-gradient(to bottom, rgba(235,242,255,0.16), rgba(14,18,28,0.5))`,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.62)',
                caretColor: accent,
                fontFamily: 'Courier New, Courier, monospace',
              }}
            />
          </div>

          <div className="hidden sm:block mono text-[0.56rem] uppercase tracking-[0.22em] text-[#c9d3e7]">
            {results.length > 0 ? `${results.length} hits` : 'idle'}
          </div>
        </div>
      </div>

      {open && results.length > 0 && (
        <div className="relative mt-2">
          <div className="smoke-glass smoke-panel overflow-hidden border" style={{ borderColor: border }}>
            <ul className="max-h-80 overflow-y-auto">
              {results.map((song) => {
                const cover = song.singleCover ?? song.albumCover;
                return (
                  <li
                    key={song.id}
                    onMouseDown={() => pick(song.slug)}
                    className="smoke-search-row group relative flex cursor-pointer items-center gap-3 border-b px-3 py-3 last:border-b-0 sm:px-4"
                    style={{ borderColor: `${border}9f` }}
                  >
                    <div className="smoke-frame relative h-10 w-10 shrink-0 overflow-hidden border">
                      <Image
                        src={cover}
                        alt={song.title}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold tracking-wide" style={{ color: '#e5eaf4' }}>
                        {song.title}
                      </p>
                      {song.features.length > 0 && (
                        <p className="truncate mono text-[0.68rem] uppercase tracking-[0.14em] text-[#becee7] sm:text-xs">
                          ft. {song.features.join(', ')}
                        </p>
                      )}
                    </div>

                    <div className="mono shrink-0 text-right text-[0.7rem] uppercase tracking-[0.2em] text-[#b8c6df]">
                      {song.year}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {open && results.length === 0 && query.trim() && (
        <div className="smoke-glass smoke-panel mt-2 border px-4 py-4" style={{ borderColor: border }}>
          <p className="mono text-[0.72rem] uppercase tracking-[0.22em] text-[#ced9ec]">No tracks found.</p>
        </div>
      )}
    </div>
  );
}
