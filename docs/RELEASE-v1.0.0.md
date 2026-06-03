# TOPBAR Marketing Site v1.0.0 — Final Release

**TOPBAR** is the official marketing storefront for the TOPBAR disposable vape lineup — premium UI, product discovery, flavour pickers, brand film, and social sharing. Built with React 19 and Vite 8.

| | |
|---|---|
| **Version** | 1.0.0 |
| **Repository** | [bitraveneth/TOPBAR](https://github.com/bitraveneth/TOPBAR) |
| **Stack** | React · Vite · React Router · Lucide icons |
| **Content** | JSON in `src/data/` + CMS defaults · Strapi scaffold in `cms/` |

---

## Hero carousel

Full-width cinematic slides on the home page — each links to products or the lineup.

### TOPBAR 60000 — Strawberry Watermelon

![TOPBAR 60000 — Strawberry Watermelon](https://raw.githubusercontent.com/bitraveneth/TOPBAR/v1.0.0/public/images/hero/topbar-60000-hero-2.webp)

*Strawberry Watermelon — bright sweet blend in the latest TOPBAR 60000 series.*

### TOPBAR 60000 — Blue Razz

![TOPBAR 60000 — Blue Razz](https://raw.githubusercontent.com/bitraveneth/TOPBAR/v1.0.0/public/images/hero/topbar-60000-hero-4.webp)

*Cool berry-forward notes with a smooth, balanced finish.*

### TOPBAR 60000 — Sour Lemon

![TOPBAR 60000 — Sour Lemon](https://raw.githubusercontent.com/bitraveneth/TOPBAR/v1.0.0/public/images/hero/topbar-60000-hero-3.webp)

*Tangy citrus profile — sharp and refreshing.*

### TOPBAR 40000 Puffs

![TOPBAR 40000 Puffs](https://raw.githubusercontent.com/bitraveneth/TOPBAR/v1.0.0/public/images/hero/topbar-hero-40000-puffs.webp)

*Rechargeable disposable with digital screen, smooth draw, and up to 40,000 puffs.*

### Desert Energy — Strawberry Ice

![Strawberry Ice](https://raw.githubusercontent.com/bitraveneth/TOPBAR/v1.0.0/public/images/hero/topbar-hero-canyon-dusk.webp)

*Sweet strawberry with a cool icy finish.*

### Fresh Drop — New Collection

![New Collection](https://raw.githubusercontent.com/bitraveneth/TOPBAR/v1.0.0/public/images/hero/topbar-hero-new-collection.webp)

*Modern disposable lineup — clean design, smooth draw, consistent flavor.*

### Ice Sensation — Gummy Bear

![Gummy Bear](https://raw.githubusercontent.com/bitraveneth/TOPBAR/v1.0.0/public/images/hero/topbar-hero-ice.webp)

*Sweet gummy candy flavor with smooth delivery.*

### Alpine Air — White Peach Raspberry

![White Peach Raspberry](https://raw.githubusercontent.com/bitraveneth/TOPBAR/v1.0.0/public/images/hero/topbar-hero-collapse.webp)

*Juicy white peach and raspberry on the TOPBAR 40000 series.*

### Volcanic Boldness — Coke Ice

![Coke Ice](https://raw.githubusercontent.com/bitraveneth/TOPBAR/v1.0.0/public/images/hero/topbar-hero-volcano.webp)

*Classic cola with a cool icy finish.*

---

## What’s in v1.0.0

### Home

- **Hero carousel** — 9 slides (60000, 40000, collection, and flavor stories)
- **TOPBAR in Motion** — scroll-autoplay brand video, play/pause/mute, fullscreen, progress bar, social share (`#brand-motion`)
- **Stat cards** — 32+ flavors · 4 devices · 30+ countries · 10M+ units sold
- **Featured products** · categories · trending · brand values · testimonials
- **Loved By You** · blog preview · newsletter · community widget

### Products

| Device | Slug | Highlights |
|--------|------|------------|
| TOPBAR 8000 Puffs | `topbar-8000-puffs` | Compact form, big flavor |
| TOPBAR 40000 Puffs | `topbar-40000-puffs` | Digital screen, 15+ flavors, key specs bento with pack + device image |
| TOPBAR 50000 Puffs | `topbar-50000-puffs` | Ultra capacity |
| TOPBAR 60000 Puffs | `topbar-60000-puffs` | Maximum puff performance |

- **Flavour picker** — per-variant images and URLs (`?flavor=`)
- **Share** — top-right on product image (hover on desktop); WhatsApp, Facebook, Telegram, X, LinkedIn, Messenger, Email, Instagram/TikTok copy, native share
- **Key specs bento** · feature showcase · related carousel

### Site pages

About · Products · Product detail · Downloads · Support · Exhibition · Verify · Age gate · Light/dark theme

### CMS & backend (scaffolding)

- **Strapi 5** app in `cms/` — homepage, navigation, products, footer, site settings
- **Supabase** migrations + `admin-create-user` edge function for future admin

### Performance & polish

- Mobile font/preload audit · lazy media · theme guard
- Optimized hero WebP assets · reduced layout shift

---

## Deploy

```bash
npm ci
npm run build
```

Publish the **`dist/`** folder to your static host (Netlify, Vercel, Cloudflare Pages, S3, etc.).

Environment: no runtime env required for the static storefront; configure Supabase/Strapi when enabling CMS.

---

## Credits

Designed and developed by **Alex** — [GitHub](https://github.com/bitraveneth)

---

*Tag `v1.0.0` · TOPBAR © 2026*
