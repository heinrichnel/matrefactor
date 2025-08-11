# WialonMaps Sub-App

## Purpose

Isolated experimental Wialon integration UI (units, drivers, commands, reports) inside the monorepo.

## Quick Start

1. Install deps:
   npm install
2. (Optional) Add a `.env` with a Wialon token:
   VITE_WIALON_TOKEN=your_token_here
3. Run dev server:
   npm run dev

## Environment Variables

VITE_WIALON_TOKEN Optional login token passed to `wialonService.initialize`.

## Architecture Notes

React + Vite + Tailwind. State sourced via `useWialon` hook wrapping `wialonService`. Commands feature uses parameter schemas typed via `WialonCommandParameterSchema`.

## Next Improvements

- Implement real Wialon SDK command execution.
- Persist user tab choice (localStorage).
- Add tests (Vitest + React Testing Library) for hooks.

## Type Safety

Command parameter schemas now strongly typed (removes loose any casts). Table component uses a `columns` + `data` contract.
