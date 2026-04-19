'use client';
// Searchable song selector with a smokedope-style glitchy dropdown.
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SongResult {
  id: number;
  slug: string;
  title: string;
  features: string;
  year: number;
  singleCover: string | null;
  albumCover: string;
}

interface Props {
  accent: string;
  border: string;
  surface: string;
  text: string;
  muted: string;
}

export default function SongSearch({ accent, border, surface, text, muted }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SongResult[]>([]);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return; }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const res = await fetch(`/api/songs?q=${encodeURIComponent(query)}`);
      const data: SongResult[] = await res.json();
      setResults(data);
      setOpen(true);
    }, 200);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [query]);

  const pick = (slug: string) => {
    setOpen(false);
    setQuery('');
    router.push(`/smokedope2016/songs/${slug}`);
  };

  return (
    <div className="relative max-w-2xl">
      <div
        className="relative overflow-hidden border shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
        style={{
          borderColor: focused ? accent : border,
          background: `linear-gradient(180deg, ${surface} 0%, ${surface} 100%)`,
          boxShadow: focused
            ? `0 0 0 1px ${accent}33, 0 0 26px ${accent}14, inset 0 1px 0 rgba(255,255,255,0.04)`
            : `0 0 0 1px ${border}66, inset 0 1px 0 rgba(255,255,255,0.03)`,
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '100% 3px, 4px 100%',
            mixBlendMode: 'soft-light',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        />

        <div className="relative flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-4">
          <div
            aria-hidden="true"
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ background: focused ? accent : muted, boxShadow: focused ? `0 0 16px ${accent}` : 'none' }}
          />
          <div className="min-w-0 flex-1">
            <p className="mono text-[0.54rem] uppercase tracking-[0.24em]" style={{ color: muted }}>
              Track vault search
            </p>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onBlur={() => {
                setFocused(false);
                setTimeout(() => setOpen(false), 150);
              }}
              onFocus={() => {
                setFocused(true);
                results.length > 0 && setOpen(true);
              }}
              placeholder="Search tracks…"
              aria-label="Search smokedope2016 songs"
              className="w-full bg-transparent font-mono text-sm sm:text-base outline-none placeholder:opacity-60"
              style={{ color: text, caretColor: accent }}
            />
          </div>
          <div
            className="hidden sm:block text-[0.56rem] uppercase tracking-[0.28em]"
            style={{ color: muted }}
          >
            {results.length > 0 ? `${results.length} hits` : 'search'}
          </div>
        </div>
      </div>

      {open && results.length > 0 && (
        <div className="relative mt-3">
          <div
            aria-hidden="true"
            className="absolute -inset-[1px]"
            style={{
              background: `linear-gradient(135deg, ${accent}55, transparent 22%, transparent 78%, ${accent}55)`,
              opacity: 0.55,
              filter: 'blur(0.3px)',
            }}
          />
          <ul
            className="relative z-10 max-h-80 overflow-y-auto border bg-[var(--song-search-surface)]"
            style={{
              ['--song-search-surface' as string]: surface,
              borderColor: border,
              boxShadow: `0 18px 48px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.03)`,
            }}
          >
            {results.map((song, index) => {
              const features: string[] = JSON.parse(song.features);
              const cover = song.singleCover ?? song.albumCover;
              return (
                <li
                  key={song.id}
                  onMouseDown={() => pick(song.slug)}
                  className="song-search-row group relative flex cursor-pointer items-center gap-3 overflow-hidden border-b last:border-b-0 px-3 py-3 sm:px-4"
                  style={{ borderColor: `${border}88`, animationDelay: `${index * 45}ms` }}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 42%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.03) 58%, transparent 100%)',
                      mixBlendMode: 'screen',
                    }}
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100"
                    style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
                  />
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden border" style={{ borderColor: `${border}cc` }}>
                    <Image
                      src={cover}
                      alt={song.title}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.06]"
                      unoptimized
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black tracking-wide" style={{ color: text }}>
                      {song.title}
                    </p>
                    {features.length > 0 && (
                      <p className="truncate text-[0.72rem] sm:text-xs uppercase tracking-[0.12em]" style={{ color: muted }}>
                        ft. {features.join(', ')}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 text-right text-[0.7rem] uppercase tracking-[0.2em]" style={{ color: muted }}>
                    {song.year}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {open && results.length === 0 && query.trim() && (
        <div
          className="relative mt-3 overflow-hidden border px-4 py-4 text-sm"
          style={{ background: surface, borderColor: border, color: muted }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
              backgroundSize: '100% 4px, 5px 100%',
            }}
          />
          <p className="relative mono text-[0.72rem] uppercase tracking-[0.22em]">
            No tracks found.
          </p>
        </div>
      )}

      <style jsx>{`
        div:focus-within > div:first-child {
          animation: flicker 320ms linear 1;
        }

        div:focus-within input {
          text-shadow: 0 0 14px ${accent}33;
        }

        .song-search-row {
          opacity: 0;
          transform: translateY(-4px);
          animation: rowIn 260ms ease forwards;
        }

        .song-search-row:hover {
          background: linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.06), rgba(255,255,255,0.02));
        }

        .song-search-row:hover::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,0.045) 0,
            rgba(255,255,255,0.045) 1px,
            transparent 1px,
            transparent 4px
          );
          mix-blend-mode: overlay;
          opacity: 0.42;
        }

        ul {
          animation: dropdownIn 220ms ease-out both;
          transform-origin: top center;
        }

        @keyframes flicker {
          0% { filter: brightness(1); }
          20% { filter: brightness(1.2); }
          40% { filter: brightness(0.92); }
          60% { filter: brightness(1.1); }
          100% { filter: brightness(1); }
        }

        @keyframes dropdownIn {
          from {
            opacity: 0;
            transform: translateY(-6px) scaleY(0.985);
            filter: blur(1px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scaleY(1);
            filter: blur(0);
          }
        }

        @keyframes rowIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
