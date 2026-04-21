// Universal nav — Windows 7 Aero Taskbar reconstruction.
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { smokedope } from '@/data/characters/smokedope';
import type { CharacterConfig } from '@/lib/types';

const characters: CharacterConfig[] = [smokedope];

const navImages: Record<string, string> = {
  smokedope2016: '/concert warehouse.jpg',
};

type SongResult = {
  id: string;
  slug: string;
  title: string;
  features: string[];
  year: number;
  singleCover: string | null;
  albumCover: string;
};

function AeroSongSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SongResult[]>([]);
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRootRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!searchRootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setResults([]);
      setErrorMessage(null);
      setIsLoading(false);
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      const requestId = ++requestIdRef.current;
      setIsLoading(true);
      setErrorMessage(null);
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch(`/api/songs?q=${encodeURIComponent(trimmed)}`, { signal: controller.signal });
        const payload: unknown = await response.json();

        if (requestId !== requestIdRef.current) return;

        if (!response.ok) {
          const errorPayload = (payload ?? {}) as { error?: string };
          setResults([]);
          setErrorMessage(errorPayload.error ?? 'Spotify search failed.');
          setOpen(true);
          setActiveIndex(-1);
          return;
        }

        const nextResults = Array.isArray(payload) ? (payload as SongResult[]) : [];
        setResults(nextResults);
        setOpen(true);
        setActiveIndex(-1);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        if (requestId !== requestIdRef.current) return;
        setResults([]);
        setErrorMessage('Could not reach Spotify search endpoint.');
        setOpen(true);
        setActiveIndex(-1);
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    }, 220);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  function pickSong(slug: string) {
    setOpen(false);
    setQuery('');
    setErrorMessage(null);
    setActiveIndex(-1);
    router.push(`/songs/${slug}`);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!open) setOpen(true);
      if (results.length === 0) return;
      setActiveIndex((prev) => (prev + 1) % results.length);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (results.length === 0) return;
      setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
      return;
    }

    if (event.key === 'Enter' && open && results.length > 0) {
      event.preventDefault();
      const selected = activeIndex >= 0 ? results[activeIndex] : results[0];
      pickSong(selected.slug);
    }
  }

  return (
    <div ref={searchRootRef} className="relative flex-1 min-w-0 px-1.5 py-1.5 sm:px-3">
      <div
        className="aero-search-shell h-full"
        style={{
          borderColor: isFocused ? 'rgba(173,222,255,0.9)' : 'rgba(188,219,255,0.42)',
          boxShadow: isFocused
            ? 'inset 0 1px 0 rgba(255,255,255,0.35), 0 0 0 1px rgba(152,220,255,0.35), 0 0 12px rgba(95,179,255,0.26)'
            : 'inset 0 1px 0 rgba(255,255,255,0.3), 0 0 0 1px rgba(0,0,0,0.45)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="aero-search-icon" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="rgba(220,239,255,0.9)" strokeWidth="2" />
          <path d="M16.5 16.5L21 21" stroke="rgba(220,239,255,0.9)" strokeWidth="2" strokeLinecap="round" />
        </svg>

        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (query.trim()) setOpen(true);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={onKeyDown}
          placeholder="Search Spotify tracks..."
          aria-label="Search songs"
          className="aero-search-input"
        />

        <p className="aero-search-status" aria-live="polite">
          {isLoading ? 'Searching' : query.trim() ? `${results.length} results` : 'Ready'}
        </p>
      </div>

      {open && (
        <div className="aero-search-dropdown">
          {isLoading && (
            <p className="aero-search-empty">Searching Spotify...</p>
          )}

          {!isLoading && errorMessage && (
            <p className="aero-search-empty">{errorMessage}</p>
          )}

          {!isLoading && !errorMessage && results.length === 0 && query.trim() && (
            <p className="aero-search-empty">No tracks found.</p>
          )}

          {!isLoading && !errorMessage && results.length > 0 && (
            <ul className="max-h-80 overflow-y-auto">
              {results.map((song, index) => {
                const active = index === activeIndex;
                const cover = song.singleCover ?? song.albumCover;

                return (
                  <li
                    key={song.id}
                    onMouseDown={() => pickSong(song.slug)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className="aero-search-row"
                    style={{
                      background: active
                        ? 'linear-gradient(to right, rgba(83,147,238,0.45), rgba(54,91,156,0.35))'
                        : 'linear-gradient(to right, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                    }}
                  >
                    <div className="aero-search-cover">
                      <Image
                        src={cover}
                        alt={song.title}
                        width={34}
                        height={34}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] text-white/90">{song.title}</p>
                      {song.features.length > 0 ? (
                        <p className="truncate text-[10px] uppercase tracking-[0.16em] text-white/65">
                          ft. {song.features.join(', ')}
                        </p>
                      ) : (
                        <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">solo</p>
                      )}
                    </div>

                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/55">{song.year}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// Single pinned-app tab with mouse-tracking radial glow.
function PinnedApp({
  href,
  label,
  sublabel,
  isActive,
  accentColor,
  bgImage,
}: {
  href: string;
  label: string;
  sublabel: string;
  isActive: boolean;
  accentColor?: string;
  bgImage?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [glow, setGlow] = useState<{ x: number; y: number } | null>(null);
  const glowFrameRef = useRef<number | null>(null);
  const pendingGlowRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    return () => {
      if (glowFrameRef.current) cancelAnimationFrame(glowFrameRef.current);
    };
  }, []);

  function onMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    pendingGlowRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    if (glowFrameRef.current) return;
    glowFrameRef.current = requestAnimationFrame(() => {
      glowFrameRef.current = null;
      setGlow(pendingGlowRef.current);
    });
  }

  function onMouseLeave() {
    if (glowFrameRef.current) {
      cancelAnimationFrame(glowFrameRef.current);
      glowFrameRef.current = null;
    }
    pendingGlowRef.current = null;
    setGlow(null);
  }

  const glowColor = accentColor ?? 'rgba(255,200,80,0.9)';

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="aero-pinned-app relative flex flex-col justify-center px-1.5 sm:px-4 py-2 min-w-[64px] sm:min-w-[120px] h-full overflow-hidden select-none"
    >
      {/* Character background bleed */}
      {bgImage && (
        <div
          className="absolute inset-0 opacity-[0.18] transition-opacity duration-300 group-hover:opacity-25"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* Mouse-following light */}
      {glow && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle 90px at ${glow.x}px ${glow.y}px, rgba(255,255,255,0.15), transparent 70%)`,
          }}
        />
      )}

      {/* Active recessed overlay */}
      {isActive && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.72), inset 0 0 14px rgba(0,0,0,0.38)',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.28), rgba(255,255,255,0.03) 65%)',
          }}
        />
      )}

      {/* Text */}
      <div className="relative z-10">
        <p
          className="hidden sm:block uppercase tracking-[0.24em]"
          style={{
            fontSize: '8px',
            color: 'rgba(255,255,255,0.40)',
            textShadow: '0px 1px 2px rgba(0,0,0,0.9)',
            fontFamily: "'Segoe UI', Tahoma, sans-serif",
          }}
        >
          {sublabel}
        </p>
        <p
          className="mt-[3px] sm:mt-[5px] text-[11px] sm:text-[13px] leading-none"
          style={{
            color: isActive && accentColor ? accentColor : 'rgba(255,255,255,0.92)',
            textShadow: '0px 1px 2px rgba(0,0,0,0.85)',
            fontFamily: "'Segoe UI', Tahoma, sans-serif",
          }}
        >
          {label}
        </p>
      </div>

      {/* Active bottom glow line */}
      {isActive && (
        <div
          className="absolute bottom-0 left-2 right-2 h-[2px]"
          style={{
            background: `linear-gradient(to right, transparent, ${glowColor}, transparent)`,
            boxShadow: `0 0 10px 2px ${glowColor}`,
          }}
        />
      )}

      {/* Divider */}
      <div className="absolute right-0 top-[18%] bottom-[18%] w-px bg-white/[0.08] hidden sm:block" />
    </Link>
  );
}

// System tray — live Eastern Time (most populated US timezone).
function SystemTray() {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit', hour12: true });
  const dateStr = now.toLocaleDateString('en-US', { timeZone: 'America/New_York', month: 'numeric', day: 'numeric', year: 'numeric' });

  return (
    <div
      className="hidden sm:flex items-center gap-2.5 px-3 h-full border-l border-white/[0.08] shrink-0"
      style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif" }}
    >
      {/* WiFi icon */}
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className="opacity-50">
        <path d="M7 11.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill="white" />
        <path d="M4.6 8.8C5.3 7.9 6.1 7.4 7 7.4s1.7.5 2.4 1.4" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M2.4 6.6C3.7 5 5.3 4 7 4s3.3 1 4.6 2.6" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.65" />
        <path d="M0.4 4.4C2.2 2.2 4.5 1 7 1s4.8 1.2 6.6 3.4" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
      </svg>

      {/* Clock */}
      <div className="text-right">
        <p
          className="leading-none"
          style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.80)',
            textShadow: '0px 1px 2px rgba(0,0,0,0.9)',
          }}
        >
          {timeStr}
        </p>
        <p
          className="leading-none mt-[3px]"
          style={{
            fontSize: '9px',
            color: 'rgba(255,255,255,0.38)',
          }}
        >
          {dateStr}
        </p>
      </div>
    </div>
  );
}

export function Nav() {
  const pathname = usePathname();
  const [navOpacity, setNavOpacity] = useState(1);
  const navFrameRef = useRef<number | null>(null);
  const navOpacityRef = useRef(1);

  useEffect(() => {
    function onScroll() {
      if (navFrameRef.current) return;

      navFrameRef.current = requestAnimationFrame(() => {
        navFrameRef.current = null;
        const nextOpacity = Math.max(0, 1 - window.scrollY / 120);
        if (Math.abs(nextOpacity - navOpacityRef.current) < 0.01) return;
        navOpacityRef.current = nextOpacity;
        setNavOpacity(nextOpacity);
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (navFrameRef.current) cancelAnimationFrame(navFrameRef.current);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <nav
      className="aero-taskbar sticky top-0 z-50"
      style={{ opacity: navOpacity, transition: 'opacity 200ms ease', pointerEvents: navOpacity === 0 ? 'none' : 'auto' }}
    >
      {/* Gloss overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.10) 100%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-1.5 sm:px-2 flex items-stretch h-[50px] sm:h-[52px]">
        {/* Start orb */}
        <div className="flex items-center px-1.5 sm:px-2.5 border-r border-white/[0.08] shrink-0">
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200"
            style={{
              background:
                'radial-gradient(circle at 38% 32%, rgba(120,180,255,0.92), rgba(18,72,200,0.88))',
              boxShadow:
                '0 0 14px rgba(60,140,255,0.50), 0 0 5px rgba(80,200,100,0.28), inset 0 1px 0 rgba(255,255,255,0.42), inset 0 -1px 0 rgba(0,0,0,0.45)',
            }}
          >
            {/* Windows pearl icon */}
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <circle cx="6.5" cy="6.5" r="4.5" fill="rgba(255,255,255,0.18)" />
              <path d="M3 6.5h7M6.5 3v7" stroke="rgba(255,255,255,0.75)" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Pinned apps + search */}
        <div className="flex items-stretch flex-1 min-w-0">
          {characters.map((c) => (
            <PinnedApp
              key={c.id}
              href="/"
              label={c.displayName}
              sublabel="Character"
              isActive={pathname === '/' || pathname.startsWith(`/${c.slug}`)}
              accentColor={c.palette.accent}
              bgImage={navImages[c.slug]}
            />
          ))}

          <AeroSongSearch />
        </div>

        {/* System tray */}
        <SystemTray />
      </div>
    </nav>
  );
}
