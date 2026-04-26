type CacheEntry<T> = {
  data: T;
  ts: number;
};

const memoryCache = new Map<string, CacheEntry<unknown>>();
const DEFAULT_TTL_MS = 60 * 60 * 1000;

const loadFromSession = <T,>(key: string): CacheEntry<T> | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as CacheEntry<T>;
  } catch {
    return null;
  }
};

const saveToSession = <T,>(key: string, entry: CacheEntry<T>) => {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // no-op: storage may be unavailable
  }
};

const getFresh = <T,>(entry: CacheEntry<T> | null | undefined, ttlMs: number): T | null => {
  if (!entry) return null;
  if (Date.now() - entry.ts > ttlMs) return null;
  return entry.data;
};

export const readJsonCache = <T,>(cacheKey: string, ttlMs = DEFAULT_TTL_MS): T | null => {
  const memoryEntry = memoryCache.get(cacheKey) as CacheEntry<T> | undefined;
  const freshMemory = getFresh(memoryEntry, ttlMs);
  if (freshMemory !== null) return freshMemory;

  const sessionEntry = loadFromSession<T>(cacheKey);
  const freshSession = getFresh(sessionEntry, ttlMs);
  if (freshSession !== null) {
    memoryCache.set(cacheKey, sessionEntry as CacheEntry<unknown>);
    return freshSession;
  }

  return null;
};

export const fetchJsonWithCache = async <T,>(
  cacheKey: string,
  url: string,
  ttlMs = DEFAULT_TTL_MS,
  options?: { bypassCache?: boolean }
): Promise<T> => {
  const bypassCache = options?.bypassCache === true;
  const memoryEntry = memoryCache.get(cacheKey) as CacheEntry<T> | undefined;
  const sessionEntry = loadFromSession<T>(cacheKey);

  if (!bypassCache) {
    const freshMemory = getFresh(memoryEntry, ttlMs);
    if (freshMemory !== null) return freshMemory;

    const freshSession = getFresh(sessionEntry, ttlMs);
    if (freshSession !== null) {
      memoryCache.set(cacheKey, sessionEntry as CacheEntry<unknown>);
      return freshSession;
    }
  }

  try {
    const bust = `${url}${url.includes("?") ? "&" : "?"}_=${Date.now()}`;
    const res = await fetch(bust, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as T;
    const nextEntry: CacheEntry<T> = { data, ts: Date.now() };
    memoryCache.set(cacheKey, nextEntry as CacheEntry<unknown>);
    saveToSession(cacheKey, nextEntry);
    return data;
  } catch (error) {
    if (memoryEntry) return memoryEntry.data;
    if (sessionEntry) return sessionEntry.data;
    throw error;
  }
};

export const invalidateJsonCache = (cacheKey: string) => {
  memoryCache.delete(cacheKey);
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(cacheKey);
  } catch {
    // no-op
  }
};
