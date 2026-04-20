# smokedope2016 Research Artifact

Date: 2026-04-20
Scope: Phase 1 research foundation for smokedope2016 content and visual refactor.
Project constraint: Preserve existing Spotify API behavior, image assets, route behavior, Vercel setup, git setup, and backend architecture.

## Source Tiers and Reliability

| Tier | Source Type | Examples | Reliability Use |
|---|---|---|---|
| Tier 1 | Official platform metadata | Spotify artist page | Use for release chronology, platform-level stats, social links, and active ecosystem signals. |
| Tier 2 | Primary interview metadata | Masked Gorilla podcast episode page | Use for interview topic framing and public self-presentation themes. |
| Tier 3 | Editorial coverage | Lyrical Lemonade interview post, Eli Enis coverage | Use for scene framing and audience-language cues, marked as interpretive. |
| Tier 4 | Community-edited profiles | Genius artist page, Last.fm wiki | Use carefully for descriptors only, never as sole source for hard claims. |

## Direct Source Notes (Date-Stamped)

### Spotify (Tier 1)
- Source: https://open.spotify.com/artist/3hGJ4nHdF99Vs0gQdXz5Nw
- Snapshot date: 2026-04-20
- Notes:
  - Shows major trilogy arc in release history: THE COMEUP (2024), THE PEAK (2025), THE COMEDOWN (2026).
  - Shows deeper catalog context including XTC (2022), 2016 (2023), SMOKESHOP 2 (2023), BANDO (2023).
  - Shows monthly listeners and follower count snapshot on page.
  - Shows official artist social links (Instagram and X) and active tour listings.

### Genius (Tier 4)
- Source: https://genius.com/artists/Smokedope2016
- Snapshot date: 2026-04-20
- Notes:
  - Artist description is community-contributed (not primary-source verified).
  - Repeated descriptors include dreamy and nostalgic vibe, limited public personal disclosure, and face-blurring visual behavior.
  - Use as secondary descriptor input only.

### Masked Gorilla (Tier 2)
- Source: https://themaskedgorilla.libsyn.com/smokedope2016-interview-masked-gorilla-podcast
- Snapshot date: 2026-04-20
- Notes:
  - Episode metadata: Feb 7, 2025, episode 62.
  - Description explicitly frames discussion topics as hidden identity, life before music, underground rap scene, and new music.
  - Strong source for persona framing language, but not a full biography source.

### Editorial Coverage (Tier 3)
- Source: https://blog.lyricallemonade.com/p/smokedope2016-interview/
- Snapshot date: 2026-04-20
- Notes:
  - Dated Oct 2, 2025.
  - Frames interview talking points: tour life, trilogy of albums, new music, and growing up in Virginia.

- Source: https://www.elienis.com/chasing-fridays-balmora-smokedope2016-quiet-light-interview/
- Snapshot date: 2026-04-20
- Notes:
  - Editorial criticism framing includes masked persona language, trilogy framing, and zoomer audience interpretation.
  - Treat as interpretation, not hard fact.

### Last.fm Wiki (Tier 4, Explicitly Non-Authoritative)
- Source: https://www.last.fm/music/smokedope2016/+wiki
- Snapshot date: 2026-04-20
- Notes:
  - Page explicitly states artist descriptions are editable by everyone.
  - Contains unverified and exaggerated statements.
  - Use only for soft, cross-checkable descriptors, never as a primary fact source.

## Verified Facts (Safe to Use in Site Copy)

1. Artist profile is active on Spotify under smokedope2016 with a broad release catalog and current popularity signals.
2. Trilogy release structure is present in platform metadata:
   - THE COMEUP (2024)
   - THE PEAK (2025)
   - THE COMEDOWN (2026)
3. Back-catalog anchors include XTC (2022) and 2016 (2023).
4. Public interview metadata (Masked Gorilla, Feb 2025) confirms hidden identity is part of public discussion.
5. Lyrical Lemonade interview metadata reinforces themes of trilogy narrative, tour life, and Virginia background.

## Likely Descriptors (Use with Attribution Tone)

These descriptors are supported by repeated references but should be written as scene language, not courtroom facts.

1. Masked or obscured identity as a deliberate image choice.
2. Dreamy, nostalgic, haze-forward mood language attached to the music.
3. Cloud rap and emo-rap adjacency in listener and editorial framing.
4. Strong youth/internet-native audience resonance around 2010s nostalgia.
5. Underground-to-broader-visibility arc without mainstream polish.

## Avoid or Uncertain Claims (Do Not Present as Facts)

1. Money, net worth, or luxury-status claims from community pages.
2. Medical or substance-condition claims inferred from lyrics or commentary.
3. Detailed personal backstory not confirmed by a high-reliability source.
4. Relationship details, private conflict narratives, or mental-health diagnoses.
5. Claims about exact collaborators, aliases, or origin stories unless cross-verified by high-reliability sources.
6. Any Last.fm wiki-only statement that is not independently corroborated.

## Visual Mood Board

### Persona-anchored keywords
- masked
- blurred
- signal bleed
- low-light flash
- party-night residue
- internet afterimage
- decline-after-peak

### Era and web-language keywords
- 2016LYFE
- post-SoundCloud nostalgia
- Windows XP glass
- Windows 7 Aero chrome
- skeuomorphic controls
- glossy gradients
- hard borders
- inner-shadow depth
- CRT grain
- scanline shimmer

### Mandatory skeuomorphic treatment cues
- Aero glass surfaces with backdrop blur layers.
- Glossy top-to-bottom gradients for panels and controls.
- Sharp hard-edged borders over soft cards.
- Inner shadows and highlight rims to create tactile depth.
- Deliberately raw and chaotic early-internet energy over clean minimal composition.

### Color direction requirements
- Sampled saturated color set from THE COMEUP cover (source-derived):
  - #806040
  - #705030
  - #604030
  - #604020
- Sampled saturated color set from THE PEAK cover (source-derived):
  - #104080
  - #104070
  - #105090
  - #205080
- Sampled saturated color set from THE COMEDOWN cover (source-derived):
  - #F04040
  - #F06050
  - #F05040
  - #E03030
- Use these as high-energy anchor colors, then build supporting dark tones around them.
- Maintain high contrast against dark backdrops.
- Prefer charged neon and toxic tones over muted editorial palettes.
- Reject flat SaaS-style color treatment for smokedope surfaces.

## Copywriting Voice Rules (Hybrid Mode)

1. Factual first sentence, atmospheric second sentence.
2. Keep line-level phrasing compact and coded, not corporate.
3. Write from observer/archive perspective, not parasocial insider voice.
4. Avoid overexplaining genre history in long academic blocks.
5. Use trilogy language as structural backbone for section narratives.
6. Preserve mystery: suggest, do not over-claim.
7. Do not quote lyrics unless formally licensed and explicitly requested.
8. Favor concrete nouns (cover, signal, blur, sequence, cut, era) over generic hype words.

## Strict Content Safety Rules (Blocking)

1. No lyric copying.
2. No invented biography claims.
3. No unverifiable personal details.
4. No medical or legal claims without authoritative public sourcing.
5. No fabricated interview quotes.
6. No speculation presented as certainty.

## Phase 2 Writing Guardrails Derived from Research

1. Keep existing data keys and component contracts unchanged.
2. Update prose tone only, not logic paths.
3. For song descriptions in spotify.ts:
   - Keep function signatures unchanged.
   - Keep cache behavior unchanged.
   - Bump SONG_DESCRIPTION_VERSION when wording system changes.
4. Any new claim introduced in UI copy must map to Tier 1 to Tier 3 evidence.

## Citation Index

1. Spotify artist page: https://open.spotify.com/artist/3hGJ4nHdF99Vs0gQdXz5Nw
2. Genius artist page: https://genius.com/artists/Smokedope2016
3. Masked Gorilla episode page: https://themaskedgorilla.libsyn.com/smokedope2016-interview-masked-gorilla-podcast
4. Lyrical Lemonade interview post: https://blog.lyricallemonade.com/p/smokedope2016-interview/
5. Eli Enis editorial post: https://www.elienis.com/chasing-fridays-balmora-smokedope2016-quiet-light-interview/
6. Last.fm overview page: https://www.last.fm/music/smokedope2016
7. Last.fm wiki page (community-edited): https://www.last.fm/music/smokedope2016/+wiki
