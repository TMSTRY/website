# TMSTRY Artist Website — Session Context

## Project Info

| | |
|---|---|
| **Naam** | TMSTRY Artist Website |
| **Live URL** | https://tmstry.com |
| **GitHub repo** | https://github.com/TMSTRY/website |
| **Lokale repo** | `/Users/timmostrey/tmstry-com` |
| **Vercel project** | `tmstry` — auto-deploy bij elke push naar `main` |
| **CMS** | Sanity — studio bereikbaar via `https://tmstry.com/studio` |

---

## Werkregels (altijd respecteren)

- **Nooit lokaal draaien.** Geen `npm run dev`, geen lokale preview servers.
- **Altijd pushen naar GitHub.** `git add` → `git commit` → `git push origin main`
- **Testen via https://tmstry.com** na elke push (Vercel deployt automatisch, duurt ~1 min).
- **Geen tokens of API keys hardcoden** in de code. Gebruik Vercel environment variables.
- Styled-components is als directe dependency toegevoegd (package.json) om een Sanity build-fout op te lossen.


## Stand en werken in de cloud (27/10/2026)

- Deze CONTEXT.md is de bron voor elke sessie, ook in de cloud (claude.ai/code): lees ze eerst.
- Alles wat nodig is staat in de repo; geheimen (Sanity-token, ANTHROPIC_API_KEY, ...) enkel in Vercel.
- De nieuwe site in opbouw is een apart project: repo TMSTRY/tmstry-lab, live op labo.tmstry.com en
  lab.tmstry.com (eigen CONTEXT.md daar). Ze moet later tmstry.com vervangen; deze site blijft tot
  dan het vangnet.
- Tim antwoorden in het Nederlands, kort en in gewone taal; geen em-dashes in tekst of UI.

---

## Tech Stack

| Laag | Technologie |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS + CSS custom properties |
| Animaties | Framer Motion |
| Language | TypeScript |
| CMS | Sanity v3 (next-sanity) |
| Font | Inter (via Google Fonts, variabele `--font-display`) |
| Deploy | Vercel (auto via GitHub push naar `main`) |

---

## Mapstructuur

```
tmstry-com/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── revalidate/route.ts     — Sanity webhook: revalidate pagina na CMS-update
│   │   │   └── youtube/route.ts        — Fetch laatste YouTube-video's via RSS, filtert Shorts
│   │   ├── studio/[[...tool]]/page.tsx — Sanity Studio embedded in de site (/studio)
│   │   ├── globals.css                 — CSS custom properties, glitch-animaties, cursor, thema
│   │   ├── layout.tsx                  — Root layout: metadata, OG tags, ThemeProvider, favicon
│   │   └── page.tsx                    — Hoofdpagina: volgorde van alle secties
│   │
│   ├── components/
│   │   ├── ClientCursor.tsx            — Wrapper: laadt CustomCursor client-side (no SSR)
│   │   ├── CustomCursor.tsx            — Custom cursor: blauw dot + ring die interactieve elementen vergroot
│   │   ├── FadeInSection.tsx           — Scroll-triggered fade-in wrapper (up/left/right/none)
│   │   ├── HeroSection.tsx             — Hero: foto achtergrond, TMSTRY glitch-titel, parallax, particles
│   │   ├── Nav.tsx                     — Sticky nav: links naar secties, ThemeToggle, mobiel hamburger menu
│   │   ├── MusicSection.tsx            — Spotify embed + DSP links + top tracks lijst
│   │   ├── VideoSection.tsx            — YouTube: latest video featured + grid van 3, inline modal player
│   │   ├── AboutSection.tsx            — Bio + 8 klikbare hoofdstukken (modals), parallax achtergrondtekst
│   │   ├── PressSection.tsx            — Coverflow fotocarousel + lightbox (5 foto's)
│   │   ├── NewsSection.tsx             — Server component: haalt posts op uit Sanity
│   │   ├── NewsList.tsx                — Client component: toont posts als lijst + modal per post
│   │   ├── SocialSection.tsx           — Grid van 6 sociale platformen + contact e-mail
│   │   ├── Footer.tsx                  — Logo, tagline, copyright, Privacy/Terms/Press links
│   │   ├── ParticleField.tsx           — Canvas: zwevende deeltjes in de hero
│   │   ├── ThemeToggle.tsx             — Knop om dark/light theme te wisselen
│   │   └── WaveformCanvas.tsx          — Canvas: subtiele golflijn animatie in de hero
│   │
│   ├── context/
│   │   └── ThemeContext.tsx            — React context voor dark/light theme
│   │
│   ├── hooks/
│   │   └── useGlitch.ts                — Hook: voegt data-glitching attribuut toe op random interval
│   │
│   └── sanity/
│       ├── config.ts                   — Sanity project config (projectId, dataset)
│       ├── schemaTypes/
│       │   ├── index.ts                — Registreert alle schema types
│       │   └── newsPost.ts             — Schema: title, tag, date, body, image, youtubeUrl, published
│       └── lib/
│           ├── client.ts               — Sanity client instantie
│           ├── image.ts                — urlFor() helper voor Sanity afbeeldingen
│           └── queries.ts              — GROQ queries (newPostsQuery)
│
├── public/
│   ├── hero-website.png                — Hero achtergrondafbeelding (hoge kwaliteit, groot)
│   ├── headshot.png                    — MusicSection artist image (default, transparant)
│   ├── ai-headshot.jpg                 — MusicSection: verschijnt met glitch bij hover
│   ├── primary logo.png                — Primair logo (momenteel niet meer in gebruik)
│   ├── favicon.svg                     — SVG favicon (primair)
│   ├── favicon-32.png                  — PNG favicon 32×32 (fallback)
│   ├── apple-touch-icon.png            — Apple touch icon 180×180
│   ├── og.png                          — Open Graph / Twitter card image (1200×630)
│   └── photos/
│       ├── 1.jpg                       — Polaroid foto in "Origins" hoofdstuk modal
│       ├── artistiek.png               — Artistieke foto — Press carousel (slot 1) + About featured
│       ├── studio.png                  — Studio foto — Press carousel (slot 2)
│       ├── tunnel.png                  — Tunnel foto — Press carousel (slot 3)
│       ├── studio-2.png                — Studio II foto — Press carousel (slot 4)
│       └── platen.png                  — Vinyl records foto — Press carousel (slot 5)
│
├── CONTEXT.md                          — Dit bestand
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── package-lock.json
```

---

## Secties & Pagina-opbouw (in volgorde)

1. **ClientCursor** — altijd aanwezig, buiten secties
2. **Nav** — fixed top, transparant → frosted glass bij scrollen
3. **HeroSection** — `#` (geen anchor), full-screen
4. **MusicSection** — `#music`
5. **VideoSection** — `#video`
6. **AboutSection** — `#about`
7. **PressSection** — `#press`
8. **NewsSection** — `#news`
9. **SocialSection** — `#connect`
10. **Footer**

Secties worden van elkaar gescheiden door een `.section-divider` (subtiele horizontale lijn met glow).

---

## Componenten in detail

### HeroSection
- Parallax achtergrondafbeelding (`hero-website.png`), opacity `var(--hero-img-opacity)` (0.55 dark / 0.50 light)
- Subtiel grid overlay (opacity 0.025)
- WaveformCanvas + ParticleField (beide canvas-based, enkel client-side)
- Glitch-titel "TMSTRY": CSS pseudo-element animaties + `useGlitch` hook (elke ~4.5s)
- **Hover-effect op TMSTRY**: bij mouseover fadet de titel naar opacity 0.05 zodat de hero-foto erdoorheen schijnt (Framer Motion `whileHover="hovered"`, 0.45s ease-out)
- Scroll-fade: tekst fadet weg bij scrollen (useTransform op scrollYProgress)
- CTAs: "Listen Now" (→ #music) + "Discover" (→ #about)

### CustomCursor
- Blauw dot (6px) dat direct volgt
- Ring (32px) met lazy follow (easing 0.12)
- Bij hover op links/buttons: ring wordt roze (56px), dot verdwijnt
- Enkel desktop (hidden op mobile)

### MusicSection
- Top tracks (hardcoded): No Defeat, Bars to Bridges, System Shock, Strike Back, Hollow Shape
- Spotify artist embed (iframe, dark theme)
- DSP links: Spotify, Apple Music, YouTube Music, Amazon Music, Deezer

### VideoSection
- YouTube RSS API (`/api/youtube`): filtert Shorts, retourneert max 4 long-form video's
- Featured video (nieuwste) groot bovenaan
- Grid van 3 recente video's
- Inline modal player (YouTube embed met autoplay)
- Fallback: `fK4z0vTYh7g` (Hollow Shape Symphonic Remix)
- Env var: `YOUTUBE_CHANNEL_ID` (default: `UCtxAcT-Bgi5Q9O-jsptkeOw`)

### AboutSection
- Bio tekst (3 paragrafen)
- 8 klikbare hoofdstukken (accordion-modal):
  - 01 Manifesto, 02 Origins (polaroid foto), 03 Sonic DNA, 04 The Process
  - 05 Inspirations (links: producers via Spotify + hedendaagse creators), 06 The Universe, 07 Human Error, 08 Transmission
- Elk hoofdstuk heeft eigen accent-kleur (blauw / paars / roze)
- Scroll-parallax achtergrond "TMSTRY" marquee
- Featured foto (`artistiek.png`) onderaan sectie

### PressSection
- Coverflow carousel: 5 foto's, center = vol, ±1 = 78% scale, ±2 = 60% scale
- Drag-to-navigate (touch-friendly)
- Lightbox bij klik op centerfoto
- Foto's: artistiek, studio, tunnel, studio-2, platen

### NewsSection / NewsList
- Server component haalt posts op uit Sanity (force-dynamic, no-cache)
- Lijst: klikbare rijen met tag, datum, titel, body preview, thumbnail
- Modal per post: title, tag, datum, body, afbeelding, YouTube embed, hashtag pills
- Hashtag filtering: klik op `#hashtag` → filter actief in de lijst
- Sanity velden: `title`, `tag`, `date`, `body`, `image`, `youtubeUrl`, `published`
- Tags beschikbaar: Update, Release, Live, News, Interview, Video

### SocialSection
- 6 platforms: Spotify, YouTube, Instagram, SoundCloud, TikTok, X/Twitter
- Contact: `contact@tmstry.com`

---

## Visuele Identiteit

### Kleuren (CSS custom properties)
| Naam | Dark | Light | Gebruik |
|---|---|---|---|
| `--bg` / `bg-obsidian` | `#080a0e` | `#f0f2f5` | Hoofdachtergrond |
| `--bg-charcoal` / `bg-charcoal` | `#0f1117` | `#e4e8ef` | Kaarten, modals |
| `--bg-deep` / `bg-deep-gray` | `#1a1d24` | `#d8dde6` | Verdiepte elementen |
| `--text` / `text-soft-white` | `#e8eaed` | `#0d1117` | Primaire tekst |
| `--text-silver` / `text-silver` | `#8892a0` | `#4a5568` | Secundaire tekst |
| `glow-blue` | `#4fc3f7` | idem | Accents, cursor, glows |
| `glow-pink` | `#e040fb` | idem | Secundaire accents |
| Purple accent | `#9c6aff` | idem | About / Chapter accents |
| Gold accent | `rgba(200,169,110)` | idem | Press sectie header |

### Typografie
- **Font**: Inter (Google Fonts), variabele `--font-display`
- **Mono**: voor tags, timestamps, technische labels
- **Letter-spacing**: extreem wide tracking voor uppercase labels (`0.3em`–`0.4em`)
- **Grootte titels**: `clamp()` voor responsive (bijv. `clamp(2rem, 5vw, 3.5rem)`)

### Designprincipes
- Donker, cinematisch, premium — geen cyberpunk clichés
- Sfeer: post-apocalyptisch, stille devastatie, iets dat iets overleefd heeft
- Minimale UI: veel whitespace, subtiele borders (`rgba(255,255,255,0.06)`)
- Noise texture overlay op de hele pagina (`opacity: 0.025`)
- Glows zijn subtiel — nooit overweldigend
- Animaties zijn smooth en springy (`ease: [0.16, 1, 0.3, 1]`)
- Alles uppercase in labels, tracking altijd mee

---

## Externe Links

| Platform | URL |
|---|---|
| Spotify (artist) | https://open.spotify.com/artist/6N2jkKJIcbzHwMs4cswMpw |
| Apple Music | https://music.apple.com/us/artist/tmstry/646739670 |
| YouTube Music | https://music.youtube.com/@TMSTRY-music |
| Amazon Music | https://music.amazon.com/artists/B00CQATSF0/tmstry |
| Deezer | https://www.deezer.com/en/artist/4768699 |
| YouTube kanaal | https://www.youtube.com/@TMSTRY-music |
| Instagram | https://www.instagram.com/tmstry/ |
| SoundCloud | https://soundcloud.com/tmstry |
| TikTok | https://www.tiktok.com/@tmstry |
| X / Twitter | https://x.com/TMSTRYmusic |
| Contact | contact@tmstry.com |

---

## Animaties & Effecten

| Effect | Component | Techniek |
|---|---|---|
| Glitch-titel | HeroSection | CSS pseudo-elements + `useGlitch` hook (data-attr toggle) |
| TMSTRY hover fade | HeroSection | Framer Motion `whileHover` → opacity 0.05, 0.45s ease-out |
| Parallax hero foto | HeroSection | Framer Motion `useScroll` + `useTransform` |
| Hero tekst scroll-fade | HeroSection | Framer Motion `useTransform` opacity 1→0 |
| Particles | ParticleField | Canvas requestAnimationFrame |
| Waveform | WaveformCanvas | Canvas requestAnimationFrame |
| Fade-in bij scroll | FadeInSection | Framer Motion `useInView` + motion.div |
| Coverflow carousel | PressSection | Framer Motion `animate` met scale/x/blur/opacity per slot |
| Drag carousel | PressSection | Framer Motion `drag="x"` + `onDragEnd` |
| Parallax marquee | AboutSection | Framer Motion `useScroll` + `useTransform` op x-as |
| Hover slide-right | NewsList, DSP | Framer Motion `whileHover={{ x: 4 }}` |
| Cursor ring | CustomCursor | RAF-loop met lerp (0.12 factor) |
| Video play pulse | VideoSection | Framer Motion scale + opacity repeat |
| Theme transition | globals.css | CSS transition op background-color + color (0.4s) |

---

## Sanity CMS

- **Studio URL**: https://tmstry.com/studio
- **Project ID**: zie `src/sanity/config.ts`
- **Dataset**: `production`
- **Schema**: `newsPost`
  - `title` (string, required)
  - `tag` (string enum: Update/Release/Live/News/Interview/Video, required)
  - `date` (date, required)
  - `body` (text, required) — `#hashtags` in de tekst worden automatisch klikbare pills
  - `image` (image, optional) — hotspot enabled
  - `youtubeUrl` (url, optional) — wordt geëmbed in de modal
  - `published` (boolean, default true) — false = verborgen

**Revalidatie**: Sanity webhook → `/api/revalidate` triggert hercompilatie van de pagina.

---

## API Routes

| Route | Functie |
|---|---|
| `GET /api/youtube` | Fetcht YouTube RSS feed, filtert Shorts, retourneert max 4 long-form video's (gecached 1u) |
| `POST /api/revalidate` | Sanity webhook handler: invalideert Next.js cache na CMS-update |

---

## Environment Variables (Vercel)

| Variabele | Waarde / Gebruik |
|---|---|
| `YOUTUBE_CHANNEL_ID` | YouTube kanaal ID (default hardcoded: `UCtxAcT-Bgi5Q9O-jsptkeOw`) |
| Sanity vars | `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN` |

---

## Status

### Werkt perfect
- Hero met glitch-animatie, parallax, particles, waveform
- TMSTRY hover-fade effect (opacity 0.05 bij mouseover)
- Sticky nav met scroll-state + mobiel hamburger menu
- Dark/light theme toggle
- Music sectie: Spotify embed + DSP links + top tracks
- Video sectie: nieuwste video's via /api/youtube (leest de /videos-pagina van het kanaal, sinds 18/10/2026; RSS gaf 404), Shorts gefilterd, modal player
- About sectie: 8 hoofdstukken met modals, polaroid in Origins, featured foto
- Press sectie: coverflow carousel, drag-navigatie, lightbox
- News sectie: Sanity CMS-beheerd, hashtag filtering, YouTube in modals
- Social sectie: 6 platforms + contact email
- Custom vinyl cursor
- Open Graph / Twitter card metadata
- Favicon (SVG + PNG)

### Openstaande taken / verbeterpunten
- Bronfoto's in `/public/photos` zijn zware PNG's — comprimeren/converteren naar JPG/WebP (PLAN.md P4-3, nog te doen)

> Ongebruikte assets (logo animation, logo background varianten, mini avatars, circle-logo, text logo's, YT Banner) zijn verwijderd uit `/public` (PLAN.md P4-1).

### Bekende situaties
- `styled-components` is als directe dependency toegevoegd om een Sanity build-fout te vermijden (was transitieve dep maar webpack kon het niet vinden)
- YouTube Shorts-filtering werkt via HEAD-requests naar `youtube.com/shorts/{id}` — kan trager zijn bij cold start

---

## Toegevoegd sinds de eerste versie (bijgewerkt 27/10/2026)

Deze delen zijn nieuwer dan de beschrijving hierboven; bij verschil geldt dit.

### API routes
- `/api/like` — POST: verhoog likes
- `/api/comment` — GET/POST comments
- `/api/transmissions` — GET alle transmissions
- `/api/lore` — GET signalLogs (cached met tag "signalLog")
- `/api/youtube` — GET nieuwste gewone video's (?limit=1-15, default 4). **Sinds 18/10/2026 (commit a9c91ba)**: leest de /videos-pagina van het kanaal (ytInitialData, ook de `<script id="yt-initial-data">`-vorm), geen Shorts, premières overgeslagen, `Cookie: SOCS=CAI` tegen de EU-toestemmingspagina; RSS (gaf 404) enkel als reserve, Shorts daar via de /shorts/-link. CDN-cache 15 min + swr 1 dag. Zelfde aanpak als tmstry-lab /api/latest-video (die heeft de JSON-script-vorm nog niet)
- `/api/revalidate` — POST: revalidate tags newsPost/transmission/signalLog

### Sanity clients
- `src/sanity/lib/client.ts` — read-only
- `src/sanity/lib/serverClient.ts` — write-enabled (SANITY_API_TOKEN met Editor permission)
- `src/sanity/lib/image.ts` — gebruikt `createImageUrlBuilder` (named export, niet default — was deprecated)

### Hero sectie (`src/components/HeroSection.tsx`)
- **Video:** `public/hero.mp4` (Seedance 5s loop, 21:9, 14MB) op desktop; `public/hero-poster.jpg` (319KB) als poster + mobiel
- **HUD overlays:** glitch TMSTRY-titel (links), manifesto links, Transmission Feed rechtsboven, Now Playing + Listen On rechtsonder, Status: Online linksonder, + crosshairs hoeken
- **"ENTER THE TRANSMISSION"** knop → opent Signal Room via `useSignalRoom().open()`
- `NowPlaying` component geïntegreerd rechtsonder

### Globale audiospeler
- `src/context/PlayerContext.tsx` — globale state, 8 tracks, shuffle per bezoek, pauzeert bij Signal Room (`isOpen`)
- `src/components/NowPlaying.tsx` — hero-speler (cover + equalizer + progress bar + transport)
- `src/components/MiniPlayer.tsx` — floating mini-speler rechtsonder bij scrollen voorbij hero; × stopt muziek + verbergt; re-armt bij terug naar boven
- `src/components/CoverLightbox.tsx` — gedeelde cover-lightbox (click cover → groot beeld met scanlines)
- `src/components/Visualizer.tsx` — audio-reactieve spectrum-canvas: Web Audio AnalyserNode in PlayerContext (`getAnalyser()`, lazy via `ensureAnalyser()` in toggle), per track eigen `hue` in Track type; in NowPlaying (vervangt CSS-equalizer) + faint achtergrond in MiniPlayer; fallback synthetische puls, statisch bij reduced-motion
- Tracks in `public/tracks/` (10 MP3's + webp covers):
  - not-built-to-behave, dead-air, calibrated-smile, hollow-shape, quiet-tension, lovin-on-da-ladies, outdated, this-aint-easy-street, the-fire-divide, the-business

### Music sectie (`src/components/MusicSection.tsx`)
- Links: artiest-afbeelding `public/photos/studio3.jpg` (hover → glitch → `/ai-headshot.jpg`)
- Rechts: Spotify-embed + DSP-lijst (Spotify, Apple Music, YouTube Music, Amazon Music, Deezer)

### Signal Room (`src/components/signal/`)
- Verborgen CRT-TV in nav (`NavSignalTV`) → klik → full-screen immersieve Signal Room
- `SignalRoom.tsx` — 5 kanalen (CH01-CH05), mouse parallax, ambient audio
- `SignalYouTube.tsx` — YouTube IFrame API (altijd muted start, dan unmute), laadt tot 20 video's
- `RoomDust.tsx` — 48 drijvende stofdeeltjes op canvas
- `TransmissionTransition.tsx` — static-wipe channel-overgang
- Achtergrond: `public/signal-room.webp` (264KB, AI bunker)
- CH05 = Corrupted Signal — glitch, hidden messages, zware static
- Lore overlays (side-monitor logs): uit Sanity `signalLog` docs, fallback hardcoded (16 entries)
- Hidden messages (CH05): Sanity `signalLog` (kind=hidden), fallback hardcoded (15 entries, incl. "01010100 01001101 01010011")
- Ambient audio: Web Audio API (drone + hiss), geen audiobestand
- Audio stopt automatisch als Signal Room opent
- **Signal Terminal** (AI easter egg): "Terminal ▮"-knop in de controls → `SignalTerminal.tsx` chat-overlay met "the Signal"-persona; `/api/signal-chat` (route.ts) → Claude Haiku (`claude-haiku-4-5`) via @anthropic-ai/sdk; `ANTHROPIC_API_KEY` in Vercel env vars ($5 prepaid tegoed); limieten: 10 berichten/sessie client-side, 30 req/10min per IP server-side, max 400 chars/bericht, prompt caching op system prompt

### Overige easter eggs & polish (17/7 sessie)
- `IncomingTransmission.tsx` — "incoming transmission" toast na 25s (1×/sessie), Answer → Signal Room + terminal auto-open (via `open({terminal:true})` op SignalRoomContext)
- `KonamiUnlock.tsx` — Konami-code (↑↑↓↓←→←→BA) ontgrendelt CH06 "The Source" permanent (localStorage `tmstry-ch06`); toast met "Tune in" → springt direct naar CH06 (sessionStorage `tmstry-goto-ch06`)
- CH06 in SignalRoom: alleen static ("NO CARRIER" + binaire TMS), eigen CH06_MESSAGES pool, roze accent in channel rail
- Toetsenbord in Signal Room: ← → kanalen, N next, R random, M mute, T terminal, ESC exit (+ hint-regel desktop)
- Footer: "LAST TRANSMISSION // dd.mm — titel" linkt naar nieuwste post (server component, `latestPostMetaQuery`, newsPost ISR-tag); fallback "SIGNAL ACTIVE"
- `/api/og` (route.tsx, edge) — gegenereerde OG-image 1200×630 per nieuwspost (wordmark, scanlines, glitch-titel); `generateMetadata` in news/[slug] wijst ernaar
- Signal Terminal dossier: Tim-feiten in system prompt (43, getrouwd, 2 kids, 2 honden/t-rex pup, cipier nachtdienst 18j, Gent, doner, GTA 6, schoenmaat 43 — GEEN high heels grap, te persoonlijk); druppelsgewijs + liefdevol plagend, nooit verzinnen

### Nav (`src/components/Nav.tsx`)
- Scroll-spy via IntersectionObserver, active = helderdere tekst + blauw onderstreepje + glow stipje
- **Hover-swap** (HoverSwapText): Music→Racket(paars), Video→Reruns(roze), About→Ego(paars), Press→Crap(roze), News→Gossip(paars), Connect→Spam(roze)
- Grunge font + swap-glitch animatie op hover
- NavSignalTV tussen nav-links en ThemeToggle

### Globale componenten
- `src/components/ScrollProgress.tsx` — 4px blauw→magenta balk bovenaan (scroll progress, Framer Motion spring)
- `src/components/ConsoleSignal.tsx` — easter egg in browser console (TMSTRY logo + hints + binaire TMS)
- `src/components/HoverSwapText.tsx` — herbruikbare hover-swap, tone prop: "purple" | "pink"
- `src/app/not-found.tsx` — branded 404 "Signal Lost" pagina
- `src/components/CustomCursor.tsx` — `body.cursor-none` (homepage only)

### CSS / globals (`src/app/globals.css`)
- `scroll-padding-top: 6rem` (nav offset)
- CRT keyframes: signal-label-flicker, crt-flicker, signal-glitch
- Fog keyframes, img-glitch, swap-glitch, eq-bar
- `.font-grunge { font-family: var(--font-grunge), cursive; }`
- `:focus-visible { outline: 2px solid rgba(79,195,247,0.8); }` (keyboard a11y)
- `body.cursor-none` scoped cursor: none

### Fonts
- Inter (--font-sans), JetBrains Mono (--font-mono), Rubik Distressed (--font-grunge)

### Public assets
- `public/hero.mp4` — Seedance 5s loop (14MB, 21:9 → 1850×793)
- `public/hero-poster.jpg` — 319KB, 21:9 clean plate
- `public/signal-room.webp` — 264KB bunker still
- `public/headshot.png` — 228KB (transparant)
- `public/ai-headshot.jpg` — 98KB
- `public/photos/studio3.jpg` — 95KB, Music-sectie artiest-afbeelding
- `public/tracks/` — 8 MP3's + 8 webp covers

### Connect sectie
- Email boven copy: "Got something on your plate? Work for hire?" + "Or just here to hate? The inbox has thick skin."
- contact@tmstry.com

### Sanity plan
- Gratis Free-plan (trial verlopen) — geen impact op features (geen private datasets, Studio Comments, Scheduled Drafts of AI Assist)

### Layout providers (src/app/layout.tsx)
- ThemeProvider > SignalRoomProvider > PlayerProvider > children + MiniPlayer + ScrollProgress + ConsoleSignal

### ZERO SUM op de homepage (17/10/2026)
- `src/components/zerosum/ZeroSumSection.tsx` (server, leest `https://zerosum.tmstry.com/api/time`, ISR 60s, fallback 6/11/2026 20:00 CET) + `ZeroSumRoom.tsx` (client): direct onder de hero; palet van de albumsite (soot/iron/brass/bone/ash/oxide, brass enige accent), werkplaats-still uit `public/zerosum/`, ademende lichtbundel, split-flap aftelling, tracklist als kassabon met cover erop geniet; fases countdown/open/live/archive (archive = endedAt of 6u na target)
- Nav: messing "Zero Sum"-knop (desktop vanaf lg, ook in mobiel menu) scrollt naar #zerosum
- Trackduren hardcoded uit Zero Sum/src/content/tracks.ts (totaal 29:56); albumproject zelf staat in ~/Zero Sum (HANDOFF.md)
