# FramerKit Site

Marketing site and documentation portal for FramerKit, built with Vite, React, and TypeScript.

## Stack

- Vite
- React 19
- TypeScript
- React Router
- Supabase
- Vercel Analytics
- GA4

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local env file from the example:

```bash
cp .env.example .env
```

3. Fill in the required values in `.env`.

4. Start the dev server:

```bash
npm run dev
```

## Site + Plugin Workflow

Plugin is expected at `../Framerkit` (relative to this site folder).
Single source of catalog config lives in:

`src/shared/catalogManifest.ts`

It is synced to plugin at:

`../Framerkit/src/config/catalogManifest.ts`

Run both together:

```bash
npm run dev:all
```

`dev:all` now uses a process runner that:
- checks plugin folder existence (`../Framerkit`)
- starts site and plugin together
- stops both when one crashes or when you stop with `Ctrl + C`

Run separately:

```bash
npm run dev:site
npm run dev:plugin
npm run sync:catalog
npm run catalog:add -- --group components --id tabs --label "Tabs" --json-key tabs
npm run catalog:pull
npm run catalog:upload
```

## Environment Variables

Client-side app:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GA_ID`

Server-side checkout flow:

- `POLAR_API_KEY`
- `POLAR_PRODUCT_ID`

Support form endpoint:

- `VITE_SUPPORT_FORM_ENDPOINT`
- `VITE_CATALOG_ENDPOINT`
- `VITE_SUPPORT_EMAIL` (optional fallback email shown in UI)

## Scripts

```bash
npm run dev
npm run dev:all
npm run dev:site
npm run dev:plugin
npm run build
npm run build:all
npm run catalog:add -- --group components --id tabs --label "Tabs" --json-key tabs
npm run catalog:pull
npm run catalog:upload
npm run build:site
npm run build:plugin
npm run pack:plugin
npm run lint
npm run preview
```

## Notes

- Production build output goes to `dist/`.
- Preview pages are served from `public/preview`.
- Routes under `/p/...` are rewritten to the preview viewer in local development.
- Support form backend setup guide: `SUPPORT_FORM_SETUP.md`.
- Catalog backend setup guide: `CATALOG_SETUP.md`.
