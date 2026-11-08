# WealthPilot

A modern Angular personal wealth management platform for tracking investments, watchlists, portfolio performance, IPOs, crypto, and market analytics.

## Features

- Authentication pages: login and registration
- Dashboard overview with portfolio KPIs
- Portfolio management with allocation and holdings
- Stock market screen and sector analysis
- IPO pipeline monitoring
- Crypto market tracking
- Multi-watchlist support
- Profile and settings pages
- Clean fintech-style dashboard UI
- Enterprise-ready Angular structure for future Java backend integration

## Tech stack

- Angular 22
- TypeScript
- RxJS
- SCSS
- Standalone components
- Angular Router

## Prerequisites

- Node.js 20+
- npm 10+

## Setup

```bash
npm install
npm start
```

Open the local app in your browser at:

```text
http://localhost:4200
```

## Build

```bash
npm run build
```

## Project structure

```text
src/
  app/
    app.component.ts
    app.routes.ts
    core/
      models/
      services/
    features/
      dashboard/
      portfolio/
      stocks/
      ipo/
      crypto/
      watchlists/
      profile/
      settings/
      login/
      register/
    shared/
      components/
  styles.scss
```

## Backend integration plan

This frontend is designed to connect to a Java REST backend later. Suggested contracts:

- Auth API: `/api/auth/login`, `/api/auth/register`
- Portfolio API: `/api/portfolio`, `/api/transactions`
- Stocks API: `/api/stocks`, `/api/sectors`, `/api/watchlists`
- Crypto API: `/api/crypto`
- User profile API: `/api/profile`

Use environment configuration and service abstractions to replace mock data when the backend becomes available.

## Notes

This starter app includes mock data for local development and visual prototyping. You can refine it against your Figma design and replace placeholder content with your final product copy and data models.
