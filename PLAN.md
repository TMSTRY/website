# TMSTRY — Review & Improvement Plan

> Comprehensive review of the TMSTRY artist site (Next.js 15 App Router, https://tmstry.com).
> Tasks are ordered by impact and grouped by priority. **Each task is self-contained** and
> written so Claude Sonnet can execute it without running anything locally.

## Working rules (read first)

- **Never run locally.** No `npm run dev`, no build, no preview servers.
- **Workflow per task:** `git add` → `git commit` → `git push origin main`. Vercel auto-deploys (~1 min).
- **Verify after each push** by loading https://tmstry.com (hard refresh) and/or `curl`-ing the relevant URL. Each task lists how to verify.
- **One task = one commit.** Keep commits small so a bad deploy is easy to revert.
- **No secrets in code.** Use Vercel environment variables.
- If a task depends on an env var or Sanity config, note it in the commit and continue with the rest.

---

## Summary of findings

The site is visually strong and the cinematic direction is well executed. The biggest wins are:
**(1)** the homepage is rendered fully dynamic on every request (no edge caching) — a global TTFB/perf hit;
**(2)** missing SEO fundamentals (no robots, no sitemap, no structured data) which matter a lot for a music artist;
**(3)** a few real bugs (dead ESC affordance in two modals, a React key warning, no scroll-lock);
**(4)** the `--font-mono` (JetBrains Mono) referenced everywhere but never loaded, so all "technical" labels fall back to system monospace and look off-brand;
**(5)** ~26 MB of unused assets and oversized images shipped in the repo.

---

# P0 — Bugs & quick correctness fixes

### P0-1. ESC key does nothing in About & News modals (broken affordance)
**Files:** `src/components/AboutSection.tsx` (`ChapterModal`), `src/components/NewsList.tsx` (`PostModal`)
**Problem:** Both modals render an "ESC ×" label, but only `VideoModal` (in `VideoSection.tsx`) actually listens for the Escape key. Pressing ESC in the About-chapter modal or the News-post modal does nothing.
**Fix:** Add the same effect `VideoModal` uses to each modal component:
```tsx
useEffect(() => {
  const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, [onClose]);
```
Import `useEffect` where needed (`AboutSection.tsx` currently imports only `useRef, useState`; `NewsList.tsx` imports only `useState`).
**Verify:** Open a chapter modal and a news-post modal on https://tmstry.com, press ESC — both should close.

### P0-2. React key warning in About chapter text layout
**File:** `src/components/AboutSection.tsx` (~lines 346–392, the `.split("\n\n").map(...)` in the standard text layout)
**Problem:** The map returns a bare fragment `<>...</>` and puts `key={i}` on the inner `<p>`, not on the mapped root element. This logs a "unique key" warning and can mis-reconcile when the polaroid is injected.
**Fix:** Replace the bare fragment with a keyed fragment. Import `Fragment` from `react` and change `(<>` to `(<Fragment key={i}>` and `</>)` to `</Fragment>)`. Remove the now-redundant `key={i}` from the inner `<p>`.
**Verify:** Open browser devtools console on the About section after deploy — no key warning when opening chapters 01/02/03/etc.

### P0-3. Body does not lock scroll while a modal is open
**Files:** `src/components/VideoSection.tsx`, `src/components/AboutSection.tsx`, `src/components/NewsList.tsx`, `src/components/PressSection.tsx` (all four modal/lightbox components)
**Problem:** When any modal/lightbox is open, the page behind it still scrolls.
**Fix (shared approach):** In each modal/lightbox component add:
```tsx
useEffect(() => {
  const prev = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  return () => { document.body.style.overflow = prev; };
}, []);
```
Optional but cleaner: create `src/hooks/useBodyScrollLock.ts` exporting this effect and call it from each modal.
**Verify:** Open each modal on https://tmstry.com and try to scroll — background should stay fixed; closing restores scroll.

### P0-4. Remove dead `dragStart` state in Press carousel
**File:** `src/components/PressSection.tsx`
**Problem:** `const [dragStart, setDragStart] = useState(0)` and `onDragStart={(_, info) => setDragStart(info.point.x)}` — `dragStart` is never read.
**Fix:** Delete the `dragStart` state and the `onDragStart` handler (drag navigation relies on `onDragEnd`'s `info.offset.x`, which is unaffected).
**Verify:** Drag the center photo left/right on https://tmstry.com — navigation still works.

### P0-5. `force-dynamic` export in a component file is a no-op
**File:** `src/components/NewsSection.tsx`
**Problem:** `export const dynamic = "force-dynamic"` only has effect in route segment files (`page.tsx`/`layout.tsx`/`route.ts`), not in an imported component. It's misleading. (Actual dynamic rendering is currently caused by `cache: "no-store"` — addressed in P1-1.)
**Fix:** This line is removed as part of **P1-1**; if doing cleanup standalone, just delete the line.
**Verify:** Covered by P1-1's cache-header check.

---

# P1 — High-impact performance & SEO

### P1-1. Stop rendering the whole homepage dynamically on every request ⭐ biggest perf win
**Files:** `src/components/NewsSection.tsx`, `src/app/api/revalidate/route.ts`
**Problem:** `NewsSection` fetches Sanity with `cache: "no-store"`, which opts the **entire** homepage into dynamic rendering. Live headers confirm `cache-control: no-store` and `x-vercel-cache: MISS` — the cinematic homepage is server-rendered fresh on every visit, hurting global TTFB. A revalidate webhook already exists but is defeated by `no-store`.
**Fix — switch to tag-based ISR:**
1. In `NewsSection.tsx`: remove `export const dynamic = "force-dynamic"`, and change the fetch to use a cache tag instead of `no-store`:
   ```tsx
   const posts = await client
     .fetch(newPostsQuery, {}, { next: { tags: ["newsPost"] } })
     .catch(() => []);
   ```
   (Remove the `{ cache: "no-store" }` argument.)
2. In `src/app/api/revalidate/route.ts`: replace `revalidatePath("/")` with `revalidateTag("newsPost")` (import `revalidateTag` from `next/cache`). Keep the secret check.
**Why:** The homepage becomes statically rendered / edge-cached and only rebuilds when the Sanity webhook fires after a CMS edit — best of both worlds.
**Env/Sanity note:** The Sanity webhook must still POST to `/api/revalidate?secret=...` (unchanged). `REVALIDATE_SECRET` must be set in Vercel.
**Verify:** After deploy, `curl -sI https://tmstry.com/ | grep -i cache-control` — should no longer say `no-store`; a second request should show `x-vercel-cache: HIT`. Then publish a test edit in `/studio` and confirm it appears within a minute.

### P1-2. Add `robots.txt` and `sitemap.xml` (both currently 404)
**Files:** create `src/app/robots.ts` and `src/app/sitemap.ts`
**Problem:** `https://tmstry.com/robots.txt` and `/sitemap.xml` both return 404.
**Fix:**
`src/app/robots.ts`:
```ts
import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/studio" },
    sitemap: "https://tmstry.com/sitemap.xml",
  };
}
```
`src/app/sitemap.ts`:
```ts
import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://tmstry.com", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
  ];
}
```
**Verify:** `curl -s -o /dev/null -w "%{http_code}" https://tmstry.com/robots.txt` and `/sitemap.xml` should both return `200`.

### P1-3. Add `metadataBase` + canonical to root metadata
**File:** `src/app/layout.tsx`
**Problem:** No `metadataBase` (Next emits a warning and resolves OG/relative URLs unreliably), no canonical URL.
**Fix:** In the `metadata` object add:
```ts
metadataBase: new URL("https://tmstry.com"),
alternates: { canonical: "/" },
```
With `metadataBase` set, the OG/Twitter `images` can become relative (`/og.png` — see P1-5) instead of absolute.
**Verify:** View source on https://tmstry.com — a `<link rel="canonical" href="https://tmstry.com/">` should be present; OG image URL resolves correctly.

### P1-4. Add JSON-LD structured data for the music artist ⭐ high SEO value
**File:** `src/app/layout.tsx` (or a small `src/components/StructuredData.tsx` rendered in layout)
**Problem:** No structured data. For a music artist, a `MusicGroup`/`Person` schema with `sameAs` links drives rich results and entity recognition across Google/Bing.
**Fix:** Inject a JSON-LD script in `<head>` (or top of `<body>`):
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "MusicGroup",
      name: "TMSTRY",
      url: "https://tmstry.com",
      genre: ["Electronic", "Cinematic", "AI-Hybrid"],
      image: "https://tmstry.com/Spotify Banner.png",
      sameAs: [
        "https://open.spotify.com/artist/6N2jkKJIcbzHwMs4cswMpw",
        "https://music.apple.com/us/artist/tmstry/646739670",
        "https://music.youtube.com/@TMSTRY-music",
        "https://www.youtube.com/@TMSTRY-music",
        "https://www.instagram.com/tmstry/",
        "https://soundcloud.com/tmstry",
        "https://www.tiktok.com/@tmstry",
        "https://x.com/TMSTRYmusic",
        "https://music.amazon.com/artists/B00CQATSF0/tmstry",
        "https://www.deezer.com/en/artist/4768699",
      ],
    }),
  }}
/>
```
(Use the encoded image path once P1-5 lands.)
**Verify:** Paste https://tmstry.com into Google's Rich Results Test (or view source and confirm the `application/ld+json` block).

### P1-5. Rename the OG image to a space-free filename
**Files:** `public/Spotify Banner.png` → `public/og.png`; update `src/app/layout.tsx` (and P1-4 JSON-LD)
**Problem:** OG/Twitter image is `https://tmstry.com/Spotify Banner.png` (literal space). It currently works (encoded), but spaces in asset URLs are fragile across social scrapers/CDNs.
**Fix:** `git mv "public/Spotify Banner.png" public/og.png` and update all references from `"https://tmstry.com/Spotify Banner.png"` / `"/Spotify Banner.png"` to `/og.png` (with `metadataBase` from P1-3, relative is fine).
**Verify:** `curl -s -o /dev/null -w "%{http_code}" https://tmstry.com/og.png` → `200`; re-scrape with the Facebook Sharing Debugger / X Card Validator.

### P1-6. Restrict `next.config` image `remotePatterns` (security + correctness)
**File:** `next.config.mjs`
**Problem:** `remotePatterns: [{ protocol: "https", hostname: "**" }]` turns the Next image optimizer into an open proxy for **any** HTTPS host — an abuse vector and unnecessary.
**Fix:** Restrict to the hosts actually used (YouTube thumbnails + Sanity CDN):
```js
images: {
  remotePatterns: [
    { protocol: "https", hostname: "i.ytimg.com" },
    { protocol: "https", hostname: "cdn.sanity.io" },
  ],
},
```
**Verify:** After deploy, confirm YouTube thumbnails in the Video section and any Sanity post images still load on https://tmstry.com.

### P1-7. Lower hero image quality + reduce LCP cost
**File:** `src/components/HeroSection.tsx`
**Problem:** The hero `<Image>` uses `quality={95}` on a large 1.9 MB source as the LCP element. 95 is overkill and inflates the optimized payload.
**Fix:** Set `quality={75}` on the hero image (keep `priority`). Consider adding `sizes="100vw"` (it's `fill`). Optionally drop other `quality={90}/{95}` props elsewhere to ~80.
**Verify:** Run https://tmstry.com through PageSpeed Insights — LCP image transfer size should drop with no visible quality loss.

---

# P2 — Visual polish & cinematic consistency

### P2-1. Actually load JetBrains Mono (or stop referencing it) ⭐ visible inconsistency
**File:** `src/app/layout.tsx`, `src/app/globals.css`
**Problem:** `--font-mono: "JetBrains Mono"` is used across the site (track numbers, tags, timestamps, "SIGNAL ACTIVE", chapter indices) but the font is **never loaded** — only `Inter` is. All `font-mono` text falls back to the OS monospace (Menlo/Courier), which clashes with the premium aesthetic.
**Fix:** Load it via `next/font/google` alongside Inter:
```ts
import { Inter, JetBrains_Mono } from "next/font/google";
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
```
Add `jetbrains.variable` to the `<html>` className (e.g. `className={`${inter.variable} ${jetbrains.variable}`}`). In `globals.css`, the `--font-mono` var is already referenced by Tailwind's `font-mono`; the next/font variable will now populate it.
**Verify:** On https://tmstry.com inspect a `font-mono` element (e.g. the track-number "1" in Music, or "SIGNAL ACTIVE" in the footer) — computed font-family should be JetBrains Mono.

### P2-2. Fix theme flash (FOUC) for light-mode visitors
**File:** `src/app/layout.tsx`, `src/context/ThemeContext.tsx`
**Problem:** Theme is read from `localStorage` in a `useEffect` after hydration, so a saved-light visitor sees a flash of dark theme on every load.
**Fix:** Add a tiny blocking inline script in `<head>` (before paint) that sets `data-theme` from localStorage:
```tsx
<script
  dangerouslySetInnerHTML={{
    __html: `try{var t=localStorage.getItem('tmstry-theme');if(t==='light'||t==='slate'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}`,
  }}
/>
```
Keep `ThemeContext` as the source of truth for the toggle; it can still read localStorage on mount to sync React state (no visual flash because the attribute is already set).
**Verify:** Toggle to light mode on https://tmstry.com, hard-refresh — no dark flash before light renders.

### P2-3. Resolve the placeholder content in About → "In Their Words"
**File:** `src/components/AboutSection.tsx` (`QUOTES`, chapter `05`)
**Problem:** Chapter 05 ships visible placeholders ("Creator Name", "Sound Designer", "Producer") and a literal "Archival / Placeholder" label shown to users — reads as unfinished.
**Fix (pick one, ask the owner if unsure):**
- (a) Replace with real, attributable quotes, or
- (b) Temporarily remove chapter `05` from the `CHAPTERS` array until real quotes exist, or
- (c) Reframe as clearly intentional ("Transmissions" / anonymous) and remove the "Placeholder" label.
**Verify:** Open chapter 05 on https://tmstry.com — no "Placeholder"/"Creator Name" text visible.

### P2-4. Footer Privacy / Terms / Press links go nowhere (`href="#"`)
**File:** `src/components/Footer.tsx`
**Problem:** All three footer links point to `#`.
**Fix:** Either remove links that have no destination, or point "Press" to `#press` and add minimal Privacy/Terms routes (`src/app/privacy/page.tsx`, `src/app/terms/page.tsx`) with short content. Minimum viable: link "Press" → `#press`, drop Privacy/Terms until pages exist.
**Verify:** Click each footer link on https://tmstry.com — no dead `#` jumps to top.

---

# P3 — Animation smoothness & accessibility

### P3-1. Respect `prefers-reduced-motion`
**Files:** `src/app/globals.css` (global), `src/components/ParticleField.tsx`, `src/components/WaveformCanvas.tsx`, `src/hooks/useGlitch.ts`
**Problem:** Nothing respects reduced-motion. Continuous canvas RAF loops, the glitch effect, infinite pulses, and the marquee all run regardless.
**Fix:**
- Global CSS safety net in `globals.css`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
    html { scroll-behavior: auto; }
  }
  ```
- In `ParticleField`, `WaveformCanvas`, and `useGlitch`: early-return (skip starting the RAF/interval) when `window.matchMedia("(prefers-reduced-motion: reduce)").matches`.
**Verify:** Enable "Reduce motion" in OS settings, load https://tmstry.com — particles/waveform/glitch are static, no jank.

### P3-2. Pause hero canvases when off-screen / tab hidden (battery + main thread)
**Files:** `src/components/ParticleField.tsx`, `src/components/WaveformCanvas.tsx`
**Problem:** Both RAF loops run continuously even after the hero scrolls out of view and while the tab is backgrounded; 80 particles also run on mobile.
**Fix:**
- Add a `visibilitychange` listener: `cancelAnimationFrame` when `document.hidden`, resume on focus.
- Optionally use an `IntersectionObserver` on the canvas to stop the loop when the hero is not intersecting.
- Reduce particle count on small screens, e.g. `const COUNT = window.innerWidth < 768 ? 35 : 80;`.
**Verify:** Scroll past the hero on https://tmstry.com and background the tab — CPU usage should drop (check devtools Performance/Activity Monitor).

### P3-3. Custom cursor: use event delegation so it works on modal content
**File:** `src/components/CustomCursor.tsx`
**Problem:** `querySelectorAll("a, button, [role=button]")` runs once at mount, so links/buttons inside modals (rendered later) never trigger the ring-grow/dot-hide hover state.
**Fix:** Replace per-element listeners with delegated `mouseover`/`mouseout` on `document`, checking `e.target.closest("a, button, [role='button']")`. This also covers dynamically added elements.
**Verify:** Open a modal on https://tmstry.com (desktop) and hover its Close button — the cursor ring should grow/turn pink.

### P3-4. Don't hide the system cursor on devices without the custom cursor
**File:** `src/app/globals.css` (`body { cursor: none; }`)
**Problem:** `cursor: none` is applied to `body` globally, but the custom cursor only renders at `md+` (`hidden md:block`). A mouse user on a viewport `< 768px` (small window / some tablets) gets **no cursor at all**.
**Fix:** Scope it to fine pointers and md+:
```css
@media (min-width: 768px) and (pointer: fine) { body { cursor: none; } }
```
Remove the unconditional `cursor: none` from the base `body` rule.
**Verify:** Narrow a desktop browser window below 768px on https://tmstry.com — the normal OS cursor should reappear.

### P3-5. Add `role="dialog"` / `aria-modal` to modals
**Files:** all four modal components (Video/About/News/Press)
**Problem:** Modals lack dialog semantics and focus management.
**Fix (minimum):** Add `role="dialog" aria-modal="true"` to the modal card container, and an `aria-label` describing it. (Full focus-trap is optional/larger; scroll-lock from P0-3 and ESC from P0-1 already cover the basics.)
**Verify:** Inspect a modal on https://tmstry.com — container has `role="dialog"`.

---

# P4 — Repo hygiene & assets

### P4-1. Remove unused assets (~26 MB) from `public/`
**Files (per CONTEXT.md "niet actief"):** `public/logo animation 02.mp4` (11 MB), `public/logo background 2K.png`, `public/logo background.png`, `public/circle-logo.png`, `public/mini avatar 1.png`, `public/mini avatar 2.png`, `public/minimal icon.png`, `public/text logo.png`, `public/text logo 2.png`, `public/YT Banner 3.png`
**Problem:** ~26 MB of assets are shipped in the repo/deploy but referenced nowhere in `src/`.
**Fix:** Before deleting, confirm each is unreferenced: `grep -rn "<filename>" src` returns nothing. Then `git rm` the confirmed-unused files. **Do not** remove `hero-website.png`, `primary logo.png`, `favicon.svg`, `glyph favicon.png`, `og.png` (renamed), or anything in `public/photos/`.
**Verify:** Site still renders fully on https://tmstry.com; deploy size drops.

### P4-2. Shrink the oversized favicon / apple-touch icon
**File:** `public/glyph favicon.png` (1.6 MB), referenced in `src/app/layout.tsx`
**Problem:** A 1.6 MB PNG is used as both the 32×32 favicon and the Apple touch icon — hundreds of KB wasted on a tiny asset.
**Fix:** Generate properly sized icons (e.g. `favicon-32.png` at 32×32 and `apple-touch-icon.png` at 180×180) and point the `<link>` tags at them. (The SVG favicon is already tiny and fine for modern browsers.) Asset re-export may need the owner to provide source art — if so, note it and leave the SVG as primary.
**Verify:** `curl -sI https://tmstry.com/apple-touch-icon.png` (or the new filename) returns a small `content-length`; favicon still shows in the tab.

### P4-3. Compress source photos (optional, source-quality)
**Files:** `public/photos/*.png` (1.3–2.1 MB each), `public/hero-website.png` (1.9 MB)
**Problem:** Photographs stored as large PNGs. `next/image` optimizes delivery, but the heavy PNG **sources** bloat the repo and the first optimization pass.
**Fix:** Re-export the photographs as high-quality JPG/WebP (visually lossless ~80–85) and update references, or run them through an image compressor in place. This is a content task — if re-export needs the owner, note it.
**Verify:** Repo size drops; images look identical on https://tmstry.com.

---

## Suggested execution order

1. **P0** (all) — small, safe, fixes visible bugs. One commit each.
2. **P1-1** — the cache fix; verify headers flip from `no-store` to cacheable.
3. **P1-2 → P1-7** — SEO + image/security wins.
4. **P2** — font/theme/content polish (P2-1 font fix is high visible value).
5. **P3** — motion/accessibility.
6. **P4** — repo/asset cleanup last (lowest risk, easy to verify nothing broke).

## Per-task checklist (apply to every task)
- [ ] Make the change in the listed file(s) only.
- [ ] `git add -A && git commit -m "<concise message>"`
- [ ] `git push origin main`
- [ ] Wait ~1 min, hard-refresh https://tmstry.com (and run the task's `curl`/inspect check).
- [ ] If broken, `git revert` the commit and push.
