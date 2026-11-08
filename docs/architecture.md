# WealthPilot architecture

## Overview

This starter project follows a modular Angular architecture optimized for a fintech application with a future Java Spring Boot backend.

## Layers

- Core: shared models, services, API contracts, utilities
- Features: dashboard, portfolio, stocks, crypto, watchlists, profile, auth
- Shared: reusable components and layout wrappers

## Routes

- `/login`
- `/register`
- `/dashboard`
- `/portfolio`
- `/stocks`
- `/ipo`
- `/crypto`
- `/watchlists`
- `/profile`
- `/settings`

## Future integration

- Add `environment.ts` and `environment.prod.ts`
- Add `HttpClient` interceptors for authentication and API error handling
- Replace mock services with real backend calls
- Add state management with Signals or NgRx if the app grows
- Add charts with `ng2-charts` or `Highcharts` for better analytics
