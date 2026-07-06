# Joiyn Landing Page

Marketing website for the [Joiyn](https://joiyn.app) mobile app, deployed via GitHub Pages.

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

## Deployment (GitHub Pages)

### Option A — deploy from `main` branch root (recommended)

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Set **Source** to `Deploy from a branch`, branch `main`, folder `/` (root).
4. Save. With a custom domain configured, the site is published at `https://joiyn.app` (GitHub Pages also serves at `https://<username>.github.io/joiyn-landingpage/` until the custom domain is set).

### Option B — deploy from `/docs` folder

Move all files into a `docs/` sub-folder and set the Pages source to `main / docs`.

### Option C — GitHub Actions

Use the `actions/deploy-pages` workflow for full CI/CD control.

## Event deep links (`/events/*`)

Event invites use `https://joiyn.app/events/{eventId}?...`. These files enable universal links and a browser fallback:

| File | Purpose |
|------|---------|
| `.well-known/apple-app-site-association` | iOS Universal Links (opens app when installed) |
| `.well-known/assetlinks.json` | Android App Links verification |
| `404.html` | GitHub Pages fallback for `/events/*` when the app is not installed |

### Before deploy

1. **`assetlinks.json`** — replace `REPLACE_WITH_PLAY_APP_SIGNING_SHA256` with the **App signing key certificate** SHA-256 from Play Console → **Setup** → **App signing** (colon-separated hex, uppercase).
2. Requires a new native mobile build with `associatedDomains` / `intentFilters` (see `joiyn-mvp/mobile/JoiynMobile/app.json`).

### Verify after deploy

```bash
curl -s https://joiyn.app/.well-known/apple-app-site-association
curl -s https://joiyn.app/.well-known/assetlinks.json
curl -sI https://joiyn.app/events/test-id   # should return 404 body from 404.html
```

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
├── .nojekyll           # Prevents GitHub Pages Jekyll processing
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
