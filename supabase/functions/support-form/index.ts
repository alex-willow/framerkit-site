const MAX_FILE_COUNT = 8;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB per file
const MAX_TOTAL_BYTES = 20 * 1024 * 1024; // 20 MB total per request
const SIGNED_URL_EXPIRES_SECONDS = 60 * 60 * 24 * 7; // 7 days
const ATTACHMENT_RETENTION_DAYS = 10;
const CLEANUP_BATCH_LIMIT = 100;

const requiredEnv = (name: string): string => {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
};

const json = (status: number, body: Record<string, unknown>, headers: HeadersInit = {}) => {
  const merged = new Headers(headers);
  merged.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body), {
    status,
    headers: merged,
  });
};

const readText = (formData: FormData, key: string): string => {
  const raw = formData.get(key);
  if (typeof raw !== "string") return "";
  return raw.trim();
};

const bytesToBase64 = (bytes: Uint8Array): string => {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
};

const sanitizeFileName = (value: string) => value.replace(/[^a-zA-Z0-9._-]/g, "_");

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

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
    "Access-Control-Allow-Methods": "POST, OPTIONS",
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

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const cleanupOldAttachments = async (
  supabaseUrl: string,
  serviceRoleKey: string,
  bucket: string,
  retentionDays: number,
) => {
  if (!serviceRoleKey) return;

  try {
    const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000).toISOString();
    const query =
      `/rest/v1/storage.objects?select=name` +
      `&bucket_id=eq.${encodeURIComponent(bucket)}` +
      `&created_at=lt.${encodeURIComponent(cutoff)}` +
      `&limit=${CLEANUP_BATCH_LIMIT}`;

    const listResponse = await fetch(`${supabaseUrl.replace(/\/$/, "")}${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
      },
    });

    if (!listResponse.ok) {
      console.error("Attachment cleanup list failed", await listResponse.text());
      return;
    }

    const rows = (await listResponse.json()) as Array<{ name?: string }>;
    const paths = rows.map((row) => row.name).filter((name): name is string => Boolean(name));
    if (!paths.length) return;

    const removeResponse = await fetch(`${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${bucket}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prefixes: paths }),
    });

    if (!removeResponse.ok) {
      console.error("Attachment cleanup remove failed", await removeResponse.text());
    }
  } catch (error) {
    console.error("Attachment cleanup error", error);
  }
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
    const formData = await request.formData();

    const channel = readText(formData, "channel") || "support";
    const name = readText(formData, "name");
    const email = readText(formData, "email");
    const topic = readText(formData, "topic") || readText(formData, "suggestionArea");
    const requestType = readText(formData, "requestType") || readText(formData, "suggestionType");
    const pageUrl = readText(formData, "pageUrl");
    const message = readText(formData, "message");
    const sentAt = readText(formData, "sentAt");
    const honeypot = readText(formData, "company");

    if (honeypot) {
      return json(200, { ok: true }, corsHeaders);
    }

    if (!name || !email || !message) {
      return json(400, { error: "name, email, and message are required" }, corsHeaders);
    }

    if (!isEmail(email)) {
      return json(400, { error: "Invalid email address" }, corsHeaders);
    }

    const files = formData
      .getAll("attachments")
      .filter((item): item is File => item instanceof File && item.size > 0);

    if (files.length > MAX_FILE_COUNT) {
      return json(400, { error: `Maximum ${MAX_FILE_COUNT} attachments allowed` }, corsHeaders);
    }

    const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
    if (totalBytes > MAX_TOTAL_BYTES) {
      return json(400, { error: "Total attachment size exceeds 20 MB" }, corsHeaders);
    }

    const oversize = files.find((file) => file.size > MAX_FILE_SIZE_BYTES);
    if (oversize) {
      return json(400, { error: `File too large: ${oversize.name}` }, corsHeaders);
    }

    const fileEntries = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        bytes: new Uint8Array(await file.arrayBuffer()),
      })),
    );

    const resendApiKey = requiredEnv("RESEND_API_KEY");
    const supportFromEmail = requiredEnv("SUPPORT_FROM_EMAIL");
    const supportToEmail = requiredEnv("SUPPORT_TO_EMAIL");
    const supabaseUrl = requiredEnv("SUPABASE_URL");
    const supabaseServiceRoleKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SERVICE_ROLE_KEY") || "";
    const storageBucket = Deno.env.get("SUPPORT_ATTACHMENTS_BUCKET") || "support-attachments";
    const safeChannel = channel.toLowerCase() === "suggestion" ? "suggestion" : "support";
    const attachmentMode = fileEntries.length === 0 ? "none" : "inline+signed-url";
    const resendAttachments: { filename: string; content: string; type: string }[] = [];
    const signedLinks: { name: string; url: string }[] = [];

    await cleanupOldAttachments(
      supabaseUrl,
      supabaseServiceRoleKey,
      storageBucket,
      ATTACHMENT_RETENTION_DAYS,
    );

    for (const file of fileEntries) {
      const emailSafeName = sanitizeFileName(file.name) || `attachment-${crypto.randomUUID()}`;
      resendAttachments.push({
        filename: emailSafeName,
        content: bytesToBase64(file.bytes),
        type: file.type,
      });
    }

    if (supabaseServiceRoleKey) {
      for (const file of fileEntries) {
        try {
          const objectPath = `${safeChannel}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${sanitizeFileName(file.name)}`;
          const uploadResponse = await fetch(
            `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${storageBucket}/${objectPath}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${supabaseServiceRoleKey}`,
                apikey: supabaseServiceRoleKey,
                "Content-Type": file.type,
                "x-upsert": "false",
              },
              body: file.bytes,
            },
          );

          if (!uploadResponse.ok) {
            console.error("Storage upload failed", await uploadResponse.text());
            continue;
          }

          const signResponse = await fetch(
            `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/sign/${storageBucket}/${objectPath}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${supabaseServiceRoleKey}`,
                apikey: supabaseServiceRoleKey,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ expiresIn: SIGNED_URL_EXPIRES_SECONDS }),
            },
          );

          if (!signResponse.ok) {
            console.error("Signed URL generation failed", await signResponse.text());
            continue;
          }

          const signPayload = await signResponse.json();
          const signedPath = signPayload.signedURL || signPayload.signedUrl || "";
          if (typeof signedPath !== "string" || !signedPath) continue;

          const baseUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/`;
          const relativePath = signedPath.startsWith("http")
            ? signedPath
            : signedPath.startsWith("/")
              ? signedPath.slice(1)
              : signedPath;
          const signedUrlObj = new URL(relativePath, baseUrl);
          signedUrlObj.searchParams.set("download", "1");
          const signedUrl = signedUrlObj.toString();

          signedLinks.push({ name: file.name, url: signedUrl });
        } catch (storageError) {
          console.error("Attachment storage/sign error", storageError);
        }
      }
    }

    const subjectPrefix = safeChannel === "suggestion" ? "Suggestion" : "Support";
    const subjectTopic = topic || "General";
    const subjectType = requestType ? ` / ${requestType}` : "";
    const subject = `[FramerKit ${subjectPrefix}] ${subjectTopic}${subjectType}`;

    const lines = [
      `Channel: ${subjectPrefix}`,
      `Name: ${name}`,
      `Email: ${email}`,
      `Topic: ${subjectTopic}`,
      `Type: ${requestType || "-"}`,
      `Page URL: ${pageUrl || "-"}`,
      `Sent At: ${sentAt || new Date().toISOString()}`,
      "",
      "Message:",
      message,
      "",
      "Attachments:",
      fileEntries.length ? fileEntries.map((item) => `${item.name}: attached to email`).join("\n") : "None",
      "",
      "Attachment links:",
      signedLinks.length ? signedLinks.map((item) => `${item.name}: ${item.url}`).join("\n") : "None",
    ];

    const htmlAttachments =
      fileEntries.length > 0
        ? `<ul>${fileEntries.map((item) => `<li>${escapeHtml(item.name)} (attached)</li>`).join("")}</ul>`
        : "<p>None</p>";

    const htmlAttachmentLinks =
      signedLinks.length > 0
        ? `<ul>${signedLinks
            .map(
              (item) =>
                `<li><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(
                  item.name,
                )}</a></li>`,
            )
            .join("")}</ul>`
        : "<p>None</p>";

    const html = `
      <h2>FramerKit ${escapeHtml(subjectPrefix)} Request</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Topic:</strong> ${escapeHtml(subjectTopic)}</p>
      <p><strong>Type:</strong> ${escapeHtml(requestType || "-")}</p>
      <p><strong>Page URL:</strong> ${escapeHtml(pageUrl || "-")}</p>
      <p><strong>Sent At:</strong> ${escapeHtml(sentAt || new Date().toISOString())}</p>
      <h3>Message</h3>
      <p>${escapeHtml(message).replaceAll("\n", "<br/>")}</p>
      <h3>Attachments</h3>
      ${htmlAttachments}
      <h3>Attachment links (7 days)</h3>
      ${htmlAttachmentLinks}
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: supportFromEmail,
        to: [supportToEmail],
        subject,
        text: lines.join("\n"),
        html,
        reply_to: email,
        ...(resendAttachments.length ? { attachments: resendAttachments } : {}),
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      throw new Error(`Resend API error: ${errorText}`);
    }

    const resendPayload = await resendResponse.json();
    return json(
      200,
      {
        ok: true,
        emailId: resendPayload.id,
        attachments: fileEntries.length,
        attachmentMode,
        attachmentLinks: signedLinks.length,
      },
      corsHeaders,
    );
  } catch (error) {
    console.error(error);
    return json(
      500,
      {
        error: "Failed to process form submission",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      corsHeaders,
    );
  }
});
