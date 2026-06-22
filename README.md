# TOPBAR

Official marketing storefront for the TOPBAR disposable vape lineup — premium UI, product discovery, flavour pickers, brand film, and community content.

**Current release:** [v2.0.0](docs/RELEASE-v2.0.0.md) · [Deploy guide](docs/DEPLOYMENT.md)

## Development

```bash
npm install
npm run dev
```

Open http://localhost:5173 — built with [React](https://react.dev) and [Vite](https://vite.dev).

For **where to change routes, JSON content, images, and styles**, see [`docs/project-guide.md`](./docs/project-guide.md).

## Build

```bash
npm run build       # production bundle in dist/
npm run preview     # local preview of the production build
npm run lint        # ESLint
npm run images:mobile   # generate -480w / -960w responsive WebP variants
```

## Deploy on a server

1. `npm ci && npm run build`
2. Upload the **`dist/`** folder to your web server
3. Configure SPA fallback (`try_files` in Nginx)

Full walkthrough: **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)** · example Nginx config in [`deploy/nginx-topbar.conf.example`](./deploy/nginx-topbar.conf.example)

## Content

Site content is sourced from JSON in [`src/data/`](./src/data) with defaults in [`src/lib/cmsDefaults.js`](./src/lib/cmsDefaults.js). Edit those files and assets under `public/` to update the storefront.

## Documentation

| Doc | Purpose |
|-----|---------|
| [RELEASE-v2.0.0.md](docs/RELEASE-v2.0.0.md) | v2 changelog and highlights |
| [RELEASE-v1.0.0.md](docs/RELEASE-v1.0.0.md) | v1 feature reference |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Server deploy (Nginx, SSL, updates) |
| [project-guide.md](docs/project-guide.md) | Maintenance map for developers |
| [image-size-reference.md](docs/image-size-reference.md) | Recommended image dimensions |

## Credits

Designed and developed by **Alex** — [GitHub](https://github.com/bitraveneth)
