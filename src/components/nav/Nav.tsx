// Universal nav — Windows 7 Aero Taskbar reconstruction.
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { smokedope } from '@/data/characters/smokedope';
import type { CharacterConfig } from '@/lib/types';

const characters: CharacterConfig[] = [smokedope];

const navImages: Record<string, string> = {
  smokedope2016: '/concert warehouse.jpg',
};

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

  function onMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setGlow({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  const glowColor = accentColor ?? 'rgba(255,200,80,0.9)';

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setGlow(null)}
      className="aero-pinned-app relative flex flex-col justify-center px-2 sm:px-4 py-2 min-w-[80px] sm:min-w-[120px] h-full overflow-hidden select-none"
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
          className="uppercase tracking-[0.24em]"
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
          className="mt-[5px] text-[13px] leading-none"
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
      <div className="absolute right-0 top-[18%] bottom-[18%] w-px bg-white/[0.08]" />
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

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setNavOpacity(Math.max(0, 1 - y / 120));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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

      <div className="relative z-10 mx-auto max-w-7xl px-2 flex items-stretch h-[52px]">
        {/* Start orb */}
        <div className="flex items-center px-2.5 border-r border-white/[0.08] shrink-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200"
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

        {/* Pinned apps */}
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
        </div>

        {/* System tray */}
        <SystemTray />
      </div>
    </nav>
  );
}
