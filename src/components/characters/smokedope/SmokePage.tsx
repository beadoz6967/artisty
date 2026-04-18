// Smokedope world page — cloud-rap dossier with official artwork chronology.
import Image from 'next/image';
import type { CharacterConfig } from '@/lib/types';

type Props = {
  config: CharacterConfig;
};

const highlights = [
  { label: 'Origin', value: 'Virginia, USA' },
  { label: 'Born', value: '28 May 2001' },
  { label: 'Persona', value: 'No face / high signal' },
  { label: 'Breakout Era', value: 'THE PEAK (2025)' },
];

const featuredTracks = [
  'In Da Party',
  'IM NOT GOD BUT I WISH I WAS',
  'White Owls',
  'Eastbay',
  'My Chalice',
  'banshee',
];

export function SmokePage({ config }: Props) {
  const { palette, meta, lore, discography, displayName, gallery } = config;

  const sortedDiscography = [...(discography ?? [])].sort((a, b) => b.year - a.year);

  return (
    <div
      style={{
        '--color-bg': palette.bg,
        '--color-surface': palette.surface,
        '--color-card': palette.card,
        '--color-accent': palette.accent,
        '--color-text': palette.text,
        '--color-muted': palette.muted,
        '--color-border': palette.border,
      } as React.CSSProperties}
      className="site-shell min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]"
    >
      <section className="relative overflow-hidden min-h-[66vh] sm:min-h-[70vh] px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <Image
          src="/concert warehouse.jpg"
          alt="smokedope2016 live atmosphere"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/65 to-black/90" />

        <div className="relative z-10 mx-auto max-w-6xl pt-24 md:pt-32">
          <p className="mono text-[0.56rem] tracking-[0.3em] uppercase text-[var(--color-muted)]">Archive: cloud rap dossier</p>
          <h1
            style={{ color: palette.accent }}
            className="text-[clamp(2.35rem,12vw,10rem)] leading-[0.84] font-black tracking-tight mt-4"
          >
            {displayName}
          </h1>
          <p className="max-w-2xl text-sm md:text-base text-[var(--color-muted)] mt-5">
            Anonymous, image-controlled, and stylistically nostalgic. A 2020s underground artist using scarcity, mood, and cover-art identity as the main storytelling engine.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {meta.tags.map((tag) => (
              <span
                key={tag}
                className="text-[0.56rem] uppercase tracking-[0.25em] px-3 py-2 border border-white/20 bg-black/35 text-[var(--color-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {highlights.map((item) => (
          <article key={item.label} className="border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="mono text-[0.54rem] uppercase tracking-[0.25em] text-[var(--color-muted)]">{item.label}</p>
            <p className="text-sm mt-2 text-[var(--color-text)]">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-12 grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <p style={{ color: palette.accent }} className="mono text-[0.56rem] uppercase tracking-[0.28em]">Lore markers</p>
          <h2 className="text-2xl sm:text-3xl font-black mt-3">How the persona works</h2>
        </div>

        <div className="lg:col-span-3 space-y-8">
          {lore.slice(0, 4).map((block) => (
            <article key={block.heading} className="border-l border-[var(--color-border)] pl-4">
              <h3 style={{ color: palette.accent }} className="text-[0.65rem] uppercase tracking-[0.22em]">
                {block.heading}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-muted)] mt-2">{block.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-14">
        <p style={{ color: palette.accent }} className="mono text-[0.56rem] uppercase tracking-[0.28em]">Discography timeline</p>
        <h2 className="text-2xl sm:text-3xl font-black mt-3">Official release chronology</h2>

        <div className="mt-8 space-y-4">
          {sortedDiscography.map((entry) => (
            <article
              key={entry.title}
              className="grid grid-cols-[56px_1fr_72px] sm:grid-cols-[70px_1fr_88px] md:grid-cols-[90px_1fr_112px] items-center gap-3 sm:gap-4 border border-[var(--color-border)] bg-[var(--color-surface)] p-3 md:p-4"
            >
              <p className="mono text-xs text-[var(--color-muted)]">{entry.year}</p>
              <div>
                <p className="text-base sm:text-lg leading-tight text-[var(--color-text)]">{entry.title}</p>
                {entry.note && <p className="text-xs text-[var(--color-muted)] mt-1">{entry.note}</p>}
              </div>
              {entry.coverArt ? (
                <div className="relative aspect-square w-[72px] sm:w-[88px] md:w-[112px] overflow-hidden rounded-sm">
                  <Image src={entry.coverArt} alt={`${entry.title} cover`} fill className="object-cover" sizes="112px" />
                </div>
              ) : (
                <div className="aspect-square w-[72px] sm:w-[88px] md:w-[112px] rounded-sm bg-[var(--color-card)]" />
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-14 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="relative overflow-hidden rounded-sm aspect-square border border-[var(--color-border)]">
          <Image
            src="https://cdn-images.dzcdn.net/images/cover/b004c8c39c4f7aef180e34dbe59cde18/640x640-000000-80-0-0.jpg"
            alt="THE PEAK cover"
            fill
            className="object-cover"
          />
        </div>

        <div>
          <p style={{ color: palette.accent }} className="mono text-[0.56rem] uppercase tracking-[0.28em]">Breakout lens</p>
          <h2 className="text-2xl sm:text-3xl font-black mt-3">THE PEAK and aftershock</h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">
            THE PEAK marks the moment his niche became a movement. THE COMEDOWN reframes that high point with more reflective writing and a colder emotional register, while maintaining the same visual identity discipline.
          </p>

          <div className="mt-6 border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="mono text-[0.54rem] uppercase tracking-[0.25em] text-[var(--color-muted)]">Popular tracks pulse</p>
            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-[var(--color-text)]">
              {featuredTracks.map((track) => (
                <li key={track}>{track}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {gallery && gallery.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
          <p style={{ color: palette.accent }} className="mono text-[0.56rem] uppercase tracking-[0.28em]">Visual archive</p>
          <h2 className="text-2xl sm:text-3xl font-black mt-3">Official cover wall</h2>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery
              .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
              .map((item) => (
                <article key={item.title} className="border border-[var(--color-border)] bg-[var(--color-surface)] p-2">
                  <div className="relative aspect-square overflow-hidden rounded-sm">
                    <Image src={item.image} alt={item.title} fill className="object-cover" sizes="240px" />
                  </div>
                  <p className="text-xs mt-2 text-[var(--color-text)] truncate">{item.title}</p>
                  {item.year && <p className="mono text-[0.62rem] text-[var(--color-muted)] mt-1">{item.year}</p>}
                </article>
              ))}
          </div>
        </section>
      )}

      <div className="h-20" />
    </div>
  );
}
