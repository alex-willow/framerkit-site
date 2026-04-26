import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const dataDir = path.resolve(rootDir, "catalog-data");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
const CATALOG_BUCKET = process.env.CATALOG_BUCKET || "catalog-json";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const listJsonFiles = (group) => {
  const groupDir = path.resolve(dataDir, group);
  return readdirSync(groupDir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => ({ name, fullPath: path.resolve(groupDir, name) }));
};

const ensureBucket = async () => {
  const { data: buckets, error } = await client.storage.listBuckets();
  if (error) throw error;
  if (buckets.some((bucket) => bucket.name === CATALOG_BUCKET)) return;

  const { error: createError } = await client.storage.createBucket(CATALOG_BUCKET, {
    public: false,
  });
  if (createError) throw createError;
  console.log(`Created bucket: ${CATALOG_BUCKET}`);
};

const uploadGroup = async (group) => {
  const files = listJsonFiles(group);
  for (const file of files) {
    const buffer = readFileSync(file.fullPath);
    const objectPath = `${group}/${file.name}`;
    const { error } = await client.storage.from(CATALOG_BUCKET).upload(objectPath, buffer, {
      upsert: true,
      contentType: "application/json",
      cacheControl: "3600",
    });
    if (error) throw error;
    console.log(`Uploaded: ${objectPath}`);
  }
};

const run = async () => {
  await ensureBucket();
  await uploadGroup("layout");
  await uploadGroup("components");
  await uploadGroup("templates");
  console.log(`Catalog upload complete to bucket "${CATALOG_BUCKET}".`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
