# Deploying TOPBAR on a server

The marketing pages are a **static single-page app**. You build them once, then Nginx serves the `dist/` folder.

From **v3.0.0**, product verification and the admin desk also need a Node API and Postgres running on the server. See [Updating to v3.0.0](#updating-to-v300) and [RELEASE-v3.0.0.md](./RELEASE-v3.0.0.md).

---

## What you need

| Requirement | Notes |
|-------------|--------|
| **Build machine** | Your PC, CI, or the server itself |
| **Node.js 20+** | Build the site, and keep the v3 verification API running |
| **Git** | To clone/pull the repo |
| **Web server** | Nginx (recommended), Apache, Caddy, or a static host |
| **Domain + DNS** | A record or CNAME pointing to your server IP |
| **SSL certificate** | Let’s Encrypt (free) via Certbot |

---

## Overview

```
┌─────────────┐     npm run build      ┌──────────┐
│  Git repo   │  ──────────────────►   │  dist/   │
│  (source)   │                        │  folder  │
└─────────────┘                        └────┬─────┘
                                            │
                                            ▼
                                    ┌───────────────┐
                                    │ Nginx / Apache│
                                    │ serves files  │
                                    │ + SPA fallback│
                                    └───────────────┘
```

---

## Step 1 — Build the site

On your build machine (local PC or server):

```bash
# Clone (first time)
git clone https://github.com/bitraveneth/TOPBAR.git
cd TOPBAR

# Use the v3 release
git checkout v3.0.0

# Install exact dependencies and build
npm ci
npm run build
```

When it finishes, everything you need is in **`dist/`**:

- `dist/index.html` — entry page
- `dist/assets/` — JS, CSS, fonts (hashed filenames for cache busting)
- Images and videos are bundled/copied from `public/` into `dist/` as needed

**Test locally before uploading:**

```bash
npm run preview
# Open http://localhost:4173
```

---

## Step 2 — Copy `dist/` to the server

### Option A — Build on the server (simplest)

If Node is installed on the VPS:

```bash
ssh user@your-server-ip
cd /var/www/topbar   # or your deploy path
git pull origin main   # or checkout v3.0.0
npm ci
npm run build
```

Point Nginx at `/var/www/topbar/dist` (see Step 3).

### Option B — Build locally, upload with SCP

From your PC (PowerShell or bash):

```bash
# After npm run build locally
scp -r dist/* user@your-server-ip:/var/www/topbar/dist/
```

### Option C — rsync (Linux/Mac, incremental updates)

```bash
rsync -avz --delete dist/ user@your-server-ip:/var/www/topbar/dist/
```

`--delete` removes old hashed assets so stale JS/CSS does not linger.

---

## Step 3 — Nginx configuration (recommended)

Install Nginx on Ubuntu/Debian:

```bash
sudo apt update
sudo apt install nginx
```

Create the site config (example: `deploy/nginx-topbar.conf.example` in this repo):

```bash
sudo nano /etc/nginx/sites-available/topbar
```

Paste and adjust `server_name` and `root`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name topbar.example.com www.topbar.example.com;

    root /var/www/topbar/dist;
    index index.html;

    # Gzip for text assets
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 256;

    # Long cache for hashed build assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Cache images/videos from public folder (no hash in filename — use shorter TTL)
    location /images/ {
        expires 7d;
        add_header Cache-Control "public";
    }

    location /videos/ {
        expires 7d;
        add_header Cache-Control "public";
    }

    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads/ {
        alias /var/www/topbar/public/uploads/;
        expires 7d;
        add_header Cache-Control "public";
    }

    # SPA fallback — required for React Router
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/topbar /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Why `try_files`?** Routes like `/products/topbar-40000-puffs` do not exist as real files. Nginx must serve `index.html` so React Router can handle the URL.

---

## Step 4 — HTTPS (Let’s Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d topbar.example.com -d www.topbar.example.com
```

Certbot edits your Nginx config for SSL and sets up auto-renewal. Verify:

```bash
sudo certbot renew --dry-run
```

---

## Step 5 — Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## Updating to v3.0.0

v3 adds the product check and the admin desk. The marketing pages are still the built `dist/` folder. The check itself needs the API process and a Postgres database. Full steps are in [RELEASE-v3.0.0.md](./RELEASE-v3.0.0.md).

```bash
cd /var/www/topbar
git fetch --tags
git checkout v3.0.0
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
```

Create `.env` from `.env.example` before the first API start. Then keep this running (systemd is the usual way):

```bash
NODE_ENV=production node --env-file=.env server/index.js
```

Point Nginx `/api/` at `127.0.0.1:4000` and `/uploads/` at `public/uploads/`, using [`deploy/nginx-topbar.conf.example`](../deploy/nginx-topbar.conf.example). Then:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## Apache (alternative)

Enable `mod_rewrite` and set `DocumentRoot` to `dist/`. Add in your VirtualHost or `.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## Static hosts (no VPS)

These work without managing a server:

| Host | Deploy |
|------|--------|
| **Netlify** | Connect repo; build `npm run build`; publish `dist` |
| **Vercel** | Same; framework preset Vite |
| **Cloudflare Pages** | Build command `npm run build`; output `dist` |
| **GitHub Pages** | Use `base` in `vite.config` if serving from a subpath |

For client-side routing, enable **SPA fallback** / “redirect all to index.html” in the host dashboard.

---

## Environment variables

From v3.0.0, copy `.env.example` to `.env` on the server and fill it in. Do not commit `.env`.

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Pooled Postgres URL used by the API |
| `DIRECT_URL` | Direct Postgres URL used by `prisma migrate deploy` |
| `ADMIN_USERNAME` | First admin account, created once on startup |
| `ADMIN_PASSWORD` | Password for that first account. Set a strong one before the first start. Later changes are made in the admin users page |
| `ADMIN_SESSION_SECRET` | Signs the admin sign-in cookie. Keep it stable |
| `IP_HASH_SALT` | Salt for hashed visitor addresses. Keep it stable |
| `PORT` | API port, default `4000` |

Set `NODE_ENV=production` when you start the API so the sign-in cookie is marked Secure.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| **404 on refresh** at `/products/...` | Add SPA `try_files` / Apache rewrite (Step 3) |
| **Blank page after deploy** | Check browser console; often wrong `base` path or missing `dist` upload |
| **Old styles after update** | Hard refresh (Ctrl+Shift+R) or use `rsync --delete` |
| **Huge first load** | Normal — videos in `public/videos/` are large; CDN or separate video host helps |
| **Build fails on server** | Ensure Node 20+; run `npm ci` not `npm install` |

---

## Quick checklist

- [ ] `git checkout v3.0.0`
- [ ] `npm ci && npm run build`
- [ ] `dist/` on server at Nginx `root`
- [ ] `try_files` SPA fallback configured
- [ ] DNS A record → server IP
- [ ] HTTPS via Certbot
- [ ] Test home, a product page, and direct URL refresh

---

*See also [RELEASE-v3.0.0.md](./RELEASE-v3.0.0.md) and [project-guide.md](./project-guide.md).*
