# Direct Line Web Chat FAB Demo (Theming Playground)

A small, **secure-by-default** demo repo showing how to embed **Bot Framework Web Chat (Direct Line)** on any website, launched from an **interactive Floating Action Button (FAB)** that opens a mobile-first chat panel.

## What you get

- ✅ Floating Action Button (FAB) that opens/closes chat
- ✅ Mobile-first panel sizing + safe desktop sizing
- ✅ **Theming playground** using CSS variables (easy brand restyle)
- ✅ Token handling patterns:
  - **Recommended:** same-origin token endpoint (`/api/directline/token`) via the included Node proxy
  - **Alternative:** call your own token endpoint directly (only if CORS + auth are correct)

---

## Quick start (local)

### 1) Install
```bash
npm install
```

### 2) Configure
Copy the example env file:
```bash
cp .env.example .env
```

Set **one** of these:

#### Option A (recommended): Proxy to your existing Azure Function token endpoint
Set:
- `TOKEN_MODE=proxy`
- `PROXY_TOKEN_ENDPOINT=<YOUR_TOKEN_ENDPOINT_URL>`

Example (yours, from the earlier thread):
- `PROXY_TOKEN_ENDPOINT=https://afa-communications-hub-e7e2f2fwesa3hqev.uksouth-01.azurewebsites.net/api/GenerateDirectLineToken`

#### Option B: Generate tokens from a Direct Line secret (keep secret server-side)
Set:
- `TOKEN_MODE=directline_secret`
- `DIRECTLINE_SECRET=<YOUR_DIRECTLINE_SECRET>`

> Never put the Direct Line secret in client-side JS or HTML.

### 3) Run
```bash
npm run dev
```

Open:
- http://localhost:3000

---

## Deploy

You have two typical options:

### Option 1: Host everything together (recommended)
Deploy the static site **and** the Node token endpoint together (same origin).
- Pros: simplest CORS story, safest token flow.
- Cons: you run a tiny server.

### Option 2: Static hosting + separate token service
Host `public/` on a static site, and host a token service elsewhere.
- Pros: works with static-only hosting.
- Cons: you must manage CORS + auth correctly.

---

## Security guide (please read)

### 1) Do not expose secrets
- ✅ OK: Browser calls a backend endpoint that returns a **short-lived Direct Line token**
- ❌ Not OK: Browser contains a Direct Line **secret** or generates tokens itself

### 2) Restrict your token endpoint
Treat token issuance as sensitive:
- Require auth (e.g. session, API key, signed request, or app-level identity)
- Rate limit + abuse protection
- Consider tenant scoping (if multi-tenant)

### 3) CORS & Origin rules
If your web page calls a token endpoint from the browser:
- Allow only your website origins
- Block `*` for production
- Prefer same-origin (`/api/directline/token`)

### 4) Token lifetime
Direct Line tokens are short-lived. Your frontend should be prepared to refresh by reloading the page or re-requesting a token (pattern depends on your bot/channel).

### 5) Content Security Policy (CSP)
This demo uses CDNs for Web Chat. For production, consider self-hosting assets and tightening CSP.

---

## Theming playground

Edit **`public/styles.css`**. The main knobs are CSS variables:

- `--fab-bg`, `--fab-fg`
- `--panel-bg`, `--panel-border`
- `--brand`, `--brand-2`
- `--radius`, `--shadow`

You can also restyle:
- FAB size + position
- Panel width/height
- Header layout

---

## Files

- `public/index.html` – page shell + FAB + panel
- `public/app.js` – Web Chat boot + open/close logic
- `public/styles.css` – theming playground (safe to edit)
- `public/config.example.js` – client config template
- `server/index.js` – token endpoint (proxy or Direct Line secret mode)

---

## Notes for developers integrating into an existing site

1. Copy `public/styles.css` variables into your design system.
2. Keep `public/app.js` token flow, but point it at your own `/api/directline/token`.
3. Keep secrets server-side.
4. If your site is React/Next/Astro/etc, you can:
   - keep this as a standalone widget loaded via `<script type="module">`
   - or port the logic into a component (same patterns apply)

---

## License

MIT (do what you like, keep the notice).
