# TOPBAR Marketing Site v2.0.0 — Release

**TOPBAR** is the official marketing storefront for the TOPBAR disposable vape lineup — premium UI, product discovery, flavour pickers, brand film, and social sharing. Built with React 19 and Vite 8.

| | |
|---|---|
| **Version** | 2.0.0 |
| **Previous** | [v1.0.0](./RELEASE-v1.0.0.md) |
| **Repository** | [bitraveneth/TOPBAR](https://github.com/bitraveneth/TOPBAR) |
| **Stack** | React · Vite · React Router · Lucide icons |
| **Content** | JSON in `src/data/` + CMS defaults · Strapi scaffold in `cms/` |

---

## What’s new in v2.0.0

### Visual refresh — TOPBAR 40000 & home

- **Hero carousel** — updated slide art and copy for 40000 Puffs, New Collection, Gummy Bear, White Peach Raspberry, Coke Ice, and 60000 series slides
- **TOPBAR 40000 flavours** — all 15 variant images remapped in `public/images/products/topbar-40000-colors/`
- **Key specs** — new `topbar-40000-key-specs.webp` bento asset (replaces PNG)
- **Home showcase** — `topbar-40000-showcase-home.webp` for the featured product module
- **Real Reviews (Loved By You)** — four refreshed community module images; streamlined card set

### Performance

- **Self-hosted fonts** — Chakra Petch, Inter, and Ubuntu via `@fontsource/*` (no render-blocking Google Fonts)
- **Responsive hero images** — `-480w` / `-960w` WebP variants with `srcset` in `HeroCarousel` (`npm run images:mobile` to regenerate)
- **Product LCP preload** — inline head script + `productImagePreload.js` for faster product detail paint
- **Brand film preload** — earlier video fetch via `brandFilmPreload.js` with sequential film loading
- **Code splitting** — lazy-loaded home sections and vendor chunks in production build

### Mobile UX

- **Hero** — per-slide `mobile` copy blocks in `homeSections.json`; lighter overlays; text positioned lower so product art stays visible
- **Hero arrows** — re-enabled on mobile with subtle styling
- **TopbarScrollZoom** — hidden on viewports ≤768px to reduce scroll jank on phones
- **Loved By You** — ribbon layout restored (Real Reviews → cards → Join The Movement)

### Code quality

- ESLint clean (0 errors, 0 warnings)
- CMS context split: `cmsSharedContext.js`, `CmsContext.jsx`, `useCms.js` (fixes Windows case-collision build issue)
- Deterministic flavour shuffle (`shuffleFlavors.js`) for stable renders

---

## Hero carousel (v2 assets)

### TOPBAR 40000 Puffs

![TOPBAR 40000 Puffs](https://raw.githubusercontent.com/bitraveneth/TOPBAR/v2.0.0/public/images/hero/topbar-hero-40000-puffs.webp)

*Rechargeable disposable with digital screen, smooth draw, and up to 40,000 puffs.*

### Fresh Drop — New Collection

![New Collection](https://raw.githubusercontent.com/bitraveneth/TOPBAR/v2.0.0/public/images/hero/topbar-hero-new-collection.webp)

*Modern disposable lineup — clean design, smooth draw, consistent flavor.*

### Ice Sensation — Gummy Bear

![Gummy Bear](https://raw.githubusercontent.com/bitraveneth/TOPBAR/v2.0.0/public/images/hero/topbar-hero-ice.webp)

*Sweet gummy candy flavor with smooth delivery.*

### Alpine Air — White Peach Raspberry

![White Peach Raspberry](https://raw.githubusercontent.com/bitraveneth/TOPBAR/v2.0.0/public/images/hero/topbar-hero-collapse.webp)

*Juicy white peach and raspberry on the TOPBAR 40000 series.*

### Volcanic Boldness — Coke Ice

![Coke Ice](https://raw.githubusercontent.com/bitraveneth/TOPBAR/v2.0.0/public/images/hero/topbar-hero-volcano.webp)

*Classic cola with a cool icy finish.*

---

## npm scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local dev server (port 5173) |
| `npm run build` | Production bundle → `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run lint` | ESLint |
| `npm run images:mobile` | Generate `-480w` / `-960w` responsive WebP variants |
| `npm run perf:summary` | Summarize Lighthouse JSON reports |

---

## Deploy

See **[docs/DEPLOYMENT.md](./DEPLOYMENT.md)** for full server setup (Nginx, SSL, updates).

Quick build:

```bash
npm ci
npm run build
```

Publish the **`dist/`** folder to your static host. No runtime environment variables are required for the static storefront.

---

## Upgrade notes (v1 → v2)

1. Pull `v2.0.0` (or merge `main` after the tag).
2. Run `npm ci` — new `@fontsource/*` and `sharp` dependencies.
3. Run `npm run build` and redeploy `dist/`.
4. If you add new hero or product images, run `npm run images:mobile` before building so mobile `srcset` variants exist.

---

## Credits

Designed and developed by **Alex** — [GitHub](https://github.com/bitraveneth)

---

*Tag `v2.0.0` · TOPBAR © 2026*
