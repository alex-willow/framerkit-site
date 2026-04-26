const DATA_GROUPS = {
  layout: new Set([
    "navbar",
    "hero",
    "logo",
    "feature",
    "gallery",
    "testimonial",
    "contact",
    "pricing",
    "faq",
    "cta",
    "footer",
  ]),
  components: new Set([
    "accordion",
    "accordiongroup",
    "avatar",
    "avatargroup",
    "badge",
    "button",
    "card",
    "icon",
    "input",
    "form",
    "pricingcard",
    "rating",
    "testimonialcard",
  ]),
  templates: new Set(["framerkitdaily"]),
  styles: new Set(["color-palettes", "colorset"]),
  meta: new Set(["product", "catalog-manifest"]),
} as const;

type CatalogGroup = keyof typeof DATA_GROUPS;

const requiredEnv = (name: string): string => {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
};

const normalizeOrigin = (origin: string) => origin.trim().replace(/\/$/, "");
const isLocalDevOrigin = (origin: string) =>
  origin.startsWith("http://localhost:") ||
  origin.startsWith("http://127.0.0.1:") ||
  origin.startsWith("https://localhost:") ||
  origin.startsWith("https://127.0.0.1:");

const corsHeadersFor = (origin: string | null): Headers => {
  const configured = Deno.env.get("ALLOWED_ORIGINS") ?? "";
  const allowAll = configured.trim() === "";
  const allowedOrigins = configured
    .split(",")
    .map((item) => normalizeOrigin(item))
    .filter(Boolean);

  const responseHeaders = new Headers({
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    Vary: "Origin",
  });

  if (!origin) {
    responseHeaders.set("Access-Control-Allow-Origin", allowAll ? "*" : "null");
    return responseHeaders;
  }

  const normalizedOrigin = normalizeOrigin(origin);
  if (allowAll || allowedOrigins.includes(normalizedOrigin) || isLocalDevOrigin(normalizedOrigin)) {
    responseHeaders.set("Access-Control-Allow-Origin", origin);
  } else {
    responseHeaders.set("Access-Control-Allow-Origin", "null");
  }

  return responseHeaders;
};

const json = (status: number, body: Record<string, unknown>, headers: HeadersInit = {}) => {
  const merged = new Headers(headers);
  merged.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body), { status, headers: merged });
};

const isCatalogGroup = (value: string): value is CatalogGroup =>
  value === "layout" ||
  value === "components" ||
  value === "templates" ||
  value === "styles" ||
  value === "meta";

const isValidDynamicId = (value: string) => /^[a-z0-9-]+$/.test(value);

Deno.serve(async (request) => {
  const origin = request.headers.get("origin");
  const corsHeaders = corsHeadersFor(origin);

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== "GET") {
    return json(405, { error: "Method not allowed" }, corsHeaders);
  }

  try {
    const url = new URL(request.url);
    const groupRaw = (url.searchParams.get("group") || "").toLowerCase();
    const id = (url.searchParams.get("id") || "").toLowerCase();

    if (!isCatalogGroup(groupRaw)) {
      return json(400, { error: "Invalid group" }, corsHeaders);
    }

    if (!id) {
      return json(400, { error: "Invalid id" }, corsHeaders);
    }

    const isDynamicGroup =
      groupRaw === "layout" || groupRaw === "components" || groupRaw === "templates";

    if (isDynamicGroup) {
      if (!isValidDynamicId(id)) {
        return json(400, { error: "Invalid id" }, corsHeaders);
      }
    } else if (!DATA_GROUPS[groupRaw].has(id)) {
      return json(400, { error: "Invalid id" }, corsHeaders);
    }

    const supabaseUrl = requiredEnv("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SERVICE_ROLE_KEY");
    if (!serviceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY or SERVICE_ROLE_KEY");
    const bucket = Deno.env.get("CATALOG_BUCKET") || "catalog-json";

    const objectPath = `${groupRaw}/${id}.json`;
    const objectUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${bucket}/${objectPath}`;

    const fileResponse = await fetch(objectUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
      },
    });

    if (!fileResponse.ok) {
      return json(404, { error: "Catalog data not found" }, corsHeaders);
    }

    const body = await fileResponse.text();
    const headers = new Headers(corsHeaders);
    headers.set("Content-Type", "application/json; charset=utf-8");
    headers.set(
      "Cache-Control",
      groupRaw === "meta" ? "no-store, max-age=0" : "public, max-age=300"
    );
    return new Response(body, { status: 200, headers });
  } catch (error) {
    console.error(error);
    return json(
      500,
      {
        error: "Failed to load catalog data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      corsHeaders,
    );
  }
});
