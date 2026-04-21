// Smokedope world page — cloud-rap dossier with official artwork chronology.
import Image from 'next/image';
import type { CharacterConfig } from '@/lib/types';
import SongSearch from './SongSearch';

type Props = {
  config: CharacterConfig;
};

const highlights = [
  { label: 'Origin', value: 'Virginia, USA' },
  { label: 'Born', value: '28 May 2001' },
  { label: 'Persona', value: 'Masked / image-controlled' },
  { label: 'Trilogy Arc', value: 'COMEUP → PEAK → COMEDOWN' },
];

const comeupTracks = [
  { n: 1, title: 'Drank', dur: '2:00' },
  { n: 2, title: 'White Owls', dur: '3:18' },
  { n: 3, title: 'Glock', dur: '3:26' },
  { n: 4, title: 'Merch', dur: '2:38' },
  { n: 5, title: 'No Water', dur: '2:07' },
  { n: 6, title: 'Frat', dur: '3:21' },
  { n: 7, title: 'Foamposite Interlude', dur: '3:22' },
  { n: 8, title: 'My Style', dur: '3:48' },
  { n: 9, title: 'Ball Out', dur: '2:50' },
  { n: 10, title: 'Khalifa', dur: '3:00' },
  { n: 11, title: 'High', dur: '2:53' },
  { n: 12, title: 'Mall', dur: '2:38' },
  { n: 13, title: 'Too Gone', dur: '3:32' },
];

const peakTracks = [
  { n: 1, title: 'Back2Back', dur: '2:41' },
  { n: 2, title: 'Icey Soles', dur: '3:18' },
  { n: 3, title: 'Taipei / Waterbed', dur: '3:15' },
  { n: 4, title: 'Elite Socks', dur: '3:09' },
  { n: 5, title: 'Goyard', dur: '3:03' },
  { n: 6, title: 'Dope Love', dur: '3:08' },
  { n: 7, title: 'Draft Night', dur: '2:20' },
  { n: 8, title: 'Gnarly', dur: '3:28' },
  { n: 9, title: 'Trust', dur: '2:36' },
  { n: 10, title: 'In Da Party', dur: '2:21' },
  { n: 11, title: 'Hypebeast', dur: '1:50' },
  { n: 12, title: 'Eastbay', dur: '2:34' },
  { n: 13, title: 'Off Tha Cid', dur: '2:17' },
];

const comedownTracks = [
  { n: 1, title: 'Banshee', dur: '2:59' },
  { n: 2, title: 'My Chalice', dur: '3:12' },
  { n: 3, title: "Wild 'N Out", dur: '1:53' },
  { n: 4, title: 'Smoking Kills', dur: '2:24' },
  { n: 5, title: 'Flocc', dur: '2:45' },
  { n: 6, title: 'How I Bled', dur: '2:31' },
  { n: 7, title: 'Forgiato', dur: '2:36' },
  { n: 8, title: 'Be My Zombie', dur: '4:09' },
  { n: 9, title: 'Ozweego', dur: '2:12' },
  { n: 10, title: 'Famous', dur: '1:48' },
  { n: 11, title: 'Lips Sealed', dur: '3:02' },
  { n: 12, title: 'Lay My Body Down', dur: '3:17' },
  { n: 13, title: 'Closing Time', dur: '2:40' },
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
      className="site-shell smoke-shell min-h-screen text-[var(--color-text)]"
    >
      <section className="smoke-content relative flex min-h-[60vh] sm:min-h-[calc(100vh-52px)] items-center justify-center overflow-hidden px-4 sm:px-6 py-10 sm:py-16 md:py-20">
        <Image
          src="/concert warehouse.jpg"
          alt="smokedope2016 live atmosphere"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#105090]/35 via-black/68 to-[#f04040]/32" />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-center">
          <div className="smoke-glass smoke-panel w-full max-w-3xl border p-5 sm:p-8 md:p-10">
            <p className="mono smoke-kicker text-[0.56rem] text-[#b6c7e6] hero-fade-1">Signal archive: smokedope2016</p>
            <h1
              style={{ color: palette.accent }}
              className="smoke-heading mt-4 max-w-full break-words [overflow-wrap:anywhere] text-[clamp(2rem,7vw,4.5rem)] leading-[1] font-black tracking-tight hero-rise-2"
            >
              {displayName}
            </h1>
            <p className="max-w-2xl text-sm md:text-base text-[#d4d9e5] mt-5 hero-fade-3">
              Virginia rapper who quit his welding job in summer 2024 and went full-time. Three albums in two years. Face never shown. The name was his Steam username. The music sounds like 2016 remembered badly.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 hero-fade-4">
              {meta.tags.map((tag) => (
                <span
                  key={tag}
                  className="smoke-chip text-[0.56rem] uppercase tracking-[0.25em] px-3 py-2 text-[#d6dded]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="smoke-content mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-14 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {highlights.map((item) => (
          <article key={item.label} className="smoke-panel smoke-glass p-4">
            <p className="mono text-[0.54rem] uppercase tracking-[0.25em] text-[#a9bbd8]">{item.label}</p>
            <p className="text-sm mt-2 text-[#e3e7f1]">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="smoke-content mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-12">
        <p style={{ color: palette.accent }} className="mono smoke-kicker text-[0.56rem]">Persona map</p>
        <h2 className="smoke-heading text-2xl sm:text-3xl font-black mt-3 mb-8">How the signal is built</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lore.map((block) => (
            <article key={block.heading} className="smoke-panel border-l-2 border-l-[#f04040] p-4 sm:p-5">
              <h3 style={{ color: palette.accent }} className="mono text-[0.65rem] uppercase tracking-[0.22em]">
                {block.heading}
              </h3>
              <p className="text-sm leading-relaxed text-[#d0d6e4] mt-2">{block.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="smoke-content mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-14">
        <p style={{ color: palette.accent }} className="mono smoke-kicker text-[0.56rem]">Song vault</p>
        <h2 className="smoke-heading text-2xl sm:text-3xl font-black mt-3">Search the full catalog</h2>
        <div className="smoke-panel smoke-glass mt-6 max-w-lg p-4">
          <SongSearch
            accent={palette.accent}
            border={palette.border}
            surface={palette.surface}
            text={palette.text}
            muted={palette.muted}
          />
        </div>
      </section>

      <section className="smoke-content mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-14">
        <p style={{ color: palette.accent }} className="mono smoke-kicker text-[0.56rem]">Discography timeline</p>
        <h2 className="smoke-heading text-2xl sm:text-3xl font-black mt-3">Timeline: official releases</h2>

        <div className="mt-8 space-y-4">
          {sortedDiscography.map((entry) => (
            <article
              key={entry.title}
              className="smoke-panel grid grid-cols-[56px_1fr_72px] sm:grid-cols-[70px_1fr_88px] md:grid-cols-[90px_1fr_112px] items-center gap-3 sm:gap-4 p-3 md:p-4"
            >
              <p className="mono text-xs text-[#b4c3dd]">{entry.year}</p>
              <div>
                <p className="text-base sm:text-lg leading-tight text-[#e4e9f2]">{entry.title}</p>
                {entry.note && <p className="text-xs text-[#c7cfde] mt-1">{entry.note}</p>}
              </div>
              {entry.coverArt ? (
                <div className="smoke-frame relative aspect-square w-[72px] sm:w-[88px] md:w-[112px] overflow-hidden">
                  <Image src={entry.coverArt} alt={`${entry.title} cover`} fill className="object-cover" sizes="112px" />
                </div>
              ) : (
                <div className="smoke-frame aspect-square w-[72px] sm:w-[88px] md:w-[112px] bg-[var(--color-card)]" />
              )}
            </article>
          ))}
        </div>
      </section>

      {/* THE COMEUP */}
      <section className="smoke-content mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-14 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="smoke-frame relative overflow-hidden w-full h-full min-h-[200px] sm:min-h-[320px]">
          <Image
            src="https://cdn-images.dzcdn.net/images/cover/23fa0725c20a28ef2dfdf6d173792099/640x640-000000-80-0-0.jpg"
            alt="THE COMEUP cover"
            fill
            className="object-cover"
          />
        </div>

        <div className="smoke-panel smoke-glass p-5 sm:p-6 h-full">
          <p style={{ color: palette.accent }} className="mono smoke-kicker text-[0.56rem]">2024</p>
          <h2 className="smoke-heading text-2xl sm:text-3xl font-black mt-3">THE COMEUP</h2>
          <p className="mt-4 text-sm leading-relaxed text-[#d2d8e6]">
            The first chapter, out May 2024. Thirteen tracks built around a late-night nostalgic haze that becomes the trilogy's signature. Quieter and more restrained than what follows — closer to a mood being established than a statement being made.
          </p>

          <div className="smoke-panel mt-6 p-4">
            <p className="mono text-[0.54rem] uppercase tracking-[0.25em] text-[#b4c2dc]">Tracklist</p>
            <ul className="mt-3 space-y-1">
              {comeupTracks.map((track) => (
                <li key={track.n} className="flex items-baseline gap-3 text-sm text-[#e4e9f2]">
                  <span className="mono text-[0.6rem] text-[#7a8faa] w-4 shrink-0">{track.n}</span>
                  <span className="flex-1">{track.title}</span>
                  <span className="mono text-[0.6rem] text-[#7a8faa] shrink-0">{track.dur}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* THE PEAK */}
      <section className="smoke-content mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-14 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="smoke-frame relative overflow-hidden w-full h-full min-h-[200px] sm:min-h-[320px]">
          <Image
            src="https://cdn-images.dzcdn.net/images/cover/b004c8c39c4f7aef180e34dbe59cde18/640x640-000000-80-0-0.jpg"
            alt="THE PEAK cover"
            fill
            className="object-cover"
          />
        </div>

        <div className="smoke-panel smoke-glass p-5 sm:p-6 h-full">
          <p style={{ color: palette.accent }} className="mono smoke-kicker text-[0.56rem]">2025</p>
          <h2 className="smoke-heading text-2xl sm:text-3xl font-black mt-3">THE PEAK</h2>
          <p className="mt-4 text-sm leading-relaxed text-[#d2d8e6]">
            Released January 2025, debuted at number nine on the Spotify US album chart. Produced mainly by Lil Fittedcap and Bartesian Water, the sound gets sharper without losing the woozy atmosphere. This is the record that pushed him past a million monthly listeners.
          </p>

          <div className="smoke-panel mt-6 p-4">
            <p className="mono text-[0.54rem] uppercase tracking-[0.25em] text-[#b4c2dc]">Tracklist</p>
            <ul className="mt-3 space-y-1">
              {peakTracks.map((track) => (
                <li key={track.n} className="flex items-baseline gap-3 text-sm text-[#e4e9f2]">
                  <span className="mono text-[0.6rem] text-[#7a8faa] w-4 shrink-0">{track.n}</span>
                  <span className="flex-1">{track.title}</span>
                  <span className="mono text-[0.6rem] text-[#7a8faa] shrink-0">{track.dur}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* THE COMEDOWN */}
      <section className="smoke-content mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-14 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="smoke-frame relative overflow-hidden w-full h-full min-h-[200px] sm:min-h-[320px]">
          <Image
            src="https://cdn-images.dzcdn.net/images/cover/1250897f68ebecf3f2d292b8cdc0438a/640x640-000000-80-0-0.jpg"
            alt="THE COMEDOWN cover"
            fill
            className="object-cover"
          />
        </div>

        <div className="smoke-panel smoke-glass p-5 sm:p-6 h-full">
          <p style={{ color: palette.accent }} className="mono smoke-kicker text-[0.56rem]">2026</p>
          <h2 className="smoke-heading text-2xl sm:text-3xl font-black mt-3">THE COMEDOWN</h2>
          <p className="mt-4 text-sm leading-relaxed text-[#d2d8e6]">
            His seventh album and the trilogy closer. The house-leaning production is gone — what's left is slower, darker, and more self-aware. Songs about what comes after the high, not the high itself.
          </p>

          <div className="smoke-panel mt-6 p-4">
            <p className="mono text-[0.54rem] uppercase tracking-[0.25em] text-[#b4c2dc]">Tracklist</p>
            <ul className="mt-3 space-y-1">
              {comedownTracks.map((track) => (
                <li key={track.n} className="flex items-baseline gap-3 text-sm text-[#e4e9f2]">
                  <span className="mono text-[0.6rem] text-[#7a8faa] w-4 shrink-0">{track.n}</span>
                  <span className="flex-1">{track.title}</span>
                  <span className="mono text-[0.6rem] text-[#7a8faa] shrink-0">{track.dur}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {gallery && gallery.length > 0 && (
        <section className="smoke-content mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-14">
          <p style={{ color: palette.accent }} className="mono smoke-kicker text-[0.56rem]">Projects</p>
          <h2 className="smoke-heading text-2xl sm:text-3xl font-black mt-3">Cover archive</h2>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery
              .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
              .map((item) => (
                <article
                  key={item.title}
                  className="smoke-panel p-2 group transition-transform duration-300 ease-out hover:-translate-y-1"
                  style={{ willChange: 'transform' }}
                >
                  <div className="smoke-frame relative aspect-square overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                      style={{ willChange: 'transform' }}
                      sizes="240px"
                    />
                    {/* Colour wash on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ background: 'linear-gradient(135deg, rgba(240,64,64,0.18), rgba(16,80,144,0.22))' }} />
                  </div>
                  <p className="text-xs mt-2 text-[#e4e9f2] truncate transition-colors duration-200 group-hover:text-white">{item.title}</p>
                  {item.year && <p className="mono text-[0.62rem] text-[#b4c2dc] mt-1">{item.year}</p>}
                </article>
              ))}
          </div>
        </section>
      )}

      <div className="h-20" />
    </div>
  );
}
