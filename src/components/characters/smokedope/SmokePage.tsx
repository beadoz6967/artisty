// Smokedope world page — cloud-rap dossier with official artwork chronology.
import Image from 'next/image';
import type { CharacterConfig, DiscographyEntry, Palette } from '@/lib/types';

type Props = {
  config: CharacterConfig;
};

// Named constants for recurring off-palette colors used in this design
const SMOKE_COLORS = {
  kicker: '#b6c7e6',
  heroProse: '#d4d9e5',
  highlightLabel: '#a9bbd8',
  highlightValue: '#e3e7f1',
  loreProse: '#d0d6e4',
  timelineYear: '#b4c3dd',
  timelineTitle: '#e4e9f2',
  timelineNote: '#c7cfde',
  tracklistLabel: '#b4c2dc',
  trackNum: '#7a8faa',
  trackTitle: '#e4e9f2',
  galleryTitle: '#e4e9f2',
  galleryYear: '#b4c2dc',
};

type AlbumSectionProps = {
  entry: DiscographyEntry;
  palette: Palette;
  index: number;
};

function revealDelay(index: number, start = 0, step = 70): React.CSSProperties {
  return { '--reveal-delay': `${start + index * step}ms` } as React.CSSProperties;
}

function AlbumSection({ entry, palette, index }: AlbumSectionProps) {
  const sectionDelay = 80 + index * 80;

  return (
    <section className="smoke-content smoke-virtualized mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-14 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div
        className="smoke-frame smoke-reveal relative overflow-hidden w-full h-full min-h-[200px] sm:min-h-[320px]"
        style={{ ...revealDelay(index, sectionDelay, 0) }}
      >
        {entry.coverArt && (
          <Image
            src={entry.coverArt}
            alt={`${entry.title} cover`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        )}
      </div>

      <div className="smoke-panel smoke-glass smoke-reveal p-5 sm:p-6 h-full" style={{ ...revealDelay(index, sectionDelay + 80, 0) }}>
        <p style={{ color: palette.accent }} className="mono smoke-kicker text-[0.56rem]">{entry.year}</p>
        <h2 className="smoke-heading text-2xl sm:text-3xl font-black mt-3">{entry.title}</h2>
        {entry.longDescription && (
          <p className="mt-4 text-sm leading-relaxed" style={{ color: SMOKE_COLORS.loreProse }}>
            {entry.longDescription}
          </p>
        )}

        {entry.tracklist && entry.tracklist.length > 0 && (
          <div className="smoke-panel mt-6 p-4">
            <p className="mono text-[0.54rem] uppercase tracking-[0.25em]" style={{ color: SMOKE_COLORS.tracklistLabel }}>Tracklist</p>
            <ul className="mt-3 space-y-1">
              {entry.tracklist.map((track) => (
                <li key={track.n} className="flex items-baseline gap-3 text-sm" style={{ color: SMOKE_COLORS.trackTitle }}>
                  <span className="mono text-[0.6rem] w-4 shrink-0" style={{ color: SMOKE_COLORS.trackNum }}>{track.n}</span>
                  <span className="flex-1">{track.title}</span>
                  <span className="mono text-[0.6rem] shrink-0" style={{ color: SMOKE_COLORS.trackNum }}>{track.dur}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export function SmokePage({ config }: Props) {
  const { palette, meta, lore, discography, displayName, gallery, highlights } = config;

  const sortedDiscography = [...(discography ?? [])].sort((a, b) => b.year - a.year);
  const trilogyAlbums = sortedDiscography.filter((d) => d.tracklist);

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
      className="site-shell smoke-shell min-h-screen text-[var(--color-text)]"
    >
      <section className="smoke-content relative flex min-h-[60vh] sm:min-h-[calc(100vh-52px)] items-center justify-center overflow-hidden px-4 sm:px-6 py-10 sm:py-16 md:py-20">
        <Image
          src="/concert warehouse.jpg"
          alt="smokedope2016 live atmosphere"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#105090]/35 via-black/68 to-[#f04040]/32" />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-center">
          <div className="smoke-glass smoke-panel w-full max-w-3xl border p-5 sm:p-8 md:p-10">
            <p className="mono smoke-kicker text-[0.56rem] hero-fade-1" style={{ color: SMOKE_COLORS.kicker }}>Signal archive: smokedope2016</p>
            <h1
              style={{ color: palette.accent }}
              className="smoke-heading mt-4 max-w-full break-words [overflow-wrap:anywhere] text-[clamp(2rem,7vw,4.5rem)] leading-[1] font-black tracking-tight hero-rise-2"
            >
              {displayName}
            </h1>
            <p className="max-w-2xl text-sm md:text-base mt-5 hero-fade-3" style={{ color: SMOKE_COLORS.heroProse }}>
              Virginia rapper who quit his welding job in summer 2024 and went full-time. Three albums in two years. Face never shown. The name was his Steam username. The music sounds like 2016 remembered badly.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 hero-fade-4">
              {meta.tags.map((tag) => (
                <span
                  key={tag}
                  className="smoke-chip text-[0.56rem] uppercase tracking-[0.25em] px-3 py-2"
                  style={{ color: SMOKE_COLORS.heroProse }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="smoke-content smoke-virtualized mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {(highlights ?? []).map((item, idx) => (
          <article
            key={item.label}
            className="smoke-panel smoke-glass smoke-reveal-plate p-4"
            style={revealDelay(idx, 120, 80)}
          >
            <p className="mono text-[0.54rem] uppercase tracking-[0.25em]" style={{ color: SMOKE_COLORS.highlightLabel }}>{item.label}</p>
            <p className="text-sm mt-2" style={{ color: SMOKE_COLORS.highlightValue }}>{item.value}</p>
          </article>
        ))}
      </section>

      <section className="smoke-content smoke-virtualized mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-12">
        <p style={{ color: palette.accent, ...revealDelay(0, 110, 0) }} className="mono smoke-kicker smoke-reveal text-[0.56rem]">Persona map</p>
        <h2 className="smoke-heading smoke-reveal text-2xl sm:text-3xl font-black mt-3 mb-8" style={revealDelay(0, 190, 0)}>How the signal is built</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lore.map((block, idx) => (
            <article
              key={block.heading}
              className="smoke-panel smoke-reveal-plate border-l-2 border-l-[#f04040] p-4 sm:p-5"
              style={revealDelay(idx, 280, 75)}
            >
              <h3 style={{ color: palette.accent }} className="mono text-[0.65rem] uppercase tracking-[0.22em]">
                {block.heading}
              </h3>
              <p className="text-sm leading-relaxed mt-2" style={{ color: SMOKE_COLORS.loreProse }}>{block.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="smoke-content smoke-virtualized mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-14">
        <p style={{ color: palette.accent, ...revealDelay(0, 100, 0) }} className="mono smoke-kicker smoke-reveal text-[0.56rem]">Discography timeline</p>
        <h2 className="smoke-heading smoke-reveal text-2xl sm:text-3xl font-black mt-3" style={revealDelay(0, 190, 0)}>Timeline: official releases</h2>

        <div className="mt-8 space-y-4">
          {sortedDiscography.map((entry, idx) => (
            <article
              key={entry.title}
              className="smoke-panel smoke-reveal-plate grid grid-cols-[56px_1fr_72px] sm:grid-cols-[70px_1fr_88px] md:grid-cols-[90px_1fr_112px] items-center gap-3 sm:gap-4 p-3 md:p-4"
              style={revealDelay(idx, 300, 60)}
            >
              <p className="mono text-xs" style={{ color: SMOKE_COLORS.timelineYear }}>{entry.year}</p>
              <div>
                <p className="text-base sm:text-lg leading-tight" style={{ color: SMOKE_COLORS.timelineTitle }}>{entry.title}</p>
                {entry.note && <p className="text-xs mt-1" style={{ color: SMOKE_COLORS.timelineNote }}>{entry.note}</p>}
              </div>
              {entry.coverArt ? (
                <div className="smoke-frame relative aspect-square w-[72px] sm:w-[88px] md:w-[112px] overflow-hidden">
                  <Image
                    src={entry.coverArt}
                    alt={`${entry.title} cover`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 72px, (max-width: 768px) 88px, 112px"
                  />
                </div>
              ) : (
                <div className="smoke-frame aspect-square w-[72px] sm:w-[88px] md:w-[112px] bg-[var(--color-card)]" />
              )}
            </article>
          ))}
        </div>
      </section>

      {trilogyAlbums.map((entry, idx) => (
        <AlbumSection key={entry.title} entry={entry} palette={palette} index={idx} />
      ))}

      {gallery && gallery.length > 0 && (
        <section className="smoke-content smoke-virtualized mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-14">
          <p style={{ color: palette.accent, ...revealDelay(0, 100, 0) }} className="mono smoke-kicker smoke-reveal text-[0.56rem]">Projects</p>
          <h2 className="smoke-heading smoke-reveal text-2xl sm:text-3xl font-black mt-3" style={revealDelay(0, 180, 0)}>Cover archive</h2>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...gallery]
              .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
              .map((item, idx) => (
                <article
                  key={item.title}
                  className="smoke-panel smoke-reveal-plate p-2 group transition-transform duration-300 ease-out hover:-translate-y-1"
                  style={revealDelay(idx, 260, 55)}
                >
                  <div className="smoke-frame relative aspect-square overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 240px"
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ background: 'linear-gradient(135deg, rgba(240,64,64,0.18), rgba(16,80,144,0.22))' }}
                    />
                  </div>
                  <p className="text-xs mt-2 truncate transition-colors duration-200 group-hover:text-white" style={{ color: SMOKE_COLORS.galleryTitle }}>{item.title}</p>
                  {item.year && <p className="mono text-[0.62rem] mt-1" style={{ color: SMOKE_COLORS.galleryYear }}>{item.year}</p>}
                </article>
              ))}
          </div>
        </section>
      )}

      <div className="h-20" />
    </div>
  );
}
