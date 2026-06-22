# TOPBAR storefront — project guide

This document is the **maintenance map** for the site: where routes, copy, images, and styling live so you can change things without hunting the codebase.

---

## Why this exists

The app is a **static React + Vite** site. There is **no live CMS or database** in this repo. Content is assembled from **JSON files** in `src/data/` plus defaults in `src/lib/cmsDefaults.js`, then exposed through `CmsContext` as `merged`. Editing those files (and assets under `public/`) is how you update the storefront.

For **deploying to a VPS or static host**, see [`docs/DEPLOYMENT.md`](./DEPLOYMENT.md).

---

## Tech stack (at a glance)

| Piece | Location / notes |
|--------|------------------|
| React 19 | UI |
| Vite 8 | Dev server, production build (`npm run build` → `dist/`) |
| React Router 7 | Client-side routes |
| Lucide React | Icons |
| Global CSS | `src/styles/global.css` + `src/styles/tokens.css` (design tokens, light/dark) |

Entry: `index.html` → `src/main.tsx` → `src/App.jsx`.

---

## Folder map

```
src/
  main.tsx              # React root, StrictMode, BrowserRouter
  App.jsx               # Wraps all routes in SiteLayout
  routes/index.jsx      # URL → page component table
  pages/                # Full-page views (Home, Products, ProductDetail, …)
  components/
    layout/             # Header, Footer, SiteLayout (shell + global widgets)
    common/             # HeroCarousel, AgeGateModal, BackToTop, …
    sections/           # Home sections (ProductShowcase, BrandValues, …)
  contexts/             # CmsProvider (static merged content), ThemeContext
  data/*.json           # Primary editable content (imported into defaults)
  lib/cmsDefaults.js    # Merges JSON + inline defaults (site notice, footer, newsletter, …)
  styles/               # tokens.css, global.css
public/                 # Static files served as-is (images, favicon)
docs/
  project-guide.md      # This file
  image-size-reference.md  # Hero / product image sizes & ratios
```

---

## Routes (add or rename pages)

**File:** [`src/routes/index.jsx`](../src/routes/index.jsx)

Each `{ path, element }` is one route. `App.jsx` mounts every route inside `SiteLayout` (header, footer, age gate).

- **New page:** create `src/pages/YourPage.jsx`, import it in `routes/index.jsx`, add `{ path: '/your-path', element: <YourPage /> }`.
- **404:** catch-all `path: '*'` must stay last.

There is a `src/pages/News.jsx` file in the repo that is **not** wired in `routes/index.jsx`; it will not appear until you add a route.

---

## Content model — what to edit

### 1. Products (names, images, specs, flavor cards)

**Primary data:** [`src/data/products.json`](../src/data/products.json)

- Each product has `slug`, `name`, `image`, `colorVariants`, feature blocks, etc.
- **URLs:** product pages are `/products/{slug}` (see `routes`).

**Also check:** [`src/lib/cmsDefaults.js`](../src/lib/cmsDefaults.js)

- `products.slugAliases` — old slugs that should redirect to a current product (used on product detail).
- `home.flavorOrderBySlug` — order of flavor names shown in “Best Selling Flavors” per product slug.

**Accent colors** on the home showcase are partly hardcoded in [`src/pages/Home.jsx`](../src/pages/Home.jsx) (`showcaseAccentBySlug`) and similarly in [`src/pages/Products.jsx`](../src/pages/Products.jsx).

---

### 2. Home page — hero slider

**Slide list + copy:** [`src/data/homeSections.json`](../src/data/homeSections.json) — `heroSlides[]` (`image`, `title`, `subtitle`, `cta`, `link`, etc.).

**Images:** paths like `/images/hero/....webp` live under **`public/images/hero/`**.

**Carousel behavior / a11y:** [`src/components/common/HeroCarousel.jsx`](../src/components/common/HeroCarousel.jsx).

**Visual treatment (overlays, mobile height):** [`src/styles/global.css`](../src/styles/global.css) — search for `.parallax-hero`.

**Image dimensions:** [`docs/image-size-reference.md`](./image-size-reference.md) section 1.

---

### 3. Navigation (header + mega menu)

**Data:** [`src/data/navigation.json`](../src/data/navigation.json)

**Rendering / mobile menu:** [`src/components/layout/Header.jsx`](../src/components/layout/Header.jsx)

---

### 4. Footer, legal strip, copyright

**Defaults:** [`src/lib/cmsDefaults.js`](../src/lib/cmsDefaults.js) — `footer` object (`columns`, `copyright`, `legalLinks`, `giantWordmark`).

There is no separate `footer.json`; change `cmsDefaults.js` or refactor to import a JSON file if you prefer.

---

### 5. Site-wide chrome (notice bar, logo)

**Defaults:** [`src/lib/cmsDefaults.js`](../src/lib/cmsDefaults.js) — `site` (`warningBold`, `warningText`, `headerLogo`, `headerLogoAlt`).

Logo file path points under **`public/`** (e.g. `/images/topbar-logo.png`).

---

### 6. Newsletter block (home)

**Copy / labels:** [`src/lib/cmsDefaults.js`](../src/lib/cmsDefaults.js) — `newsletter`.

**Layout / styling:** [`src/components/sections/NewsletterSignup.jsx`](../src/components/sections/NewsletterSignup.jsx) + CSS classes in `global.css`.

---

### 7. “Loved by you” / community strip

**Data:** [`src/data/lovedByYou.json`](../src/data/lovedByYou.json)

**Component:** [`src/components/sections/LovedByYou.jsx`](../src/components/sections/LovedByYou.jsx) (may still reference paths under `public/images/community/`).

---

### 8. Home blog preview cards

**Data:** [`src/data/homeBlogPreview.json`](../src/data/homeBlogPreview.json)

**Component:** [`src/components/sections/HomeBlogPreview.jsx`](../src/components/sections/HomeBlogPreview.jsx)

---

### 9. Age verification (21+)

**Copy + logic:** [`src/components/common/AgeGateModal.jsx`](../src/components/common/AgeGateModal.jsx)

**Styles:** [`src/styles/global.css`](../src/styles/global.css) — search `.age-gate`.

Session key: `sessionStorage` (see component for exact keys).

---

### 10. Theme (light / dark) and colors

**Tokens (CSS variables):** [`src/styles/tokens.css`](../src/styles/tokens.css) — `:root` vs `:root[data-theme='light']`.

**Theme toggle + persistence:** [`src/contexts/ThemeContext.jsx`](../src/contexts/ThemeContext.jsx), [`src/contexts/useTheme.js`](../src/contexts/useTheme.js).

**Most layout / component styling:** [`src/styles/global.css`](../src/styles/global.css) (large file — use editor search for class names from components).

---

### 11. Fonts and document title

**Fonts + default theme on first paint:** [`index.html`](../index.html) (Google Fonts links, `<html data-theme="...">`).

**Browser tab title:** `<title>` in `index.html`.

---

## Static assets (`public/`)

Anything referenced as `/something.ext` is served from **`public/something.ext`**.

- Product and marketing images: `public/images/...`
- Favicon: `public/favicon.png` (and `index.html` link)

After adding or replacing images, keep **ASCII filenames** when possible for Linux servers, and prefer **WebP** for large photos (see `image-size-reference.md`).

---

## CMS context (important mental model)

[`src/contexts/CmsContext.jsx`](../src/contexts/CmsContext.jsx) always provides:

```js
const { merged } = useCms()
```

`merged` is the return value of **`getDefaultCmsMap()`** in [`src/lib/cmsDefaults.js`](../src/lib/cmsDefaults.js). There is **no network fetch** in this branch of the project — `loading` is always `false` and `refresh` is a no-op.

If you later plug in a real API again, this provider is the natural place to merge **remote + defaults**.

---

## Commands you will use

```bash
npm install          # dependencies
npm run dev          # local dev (default Vite port)
npm run build        # production output to dist/
npm run preview      # serve dist/ locally
npm run lint         # ESLint
```

---

## Quick “I want to change…” index

| Goal | Start here |
|------|------------|
| Add a route / page | `src/routes/index.jsx`, `src/pages/` |
| Edit products or slugs | `src/data/products.json`, `cmsDefaults.js` (`slugAliases`) |
| Hero slides text or image URL | `src/data/homeSections.json`, `public/images/hero/` |
| Main menu | `src/data/navigation.json`, `Header.jsx` |
| Footer links / copyright | `src/lib/cmsDefaults.js` → `footer` |
| Top nicotine notice / logo path | `src/lib/cmsDefaults.js` → `site` |
| Home “Our Products” title / featured slugs / flavor order | `src/lib/cmsDefaults.js` → `home` |
| Newsletter wording | `src/lib/cmsDefaults.js` → `newsletter` |
| Age gate copy | `AgeGateModal.jsx` + `.age-gate` in `global.css` |
| Colors / light theme | `tokens.css`, then `global.css` for components |
| Page-specific layout | `src/pages/*.jsx` + matching classes in `global.css` |
| Image export sizes | `docs/image-size-reference.md` |

---

## Related docs

- [`README.md`](../README.md) — install, build, high-level overview  
- [`docs/image-size-reference.md`](./image-size-reference.md) — asset dimensions and safe areas  

If this guide drifts out of date after a refactor, update **`CMS_DOCUMENT_KEYS`** in `cmsDefaults.js` and this file together so labels stay aligned.
