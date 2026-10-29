# TOPBAR v3.0.0

Customers can scratch the pack and check a **16 Digit Code** on the site. The same release adds the admin desk for codes, imports, and page content.

| | |
|---|---|
| **Version** | 3.0.0 |
| **Previous** | [v2.0.0](./RELEASE-v2.0.0.md) |
| **Repository** | [bitraveneth/TOPBAR](https://github.com/bitraveneth/TOPBAR) |
| **Stack** | React · Vite · Express · Prisma · Postgres |

This tag also includes the v2.0.1 video work: smaller promo films, later brand-film loading, and the desktop product-image layout fix.

---

## Product check

Open `/verify-products`.

- Scratch the coating on the pack, then type the 16 Digit Code. No link is required.
- A first check confirms the pack.
- Later checks say the code was already verified, or that it has been checked too many times.
- An unknown code is reported as not authentic.
- On a desktop, the tips beside the form follow the same scratch-and-type steps. On a phone, those tips stay hidden and the three steps sit under the form.

## Admin desk

Open `/admin/login`.

- Sign in with the admin username and password from the server `.env`.
- Codes open in place. Each row can be deleted, and that delete also removes its check history.
- Import a `.txt` file with one security code per line. Choosing the file checks it. Press **Save codes now** to store it. The page shows whether the save worked.
- Recent imports can be removed from the history list. That does not delete the codes already saved.
- New checks store the country and region when the visitor address can be located. Older checks stay as they were.
- Activity is grouped by code.
- Homepage, products, downloads, exhibition, and support can be edited in the desk. About, news, and compliance stay in the site files.
- Image uploads are limited to 1 MB.
- Additional admin users can be added, with separate access for the desk and the content pages.

---

## Update the server

Do this on the machine that serves topbarvape.com. The site keeps working on the old build until you switch it.

1. In the site directory:

```bash
git fetch --tags
git checkout v3.0.0
```

2. Copy `.env.example` to `.env` if the server does not have one yet. Fill in the database URLs, the first admin username, a strong admin password, and two long random secrets (`ADMIN_SESSION_SECRET` and `IP_HASH_SALT`). Keep that file on the server only.

3. Install, migrate, and build:

```bash
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
```

4. Start the API and leave it running. `systemd` is the usual way:

```bash
NODE_ENV=production node --env-file=.env server/index.js
```

It listens on port `4000`.

5. In Nginx, send `/api/` to `http://127.0.0.1:4000` and serve `/uploads/` from `public/uploads/`. The example is [`deploy/nginx-topbar.conf.example`](../deploy/nginx-topbar.conf.example). The public site files stay in `dist/`.

```bash
sudo nginx -t && sudo systemctl reload nginx
```

6. Check `/verify-products`, then sign in at `/admin/login`. The password in `.env` is used only to create the first admin. After that, change passwords from the users page.

---

## Credits

Designed and developed by **Alex** — [GitHub](https://github.com/bitraveneth)

*Tag `v3.0.0` · TOPBAR © 2026*
