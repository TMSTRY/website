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
│   ├── primary logo.png                — Primair logo — gebruikt in MusicSection (artist image)
│   ├── favicon.svg                     — SVG favicon
│   ├── glyph favicon.png               — PNG favicon (32x32 + Apple touch icon)
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
  - 05 In Their Words (quotes), 06 The Universe, 07 Human Error, 08 Transmission
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
- Video sectie: live YouTube RSS feed, Shorts gefilterd, modal player
- About sectie: 8 hoofdstukken met modals, polaroid in Origins, featured foto
- Press sectie: coverflow carousel, drag-navigatie, lightbox
- News sectie: Sanity CMS-beheerd, hashtag filtering, YouTube in modals
- Social sectie: 6 platforms + contact email
- Custom vinyl cursor
- Open Graph / Twitter card metadata
- Favicon (SVG + PNG)

### Openstaande taken / verbeterpunten
- Footer: Privacy, Terms, Press links wijzen naar `#` (nog geen inhoud)
- About hoofdstuk 05 "In Their Words": quotes zijn placeholders (Ash Johansen etc. zijn fictief)
- Favicon / apple-touch-icon: `glyph favicon.png` is ~1.6 MB — vervangen door correct geschaalde iconen (zie PLAN.md P4-2)
- Bronfoto's in `/public/photos` zijn zware PNG's — comprimeren/converteren naar JPG/WebP (PLAN.md P4-3)

> Ongebruikte assets (logo animation, logo background varianten, mini avatars, circle-logo, text logo's, YT Banner) zijn verwijderd uit `/public` (PLAN.md P4-1).

### Bekende situaties
- `styled-components` is als directe dependency toegevoegd om een Sanity build-fout te vermijden (was transitieve dep maar webpack kon het niet vinden)
- YouTube Shorts-filtering werkt via HEAD-requests naar `youtube.com/shorts/{id}` — kan trager zijn bij cold start
