"use client";

// Smokedope world page — cloud-rap dossier with official artwork chronology.
import { useMemo, useState } from 'react';
import Image from 'next/image';
import type { CharacterConfig, DiscographyEntry, Palette } from '@/lib/types';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { LenisProvider } from '@/components/motion/LenisProvider';

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
  timelineYearActive: '#ebf2ff',
  timelineTitle: '#e4e9f2',
  timelineNote: '#c7cfde',
  timelineDockProse: '#d7deeb',
  timelineRailMeta: '#95a7c4',
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

function revealDelaySeconds(index: number, start = 0, step = 70): number {
  return Math.min((start + index * step) / 1000, 0.24);
}

function AlbumSection({ entry, palette, index }: AlbumSectionProps) {
  const sectionDelay = 80 + index * 80;

  return (
    <section className="smoke-content smoke-virtualized mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-14 grid grid-cols-1 md:grid-cols-2 gap-8">
      <ScrollReveal
        className="smoke-frame relative overflow-hidden w-full h-full min-h-[200px] sm:min-h-[320px]"
        delay={revealDelaySeconds(index, sectionDelay, 0)}
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
      </ScrollReveal>

      <ScrollReveal
        className="smoke-panel smoke-glass p-5 sm:p-6 h-full"
        delay={revealDelaySeconds(index, sectionDelay + 80, 0)}
      >
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
      </ScrollReveal>
    </section>
  );
}

export function SmokePage({ config }: Props) {
  const { palette, meta, lore, discography, displayName, gallery, highlights } = config;
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0);

  const sortedDiscography = [...(discography ?? [])].sort((a, b) => b.year - a.year);
  const timelineBuckets = useMemo(() => {
    const yearMap = new Map<number, number[]>();
    sortedDiscography.forEach((entry, idx) => {
      if (!yearMap.has(entry.year)) {
        yearMap.set(entry.year, []);
      }
      yearMap.get(entry.year)?.push(idx);
    });

    return Array.from(yearMap.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([year, indexes]) => ({ year, indexes }));
  }, [sortedDiscography]);

  const safeTimelineIndex =
    sortedDiscography.length > 0
      ? Math.min(activeTimelineIndex, sortedDiscography.length - 1)
      : -1;
  const activeTimelineEntry = safeTimelineIndex >= 0 ? sortedDiscography[safeTimelineIndex] : null;
  const activeTimelineBucket = activeTimelineEntry
    ? timelineBuckets.find((bucket) => bucket.year === activeTimelineEntry.year)
    : null;

  const trilogyAlbums = [...(discography ?? [])]
    .filter((d) => d.tracklist)
    .sort((a, b) => a.year - b.year);

  return (
    <LenisProvider>
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
          <ScrollReveal
            as="article"
            key={item.label}
            className="smoke-panel smoke-glass p-4"
            delay={revealDelaySeconds(idx, 120, 80)}
          >
            <p className="mono text-[0.54rem] uppercase tracking-[0.25em]" style={{ color: SMOKE_COLORS.highlightLabel }}>{item.label}</p>
            <p className="text-sm mt-2" style={{ color: SMOKE_COLORS.highlightValue }}>{item.value}</p>
          </ScrollReveal>
        ))}
      </section>

      <section className="smoke-content smoke-virtualized mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lore.map((block, idx) => (
            <ScrollReveal
              as="article"
              key={block.body.slice(0, 40)}
              className="smoke-panel border-l-2 border-l-[#f04040] p-4 sm:p-5"
              delay={revealDelaySeconds(idx, 280, 75)}
            >
              <p className="text-sm leading-relaxed" style={{ color: SMOKE_COLORS.loreProse }}>{block.body}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="smoke-content smoke-virtualized mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-14">
        <ScrollReveal
          as="p"
          style={{ color: palette.accent }}
          className="mono smoke-kicker text-[0.56rem]"
          delay={revealDelaySeconds(0, 100, 0)}
        >
          Discography timeline
        </ScrollReveal>
        <ScrollReveal
          as="h2"
          className="smoke-heading text-2xl sm:text-3xl font-black mt-3"
          delay={revealDelaySeconds(0, 190, 0)}
        >
          Timeline: official releases
        </ScrollReveal>

        {sortedDiscography.length > 0 && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[188px_1fr] gap-4 sm:gap-6">
            <ScrollReveal
              as="nav"
              className="smoke-panel smoke-glass p-3 sm:p-4"
              delay={revealDelaySeconds(0, 280, 0)}
            >
              <p className="mono text-[0.54rem] uppercase tracking-[0.25em]" style={{ color: SMOKE_COLORS.timelineRailMeta }}>
                Era scrubber
              </p>
              <div className="mt-3 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
                {timelineBuckets.map((bucket) => {
                  const isActiveYear = activeTimelineEntry?.year === bucket.year;
                  const yearAnchorIndex = bucket.indexes[0] ?? 0;

                  return (
                    <button
                      key={bucket.year}
                      type="button"
                      onClick={() => setActiveTimelineIndex(yearAnchorIndex)}
                      className="smoke-panel w-full min-w-[104px] lg:min-w-0 px-3 py-2 text-left transition-colors"
                      style={{
                        borderColor: isActiveYear ? '#7ea0d8' : 'var(--color-border)',
                        background: isActiveYear
                          ? 'linear-gradient(180deg, rgba(64,102,170,0.45), rgba(23,32,52,0.7))'
                          : 'linear-gradient(180deg, rgba(17,28,45,0.65), rgba(42,22,22,0.56))',
                      }}
                    >
                      <p className="mono text-xs" style={{ color: isActiveYear ? SMOKE_COLORS.timelineYearActive : SMOKE_COLORS.timelineYear }}>
                        {bucket.year}
                      </p>
                      <p className="mono text-[0.56rem] mt-1" style={{ color: SMOKE_COLORS.timelineRailMeta }}>
                        {bucket.indexes.length} release{bucket.indexes.length === 1 ? '' : 's'}
                      </p>
                    </button>
                  );
                })}
              </div>
            </ScrollReveal>

            {activeTimelineEntry && (
              <ScrollReveal
                as="article"
                className="smoke-panel smoke-glass p-4 sm:p-5 md:p-6"
                delay={revealDelaySeconds(1, 320, 0)}
              >
                <div className="grid grid-cols-1 md:grid-cols-[1fr_118px] gap-5 items-start">
                  <div>
                    <p className="mono text-xs" style={{ color: SMOKE_COLORS.timelineYearActive }}>{activeTimelineEntry.year}</p>
                    <h3 className="text-xl sm:text-2xl leading-tight mt-2" style={{ color: SMOKE_COLORS.timelineTitle }}>
                      {activeTimelineEntry.title}
                    </h3>
                    {activeTimelineEntry.note && (
                      <p className="text-sm mt-3 leading-relaxed" style={{ color: SMOKE_COLORS.timelineNote }}>
                        {activeTimelineEntry.note}
                      </p>
                    )}
                    {activeTimelineEntry.longDescription && (
                      <p className="text-sm mt-3 leading-relaxed" style={{ color: SMOKE_COLORS.timelineDockProse }}>
                        {activeTimelineEntry.longDescription}
                      </p>
                    )}

                    {activeTimelineBucket && activeTimelineBucket.indexes.length > 1 && (
                      <div className="mt-5">
                        <p className="mono text-[0.54rem] uppercase tracking-[0.25em]" style={{ color: SMOKE_COLORS.timelineRailMeta }}>
                          Release detail dock
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {activeTimelineBucket.indexes.map((entryIndex) => {
                            const entry = sortedDiscography[entryIndex];
                            const isActiveRelease = entryIndex === safeTimelineIndex;

                            return (
                              <button
                                key={`${entry.title}-${entry.year}`}
                                type="button"
                                onClick={() => setActiveTimelineIndex(entryIndex)}
                                className="smoke-chip px-3 py-2 text-[0.56rem] uppercase tracking-[0.16em] transition-colors"
                                style={{
                                  color: isActiveRelease ? SMOKE_COLORS.timelineYearActive : SMOKE_COLORS.timelineNote,
                                  borderColor: isActiveRelease ? '#8da9d9' : 'var(--color-border)',
                                  background: isActiveRelease
                                    ? 'linear-gradient(180deg, rgba(77,112,176,0.42), rgba(29,34,56,0.74))'
                                    : 'linear-gradient(180deg, rgba(26,34,48,0.55), rgba(47,24,24,0.52))',
                                }}
                              >
                                {entry.title}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {activeTimelineEntry.coverArt ? (
                    <div className="smoke-frame relative aspect-square w-[118px] overflow-hidden md:justify-self-end">
                      <Image
                        src={activeTimelineEntry.coverArt}
                        alt={`${activeTimelineEntry.title} cover`}
                        fill
                        className="object-cover"
                        sizes="118px"
                      />
                    </div>
                  ) : (
                    <div className="smoke-frame aspect-square w-[118px] bg-[var(--color-card)] md:justify-self-end" />
                  )}
                </div>
              </ScrollReveal>
            )}
          </div>
        )}
      </section>

      {trilogyAlbums.map((entry, idx) => (
        <AlbumSection key={entry.title} entry={entry} palette={palette} index={idx} />
      ))}

      {gallery && gallery.length > 0 && (
        <section className="smoke-content smoke-virtualized mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-14">
          <ScrollReveal
            as="p"
            style={{ color: palette.accent }}
            className="mono smoke-kicker text-[0.56rem]"
            delay={revealDelaySeconds(0, 100, 0)}
          >
            Projects
          </ScrollReveal>
          <ScrollReveal
            as="h2"
            className="smoke-heading text-2xl sm:text-3xl font-black mt-3"
            delay={revealDelaySeconds(0, 180, 0)}
          >
            Cover archive
          </ScrollReveal>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...gallery]
              .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
              .map((item, idx) => (
                <ScrollReveal
                  as="article"
                  key={item.title}
                  className="smoke-panel p-2 group transition-transform duration-300 ease-out hover:-translate-y-1"
                  delay={revealDelaySeconds(idx, 260, 55)}
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
                </ScrollReveal>
              ))}
          </div>
        </section>
      )}

        <div className="h-20" />
      </div>
    </LenisProvider>
  );
}
