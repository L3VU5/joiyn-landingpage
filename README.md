# Joiyn Landing Page

Marketing website for the [Joiyn](https://joiyn.app) mobile app, served from Cloudflare Workers Static Assets (moving from GitHub Pages, see Deployment).

## Pages

| Page | File | Purpose |
|------|------|---------|
| Landing | `index.html` | Main marketing page — hero, features, how-it-works, download CTA |
| Privacy Policy | `privacy.html` | Required for App Store & Google Play submission |
| Support | `support.html` | FAQ + contact form for user support |

## Tech stack

Plain HTML + CSS — no build step required.

- **Font:** [Lexend](https://fonts.google.com/specimen/Lexend), matching the mobile app, self-hosted in `assets/fonts/lexend/` (OFL)
- **Icons:** [Tabler Icons](https://tabler.io/icons) 3.49.0, self-hosted subset in `assets/fonts/tabler-icons/` (MIT), see below
- **Colors:** Brand teal `#388F8C`, accent `#FFB980`
- **Assets:** App icon and illustration copied from the mobile project

## Fonts and icons

Nothing loads from third-party hosts: visitors' IPs only reach Cloudflare.

- Lexend: the latin and latin-ext files Google Fonts serves (one variable font each, weights 400 to 700 used), declared at the top of `assets/css/styles.css`.
- Tabler Icons: `assets/fonts/tabler-icons/tabler-icons.<hash>.woff2` holds only the icons the pages use, and `assets/css/tabler-icons.css` maps the `ti ti-<name>` classes to it. **After adding a new `ti-...` icon to a page, rebuild both** (needs `fonttools` and `brotli`, e.g. `python3 -m venv .venv && .venv/bin/pip install fonttools brotli`):

  ```bash
  npm pack @tabler/icons-webfont@3.49.0 && tar xzf tabler-icons-webfont-3.49.0.tgz   # in a scratch folder
  .venv/bin/python scripts/subset-icons.py path/to/package
  ```

  `_headers` caches `/assets/fonts/*` for a year, which is safe because the file names change with the content.

## Local development

Just open `index.html` in any browser — no server needed.

```bash
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

Or serve with any static file server:

```bash
npx serve .
# → http://localhost:3000
```

## Deployment (Cloudflare Workers)

The site is the `joiyn-landing` Worker: static assets only, no code, route `joiyn.app/*` (live since Nov 6 2026). The event page Worker (`joiyn-mvp/web/event-page`) owns `joiyn.app/events/*` and `joiyn.app/j/*`. Switch, zone settings and rollback are described once, in `joiyn-mvp/web/event-page/README.md` → "Moving joiyn.app to Workers". GitHub Pages still builds from `main` but no longer serves anything; it is only the rollback.

| File | Purpose |
|------|---------|
| `wrangler.jsonc` | Worker config: assets from the repo root, `html_handling: none` (URLs stay exactly as on GitHub Pages), `404.html` for unknown paths, route `joiyn.app/*` |
| `.assetsignore` | Files that are not published (`.git`, config, README, `CNAME`, `scripts`) |
| `_headers` | `Content-Type: application/json` for the AASA; `charset=utf-8` on HTML, JS and CSS (Workers omits it); a year of caching for `/assets/fonts/*` |
| `_redirects` | `/privacy`, `/support`, `/delete-account`, `/child-safety` served without the `.html` (200 rewrites) |

**A push to `main` does not deploy.** Deploy by hand after merging (needs `npx wrangler login` once):

```bash
npx wrangler dev                   # local preview, http://localhost:8787
npx wrangler deploy                # production

# from joiyn-mvp/web/event-page (npm install once):
node --import tsx scripts/fail-open.ts joiyn-landing    # every deploy resets the route's fail open
npm run verify -- https://joiyn.app --www --reference-dir ../../../joiyn-landingpage
```

`verify` checks every page byte for byte against this folder, the AASA and `assetlinks.json`, the 404 page, and the http and www redirects. To deploy on push instead, connect Workers Builds (Cloudflare dashboard → Workers & Pages → joiyn-landing → Settings → Builds, deploy command `npx wrangler deploy`); the fail open step then still needs doing by hand.

## Event deep links (`/events/*`)

Event invites use `https://joiyn.app/events/{eventId}?...`. These files enable universal links and a browser fallback:

| File | Purpose |
|------|---------|
| `.well-known/apple-app-site-association` | iOS Universal Links (opens app when installed) |
| `.well-known/assetlinks.json` | Android App Links verification |
| `404.html` | Page for unknown paths; its `/events/*` fallback is replaced by the event page Worker |

### Before deploy

1. **`assetlinks.json`** — replace `REPLACE_WITH_PLAY_APP_SIGNING_SHA256` with the **App signing key certificate** SHA-256 from Play Console → **Setup** → **App signing** (colon-separated hex, uppercase).
2. Requires a new native mobile build with `associatedDomains` / `intentFilters` (see `joiyn-mvp/mobile/JoiynMobile/app.json`).

### Verify after deploy

```bash
curl -s https://joiyn.app/.well-known/apple-app-site-association
curl -s https://joiyn.app/.well-known/assetlinks.json
curl -sI https://joiyn.app/events/test-id
```

Full check: `npm run verify -- https://joiyn.app --www` in `joiyn-mvp/web/event-page`.

## File structure

```
joiyn-landingpage/
├── index.html          # Landing page
├── privacy.html        # Privacy Policy
├── support.html        # Support & FAQ
├── 404.html            # Event deep-link fallback (app not installed)
├── .well-known/
│   ├── apple-app-site-association
│   └── assetlinks.json
├── .nojekyll           # Prevents GitHub Pages Jekyll processing (until GitHub Pages is off)
├── wrangler.jsonc      # Cloudflare Worker config (static assets)
├── _headers / _redirects / .assetsignore
├── assets/
│   ├── css/
│   │   └── styles.css  # All styles (CSS custom properties + responsive)
│   └── images/
│       ├── icon.png        # App icon 1024×1024 (sourced from mobile app)
│       ├── favicon.png     # 48×48 favicon
│       └── home.svg        # Hero illustration (sourced from mobile app)
└── README.md
```

## Updating store links

Store URLs in `index.html` and `404.html`:

```html
<!-- App Store -->
<a href="https://apps.apple.com/app/id6773401520" …>

<!-- Google Play -->
<a href="https://play.google.com/store/apps/details?id=com.shirocoding.joiyn" …>
```

## Privacy policy URL

Live site:

```
https://joiyn.app/privacy.html
```

The mobile app references this URL in `joiyn-mvp/mobile/JoiynMobile/src/config/legal.ts`.
