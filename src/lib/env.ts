// Environment variables with fallbacks for production builds
// Some features may be unavailable if variables are missing

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? "";

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

export const GA_ID = import.meta.env.VITE_GA_ID ?? "G-GNZGR575KN";

export const CATALOG_ADMIN_ENDPOINT =
  import.meta.env.VITE_CATALOG_ADMIN_ENDPOINT ?? "";
