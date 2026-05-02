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
4. Save. GitHub will publish the site at `https://<username>.github.io/joiyn-landingpage/`.

### Option B — deploy from `/docs` folder

Move all files into a `docs/` sub-folder and set the Pages source to `main / docs`.

### Option C — GitHub Actions

Use the `actions/deploy-pages` workflow for full CI/CD control.

## File structure

```
joiyn-landingpage/
├── index.html          # Landing page
├── privacy.html        # Privacy Policy
├── support.html        # Support & FAQ
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

Search for `href="#"` in `index.html` and replace with real App Store / Google Play URLs once the app is live.

```html
<!-- App Store -->
<a href="https://apps.apple.com/app/joiyn/idXXXXXXXXXX" …>

<!-- Google Play -->
<a href="https://play.google.com/store/apps/details?id=com.joiyn.app" …>
```

## Privacy policy URL

Once deployed, update `docs/APP_STORE_RELEASE.md` in the `joiyn-mvp` repo with the live privacy policy URL, e.g.:

```
https://<username>.github.io/joiyn-landingpage/privacy.html
```
