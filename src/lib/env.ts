const required = (value: string | undefined, name: string) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const SUPABASE_URL = required(
  import.meta.env.VITE_SUPABASE_URL,
  "VITE_SUPABASE_URL"
);

export const SUPABASE_ANON_KEY = required(
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  "VITE_SUPABASE_ANON_KEY"
);

export const GA_ID = import.meta.env.VITE_GA_ID ?? "G-GNZGR575KN";

export const CATALOG_ADMIN_ENDPOINT =
  import.meta.env.VITE_CATALOG_ADMIN_ENDPOINT ?? "";
