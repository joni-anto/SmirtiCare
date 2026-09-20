# SmritiCare (React + Vite)

## Setup

1. **Firebase config (required before running):**
   Open `src/firebase.js`, replace the `PASTE_YOUR_...` placeholders with
   your real values from https://console.firebase.google.com →
   Project settings → your web app.

2. **Install and run:**
   ```
   npm install
   npm run dev
   ```
   Open the URL it prints (usually `http://localhost:5173`).

3. **Production build** (what you'd actually deploy):
   ```
   npm run build
   ```
   Output lands in `dist/`.

## What's here

- `src/App.jsx` — the three screens (Home / Play / Offline), same structure
  as the original vanilla-JS version, rebuilt as React components.
- `src/hooks/useCompanion.js` — voice assistant logic (languages, TTS,
  ambient proactive check-ins).
- `src/hooks/useGame.js` — the adaptive memory-match game.
- `src/hooks/useStore.js` — Firestore read/write, replaces the old
  `window.Store` module with a proper React hook.
- `src/hooks/useNetworkStatus.js` — real (not simulated) browser
  connectivity, used by the ambient bar and Offline screen.
- Tailwind is configured with the same design tokens (`ink`, `paper`,
  `moss`, `brass`, `rust`, `line`) as the original CSS variables, so
  the look carries over exactly.

## Verified before handoff

- `npm run build` — succeeds, 37 modules compile clean (one harmless
  bundle-size warning from including the Firebase SDK).
- `npm run dev` — boots and serves `200` on its own.

Neither of these confirms the actual Firebase connection works yet —
that only becomes real once you paste your project config into
`src/firebase.js`.
