# WealthPilot / Folio Pro

An Angular prototype for a personal wealth and market research workspace. The supplied visual references inform the UI: a split-screen dark login experience and a charcoal stock research dashboard with blue highlights and warm yellow accents.

## Current prototype screens
- Login (with a demo-only entry to sample dashboard data)
- Ideas dashboard
- Portfolio
- Stock screener / sector and fundamental overview
- IPO pipeline
- Crypto market overview
- Watchlists
- Profile and settings

All displayed prices, holdings, analysis scores, and market data are mock/sample values for UI development. They are not live financial data or investment advice. Authentication is not connected to a backend.

## Run locally

```bash
npm install
npm start
```

Then visit `http://localhost:4200`.

## Build

```bash
npm run build
```

## Architecture

```text
src/app/
  core/models/       Typed wealth and market data
  core/services/     Mock data service (replace behind service APIs)
  features/          Login, dashboard, portfolio, stocks, IPO, crypto, watchlists, profile, settings
  shared/components/ Reusable app shell and metric cards
```

## Backend integration (planned)
Connect the Angular service layer to a Java REST API only after API contracts, authentication/token lifecycle, error responses, and permissions are defined. Suggested resource areas: auth, profile, portfolios, transactions, instruments, sectors, IPOs, crypto, watchlists, and market analysis. Keep credentials and provider secrets on the backend; do not ship them in browser code.

## Visual reference
The supplied screenshot images are design references. The implementation is a first pass and can be iterated against additional Figma measurements, logo assets, and responsive/mobile screens.
