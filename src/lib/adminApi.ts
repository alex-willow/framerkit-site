import { SUPABASE_ANON_KEY } from "./env";

export const buildAdminHeaders = (adminAuthToken: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  apikey: SUPABASE_ANON_KEY,
  "x-admin-authorization": `Basic ${adminAuthToken}`,
});
