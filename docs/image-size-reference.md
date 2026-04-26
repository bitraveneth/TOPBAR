# Image size reference (slider → product areas)

**Global rules**

- **Container max width** for main content: `--container: 1320px` in [`src/styles/tokens.css`](../src/styles/tokens.css) (content uses `min(1320px, 94vw)` with horizontal padding in [`.container`](../src/styles/global.css)).
- **Raster assets**: almost all images use **`object-fit: cover`**, so the **center** of a wider/taller file may be **cropped**. Match the **aspect ratio** of the slot to avoid important details at the edges being cut.
- **Retina / sharpness**: export at about **1.5–2×** the largest on-screen size you expect, then optimize (e.g. WebP); vectors (SVG) for logos.

---

## 1. Home hero / slider (HeroCarousel)

**CSS:** [`.parallax-hero`](../src/styles/global.css) — `height: 100vh`, `min-height: 600px` (at `max-width: 860px`, `min-height: 400px`).

**Image behavior:** [`.parallax-hero__img`](../src/styles/global.css) — `width/height: 100%` of the hero, `object-fit: cover`.

**Implied shape:** full viewport, typically **~16:9 to wider** depending on the monitor; on phones it is **tall** (e.g. 9:16 feel).

**Practical prep**

- **Ratio:** no single ratio; **landscape, wide** is safe (e.g. **16:9** or **21:9** art).
- **Export size (examples):** **1920×1080** or **2560×1440**; keep key subject **inside a safe area** (center ~70%) to survive crop and dark gradients/overlay.
- **Data path:** [`homeSections.json` `heroSlides[].image`](../src/data/homeSections.json).

---

## 2. “Explore Our Products” (ProductShowcase, home)

**CSS:** [`.showcase-card`](../src/styles/global.css) — `aspect-ratio: 3 / 4` (portrait). [`.showcase-card__img`](../src/styles/global.css) — fills the card, `object-fit: cover`.

**Layout:** 3 equal columns; at `max-width: 960px` [`.showcase-grid`](../src/styles/global.css) is **1 column**, `max-width: 420px` (cards centered).

**Implied on-screen size (order of magnitude)**

- **Desktop (3 col):** each card width ≈ one-third of the content area; height = width × (4/3) — e.g. **~400–420px** wide → **~530–560px** tall.
- **Mobile column:** up to **420px** wide → **~560px** tall.

**Practical prep**

- **Export ratio: 3:4** (e.g. **1200×1600** or **900×1200** for 2× around the mobile cap).
- **Data path:** `image` in [`src/data/products.json`](../src/data/products.json) for the first **three** products shown on the home (same JSON drives [`ProductShowcase` `limit={3}`](../src/pages/Home.jsx)).

---

## 3. “Loved by you” (LovedByYou)

**CSS:** [`.loved-card`](../src/styles/global.css) — **fixed** `width: 280px`, `height: 370px` (ratio ≈ **28:37**). Images: `object-fit: cover`, full bleed.

**Practical prep**

- **Target ratio:** **280×370** (or **560×740** at 2×). Not a standard 3:4/4:3—**slightly taller** than 3:4.
- **Data:** hardcoded in [`LovedByYou.jsx`](../src/components/sections/LovedByYou.jsx) (`/images/community/...`).

---

## 4. All products grid (`/products`)

**CSS:** [`.product-card__image`](../src/styles/global.css) — `aspect-ratio: 1 / 1` (square). [`.product-grid`](../src/styles/global.css) — `minmax(260px, 1fr)`; at `max-width: 420px` the grid can go to a single column.

**Practical prep**

- **Export ratio: 1:1** (e.g. **800×800** or **1000×1000** for Retina on ~400–500px display width).
- **Data:** same [`products.json` `image`](../src/data/products.json) as the listing card and detail (unless you split assets later in code—currently one URL per product).

---

## 5. Product detail page

**CSS:** [`.detail-image`](../src/styles/global.css) — `aspect-ratio: 1 / 1`; image `object-fit: cover`. [`ProductDetail.jsx`](../src/pages/ProductDetail.jsx) + related product mini-cards re-use [`.product-card__image`](../src/styles/global.css) (also **1:1**).

**Layout:** [`.detail-layout`](../src/styles/global.css) — 2 columns on large screens; stacks at `max-width: 860px` — so the main image is roughly **half the container** wide on desktop.

**Practical prep**

- **Ratio: 1:1**; for large detail views, **1200×1200** or **1600×1600** is reasonable if file size allows.

---

## 6. Logos (not product, but for asset prep)

- **Header:** [`.brand-logo`](../src/styles/global.css) — `height: 32px`, `width: auto` (`/images/topbar-logo.svg`).
- **Footer:** [`.footer-brand-logo`](../src/styles/global.css) — `height: 28px`, `width: auto`.

Prefer **SVG**; if raster, @2x height **64px / 56px** width proportional.

---

## 7. Patterns defined in CSS but not wired on a page today

If you add these later, match:

| Block | File | Ratio | Notes |
|--------|------|--------|--------|
| Featured / New Arrivals | [`.featured-card`](../src/styles/global.css) | **16:10** | Two-column grid; images darkened. |
| Category grid | [`.category-card`](../src/styles/global.css) | **4:3** | `minmax(200px, 1fr)` columns. |

[`NewArrivals.jsx`](../src/components/sections/NewArrivals.jsx) and [`CategoryGrid.jsx`](../src/components/sections/CategoryGrid.jsx) are **not imported** in `src/pages` at the moment, but the above applies if you connect them.

---

### Quick decision guide for **one** product image used everywhere today

`products.json` uses **one** `image` URL for **explore (3:4 crop)**, **grid (1:1)**, and **detail (1:1)**. The strictest match is **square (1:1)** so the listing and detail are uncropped; the **showcase** will **crop** top/bottom or sides to **3:4**—place the subject with **padding in the frame** or accept crop on the 3:4 card. If the hero slide uses a **separate** path in `homeSections.json`, you can use a **wide 16:9** hero art independent of the product file.
