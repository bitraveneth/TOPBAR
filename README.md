# TOPBAR

A sleek, high-performance vape e-commerce platform for TopBar, featuring a premium UI, product discovery, and seamless checkout experience.

## Development

```bash
npm install
npm run dev
```

Built with [React](https://react.dev) and [Vite](https://vite.dev).

For **where to change routes, JSON content, images, and styles**, see [`docs/project-guide.md`](./docs/project-guide.md).

## Build

```bash
npm run build       # production bundle in dist/
npm run preview     # local preview of the production build
```

## Content

Site content is sourced from the JSON files in [`src/data/`](./src/data) (navigation, products, home sections, etc.) with defaults defined in [`src/lib/cmsDefaults.js`](./src/lib/cmsDefaults.js). Edit those files to update the storefront.

## Image asset reference

See [`docs/image-size-reference.md`](./docs/image-size-reference.md) for the recommended dimensions and aspect ratios for hero, product, and showcase imagery.
