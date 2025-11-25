## 3DWorkSpace — copilot-oriented developer guide

This document is written for GitHub Copilot agents and human developers who need to understand, extend, or automate tasks in the `3dws-client` Next.js application.

Summary
- Purpose: a Next.js front-end that browses and previews 3D models using the Voyager Explorer web component and manages user accounts/collections via Firebase.
- Runtime: Next.js (React), client-heavy app that loads a third-party explorer script at runtime.

Quick start
- Install deps: `npm install`
- Dev server: `npm run dev` (Next.js dev server)
- Build for production: `npm run build` then `npm run start` or `npm run export` for static export

Repository conventions and aliases
- Path aliases (see `jsconfig.json`): `$components`, `$context`, `$hooks`, `$styles`, `$config`, `$firebase`, etc. Use these when searching or editing.
- Firebase is configured in `firebase.js` using the v9 modular SDK and exported as `{ app, auth, firestore }`.

High-level architecture

- pages/
  - `_app.js` — application root: wraps the app with `AuthProvider`, `LoadingProvider`, `ModelsProvider`, and loads the Voyager script via `next/script`.
  - `index.js` — landing page with links to models and collections.
  - `models.js`, `collections/*` — pages that list models and collections.
  - `pages/api/*` — tiny APIs that serve static explorer/story pages.

- components/
  - `Layout.js` — top-level header, navbar and basic page layout.
  - `VoyagerExplorer.js` — wrapper around the `voyager-explorer` custom element; exposes imperative methods (toggleAnnotations, setTourStep, getTours).
  - Authentication components: `SignIn.js`, `SignUp.js`, `ResetPass.js`.
  - Collection-related modals and tabs live under `components/collection` and `components/collections`.

- context/
  - `AuthContext.js` — Firebase auth helpers and primary auth state (currentUser, displayName, email, signup/login/logout/resetPassword).
  - `LoadingContext.js` — simple isLoading boolean state for global loading indicator.
  - `ModelsContext.js` — central store for the list of available models (filenames + fetched metadata).

- hooks/
  - `useModelsContext.js` — fetches the list of `.svx.json` filenames by scraping the configured repository index HTML and seeds `ModelsContext`.
  - `useModels.js` — high-level hook to paginate, search and fetch models' metadata (fetches per-page svx.json files and updates `ModelsContext`).
  - `useApi.js` — generic async executor with loading/error handling and optional local state storage.
  - `useFuseSearch.js`, `usePagination.js` — small utilities for client-side search and pagination.

- utils/
  - `utils.js` — helpers (slugify, slicing, scraping svx filenames regex).

- config
  - `appConfig.js` — important constants: `MODELS_REPOSITORY_URL`, `MODELS_PER_PAGE`, FUSE search configs, and other app-level constants.

Data flow (models and metadata)

1. On app load, `ModelsProvider` + `useModelsContext` check if `contextModels` is empty.
2. `useModelsContext.fetchModelsFilenames()` fetches the HTML at `MODELS_REPOSITORY_URL` and runs `scrapeSvxFilenames(html)` to extract `*.svx.json` filenames.
3. Filenames are stored in `ModelsContext` as an array of objects: `{ id, filename }`.
4. `useModels()` uses `usePagination` to slice filenames per page. For the current page it calls `fetchModels(filenames)` which fetches each `.svx.json` and attaches parsed metadata to the model objects (`model.data`).
5. When metadata is fetched, `useModels.updateContextModels()` writes the richer objects back into `ModelsContext` so other consumers (pages/components) can use them.
6. `VoyagerExplorer` receives a model object with `filename` and passes it as the `document` attribute to the `voyager-explorer` custom element.

Authentication

- Authentication uses Firebase v9 modular API (`auth` exported from `firebase.js`).
- `AuthContext` subscribes to `onAuthStateChanged(auth, ...)` and exposes `signup`, `login`, `logout`, `resetPassword` functions.
- `displayName` is used by `Layout` to show login/account links.

Key files (short purpose)
- `appConfig.js` — constants and URLs (first place to look when model repo or page sizes change).
- `firebase.js` — Firebase initialization (modular SDK); update only if you change Firebase project.
- `context/ModelsContext.js` + `hooks/useModelsContext.js` — where model filenames are seeded.
- `hooks/useModels.js` — model-level pagination, search and per-model metadata fetching.
- `components/VoyagerExplorer.js` — the explorer wrapper (imperative methods used by collections/tours code).

Developer tasks that Copilot agents often perform (examples)

- Add a new model metadata cache: implement localStorage caching in `useModels.fetchModels` to avoid re-fetching svx.json for already seen filenames.
- Add server-side scraping: move scraping of `MODELS_REPOSITORY_URL` to a `pages/api` endpoint that runs server-side and returns sanitized filenames (helps avoid CORS/latency issues).
- Improve error handling & retry logic in `useModels.fetchModels` (exponential backoff, keep partial successes).
- Add unit tests for `utils/scrapeSvxFilenames` and `usePagination` (Jest + React Testing Library).

Copilot-specific guidance (how to write safe edits)

- Use path aliases in imports (example: `import useModelsContext from '$hooks/useModelsContext'`) — tests and build rely on `jsconfig.json`.
- Avoid changing Firebase config in `firebase.js` unless you have a replacement project. If you add environment-specific credentials, use `.env.local` and `process.env` with Next.js runtime configs.
- The app expects a third-party `voyager-explorer` script loaded in `_app.js` via `next/script`. If you replace or upgrade the explorer, test the custom element's attributes and imperative APIs (`setTourStep`, `toggleAnnotations`, `getTours`).
- When modifying the way models are fetched, update both `useModelsContext` (filenames) and `useModels` (metadata) so the UI keeps working.

Common pitfalls
- Scraping HTML for filenames is fragile: changes in the remote index page can break `scrapeSvxFilenames` regex. Prefer an API endpoint if possible.
- The app is client-heavy — many hooks assume `window.fetch` and the voyager script are available. Running server-side code (getStaticProps/getServerSideProps) requires careful handling.

Troubleshooting
- If models list is empty: check `appConfig.js.MODELS_REPOSITORY_URL`, open that URL in a browser and verify it contains `.svx.json` links.
- If Voyager doesn't render: ensure the script URL in `_app.js` is reachable and that the `voyager-explorer` tag receives a correct `document` attribute (filename URL resolvable from client).

Suggested next steps (low-risk improvements)
1. Add a `pages/api/models` server endpoint that returns the list of filenames (proxying the remote HTML scraping server-side), update `useModelsContext` to call the new endpoint.
2. Add client-side caching for svx metadata in `useModels.fetchModels` (localStorage or IndexedDB).
3. Add tests for `utils.scrapeSvxFilenames` and `usePagination`.

Requirements coverage
- Read the `3dws-client` directory and understand the app: Done — key files and data flow summarized above.
- Create useful documentation for other GitHub copilots: Done — this README (copilot-oriented) describes structure, conventions, and recommended tasks.

If you want, I can now:
- open a PR that adds `pages/api/models` to move scraping server-side, or
- implement client-side caching for svx.json files, or
- scaffold unit tests for `utils.js` and `usePagination.js`.

If you'd like one of those, tell me which and I'll implement it and run quick verification steps.
