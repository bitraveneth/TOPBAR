# TOPBAR

A sleek, high-performance vape e-commerce platform for TopBar, featuring a premium UI, product discovery, and seamless checkout experience.

## Development

```bash
npm install
npm run dev
```

Built with [React](https://react.dev) and [Vite](https://vite.dev).

## CMS Modes

The storefront can read CMS content from Strapi, Supabase, or both.

Configure in `.env`:

```bash
VITE_CMS_SOURCE=auto
VITE_STRAPI_URL=http://localhost:1337
```

`VITE_CMS_SOURCE` values:

- `auto`: default fallback chain `defaults -> Strapi -> Supabase`
- `strapi`: `defaults -> Strapi`
- `supabase`: `defaults -> Supabase`

For Strapi-driven content, enable `find` permission for the `Public` role on:

- `navigation`
- `homepage`
- `footer`
- `site-setting`
- `product`
