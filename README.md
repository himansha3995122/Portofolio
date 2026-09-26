# Portfolio

A personal portfolio site: React + Tailwind on the frontend, Express on the
backend, with a password-gated admin panel at `/admin` to edit everything —
profile, nav sections, visuals, projects, books, and LeetCode problems.

```
portfolio-app/
  server/   Express API + JSON file storage + image uploads
  client/   React (Vite) + Tailwind frontend
```

Content lives on the server (`server/data/db.json`), not in the browser, so
edits made through `/admin` are immediately visible to every visitor — no
export/import step.

## 1. Install

```
cd server && npm install
cd ../client && npm install
```

## 2. Configure

```
cd server
cp .env.example .env
```

Open `server/.env` and set:
- `JWT_SECRET` — any long random string (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- `ADMIN_PASSWORD` — the password you'll use to log into `/admin`

Everywhere else worth changing (page title, meta tags, colors) is marked
with a `CHANGE ME` comment — search for that string across the repo.

## 3. Run in development

Two terminals:

```
# terminal 1
cd server && npm run dev      # http://localhost:4000

# terminal 2
cd client && npm run dev      # http://localhost:5173
```

Open http://localhost:5173. The Vite dev server proxies `/api` and
`/uploads` to the Express server, so both run as if they were one app.

Visit http://localhost:5173/admin and log in with your `ADMIN_PASSWORD`.

## 4. Build for production

```
cd client && npm run build
```

This outputs `client/dist`. The Express server (`server/src/index.js`)
automatically serves that folder when it exists, plus the `/api` routes,
from **one process on one port** — so your whole site is a single
deployable Node app.

## 5. Run in production

```
cd server && npm start
```

Make sure `server/.env` has real values (not the defaults) before this step.

## 5b. Run with Docker

The `Dockerfile` builds the client and packages it with the server into
one image; `docker-compose.yml` runs it with two named volumes
(`portfolio-data`, `portfolio-uploads`) so admin edits and uploaded images
survive rebuilds.

```
cp server/.env.example server/.env   # then set JWT_SECRET and ADMIN_PASSWORD
docker compose up -d --build         # http://localhost:4000
```

- Use a different host port with `HOST_PORT=8080 docker compose up -d`.
- The container sets `NODE_ENV=production` and **refuses to start** if
  `JWT_SECRET` or `ADMIN_PASSWORD` is unset.
- Health check: `GET /api/health`.
- Update after pulling new code: `docker compose up -d --build` (the volumes are kept).
- Back up content: `docker compose cp portfolio:/app/server/data ./backup-data`
  and `docker compose cp portfolio:/app/server/uploads ./backup-uploads`.
- On first start, the volume is seeded from the `server/data/db.json` in
  the repo. After that, the volume copy is the source of truth.

## 5b-cPanel. Deploy to cPanel hosting (Setup Node.js App)

No Docker needed. cPanel runs the app with Phusion Passenger behind its
own web server, and AutoSSL provides HTTPS.

**Package it** (on your PC):

```
powershell -File scripts/package-cpanel.ps1
```

This builds the client and creates `deploy/portfolio-cpanel.zip`. The zip
never includes `server/data/db.json`, `server/uploads`, or `.env`, so
re-uploading it can't overwrite your live content, images, or secrets.

**First deploy**

1. **File Manager:** create a folder `portfolio` in your home directory
   (e.g. `/home/<user>/portfolio`, *not* inside `public_html`). Upload
   the zip there and **Extract** it. You should now have
   `portfolio/server` and `portfolio/client/dist`.
2. **Setup Node.js App → Create Application:**
   - Node.js version: the highest available (18 or newer is required)
   - Application mode: **Production**
   - Application root: `portfolio/server`
   - Application URL: your domain
   - Application startup file: `app.cjs`
   - Environment variables: add `JWT_SECRET` (long random string) and
     `ADMIN_PASSWORD`
3. Click **Create**, then **Run NPM Install**, then **Restart**.
4. **SSL/TLS Status:** make sure your domain has an AutoSSL certificate
   (run AutoSSL if it doesn't), so the site and the admin login use HTTPS.
5. Open `https://yourdomain.com` and `https://yourdomain.com/admin`.

**Deploying updates:** run the package script again, upload and extract
the new zip over `portfolio/` (overwrite existing files), then click
**Restart** in Setup Node.js App. Only click **Run NPM Install** if
`server/package.json` changed.

**Your content** lives in `portfolio/server/data/db.json` and
`portfolio/server/uploads/` on the hosting account. Back those up now and
then (download from File Manager, or use cPanel's Backup tool).

**If it doesn't start:** check `portfolio/server/stderr.log` (if your host
writes one) or the error shown in the browser. The usual causes are a
Node version below 18 or missing `JWT_SECRET` / `ADMIN_PASSWORD`, since the
server refuses to start in production without them.

## 5c. Deploy to your own server (VPS)

The `prod` compose profile adds [Caddy](https://caddyserver.com) in front of
the app. It gets and renews a free Let's Encrypt HTTPS certificate on its
own. The app's port 4000 is bound to localhost only, so all public traffic
goes through Caddy.

**One-time setup**

1. **DNS:** at your domain registrar, add an `A` record for your domain
   (and `www`, if you want it) pointing at the server's public IP. Wait
   until `ping yourdomain.com` shows that IP.
2. **Firewall:** allow ports 22 (SSH), 80, and 443. On Ubuntu:
   `sudo ufw allow OpenSSH && sudo ufw allow 80 && sudo ufw allow 443 && sudo ufw enable`
3. **Install Docker** on the server:
   `curl -fsSL https://get.docker.com | sudo sh && sudo usermod -aG docker $USER`
   (log out and back in afterwards).
4. **Get the code onto the server:** `git clone <your-repo-url> portfolio && cd portfolio`
5. **Create the two env files.** Neither is committed, so create them on
   the server:
   ```
   cp server/.env.example server/.env   # set JWT_SECRET and ADMIN_PASSWORD
   cp .env.example .env                 # set DOMAIN=yourdomain.com
   ```
6. **Start it:**
   ```
   docker compose --profile prod up -d --build
   ```
   Open `https://yourdomain.com` and `https://yourdomain.com/admin`. The
   first request can take a few seconds while the certificate is issued.
   If it fails, check `docker compose logs caddy`. The cause is almost
   always DNS not pointing at the server yet, or ports 80/443 being blocked.

**Deploying updates**

```
git pull
docker compose --profile prod up -d --build
```

Your content, uploads, and certificates are in Docker volumes, so they're
kept across updates. Don't run `docker compose down -v`: `-v` deletes
the volumes.

Both containers use `restart: unless-stopped`, so they come back up after
a server reboot on their own.

## 6. Deploy to your own domain

Any host that runs a persistent Node process works (Render, Railway,
Fly.io, a VPS, etc.) — this app needs a real server, not static hosting,
because the admin panel writes to `server/data/db.json` and `server/uploads/`
on disk.

General shape, regardless of host:
1. Push this repo to GitHub.
2. Point the host at the repo, with a build step of
   `npm install && npm run build` inside `client/`, and a start command of
   `npm start` inside `server/`.
3. Set `JWT_SECRET` and `ADMIN_PASSWORD` as environment variables on the host
   (not in a committed `.env` file).
4. Point your domain's DNS at the host (most hosts give you a CNAME target
   or an IP to use — follow their instructions).
5. Make sure the host gives you a **persistent disk** for `server/uploads`
   and `server/data`, or those get wiped on redeploy. If your host is
   ephemeral-filesystem-only (some serverless platforms are), swap
   `server/src/db.js` for a real database and image uploads for an object
   store (S3, Cloudinary, etc.) instead of local disk — the routes don't
   need to change, only `db.js` and `utils/upload.js`.

## Notes on the admin password

The password is checked **server-side** (`server/src/routes/auth.routes.js`),
never shipped to the browser — a real improvement over a client-only check.
Logging in gets you a JWT stored in the browser's `localStorage`, sent as a
Bearer token on every admin request. For a personal single-admin site this
is a reasonable tradeoff of simplicity vs. security; if you want it hardened
further, moving the token into an httpOnly cookie would prevent it being read
by injected/third-party JS, at the cost of a little more setup (CSRF
handling, same-site cookie config).
