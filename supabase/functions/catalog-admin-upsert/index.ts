const ALLOWED_GROUPS = new Set(["layout", "components", "templates"]);

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
    "Access-Control-Allow-Headers":
      "authorization, x-admin-authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  });

  if (!origin) {
    responseHeaders.set("Access-Control-Allow-Origin", allowAll ? "*" : "null");
    return responseHeaders;
  }

  const normalizedOrigin = normalizeOrigin(origin);
  if (
    allowAll ||
    allowedOrigins.includes(normalizedOrigin) ||
    isLocalDevOrigin(normalizedOrigin)
  ) {
    responseHeaders.set("Access-Control-Allow-Origin", origin);
  } else {
    responseHeaders.set("Access-Control-Allow-Origin", "null");
  }

  return responseHeaders;
};

const json = (
  status: number,
  body: Record<string, unknown>,
  headers: HeadersInit = {}
) => {
  const merged = new Headers(headers);
  merged.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body), { status, headers: merged });
};

const parseBasicAuth = (
  headerValue: string | null
): { login: string; password: string } | null => {
  if (!headerValue || !headerValue.startsWith("Basic ")) return null;
  try {
    const encoded = headerValue.slice(6).trim();
    const decoded = atob(encoded);
    const delimiter = decoded.indexOf(":");
    if (delimiter < 0) return null;
    return {
      login: decoded.slice(0, delimiter),
      password: decoded.slice(delimiter + 1),
    };
  } catch {
    return null;
  }
};

const normalizeSectionId = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-_]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const extractTrailingNumber = (value: string): number | null => {
  const match = value.match(/(\d+)(?!.*\d)/);
  if (!match) return null;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
};

const humanizeId = (id: string) =>
  id
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const buildBaseSlug = (group: string, id: string) =>
  group === "layout" ? `${id}-section` : id;

const buildBaseTitle = (group: string, id: string) => {
  const label = humanizeId(id);
  return group === "layout" ? `${label} Section` : label;
};

const getNextSequence = (items: Array<Record<string, unknown>>): number => {
  const max = items.reduce((currentMax, item) => {
    const key = item.key ? String(item.key) : "";
    const title = item.title ? String(item.title) : "";
    const keyNumber = key ? extractTrailingNumber(key) : null;
    const titleNumber = title ? extractTrailingNumber(title) : null;
    return Math.max(currentMax, keyNumber ?? 0, titleNumber ?? 0);
  }, 0);
  return max + 1;
};

const normalizeItem = (value: unknown) => {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;

  const title = String(raw.title || "").trim();
  const image = String(raw.image || "").trim();
  const url = String(raw.url || "").trim();
  if (!image || !url) return null;

  const type = raw.type === "paid" ? "paid" : "free";
  const previewUrl = raw.previewUrl ? String(raw.previewUrl).trim() : undefined;
  const key = raw.key ? String(raw.key).trim() : undefined;
  const dragType = raw.dragType ? String(raw.dragType).trim() : undefined;

  let wireframe: Record<string, string> | undefined;
  if (raw.wireframe && typeof raw.wireframe === "object") {
    const wf = raw.wireframe as Record<string, unknown>;
    const imageValue = wf.image ? String(wf.image).trim() : "";
    const urlValue = wf.url ? String(wf.url).trim() : "";
    const previewValue = wf.previewUrl ? String(wf.previewUrl).trim() : "";
    if (imageValue || urlValue || previewValue) {
      wireframe = {};
      if (imageValue) wireframe.image = imageValue;
      if (urlValue) wireframe.url = urlValue;
      if (previewValue) wireframe.previewUrl = previewValue;
    }
  }

  let dark: Record<string, unknown> | undefined;
  if (raw.dark && typeof raw.dark === "object") {
    const dv = raw.dark as Record<string, unknown>;
    const darkImage = dv.image ? String(dv.image).trim() : "";
    const darkUrl = dv.url ? String(dv.url).trim() : "";
    const darkPreviewUrl = dv.previewUrl ? String(dv.previewUrl).trim() : "";
    const darkType = dv.type === "free" ? "free" : type;
    const darkKey = dv.key ? String(dv.key).trim() : "";
    const darkTitle = dv.title ? String(dv.title).trim() : "";

    let darkWireframe: Record<string, string> | undefined;
    if (dv.wireframe && typeof dv.wireframe === "object") {
      const wf = dv.wireframe as Record<string, unknown>;
      const imageValue = wf.image ? String(wf.image).trim() : "";
      const urlValue = wf.url ? String(wf.url).trim() : "";
      const previewValue = wf.previewUrl ? String(wf.previewUrl).trim() : "";
      if (imageValue || urlValue || previewValue) {
        darkWireframe = {};
        if (imageValue) darkWireframe.image = imageValue;
        if (urlValue) darkWireframe.url = urlValue;
        if (previewValue) darkWireframe.previewUrl = previewValue;
      }
    }

    if (darkImage || darkUrl || darkPreviewUrl || darkKey || darkTitle || darkWireframe) {
      dark = {
        key: darkKey || undefined,
        title: darkTitle || undefined,
        image: darkImage || undefined,
        url: darkUrl || undefined,
        previewUrl: darkPreviewUrl || undefined,
        type: darkType,
        wireframe: darkWireframe,
      };
    }
  }

  return {
    key,
    title,
    image,
    url,
    type,
    previewUrl: previewUrl || undefined,
    dragType: dragType || undefined,
    wireframe,
    dark,
  };
};

Deno.serve(async (request) => {
  const origin = request.headers.get("origin");
  const corsHeaders = corsHeadersFor(origin);

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return json(405, { error: "Method not allowed" }, corsHeaders);
  }

  try {
    const adminLogin = requiredEnv("ADMIN_LOGIN");
    const adminPassword = requiredEnv("ADMIN_PASSWORD");
    const supabaseUrl = requiredEnv("SUPABASE_URL");
    const serviceRoleKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SERVICE_ROLE_KEY");
    if (!serviceRoleKey) {
      throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY or SERVICE_ROLE_KEY");
    }
    const bucket = Deno.env.get("CATALOG_BUCKET") || "catalog-json";

    const auth =
      parseBasicAuth(request.headers.get("x-admin-authorization")) ||
      parseBasicAuth(request.headers.get("authorization"));
    if (!auth || auth.login !== adminLogin || auth.password !== adminPassword) {
      return json(401, { error: "Unauthorized" }, corsHeaders);
    }

    const body = (await request.json()) as {
      action?: string;
      group?: string;
      id?: string;
      jsonKey?: string;
      item?: unknown;
      itemKey?: string;
      itemIndex?: number;
      label?: string;
      description?: string;
      iconKey?: string;
      countLabel?: string;
    };

    if (body.action === "auth") {
      return json(200, { ok: true }, corsHeaders);
    }

    if (
      body.action !== "append_item" &&
      body.action !== "create_section" &&
      body.action !== "delete_section" &&
      body.action !== "delete_item" &&
      body.action !== "update_section" &&
      body.action !== "update_item"
    ) {
      return json(400, { error: "Invalid action" }, corsHeaders);
    }

    const group = String(body.group || "").toLowerCase();
    const id = normalizeSectionId(String(body.id || ""));
    const jsonKeyRaw = String(body.jsonKey || "").trim();
    const jsonKey = jsonKeyRaw ? normalizeSectionId(jsonKeyRaw) : id;

    if (!ALLOWED_GROUPS.has(group) || !id) {
      return json(400, { error: "Invalid group or id" }, corsHeaders);
    }

    if (body.action === "create_section") {
      const label = String(body.label || "").trim();
      const description = String(body.description || "").trim();
      const iconKey = String(body.iconKey || "").trim();
      const countLabel = String(body.countLabel || "").trim();

      if (!label) {
        return json(400, { error: "Section label is required" }, corsHeaders);
      }

      const manifestPath = `meta/catalog-manifest.json`;
      const manifestUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${bucket}/${manifestPath}`;

      const manifestResponse = await fetch(manifestUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
        },
      });

      if (!manifestResponse.ok) {
        return json(404, { error: "catalog-manifest.json not found" }, corsHeaders);
      }

      const manifestText = await manifestResponse.text();
      let manifestData: Record<string, unknown>;
      try {
        manifestData = JSON.parse(manifestText) as Record<string, unknown>;
      } catch {
        return json(500, { error: "Invalid catalog-manifest JSON" }, corsHeaders);
      }

      const groupSections = Array.isArray(manifestData[group])
        ? ([...manifestData[group]] as Array<Record<string, unknown>>)
        : [];

      const alreadyExists = groupSections.some(
        (entry) => String(entry.id || "").toLowerCase() === id
      );
      if (alreadyExists) {
        return json(409, { error: `Section "${id}" already exists` }, corsHeaders);
      }

      const objectPath = `${group}/${id}.json`;
      const objectUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${bucket}/${objectPath}`;

      const existingFileResponse = await fetch(objectUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
        },
      });
      if (existingFileResponse.ok) {
        return json(409, { error: `JSON file "${objectPath}" already exists` }, corsHeaders);
      }

      const sectionPayload: Record<string, unknown> = {
        id,
        label,
        title: label,
        jsonKey: jsonKey || id,
      };
      if (description) {
        sectionPayload.description = description;
        sectionPayload.subtitle = description;
      }
      if (iconKey) sectionPayload.iconKey = iconKey;
      if (countLabel) sectionPayload.countLabel = countLabel;

      manifestData[group] = [...groupSections, sectionPayload];

      const saveManifestResponse = await fetch(manifestUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
          "Content-Type": "application/json; charset=utf-8",
          "x-upsert": "true",
        },
        body: JSON.stringify(manifestData),
      });

      if (!saveManifestResponse.ok) {
        const saveManifestText = await saveManifestResponse.text();
        return json(
          500,
          { error: "Failed to update catalog-manifest", details: saveManifestText },
          corsHeaders
        );
      }

      const emptySectionJson = { [jsonKey || id]: [] };
      const saveSectionResponse = await fetch(objectUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
          "Content-Type": "application/json; charset=utf-8",
          "x-upsert": "false",
        },
        body: JSON.stringify(emptySectionJson),
      });

      if (!saveSectionResponse.ok) {
        const saveSectionText = await saveSectionResponse.text();
        return json(
          500,
          { error: "Failed to create section JSON file", details: saveSectionText },
          corsHeaders
        );
      }

      return json(
        200,
        {
          ok: true,
          message: "Section created",
          section: sectionPayload,
          file: objectPath,
        },
        corsHeaders
      );
    }

    if (body.action === "delete_section") {
      const manifestPath = `meta/catalog-manifest.json`;
      const manifestUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${bucket}/${manifestPath}`;

      const manifestResponse = await fetch(manifestUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
        },
      });

      if (!manifestResponse.ok) {
        return json(404, { error: "catalog-manifest.json not found" }, corsHeaders);
      }

      const manifestText = await manifestResponse.text();
      let manifestData: Record<string, unknown>;
      try {
        manifestData = JSON.parse(manifestText) as Record<string, unknown>;
      } catch {
        return json(500, { error: "Invalid catalog-manifest JSON" }, corsHeaders);
      }

      const groupSections = Array.isArray(manifestData[group])
        ? ([...manifestData[group]] as Array<Record<string, unknown>>)
        : [];

      const nextSections = groupSections.filter(
        (entry) => String(entry.id || "").toLowerCase() !== id
      );
      if (nextSections.length === groupSections.length) {
        return json(404, { error: `Section "${id}" not found` }, corsHeaders);
      }

      manifestData[group] = nextSections;

      const saveManifestResponse = await fetch(manifestUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
          "Content-Type": "application/json; charset=utf-8",
          "x-upsert": "true",
        },
        body: JSON.stringify(manifestData),
      });

      if (!saveManifestResponse.ok) {
        const saveManifestText = await saveManifestResponse.text();
        return json(
          500,
          { error: "Failed to update catalog-manifest", details: saveManifestText },
          corsHeaders
        );
      }

      const objectPath = `${group}/${id}.json`;
      const objectUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${bucket}/${objectPath}`;
      await fetch(objectUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
        },
      });

      return json(200, { ok: true, message: "Section deleted", id, group }, corsHeaders);
    }

    if (body.action === "update_section") {
      const label = String(body.label || "").trim();
      const description = String(body.description || "").trim();
      const iconKey = String(body.iconKey || "").trim();
      const countLabel = String(body.countLabel || "").trim();

      if (!label) {
        return json(400, { error: "Section label is required" }, corsHeaders);
      }

      const manifestPath = `meta/catalog-manifest.json`;
      const manifestUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${bucket}/${manifestPath}`;

      const manifestResponse = await fetch(manifestUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
        },
      });

      if (!manifestResponse.ok) {
        return json(404, { error: "catalog-manifest.json not found" }, corsHeaders);
      }

      const manifestText = await manifestResponse.text();
      let manifestData: Record<string, unknown>;
      try {
        manifestData = JSON.parse(manifestText) as Record<string, unknown>;
      } catch {
        return json(500, { error: "Invalid catalog-manifest JSON" }, corsHeaders);
      }

      const groupSections = Array.isArray(manifestData[group])
        ? ([...manifestData[group]] as Array<Record<string, unknown>>)
        : [];

      const sectionIndex = groupSections.findIndex(
        (entry) => String(entry.id || "").toLowerCase() === id
      );
      if (sectionIndex < 0) {
        return json(404, { error: `Section "${id}" not found` }, corsHeaders);
      }

      const currentSection = groupSections[sectionIndex];
      const nextSection: Record<string, unknown> = {
        ...currentSection,
        label,
        title: label,
        description: description || undefined,
        subtitle: description || undefined,
        iconKey: iconKey || undefined,
        countLabel: countLabel || undefined,
      };

      groupSections[sectionIndex] = nextSection;
      manifestData[group] = groupSections;

      const saveManifestResponse = await fetch(manifestUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
          "Content-Type": "application/json; charset=utf-8",
          "x-upsert": "true",
        },
        body: JSON.stringify(manifestData),
      });

      if (!saveManifestResponse.ok) {
        const saveManifestText = await saveManifestResponse.text();
        return json(
          500,
          { error: "Failed to update catalog-manifest", details: saveManifestText },
          corsHeaders
        );
      }

      return json(
        200,
        {
          ok: true,
          message: "Section updated",
          section: nextSection,
        },
        corsHeaders
      );
    }

    if (body.action === "delete_item") {
      const itemKey = String(body.itemKey || "").trim();
      if (!itemKey) {
        return json(400, { error: "Item key is required" }, corsHeaders);
      }

      const objectPath = `${group}/${id}.json`;
      const objectUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${bucket}/${objectPath}`;

      const fileResponse = await fetch(objectUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
        },
      });

      if (!fileResponse.ok) {
        return json(404, { error: "Catalog JSON not found" }, corsHeaders);
      }

      const payloadText = await fileResponse.text();
      let payload: Record<string, unknown>;
      try {
        payload = JSON.parse(payloadText) as Record<string, unknown>;
      } catch {
        return json(500, { error: "Invalid JSON in storage object" }, corsHeaders);
      }

      const existingValue = payload[jsonKey];
      if (!Array.isArray(existingValue)) {
        return json(400, {
          error: `Key "${jsonKey}" does not contain an array in JSON`,
        }, corsHeaders);
      }

      const existingItems = existingValue as Array<Record<string, unknown>>;
      const nextItems = existingItems.filter(
        (entry) => String(entry.key || "").trim() !== itemKey
      );

      if (nextItems.length === existingItems.length) {
        return json(404, { error: `Item "${itemKey}" not found` }, corsHeaders);
      }

      payload[jsonKey] = nextItems;

      const saveResponse = await fetch(objectUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
          "Content-Type": "application/json; charset=utf-8",
          "x-upsert": "true",
        },
        body: JSON.stringify(payload),
      });

      if (!saveResponse.ok) {
        const saveText = await saveResponse.text();
        return json(500, { error: "Failed to save catalog JSON", details: saveText }, corsHeaders);
      }

      return json(
        200,
        {
          ok: true,
          message: "Item deleted",
          itemKey,
          items: nextItems,
        },
        corsHeaders
      );
    }

    if (body.action === "update_item") {
      const itemKey = String(body.itemKey || "").trim();
      const rawItemIndex = Number(body.itemIndex);
      const itemIndexFromBody =
        Number.isInteger(rawItemIndex) && rawItemIndex >= 0 ? rawItemIndex : null;
      if (!itemKey && itemIndexFromBody === null) {
        return json(400, { error: "Item key or item index is required" }, corsHeaders);
      }

      if (!body.item || typeof body.item !== "object" || Array.isArray(body.item)) {
        return json(400, { error: "Item payload must be an object" }, corsHeaders);
      }

      const objectPath = `${group}/${id}.json`;
      const objectUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${bucket}/${objectPath}`;

      const fileResponse = await fetch(objectUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
        },
      });

      if (!fileResponse.ok) {
        return json(404, { error: "Catalog JSON not found" }, corsHeaders);
      }

      const payloadText = await fileResponse.text();
      let payload: Record<string, unknown>;
      try {
        payload = JSON.parse(payloadText) as Record<string, unknown>;
      } catch {
        return json(500, { error: "Invalid JSON in storage object" }, corsHeaders);
      }

      const existingValue = payload[jsonKey];
      if (!Array.isArray(existingValue)) {
        return json(400, {
          error: `Key "${jsonKey}" does not contain an array in JSON`,
        }, corsHeaders);
      }

      const existingItems = existingValue as Array<Record<string, unknown>>;
      let itemIndex = existingItems.findIndex(
        (entry) => String(entry.key || "").trim() === itemKey
      );
      if (itemIndex < 0 && itemIndexFromBody !== null && itemIndexFromBody < existingItems.length) {
        itemIndex = itemIndexFromBody;
      }
      if (itemIndex < 0) {
        return json(
          404,
          {
            error: itemKey ? `Item "${itemKey}" not found` : "Item not found",
            details:
              itemIndexFromBody !== null
                ? `Index ${itemIndexFromBody} is outside the current JSON array`
                : undefined,
          },
          corsHeaders
        );
      }

      const currentItem = existingItems[itemIndex];
      const incomingItem = { ...(body.item as Record<string, unknown>) };
      const updatedItem = {
        ...currentItem,
        ...incomingItem,
        key: String(incomingItem.key || itemKey).trim() || itemKey,
        dragType: String(incomingItem.dragType || currentItem.dragType || "detachedComponentLayers"),
      };

      const nextItems = [...existingItems];
      nextItems[itemIndex] = updatedItem;
      payload[jsonKey] = nextItems;

      const saveResponse = await fetch(objectUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
          "Content-Type": "application/json; charset=utf-8",
          "x-upsert": "true",
        },
        body: JSON.stringify(payload),
      });

      if (!saveResponse.ok) {
        const saveText = await saveResponse.text();
        return json(500, { error: "Failed to save catalog JSON", details: saveText }, corsHeaders);
      }

      return json(
        200,
        {
          ok: true,
          message: "Item updated",
          item: updatedItem,
          items: nextItems,
        },
        corsHeaders
      );
    }

    const item = normalizeItem(body.item);
    if (!item) {
      return json(400, {
        error: "Invalid item payload. Required: title, image, url",
      }, corsHeaders);
    }

    const objectPath = `${group}/${id}.json`;
    const objectUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${bucket}/${objectPath}`;

    const fileResponse = await fetch(objectUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
      },
    });

    if (!fileResponse.ok) {
      return json(404, { error: "Catalog JSON not found" }, corsHeaders);
    }

    const payloadText = await fileResponse.text();
    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(payloadText) as Record<string, unknown>;
    } catch {
      return json(500, { error: "Invalid JSON in storage object" }, corsHeaders);
    }

    const existingValue = payload[jsonKey];
    if (!Array.isArray(existingValue)) {
      return json(400, {
        error: `Key "${jsonKey}" does not contain an array in JSON`,
      }, corsHeaders);
    }

    const existingItems = existingValue as Array<Record<string, unknown>>;
    const nextSequence = getNextSequence(existingItems);
    const padded = String(nextSequence).padStart(2, "0");
    const baseSlug = buildBaseSlug(group, id);
    const baseTitle = buildBaseTitle(group, id);
    const generatedKey = `${baseSlug}-${padded}`;

    const baseKey = item.key || generatedKey;

    const nextItem = {
      key: baseKey,
      title: item.title || `${baseTitle} ${padded}`,
      image: item.image,
      url: item.url,
      type: item.type,
      dragType: item.dragType || "detachedComponentLayers",
      previewUrl:
        item.previewUrl ||
        `https://framerkit.site/preview/${baseSlug}/${baseKey}`,
      wireframe: item.wireframe
        ? {
            ...item.wireframe,
            previewUrl:
              item.wireframe.previewUrl ||
              `https://framerkit.site/preview/${baseSlug}/${baseKey}-wireframe`,
          }
        : undefined,
    };

    const appendedItems = [nextItem];

    const darkInput = item.dark as Record<string, unknown> | undefined;
    const darkImage = darkInput?.image ? String(darkInput.image) : "";
    const darkUrl = darkInput?.url ? String(darkInput.url) : "";
    if (darkImage && darkUrl) {
      const darkKey = darkInput?.key ? String(darkInput.key) : `${baseKey}-dark`;
      const darkTitle = darkInput?.title ? String(darkInput.title) : nextItem.title;
      const darkType = darkInput?.type === "free" ? "free" : nextItem.type;
      const darkPreviewUrl = darkInput?.previewUrl
        ? String(darkInput.previewUrl)
        : `https://framerkit.site/preview/${baseSlug}/${darkKey}`;

      let darkWireframe: Record<string, unknown> | undefined;
      if (darkInput?.wireframe && typeof darkInput.wireframe === "object") {
        darkWireframe = { ...(darkInput.wireframe as Record<string, unknown>) };
        if (!darkWireframe.previewUrl) {
          darkWireframe.previewUrl = `https://framerkit.site/preview/${baseSlug}/${darkKey}-wireframe`;
        }
      }

      appendedItems.push({
        key: darkKey,
        title: darkTitle,
        image: darkImage,
        url: darkUrl,
        type: darkType,
        dragType: nextItem.dragType,
        previewUrl: darkPreviewUrl,
        wireframe: darkWireframe,
      });
    }

    payload[jsonKey] = [...existingValue, ...appendedItems];

    const saveResponse = await fetch(objectUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
        "Content-Type": "application/json; charset=utf-8",
        "x-upsert": "true",
      },
      body: JSON.stringify(payload),
    });

    if (!saveResponse.ok) {
      const saveText = await saveResponse.text();
      return json(500, { error: "Failed to save catalog JSON", details: saveText }, corsHeaders);
    }

    return json(
      200,
      {
        ok: true,
        message: "Item added",
        item: nextItem,
        items: appendedItems,
      },
      corsHeaders
    );
  } catch (error) {
    console.error(error);
    return json(
      500,
      {
        error: "Failed to process admin request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      corsHeaders
    );
  }
});
