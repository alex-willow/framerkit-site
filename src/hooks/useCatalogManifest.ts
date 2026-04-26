import { useEffect, useState } from "react";
import {
  FALLBACK_CATALOG_MANIFEST,
  getCatalogManifestUrl,
  type CatalogGroup,
  type CatalogManifest,
  type CatalogSection,
} from "../shared/catalogManifest";

type RawManifest = Partial<Record<CatalogGroup, Array<Partial<CatalogSection>>>>;
type HiddenSectionsByGroup = Record<CatalogGroup, string[]>;

const HIDDEN_SECTIONS_STORAGE_KEY = "framerkitHiddenSections";
const MANIFEST_CACHE_STORAGE_KEY = "framerkitManifestCache";

const emptyHiddenSections = (): HiddenSectionsByGroup => ({
  layout: [],
  components: [],
  templates: [],
});

const readHiddenSections = (): HiddenSectionsByGroup => {
  if (typeof window === "undefined") return emptyHiddenSections();
  try {
    const raw = window.localStorage.getItem(HIDDEN_SECTIONS_STORAGE_KEY);
    if (!raw) return emptyHiddenSections();
    const parsed = JSON.parse(raw) as Partial<HiddenSectionsByGroup>;
    return {
      layout: Array.isArray(parsed.layout) ? parsed.layout.map(String) : [],
      components: Array.isArray(parsed.components) ? parsed.components.map(String) : [],
      templates: Array.isArray(parsed.templates) ? parsed.templates.map(String) : [],
    };
  } catch {
    return emptyHiddenSections();
  }
};

const writeHiddenSections = (value: HiddenSectionsByGroup) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(HIDDEN_SECTIONS_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // no-op
  }
};

const readManifestCache = (): CatalogManifest | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(MANIFEST_CACHE_STORAGE_KEY);
    if (!raw) return null;
    return normalizeManifest(JSON.parse(raw));
  } catch {
    return null;
  }
};

const writeManifestCache = (value: CatalogManifest) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MANIFEST_CACHE_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // no-op
  }
};

const applyHiddenSections = (
  input: CatalogManifest,
  hidden: HiddenSectionsByGroup
): CatalogManifest => ({
  layout: input.layout.filter(
    (item) => !hidden.layout.some((id) => id.toLowerCase() === item.id.toLowerCase())
  ),
  components: input.components.filter(
    (item) => !hidden.components.some((id) => id.toLowerCase() === item.id.toLowerCase())
  ),
  templates: input.templates.filter(
    (item) => !hidden.templates.some((id) => id.toLowerCase() === item.id.toLowerCase())
  ),
});

const normalizeSection = (value: Partial<CatalogSection>): CatalogSection | null => {
  if (!value.id || !value.label) return null;
  const resolvedJsonKey = value.jsonKey || value.id;
  return {
    id: String(value.id),
    label: String(value.label),
    jsonKey: String(resolvedJsonKey),
    description: value.description ? String(value.description) : undefined,
    iconKey: value.iconKey ? String(value.iconKey) : undefined,
    countLabel: value.countLabel ? String(value.countLabel) : undefined,
  };
};

const normalizeManifest = (input: unknown): CatalogManifest | null => {
  if (!input || typeof input !== "object") return null;
  const raw = input as RawManifest;

  const normalizeGroup = (group: CatalogGroup) => {
    const fallback = FALLBACK_CATALOG_MANIFEST[group];
    const incoming = raw[group];
    if (!Array.isArray(incoming)) return fallback;

    const normalized = incoming
      .map(normalizeSection)
      .filter((item): item is CatalogSection => item !== null);

    return normalized.length > 0 ? normalized : fallback;
  };

  return {
    layout: normalizeGroup("layout"),
    components: normalizeGroup("components"),
    templates: normalizeGroup("templates"),
  };
};

export function useCatalogManifest() {
  const [hiddenSections, setHiddenSections] = useState<HiddenSectionsByGroup>(() =>
    readHiddenSections()
  );
  const [manifest, setManifest] = useState<CatalogManifest>(() => {
    const cached = readManifestCache();
    return cached ? applyHiddenSections(cached, readHiddenSections()) : FALLBACK_CATALOG_MANIFEST;
  });
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(getCatalogManifestUrl()));

  useEffect(() => {
    writeHiddenSections(hiddenSections);
  }, [hiddenSections]);

  useEffect(() => {
    writeManifestCache(manifest);
  }, [manifest]);

  useEffect(() => {
    const loadManifest = async () => {
      const url = getCatalogManifestUrl();
      if (!url) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Manifest fetch failed: ${response.status}`);
        }

        const data = await response.json();
        const normalized = normalizeManifest(data);
        if (normalized) {
          const nextHidden = { ...hiddenSections };

          (["layout", "components", "templates"] as CatalogGroup[]).forEach((group) => {
            const ids = new Set(normalized[group].map((item) => item.id.toLowerCase()));
            nextHidden[group] = nextHidden[group].filter((hiddenId) =>
              ids.has(hiddenId.toLowerCase())
            );
          });

          if (
            nextHidden.layout.length !== hiddenSections.layout.length ||
            nextHidden.components.length !== hiddenSections.components.length ||
            nextHidden.templates.length !== hiddenSections.templates.length
          ) {
            setHiddenSections(nextHidden);
          }

          const filtered: CatalogManifest = applyHiddenSections(normalized, nextHidden);

          setManifest(filtered);
        }
      } catch (error) {
        console.warn("Using fallback catalog manifest on site", error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadManifest();

    const refreshHandler = () => {
      void loadManifest();
    };
    const appendSectionHandler = (
      event: Event
    ) => {
      const customEvent = event as CustomEvent<{
        group?: CatalogGroup;
        section?: Partial<CatalogSection>;
      }>;
      const group = customEvent.detail?.group;
      const section = customEvent.detail?.section;
      if (!group || !section) return;
      if (group !== "layout" && group !== "components" && group !== "templates") return;

      const normalized = normalizeSection(section);
      if (!normalized) return;

      setManifest((prev) => {
        const alreadyExists = prev[group].some(
          (item) => item.id.toLowerCase() === normalized.id.toLowerCase()
        );
        if (alreadyExists) return prev;
        return {
          ...prev,
          [group]: [...prev[group], normalized],
        };
      });
    };
    const hideSectionHandler = (event: Event) => {
      const customEvent = event as CustomEvent<{ group?: CatalogGroup; id?: string }>;
      const group = customEvent.detail?.group;
      const id = customEvent.detail?.id;
      if (!group || !id) return;
      if (group !== "layout" && group !== "components" && group !== "templates") return;

      setHiddenSections((prev) => {
        const current = prev[group];
        if (current.some((item) => item.toLowerCase() === id.toLowerCase())) return prev;
        return {
          ...prev,
          [group]: [...current, id],
        };
      });

      setManifest((prev) => ({
        ...prev,
        [group]: prev[group].filter((item) => item.id.toLowerCase() !== id.toLowerCase()),
      }));
    };
    window.addEventListener("framerkit-manifest-refresh", refreshHandler);
    window.addEventListener(
      "framerkit-manifest-append-section",
      appendSectionHandler as EventListener
    );
    window.addEventListener(
      "framerkit-manifest-hide-section",
      hideSectionHandler as EventListener
    );

    return () => {
      window.removeEventListener("framerkit-manifest-refresh", refreshHandler);
      window.removeEventListener(
        "framerkit-manifest-append-section",
        appendSectionHandler as EventListener
      );
      window.removeEventListener(
        "framerkit-manifest-hide-section",
        hideSectionHandler as EventListener
      );
    };
  }, [hiddenSections]);

  return { manifest, isLoading };
}
