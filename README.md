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

- **Font:** [Lexend](https://fonts.google.com/specimen/Lexend) (via Google Fonts), matching the mobile app
- **Colors:** Brand teal `#388F8C`, accent `#FFB980`
- **Assets:** App icon and illustration copied from the mobile project

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

The site is the `joiyn-landing` Worker: static assets only, no code, route `joiyn.app/*`. The event page Worker (`joiyn-mvp/web/event-page`) owns `joiyn.app/events/*` and `joiyn.app/j/*`. The move from GitHub Pages (rehearsal on `next.joiyn.app`, switch, rollback) is described once, in `joiyn-mvp/web/event-page/README.md` → "Moving joiyn.app to Workers". Until that switch, GitHub Pages still serves the site from `main`.

| File | Purpose |
|------|---------|
| `wrangler.jsonc` | Worker config: assets from the repo root, `html_handling: none` (URLs stay exactly as on GitHub Pages), `404.html` for unknown paths, routes for production and the `rehearsal` env |
| `.assetsignore` | Files that are not published (`.git`, config, README, `CNAME`) |
| `_headers` | `Content-Type: application/json` for the AASA |
| `_redirects` | `/privacy`, `/support`, `/delete-account`, `/child-safety` served without the `.html` (200 rewrites) |

```bash
npx wrangler dev                   # local preview, http://localhost:8787
npx wrangler deploy --env=""       # production (or push to main once Workers Builds is connected)
```

After the switch, Workers Builds (Cloudflare dashboard → joiyn-landing → Settings → Builds, deploy command `npx wrangler deploy --env=""`) deploys every push to `main`.

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
