// Universal nav — sticky top bar with image strip per character tab.
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { smokedope } from '@/data/characters/smokedope';
import { daredevil } from '@/data/characters/daredevil';
import type { CharacterConfig } from '@/lib/types';

const characters: CharacterConfig[] = [smokedope, daredevil];

const navImages: Record<string, string> = {
  smokedope2016: '/concert warehouse.jpg',
  daredevil: '/Suit press.webp',
};

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-white/10 bg-black/40">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 flex flex-wrap gap-2.5 sm:gap-3 items-stretch">
        <Link
          href="/"
          className={`group w-full sm:w-auto sm:min-w-[180px] rounded-sm border px-3.5 sm:px-4 py-3 transition-colors ${
            isHome ? 'border-white/35 bg-white/10' : 'border-white/15 bg-white/5 hover:bg-white/10'
          }`}
        >
          <p className="text-[0.58rem] tracking-[0.28em] uppercase text-white/60">Artisty</p>
          <p className="text-sm leading-none mt-2 text-white">Signal / Smoke</p>
        </Link>

        {characters.map((c) => {
          const isActive = pathname.startsWith(`/${c.slug}`);
          const imgUrl = navImages[c.slug];

          return (
            <Link
              key={c.id}
              href={`/${c.slug}`}
              className="group relative w-full sm:min-w-[230px] sm:flex-1 min-h-[86px] sm:min-h-[96px] overflow-hidden rounded-sm border border-white/15"
            >
              <div
                style={{ backgroundImage: `url(${imgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className={`absolute inset-0 transition-colors duration-300 ${
                  isActive ? 'bg-black/42' : 'bg-black/68 group-hover:bg-black/56'
                }`}
              />

              <div className="relative z-10 p-3.5 sm:p-4">
                <p className="text-[0.52rem] tracking-[0.25em] uppercase text-white/60">Character</p>
                <p
                  style={isActive ? { color: c.palette.accent } : undefined}
                  className="text-sm sm:text-base leading-none mt-2 text-white"
                >
                  {c.displayName}
                </p>
              </div>

              <div
                style={{ backgroundColor: c.palette.accent }}
                className={`absolute left-0 right-0 bottom-0 h-[2px] transition-opacity duration-200 ${
                  isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'
                }`}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
