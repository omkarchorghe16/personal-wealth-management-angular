# Copilot instructions — Folio Pro

## Product context
Folio Pro is a prototype personal wealth and market research dashboard. Its visual language follows the supplied references: charcoal/dark surfaces, restrained borders, muted gray text, bright blue actions, and small warm-yellow accents. The login page uses a split layout with a branded feature panel and a focused sign-in form.

## Engineering conventions
- Use standalone Angular components, strict TypeScript, and SCSS.
- Keep components focused and reuse the shared `ShellComponent` for authenticated product pages.
- Use typed models and services; current market and portfolio content is mock/sample data only.
- Avoid implying that sample prices, AI insights, screener results, or returns are live or investment advice.
- Keep the UI responsive and accessible: labels for inputs, keyboard-operable controls, semantic headings, visible focus states, and appropriate contrast.
- Authentication is a prototype only. Never store real passwords or add production auth behavior without a backend contract.
- Do not put secrets or API keys in the frontend. Java backend URLs belong in environment configuration once agreed.
- Do not claim tests/builds passed unless actually run.

## Backend integration
Keep API access behind services. The future Java backend should define auth, profile, portfolios, transactions, instruments, watchlists, market data, and analysis contracts before replacing mock data.
