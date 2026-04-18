// Full Daredevil page — Frank Miller noir. Case file, confession booth. Red used like blood.
import Image from 'next/image';
import type { CharacterConfig } from '@/lib/types';
import { AppearancesGallery } from './AppearancesGallery';

type Props = {
  config: CharacterConfig;
};

export function DaredevilPage({ config }: Props) {
  const { palette, meta, lore, arcs, gallery } = config;
  const leadBlock = lore[3];
  const originBlocks = lore.slice(0, 3);
  const rogueBlocks = lore.slice(4);

  const dossier = [
    { label: 'Debut', value: 'Daredevil #1 (1964)' },
    { label: 'Identity', value: 'Matt Murdock, attorney-at-law' },
    { label: 'Core arena', value: "Hell's Kitchen, Manhattan" },
    { label: 'Primary conflict', value: 'Law vs vigilantism' },
  ];

  const rogueImages = [
    'https://upload.wikimedia.org/wikipedia/en/4/42/Kingpin_%28comics%29.jpg',
    'https://upload.wikimedia.org/wikipedia/en/3/3b/Bullseye_%28comics%29.jpg',
  ];

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
        <Image src="/Suit press.webp" alt="Daredevil hero" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/64 to-black/90" />

        <div className="relative z-10 mx-auto max-w-6xl pt-24 md:pt-32">
          <p className="mono text-[0.56rem] tracking-[0.3em] uppercase text-[var(--color-muted)]">Case file: Hell's Kitchen</p>
          <h1 className="text-[clamp(2.35rem,10vw,7.5rem)] leading-[0.82] font-black mt-3">
            Matt Murdock
            <span style={{ color: palette.accent }} className="block">Daredevil</span>
          </h1>
          <p className="max-w-2xl text-sm md:text-base text-[var(--color-muted)] mt-5">{leadBlock?.body}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dossier.map((item) => (
          <article key={item.label} className="border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="mono text-[0.54rem] uppercase tracking-[0.25em] text-[var(--color-muted)]">{item.label}</p>
            <p className="text-sm mt-2 text-[var(--color-text)]">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-12 grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <p style={{ color: palette.accent }} className="mono text-[0.56rem] uppercase tracking-[0.28em]">Origin chain</p>
          <h2 className="text-2xl sm:text-3xl font-black mt-3">The making of Matt Murdock</h2>
          <p className="mt-4 text-sm text-[var(--color-muted)]">{meta.origin}</p>
        </div>

        <div className="lg:col-span-3 space-y-8">
          {originBlocks.map((block, i) => (
            <article key={block.heading} className="border-l border-[var(--color-border)] pl-4">
              <p style={{ color: palette.accent }} className="mono text-[0.56rem] uppercase tracking-[0.24em]">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="text-base mt-1 text-[var(--color-text)]">{block.heading}</h3>
              <p className="text-sm leading-relaxed text-[var(--color-muted)] mt-2">{block.body}</p>
            </article>
          ))}
        </div>
      </section>

      {arcs && arcs.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
          <p style={{ color: palette.accent }} className="mono text-[0.56rem] uppercase tracking-[0.28em]">Story timeline</p>
          <h2 className="text-2xl sm:text-3xl font-black mt-3">Key arcs and adaptations</h2>

          <div className="mt-8 space-y-4">
            {arcs.map((arc) => (
              <article
                key={arc.title}
                className="grid grid-cols-[56px_1fr_72px] sm:grid-cols-[70px_1fr_88px] md:grid-cols-[90px_1fr_112px] items-center gap-3 sm:gap-4 border border-[var(--color-border)] bg-[var(--color-surface)] p-3 md:p-4"
              >
                <p className="mono text-xs text-[var(--color-muted)]">{arc.year}</p>
                <div>
                  <p className="text-sm sm:text-base text-[var(--color-text)]">{arc.title}</p>
                  {arc.note && <p className="text-xs mt-1 text-[var(--color-muted)]">{arc.note}</p>}
                </div>
                {arc.image ? (
                  <div className="relative aspect-square w-[72px] sm:w-[88px] md:w-[112px] overflow-hidden rounded-sm">
                    <Image src={arc.image} alt={arc.title} fill className="object-cover" sizes="112px" />
                  </div>
                ) : (
                  <div className="aspect-square w-[72px] sm:w-[88px] md:w-[112px] rounded-sm bg-[var(--color-card)]" />
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {rogueBlocks.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
          <p style={{ color: palette.accent }} className="mono text-[0.56rem] uppercase tracking-[0.28em]">Adversaries</p>
          <h2 className="text-2xl sm:text-3xl font-black mt-3">Kingpin and Bullseye pressure points</h2>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {rogueBlocks.map((block, idx) => (
              <article key={block.heading} className="border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
                <div className="relative h-52 sm:h-64">
                  <Image src={rogueImages[idx]} alt={block.heading} fill className="object-cover" sizes="50vw" />
                </div>
                <div className="p-4">
                  <h3 style={{ color: palette.accent }} className="mono text-[0.6rem] uppercase tracking-[0.25em]">{block.heading}</h3>
                  <p className="text-sm leading-relaxed text-[var(--color-muted)] mt-2">{block.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <p style={{ color: palette.accent }} className="mono text-[0.56rem] uppercase tracking-[0.28em]">Media canon</p>
        <h2 className="text-2xl sm:text-3xl font-black mt-3">Comics, TV, film appearances</h2>
        <div className="mt-8 border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <AppearancesGallery
            accentColor={palette.accent}
            surfaceColor={palette.surface}
            mutedColor={palette.muted}
            borderColor={palette.border}
          />
        </div>
      </section>

      {gallery && gallery.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
          <p style={{ color: palette.accent }} className="mono text-[0.56rem] uppercase tracking-[0.28em]">Visual archive</p>
          <h2 className="text-2xl sm:text-3xl font-black mt-3">Official covers and posters</h2>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((item) => (
              <article key={item.title} className="border border-[var(--color-border)] bg-[var(--color-surface)] p-2">
                <div className="relative aspect-square overflow-hidden rounded-sm">
                  <Image src={item.image} alt={item.title} fill className="object-cover" sizes="240px" />
                </div>
                <p className="text-xs mt-2 text-[var(--color-text)] truncate">{item.title}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="h-20" />
    </div>
  );
}
