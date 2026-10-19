# MFC Football Academy Website

A fast, accessible, animated website for **MFC Football Academy** — a football training centre in Mutharasanallur, Trichy, Tamil Nadu.

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 + Vite 5 |
| Routing | React Router v6 |
| Animation | Framer Motion |
| i18n | react-i18next (EN + Tamil) |
| Styling | Plain CSS with custom properties |
| Testing | Vitest + React Testing Library *(Phase 2)* |
| Backend | FastAPI *(Phase 4)* |
| Database | Supabase (with RLS) *(Phase 4)* |

---

## Quick Start

### Prerequisites

- Node.js >= 18 (tested on v20.15.1)
- npm >= 9

### Install dependencies

```bash
npm install
```

### Set up environment variables

```bash
cp .env.example .env
# Edit .env with your values (Phase 4 only — not needed for Phase 1)
```

### Start development server

```bash
npm run dev
# Opens at http://localhost:5173
```

### Build for production

```bash
npm run build
npm run preview   # Preview the production build locally
```

---

## Environment Variables

All variables are prefixed with VITE_ to expose them to the browser bundle.
NEVER put secrets in VITE_ variables. Server-side secrets go in the FastAPI .env (Phase 4).

| Variable | Required | Phase | Description |
|---|---|---|---|
| VITE_SUPABASE_URL | Phase 4 | 4 | Supabase project URL |
| VITE_SUPABASE_ANON_KEY | Phase 4 | 4 | Supabase public anon key |
| VITE_TURNSTILE_SITE_KEY | Phase 4 | 4 | Cloudflare Turnstile site key |
| VITE_API_URL | Phase 4 | 4 | FastAPI backend base URL |
| VITE_GOOGLE_MAPS_API_KEY | Phase 4 | 4 | Google Maps embed key |

---

## Project Structure

```
mfc_web/
├── public/                  # Static assets (favicon, robots.txt)
├── src/
│   ├── components/
│   │   ├── Header.jsx       # Fixed nav, mobile drawer, lang toggle
│   │   ├── Footer.jsx       # Site footer
│   │   ├── ScrollReveal.jsx # Scroll-triggered fade-up
│   │   ├── StatCounter.jsx  # Animated count-up
│   │   └── ConfirmBadge.jsx # Gold badge for unverified data
│   ├── data/
│   │   └── content.js       # Single source of truth for all club data
│   ├── locales/
│   │   ├── en.json          # English strings
│   │   └── ta.json          # Tamil strings
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Vision.jsx
│   │   ├── Coaches.jsx
│   │   ├── TeamAchievements.jsx
│   │   ├── IndividualAchievements.jsx
│   │   ├── SchoolProgram.jsx
│   │   ├── Contact.jsx
│   │   └── NotFound.jsx
│   ├── App.jsx              # Routes + red-wipe page transition
│   ├── i18n.js              # i18next configuration
│   ├── main.jsx             # Entry point
│   └── index.css            # Design system
├── .env                     # Secrets — gitignored
├── .env.example             # Template — committed to git
├── index.html               # SEO meta + noscript fallback
└── vite.config.js           # Build config with chunk splitting
```

---

## [CONFIRM] Items for the Club

| # | Item | File |
|---|---|---|
| 1 | Full street address | content.js -> CLUB.location |
| 2 | Tagline "#OneClubOneDream" | content.js -> CLUB.tagline |
| 3 | Age group birth-year ranges | content.js -> AGE_GROUPS |
| 4 | Blue Panthers FC team name (Aarith Tejaz) | content.js -> INDIVIDUAL_ACHIEVEMENTS[3] |
| 5 | All coach profiles (names, licences, bios, photos) | pages/Coaches.jsx |
| 6 | Team achievements | pages/TeamAchievements.jsx |
| 7 | Real club / player / ground photos | All photo placeholders |
| 8 | Google Maps embed link | pages/Contact.jsx |

---

## Design Tokens

| Variable | Value | Usage |
|---|---|---|
| --bg | #0B0B0C | Page background |
| --surface | #141416 | Card/panel background |
| --accent | #E10600 | Primary red |
| --gold | #F2B705 | Highlights, confirm badges |
| --text | #F5F5F5 | Body text |
| --muted | #9CA3AF | Secondary text |

Fonts: Anton (headlines) · Inter (body) · Noto Sans Tamil (Tamil)

---

## Performance Budget

| Metric | Target |
|---|---|
| Lighthouse mobile | 90+ |
| FPS (mid-range Android) | 55+ |
| First load JS (gzipped) | < 250 KB |
| CLS | < 0.1 |

---

## Phases

| Phase | Scope | Status |
|---|---|---|
| 1 | Core site, all pages, bilingual, animations | Done |
| 2 | Tests, ESLint/Prettier, animation polish | Next |
| 3 | Join Us, Matches, News, Gallery | Pending club content |
| 4 | Supabase, admin panel, FastAPI, Turnstile | Future |
| 5 | Security review, Lighthouse, Vercel deploy | Future |

---

## Security Notes

- No secrets in the client bundle
- .env is gitignored
- Honeypot field on contact form
- Phase 4 adds: Cloudflare Turnstile, rate limiting, CSP headers, Supabase RLS
- DPDP Act 2023 compliance for under-18 data (Phase 4)

---

## Contact

MFC Football Academy | Tamilan Nagar, Mutharasanallur, Trichy-1
Phone: 8072694818 | Email: mfcfootballacademy@gmail.com | Instagram: @mfc_trichy
