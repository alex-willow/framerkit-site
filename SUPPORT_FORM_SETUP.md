# Support Form Setup (Supabase + Resend + Attachments)

This project already sends `multipart/form-data` from the Support page.
Use the included Edge Function at:

- `supabase/functions/support-form/index.ts`

## 1) Add required secrets to Supabase

Set these secrets in your Supabase project:

- `RESEND_API_KEY`
- `SUPPORT_FROM_EMAIL` (must be verified in Resend, e.g. `support@yourdomain.com`)
- `SUPPORT_TO_EMAIL` (where requests should arrive)
- `ALLOWED_ORIGINS` (comma-separated, e.g. `http://localhost:5173,https://yourdomain.com`)

## 2) Deploy the function

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase functions deploy support-form
```

## 3) Point frontend to the function

In your local `.env`:

```bash
VITE_SUPPORT_FORM_ENDPOINT=https://<your-project-ref>.supabase.co/functions/v1/support-form
VITE_SUPPORT_EMAIL=support@yourdomain.com
```

Restart dev server after env changes.

## 4) Test flow

1. Open `Support` page.
2. Submit in both modes: `Support` and `Suggestions`.
3. Test with and without attachments.
4. Confirm:
   - email arrives at `SUPPORT_TO_EMAIL`
   - attachment links are present in email
   - links open files from storage

## Notes

- Without `VITE_SUPPORT_FORM_ENDPOINT`, frontend falls back to `mailto:` (attachments cannot be sent this way).
- File limits are enforced in function:
  - max 8 files
  - max 10 MB per file
  - max 7 MB total
- Delivery mode:
  - files are attached directly to email (no storage links in emails)
