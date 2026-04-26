# Catalog Setup (Site + Plugin)

This moves catalog JSON off public GitHub links and serves it from your Supabase project.

## 1. Pull JSON into this repo

```bash
cd /Users/wikiwoo/framerkit-site
npm run catalog:pull
```

Files will be saved under:

- `catalog-data/layout/*.json`
- `catalog-data/components/*.json`
- `catalog-data/templates/*.json`

## 2. Upload JSON to Supabase Storage

Use a service role key locally for upload:

```bash
export SUPABASE_URL="https://<project-ref>.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"
export CATALOG_BUCKET="catalog-json"
npm run catalog:upload
```

The script creates the bucket if missing (private bucket).

## 3. Set Edge Function secrets

In Supabase Edge Functions secrets, add:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (or `SERVICE_ROLE_KEY`)
- `CATALOG_BUCKET` = `catalog-json`
- `ALLOWED_ORIGINS` = `http://localhost:4173,https://framerkit.site`

## 4. Deploy `catalog-json` function

```bash
supabase functions deploy catalog-json --project-ref <project-ref> --use-api --no-verify-jwt
```

## 5. Set client endpoint

In site `.env`:

```bash
VITE_CATALOG_ENDPOINT=https://<project-ref>.supabase.co/functions/v1/catalog-json
```

`catalogManifest.ts` will use this endpoint for both site and plugin (plugin gets synced manifest via `npm run sync:catalog`).

## 6. Verify

Open in browser:

```text
https://<project-ref>.supabase.co/functions/v1/catalog-json?group=layout&id=navbar
https://<project-ref>.supabase.co/functions/v1/catalog-json?group=components&id=button
```

You should receive JSON payloads from your own Supabase storage.
