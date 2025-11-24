# Repository Guidelines

## Project Structure & Module Organization
- App entry lives in `src/main.jsx`; routes and layout in `src/App.jsx`.
- Reusable UI is under `src/components/` (e.g., `AutoExpandTextarea.jsx`, `TagInput.jsx`); page-level views in `src/pages/` (Dashboard, DeckView, ReviewSession, Login, AddCard).
- Global state is managed via `src/store.js` (Zustand). Firebase setup sits in `src/firebase.js`, with env helpers in `src/utils/`.
- Styling uses `src/index.css` plus page/component styles in `src/App.css` and utility classes; assets in `src/assets/`.
- Firebase Hosting/Functions config at repo root (`firebase.json`, `firestore.rules`, `storage.rules`, `functions/`).

## Build, Test, and Development Commands
- `npm install` — install dependencies (front-end and functions separately; run inside `functions/` for backend).
- `npm run dev` — start Vite dev server with HMR.
- `npm run build` — production build to `dist/`.
- `npm run preview` — serve the built app locally.
- `npm run lint` — run ESLint flat config over JS/JSX.
- Deploy helpers: `npm run deploy`, `npm run deploy:hosting`, `npm run deploy:rules`, `npm run deploy:functions`, `npm run deploy:preview` (Firebase CLI must be authenticated).

## Coding Style & Naming Conventions
- JavaScript/JSX, ES modules. Prefer functional components and hooks.
- Indent 2 spaces; keep semicolons; single quotes for strings.
- Component files in `PascalCase.jsx`; hooks/utilities in `camelCase.js`.
- Favor small, memoizable components; lift state into `store.js` when shared.
- Run `npm run lint` before commits; aim for no `eslint-disable` unless documented.

## Testing Guidelines
- No automated tests are currently wired in this repo. Add React Testing Library or Vitest alongside Vite if contributing tests.
- Name new test files `*.test.jsx` near the code or under `__tests__/`.
- Cover auth flows, deck CRUD, and review session logic when adding tests; include Firebase mocks/stubs.

## Commit & Pull Request Guidelines
- Use imperative, present-tense commit messages (`Add review session loading state`) and keep them focused.
- For PRs: include a concise summary, screenshots/GIFs for UI changes, steps to reproduce/verify, and linked issues if applicable.
- Note any migrations or Firebase rule/index changes; mention required environment variables or sample `.env.local` values.
- Ensure `npm run lint` and local smoke checks (login, deck view, review flow) pass before opening a PR.

## Firebase & Configuration Tips
- Local dev assumes Firebase config via environment variables (e.g., `VITE_FIREBASE_API_KEY`, etc.) loaded by Vite; keep secrets out of version control.
- Update `firestore.rules`, `firestore.indexes.json`, and `storage.rules` together with feature changes; use `firebase emulators:start` if you introduce emulator-based workflows.
