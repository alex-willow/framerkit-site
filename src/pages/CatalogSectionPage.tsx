import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { CircleCheck, Copy, Eye, Lock, Pencil, Plus, X } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import SEO from "../components/SEO";
import {
  fetchJsonWithCache,
  invalidateJsonCache,
  readJsonCache,
} from "../lib/remoteCache";
import { buildAdminHeaders } from "../lib/adminApi";
import { useCatalogManifest } from "../hooks/useCatalogManifest";
import { CATALOG_ADMIN_ENDPOINT } from "../lib/env";
import {
  getComponentSectionUrl,
  getLayoutSectionUrl,
  getTemplateSectionUrl,
  type CatalogGroup,
} from "../shared/catalogManifest";

type CatalogSectionPageProps = {
  group: CatalogGroup;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setIsSignInOpen: (open: boolean) => void;
};

type RawItem = {
  key?: string;
  title?: string;
  image?: string;
  url?: string;
  type?: "free" | "paid";
  previewUrl?: string;
  preview?: string;
  wireframe?: {
    image?: string;
    url?: string;
    previewUrl?: string;
  };
  dark?: {
    key?: string;
    title?: string;
    image?: string;
    url?: string;
    type?: "free" | "paid";
    previewUrl?: string;
    wireframe?: {
      image?: string;
      url?: string;
      previewUrl?: string;
    };
  };
};

type CatalogItem = {
  key: string;
  title: string;
  image: string;
  url: string;
  type: "free" | "paid";
  previewUrl?: string;
  wireframe?: {
    image?: string;
    url?: string;
    previewUrl?: string;
  };
  rawIndex: number;
  rawItem: RawItem;
};

type AdminFormState = {
  title: string;
  image: string;
  url: string;
  type: "free" | "paid";
  previewUrl: string;
  wireframeImage: string;
  wireframeUrl: string;
  wireframePreviewUrl: string;
  darkImage: string;
  darkUrl: string;
  darkPreviewUrl: string;
  darkWireframeImage: string;
  darkWireframeUrl: string;
  darkWireframePreviewUrl: string;
};

type AdminVariantTab =
  | "lightDesign"
  | "lightWireframe"
  | "darkDesign"
  | "darkWireframe";

const ADMIN_VARIANT_TABS: Array<{
  id: AdminVariantTab;
  label: string;
  eyebrow: "Light" | "Dark";
  tone: "Design" | "Wireframe";
}> = [
  { id: "lightDesign", label: "Light Design", eyebrow: "Light", tone: "Design" },
  { id: "lightWireframe", label: "Light Wireframe", eyebrow: "Light", tone: "Wireframe" },
  { id: "darkDesign", label: "Dark Design", eyebrow: "Dark", tone: "Design" },
  { id: "darkWireframe", label: "Dark Wireframe", eyebrow: "Dark", tone: "Wireframe" },
];

const EDIT_LAYOUT_VARIANT_TABS: Array<{
  id: "lightDesign" | "lightWireframe";
  label: "Design" | "Wireframe";
}> = [
  { id: "lightDesign", label: "Design" },
  { id: "lightWireframe", label: "Wireframe" },
];

type AdminPreviewStatus = Partial<Record<AdminVariantTab, "success" | "error">>;

const PLACEHOLDER = "https://via.placeholder.com/280x160?text=No+Image";
const createEmptyAdminFormState = (): AdminFormState => ({
  title: "",
  image: "",
  url: "",
  type: "free",
  previewUrl: "",
  wireframeImage: "",
  wireframeUrl: "",
  wireframePreviewUrl: "",
  darkImage: "",
  darkUrl: "",
  darkPreviewUrl: "",
  darkWireframeImage: "",
  darkWireframeUrl: "",
  darkWireframePreviewUrl: "",
});

const mapRawItemToAdminFormState = (item: RawItem): AdminFormState => ({
  title: item.title ? String(item.title) : "",
  image: item.image ? String(item.image) : "",
  url: item.url ? String(item.url) : "",
  type: item.type === "paid" ? "paid" : "free",
  previewUrl: item.previewUrl ? String(item.previewUrl) : item.preview ? String(item.preview) : "",
  wireframeImage: item.wireframe?.image ? String(item.wireframe.image) : "",
  wireframeUrl: item.wireframe?.url ? String(item.wireframe.url) : "",
  wireframePreviewUrl: item.wireframe?.previewUrl ? String(item.wireframe.previewUrl) : "",
  darkImage: item.dark?.image ? String(item.dark.image) : "",
  darkUrl: item.dark?.url ? String(item.dark.url) : "",
  darkPreviewUrl: item.dark?.previewUrl ? String(item.dark.previewUrl) : "",
  darkWireframeImage: item.dark?.wireframe?.image ? String(item.dark.wireframe.image) : "",
  darkWireframeUrl: item.dark?.wireframe?.url ? String(item.dark.wireframe.url) : "",
  darkWireframePreviewUrl: item.dark?.wireframe?.previewUrl
    ? String(item.dark.wireframe.previewUrl)
    : "",
});

const buildRawItemFromAdminFormState = (form: AdminFormState): RawItem => ({
  title: form.title || undefined,
  image: form.image || undefined,
  url: form.url || undefined,
  type: form.type,
  previewUrl: form.previewUrl || undefined,
  wireframe:
    form.wireframeImage || form.wireframeUrl || form.wireframePreviewUrl
      ? {
          image: form.wireframeImage || undefined,
          url: form.wireframeUrl || undefined,
          previewUrl: form.wireframePreviewUrl || undefined,
        }
      : undefined,
  dark:
    form.darkImage || form.darkUrl || form.darkPreviewUrl
      ? {
          image: form.darkImage || undefined,
          url: form.darkUrl || undefined,
          previewUrl: form.darkPreviewUrl || undefined,
          type: form.type,
          wireframe:
            form.darkWireframeImage ||
            form.darkWireframeUrl ||
            form.darkWireframePreviewUrl
              ? {
                  image: form.darkWireframeImage || undefined,
                  url: form.darkWireframeUrl || undefined,
                  previewUrl: form.darkWireframePreviewUrl || undefined,
                }
              : undefined,
        }
      : undefined,
});

const GROUP_CONFIG = {
  layout: {
    singular: "Layout",
    plural: "Layout Sections",
    titleSuffix: "Sections",
    breadcrumbRoot: "Layout Sections",
    rootPath: "/layout",
    seoPrefix: "Layout",
    description:
      "Choose the section variation that fits your page, switch between wireframe and design modes, then copy and paste into Framer.",
    enableWireframe: true,
  },
  components: {
    singular: "Component",
    plural: "UI Components",
    titleSuffix: "Components",
    breadcrumbRoot: "UI Components",
    rootPath: "/components",
    seoPrefix: "UI",
    description:
      "Pick reusable UI blocks, keep your styles consistent, and speed up implementation with ready-to-use variants.",
    enableWireframe: false,
  },
  templates: {
    singular: "Template",
    plural: "Templates",
    titleSuffix: "Templates",
    breadcrumbRoot: "Templates",
    rootPath: "/templates",
    seoPrefix: "Templates",
    description:
      "Open complete starters and production-ready blocks, then customize content and visuals for your project.",
    enableWireframe: false,
  },
} as const;

const isDarkVariant = (item: CatalogItem): boolean => {
  const haystack = [
    item.key,
    item.title,
    item.image,
    item.url,
    item.previewUrl,
    item.wireframe?.image,
    item.wireframe?.url,
    item.wireframe?.previewUrl,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes("dark");
};

const toTitleCase = (value: string) =>
  value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const humanizeSectionId = (value: string) =>
  value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getSectionUrl = (group: CatalogGroup, id: string) => {
  if (group === "layout") return getLayoutSectionUrl(id);
  if (group === "components") return getComponentSectionUrl(id);
  return getTemplateSectionUrl(id);
};

const resolveItems = (payload: unknown, jsonKey: string): RawItem[] => {
  if (Array.isArray(payload)) {
    return payload as RawItem[];
  }

  if (!payload || typeof payload !== "object") return [];

  const source = payload as Record<string, unknown>;
  const exact = source[jsonKey];
  if (Array.isArray(exact)) return exact as RawItem[];

  const ciKey = Object.keys(source).find(
    (key) => key.toLowerCase() === jsonKey.toLowerCase()
  );
  if (ciKey && Array.isArray(source[ciKey])) {
    return source[ciKey] as RawItem[];
  }

  const firstArray = Object.values(source).find((value) => Array.isArray(value));
  return Array.isArray(firstArray) ? (firstArray as RawItem[]) : [];
};

const normalizeItems = (input: RawItem[], sectionId: string): CatalogItem[] =>
  input.map((item, index) => {
    const fallbackKey = `${sectionId}-${index + 1}`;
    const normalizedKey = item.key ? String(item.key) : fallbackKey;
    return {
      key: normalizedKey,
      title: item.title ? String(item.title) : toTitleCase(normalizedKey),
      image: item.image ? String(item.image) : PLACEHOLDER,
      url: item.url ? String(item.url) : "",
      type: item.type === "paid" ? "paid" : "free",
      previewUrl: item.previewUrl ? String(item.previewUrl) : item.preview ? String(item.preview) : undefined,
      wireframe: item.wireframe
        ? {
            image: item.wireframe.image ? String(item.wireframe.image) : undefined,
            url: item.wireframe.url ? String(item.wireframe.url) : undefined,
            previewUrl: item.wireframe.previewUrl ? String(item.wireframe.previewUrl) : undefined,
          }
        : undefined,
      rawIndex: index,
      rawItem: item,
    };
  });

const extractTrailingNumber = (value: string): number | null => {
  const match = value.match(/(\d+)(?!.*\d)/);
  if (!match) return null;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
};

const getSearchRank = (item: CatalogItem, query: string) => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return Number.POSITIVE_INFINITY;

  const title = item.title.toLowerCase();
  const key = item.key.toLowerCase();
  const titleNumber = extractTrailingNumber(title);
  const keyNumber = extractTrailingNumber(key);
  const queryNumber = /^\d+$/.test(normalizedQuery) ? Number(normalizedQuery) : null;

  if (title === normalizedQuery || key === normalizedQuery) return 0;
  if (title.startsWith(normalizedQuery) || key.startsWith(normalizedQuery)) return 1;

  if (queryNumber !== null) {
    if (titleNumber === queryNumber || keyNumber === queryNumber) return 2;
    if (title.includes(` ${normalizedQuery}`) || key.endsWith(`-${normalizedQuery}`)) return 3;
  } else if (title.includes(normalizedQuery) || key.includes(normalizedQuery)) {
    return 3;
  }

  return 4;
};

const normalizeSectionIdForMatch = (value: string) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");

export default function CatalogSectionPage({
  group,
  isAuthenticated,
  isAdmin,
  setIsSignInOpen,
}: CatalogSectionPageProps) {
  const { sectionId = "" } = useParams();
  const location = useLocation();
  const { manifest, isLoading: isManifestLoading } = useCatalogManifest();
  const config = GROUP_CONFIG[group];
  const locationState = (location.state || {}) as {
    sectionLabel?: string;
    sectionDescription?: string;
  };

  const section = useMemo(
    () =>
      manifest[group].find(
        (item) =>
          normalizeSectionIdForMatch(item.id) ===
          normalizeSectionIdForMatch(sectionId)
      ),
    [group, manifest, sectionId]
  );

  const dataUrl = section ? getSectionUrl(group, section.id) : "";
  const cacheKey = section ? `${group}-section:${section.id}` : "";
  const initialItems = useMemo(() => {
    if (!section || !cacheKey) return [];
    const initialRaw = readJsonCache<unknown>(cacheKey);
    return normalizeItems(resolveItems(initialRaw, section.jsonKey), section.id);
  }, [cacheKey, section]);

  const [items, setItems] = useState<CatalogItem[]>(initialItems);
  const [loading, setLoading] = useState(Boolean(section) && initialItems.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" ? "dark" : "light";
  });
  const [availabilityFilter, setAvailabilityFilter] = useState<"paid" | "free">(
    "paid"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [hoveredPreviewKey, setHoveredPreviewKey] = useState<string | null>(null);
  const [deletingItemKey, setDeletingItemKey] = useState<string | null>(null);
  const [editingItemKey, setEditingItemKey] = useState<string | null>(null);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [editItemError, setEditItemError] = useState<string | null>(null);
  const [editItemSubmitting, setEditItemSubmitting] = useState(false);
  const [editVariantTab, setEditVariantTab] =
    useState<AdminVariantTab>("lightDesign");
  const [editForm, setEditForm] = useState<AdminFormState>(createEmptyAdminFormState);
  const shouldCloseEditItemModalOnOverlayClickRef = useRef(false);
  const [isWireframeMode, setIsWireframeMode] = useState(() => {
    try {
      const saved = localStorage.getItem("wireframeMode");
      return saved !== null ? saved === "true" : true;
    } catch {
      return true;
    }
  });
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminSubmitting, setAdminSubmitting] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminVariantTab, setAdminVariantTab] =
    useState<AdminVariantTab>("lightDesign");
  const [adminPreviewGenerating, setAdminPreviewGenerating] =
    useState<AdminVariantTab | null>(null);
  const [adminPreviewStatus, setAdminPreviewStatus] =
    useState<AdminPreviewStatus>({});
  const [adminPreviewMessage, setAdminPreviewMessage] = useState<{
    tab: AdminVariantTab;
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [adminForm, setAdminForm] = useState<AdminFormState>(createEmptyAdminFormState);

  const galleryRef = useRef<HTMLDivElement>(null);
  const shouldCloseAdminModalOnOverlayClickRef = useRef(false);

  const pendingSectionLabel = useMemo(
    () => (sectionId ? humanizeSectionId(sectionId) : config.singular),
    [config.singular, sectionId]
  );
  const effectiveSectionLabel =
    section?.label ||
    locationState.sectionLabel ||
    (isManifestLoading ? pendingSectionLabel : undefined);
  const effectiveSectionDescription =
    section?.description || locationState.sectionDescription || config.description;

  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ theme?: "light" | "dark" } | "light" | "dark">;
      const nextTheme =
        typeof customEvent.detail === "string"
          ? customEvent.detail
          : customEvent.detail?.theme;

      if (nextTheme === "light" || nextTheme === "dark") {
        setFilter(nextTheme);
      }
    };

    window.addEventListener(
      "framerkit-theme-change",
      handleThemeChange as EventListener
    );
    window.addEventListener(
      "framerkit-component-theme-change",
      handleThemeChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "framerkit-theme-change",
        handleThemeChange as EventListener
      );
      window.removeEventListener(
        "framerkit-component-theme-change",
        handleThemeChange as EventListener
      );
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("wireframeMode", isWireframeMode.toString());
    } catch {
      // no-op
    }
  }, [isWireframeMode]);

  useEffect(() => {
    galleryRef.current?.scrollTo({ top: 0 });
  }, [filter, availabilityFilter, sortDirection, isWireframeMode, sectionId, localSearchQuery]);

  useEffect(() => {
    setLocalSearchQuery("");
  }, [group, sectionId]);

  useEffect(() => {
    if (!section || !dataUrl || !cacheKey) {
      setItems([]);
      if (isManifestLoading) {
        setLoading(true);
        setError(null);
      } else {
        setLoading(false);
        setError("Section not found in catalog manifest.");
      }
      return;
    }

    let isCancelled = false;
    setLoading(initialItems.length === 0);
    setError(null);

    const load = async () => {
      try {
        const payload = await fetchJsonWithCache<unknown>(cacheKey, dataUrl);
        const resolved = normalizeItems(
          resolveItems(payload, section.jsonKey),
          section.id
        );
        if (isCancelled) return;
        setItems(resolved);
      } catch (loadError) {
        if (isCancelled) return;
        console.error(loadError);
        setError(`Failed to load ${section.label} data.`);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      isCancelled = true;
    };
  }, [cacheKey, dataUrl, group, isManifestLoading, section, sectionId]);

  const filteredItems = useMemo(() => {
    const themed = (() => {
      const darkItems = items.filter(isDarkVariant);
      const lightItems = items.filter((item) => !isDarkVariant(item));

      if (filter === "dark") {
        return darkItems.length ? darkItems : items;
      }
      return lightItems.length ? lightItems : items;
    })();

    const availability =
      availabilityFilter === "paid"
        ? themed
        : themed.filter((item) => item.type === "free");

    const searchNeedle = localSearchQuery.trim().toLowerCase();
    const searched = !searchNeedle
      ? availability
      : availability.filter((item) => {
          const title = item.title.toLowerCase();
          const key = item.key.toLowerCase();
          return title.includes(searchNeedle) || key.includes(searchNeedle);
        });
    const ordered = sortDirection === "asc" ? searched : [...searched].reverse();

    if (!searchNeedle) {
      return ordered;
    }

    return [...ordered].sort((left, right) => {
      const leftRank = getSearchRank(left, searchNeedle);
      const rightRank = getSearchRank(right, searchNeedle);

      if (leftRank !== rightRank) return leftRank - rightRank;

      const leftNumber = extractTrailingNumber(left.title) ?? extractTrailingNumber(left.key) ?? Number.POSITIVE_INFINITY;
      const rightNumber = extractTrailingNumber(right.title) ?? extractTrailingNumber(right.key) ?? Number.POSITIVE_INFINITY;

      if (leftNumber !== rightNumber) return leftNumber - rightNumber;

      return left.title.localeCompare(right.title);
    });
  }, [availabilityFilter, filter, items, localSearchQuery, sortDirection]);

  useEffect(() => {
    if (!items.length) return;
    const hasFree = items.some((item) => item.type === "free");
    const hasPaid = items.some((item) => item.type === "paid");
    if (!hasFree && hasPaid && availabilityFilter === "free") {
      setAvailabilityFilter("paid");
    }
  }, [availabilityFilter, items]);

  const nextSequence = useMemo(() => {
    const max = items.reduce((currentMax, item) => {
      const keyNumber = extractTrailingNumber(item.key);
      const titleNumber = extractTrailingNumber(item.title);
      const candidate = Math.max(keyNumber ?? 0, titleNumber ?? 0);
      return Math.max(currentMax, candidate);
    }, 0);
    return max + 1;
  }, [items]);

  const formattedSequence = String(nextSequence).padStart(2, "0");

  const baseSlug = useMemo(() => {
    if (!section) return "section";
    if (group === "layout") return `${section.id}-section`;
    return section.id;
  }, [group, section]);

  const baseTitle = useMemo(() => {
    if (!section) return "Section";
    if (group === "layout") return `${section.label}`;
    return section.label;
  }, [group, section]);

  const openPreview = (url: string) => {
    try {
      const path = url.trim();
      let cleanPath = "";

      if (path.startsWith("/")) {
        cleanPath = path.replace("/preview/", "").replace(/\/$/, "");
      } else if (path.startsWith("http")) {
        const nextUrl = new URL(path);
        cleanPath = nextUrl.pathname.replace("/preview/", "").replace(/\/$/, "");
      }

      if (cleanPath) {
        window.open(`/p/${cleanPath}`, "_blank", "noopener,noreferrer");
        return;
      }
    } catch {
      // fallback below
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopy = async (item: CatalogItem, value: string) => {
    if (!isAuthenticated && item.type === "paid") {
      setIsSignInOpen(true);
      return;
    }

    if (!value) return;

    await navigator.clipboard.writeText(value);
    setCopiedKey(item.key);
    window.setTimeout(() => setCopiedKey(null), 4000);
  };

  const handleDeleteItem = async (item: CatalogItem) => {
    if (!section) return;
    if (!CATALOG_ADMIN_ENDPOINT) {
      window.alert("VITE_CATALOG_ADMIN_ENDPOINT is not configured.");
      return;
    }

    const adminAuthToken = localStorage.getItem("framerkitAdminAuth") || "";
    const isAdminSession = localStorage.getItem("framerkitAdmin") === "true";
    if (!adminAuthToken || !isAdminSession) {
      window.alert("Admin session not found. Sign in as admin first.");
      return;
    }

    if (!window.confirm(`Delete "${item.title}" (${item.key})?`)) {
      return;
    }

    try {
      setDeletingItemKey(item.key);
      const response = await fetch(CATALOG_ADMIN_ENDPOINT, {
        method: "POST",
        headers: buildAdminHeaders(adminAuthToken),
        body: JSON.stringify({
          action: "delete_item",
          group,
          id: section.id,
          jsonKey: section.jsonKey,
          itemKey: item.key,
        }),
      });

      const responseJson = (await response.json().catch(() => null)) as
        | { error?: string; items?: RawItem[] }
        | null;

      if (!response.ok) {
        window.alert(responseJson?.error || "Failed to delete component.");
        return;
      }

      const nextItems = responseJson?.items
        ? normalizeItems(responseJson.items, section.id)
        : items.filter((entry) => entry.key !== item.key);

      setItems(nextItems);

      invalidateJsonCache(cacheKey);
      if (group === "layout") {
        invalidateJsonCache(`layout-json:${section.id}`);
      } else if (group === "components") {
        invalidateJsonCache(`components-section:${section.id}`);
        invalidateJsonCache(`component-json:${section.id}`);
      } else {
        invalidateJsonCache(`templates-section:${section.id}`);
        invalidateJsonCache(`template-json:${section.id}`);
      }
    } catch (deleteError) {
      console.error(deleteError);
      window.alert("Failed to delete component.");
    } finally {
      setDeletingItemKey(null);
    }
  };

  const openEditItemModal = (item: CatalogItem) => {
    setEditingItemKey(item.key);
    setEditingItemIndex(item.rawIndex);
    setEditVariantTab(isWireframeMode ? "lightWireframe" : "lightDesign");
    setEditForm(mapRawItemToAdminFormState(item.rawItem));
    setEditItemError(null);
    setEditItemSubmitting(false);
  };

  const closeEditItemModal = () => {
    setEditingItemKey(null);
    setEditingItemIndex(null);
    resetEditForm();
  };

  const handleUpdateItem = async () => {
    if (!section || !editingItemKey) return;
    if (!CATALOG_ADMIN_ENDPOINT) {
      setEditItemError("VITE_CATALOG_ADMIN_ENDPOINT is not configured.");
      return;
    }

    const adminAuthToken = localStorage.getItem("framerkitAdminAuth") || "";
    const isAdminSession = localStorage.getItem("framerkitAdmin") === "true";
    if (!adminAuthToken || !isAdminSession) {
      setEditItemError("Admin session not found. Sign in as admin first.");
      return;
    }

    const parsedItem = buildEditableItemPayload();

    try {
      setEditItemSubmitting(true);
      setEditItemError(null);

      const response = await fetch(CATALOG_ADMIN_ENDPOINT, {
        method: "POST",
        headers: buildAdminHeaders(adminAuthToken),
        body: JSON.stringify({
          action: "update_item",
          group,
          id: section.id,
          jsonKey: section.jsonKey,
          itemKey: editingItemKey,
          itemIndex: editingItemIndex,
          item: parsedItem,
        }),
      });

      const responseText = await response.text();
      let responseJson: { error?: string; details?: string; items?: RawItem[] } | null = null;
      if (responseText) {
        try {
          responseJson = JSON.parse(responseText) as {
            error?: string;
            details?: string;
            items?: RawItem[];
          };
        } catch {
          responseJson = null;
        }
      }

      if (!response.ok) {
        setEditItemError(
          responseJson?.details
            ? `${responseJson?.error || "Failed to update item."} ${responseJson.details}`
            : responseJson?.error || responseText || "Failed to update item."
        );
        return;
      }

      const nextItems = responseJson?.items
        ? normalizeItems(responseJson.items, section.id)
        : items;

      setItems(nextItems);
      invalidateJsonCache(cacheKey);
      closeEditItemModal();
    } catch (updateError) {
      console.error(updateError);
      setEditItemError("Failed to update item.");
    } finally {
      setEditItemSubmitting(false);
    }
  };

  const pageTitle = effectiveSectionLabel || `${config.plural}`;
  const localSearchPlaceholder = useMemo(() => {
    const label = effectiveSectionLabel || config.singular;
    if (group === "layout") return `Search ${label}...`;
    if (group === "components") return `Search ${label}...`;
    return `Search ${label}...`;
  }, [config.singular, effectiveSectionLabel, group]);
  const canonicalPath = section
    ? `https://www.framerkit.site/${group}/${section.id}`
    : `https://www.framerkit.site/${group}`;

  const resetAdminForm = () => {
    setAdminForm(createEmptyAdminFormState());
    setAdminError(null);
    setAdminPreviewGenerating(null);
    setAdminPreviewStatus({});
    setAdminPreviewMessage(null);
    setAdminVariantTab("lightDesign");
  };

  const resetEditForm = () => {
    setEditForm(createEmptyAdminFormState());
    setEditVariantTab("lightDesign");
    setEditItemError(null);
    setEditItemSubmitting(false);
  };

  const closeAdminModal = () => {
    setShowAdminModal(false);
    setAdminSubmitting(false);
    resetAdminForm();
  };

  const handleCreateItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!section) return;
    if (!CATALOG_ADMIN_ENDPOINT) {
      setAdminError("VITE_CATALOG_ADMIN_ENDPOINT is not configured.");
      return;
    }

    const adminAuthToken = localStorage.getItem("framerkitAdminAuth") || "";
    const isAdminSession = localStorage.getItem("framerkitAdmin") === "true";
    if (!adminAuthToken || !isAdminSession) {
      setAdminError("Admin session not found. Sign in as admin first.");
      return;
    }

    const payloadItem: RawItem = buildRawItemFromAdminFormState(adminForm);

    setAdminSubmitting(true);
    setAdminError(null);

    try {
      const response = await fetch(CATALOG_ADMIN_ENDPOINT, {
        method: "POST",
        headers: buildAdminHeaders(adminAuthToken),
        body: JSON.stringify({
          action: "append_item",
          group,
          id: section.id,
          jsonKey: section.jsonKey,
          item: payloadItem,
        }),
      });

      const responseJson = (await response.json().catch(() => null)) as
        | { error?: string; item?: RawItem; items?: RawItem[] }
        | null;

      if (!response.ok) {
        setAdminError(responseJson?.error || "Failed to create component.");
        return;
      }

      const createdItems = responseJson?.items?.length
        ? normalizeItems(responseJson.items, section.id)
        : responseJson?.item
          ? normalizeItems([responseJson.item], section.id)
          : normalizeItems([payloadItem], section.id);

      setItems((prev) => [...createdItems, ...prev]);
      invalidateJsonCache(cacheKey);
      if (group === "layout") {
        invalidateJsonCache(`layout-section:${section.id}`);
        invalidateJsonCache(`layout-json:${section.id}`);
      } else if (group === "components") {
        invalidateJsonCache(`components-section:${section.id}`);
        invalidateJsonCache(`component-json:${section.id}`);
      } else {
        invalidateJsonCache(`templates-section:${section.id}`);
        invalidateJsonCache(`template-json:${section.id}`);
      }
      closeAdminModal();
    } catch (submitError) {
      console.error(submitError);
      setAdminError("Failed to create component. Please try again.");
    } finally {
      setAdminSubmitting(false);
    }
  };

  const handleGeneratePreview = async (
    tab: AdminVariantTab,
    imageKey: keyof AdminFormState,
    urlKey: keyof AdminFormState,
    previewKey: keyof AdminFormState
  ) => {
    const sourceUrl = String(adminForm[urlKey] || "").trim();
    const previewUrl = String(adminForm[previewKey] || "").trim();

    setAdminPreviewMessage(null);
    setAdminPreviewStatus((prev) => ({ ...prev, [tab]: undefined }));

    if (!sourceUrl) {
      setAdminPreviewStatus((prev) => ({ ...prev, [tab]: "error" }));
      setAdminPreviewMessage({
        tab,
        type: "error",
        text: "Add the Framer copy URL first.",
      });
      return;
    }

    if (!previewUrl) {
      setAdminPreviewStatus((prev) => ({ ...prev, [tab]: "error" }));
      setAdminPreviewMessage({
        tab,
        type: "error",
        text: "Add or keep the generated preview URL first.",
      });
      return;
    }

    setAdminPreviewGenerating(tab);

    try {
      const response = await fetch("/api/generate-component-preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sourceUrl, previewUrl }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        imageUrl?: string;
        previewUrl?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Preview generation failed.");
      }

      if (data.previewUrl) {
        setAdminForm((prev) => ({
          ...prev,
          [imageKey]: data.imageUrl || prev[imageKey],
          [previewKey]: data.previewUrl,
        }));
      } else if (data.imageUrl) {
        setAdminForm((prev) => ({
          ...prev,
          [imageKey]: data.imageUrl,
        }));
      }

      setAdminPreviewMessage({
        tab,
        type: "success",
        text: "Preview generated.",
      });
      setAdminPreviewStatus((prev) => ({ ...prev, [tab]: "success" }));
    } catch (error) {
      setAdminPreviewMessage({
        tab,
        type: "error",
        text: error instanceof Error ? error.message : "Preview generation failed.",
      });
      setAdminPreviewStatus((prev) => ({ ...prev, [tab]: "error" }));
    } finally {
      setAdminPreviewGenerating(null);
    }
  };

  const updateAdminVariantField = (
    tab: AdminVariantTab,
    key: keyof AdminFormState,
    value: string
  ) => {
    setAdminForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setAdminPreviewStatus((prev) => ({ ...prev, [tab]: undefined }));
    if (adminPreviewMessage?.tab === tab) {
      setAdminPreviewMessage(null);
    }
  };

  const renderAdminVariantFields = (
    tab: AdminVariantTab,
    options: { compactTitle?: boolean } = {}
  ) => {
    const configByTab = {
      lightDesign: {
        title: "Light Design",
        imageKey: "image",
        urlKey: "url",
        previewKey: "previewUrl",
        imageLabel: "Image URL",
        copyLabel: "Copy URL",
        previewLabel: "Preview URL (optional)",
        required: true,
      },
      lightWireframe: {
        title: "Light Wireframe",
        imageKey: "wireframeImage",
        urlKey: "wireframeUrl",
        previewKey: "wireframePreviewUrl",
        imageLabel: "Wireframe Image URL",
        copyLabel: "Wireframe Copy URL",
        previewLabel: "Wireframe Preview URL (optional)",
        required: false,
      },
      darkDesign: {
        title: "Dark Design",
        imageKey: "darkImage",
        urlKey: "darkUrl",
        previewKey: "darkPreviewUrl",
        imageLabel: "Dark Image URL",
        copyLabel: "Dark Copy URL",
        previewLabel: "Dark Preview URL (optional)",
        required: false,
      },
      darkWireframe: {
        title: "Dark Wireframe",
        imageKey: "darkWireframeImage",
        urlKey: "darkWireframeUrl",
        previewKey: "darkWireframePreviewUrl",
        imageLabel: "Dark Wireframe Image URL",
        copyLabel: "Dark Wireframe Copy URL",
        previewLabel: "Dark Wireframe Preview URL (optional)",
        required: false,
      },
    }[tab] as {
      title: string;
      imageKey: keyof AdminFormState;
      urlKey: keyof AdminFormState;
      previewKey: keyof AdminFormState;
      imageLabel: string;
      copyLabel: string;
      previewLabel: string;
      required: boolean;
    };

    return (
      <div className="admin-create-variant-panel">
        {!options.compactTitle && (
          <div className="admin-create-group-title">{configByTab.title}</div>
        )}

        <label>
          {configByTab.imageLabel}
          <input
            required={configByTab.required}
            value={String(adminForm[configByTab.imageKey])}
            onChange={(event) =>
              setAdminForm((prev) => ({
                ...prev,
                [configByTab.imageKey]: event.target.value,
              }))
            }
            placeholder="https://..."
          />
        </label>

        <label>
          {configByTab.copyLabel}
          <input
            required={configByTab.required}
            value={String(adminForm[configByTab.urlKey])}
            onChange={(event) =>
              updateAdminVariantField(
                tab,
                configByTab.urlKey,
                event.target.value
              )
            }
            placeholder="https://..."
          />
        </label>

        {group !== "components" && (
          <label>
            {configByTab.previewLabel}
            <div className="admin-create-preview-row">
              <input
                value={String(adminForm[configByTab.previewKey])}
                onChange={(event) =>
                  updateAdminVariantField(
                    tab,
                    configByTab.previewKey,
                    event.target.value
                  )
                }
                placeholder="/preview/..."
              />
              <button
                type="button"
                className={`admin-preview-generate-btn ${
                  adminPreviewStatus[tab] === "success" ? "generated" : ""
                }`}
                disabled={adminPreviewGenerating !== null}
                onClick={() =>
                    void handleGeneratePreview(
                      tab,
                      configByTab.imageKey,
                      configByTab.urlKey,
                      configByTab.previewKey
                    )
                }
              >
                {adminPreviewGenerating === tab ? (
                  <>
                    <span className="admin-preview-spinner" aria-hidden="true" />
                    Generating
                  </>
                ) : adminPreviewStatus[tab] === "success" ? (
                  "Generated"
                ) : (
                  "Generate"
                )}
              </button>
            </div>
            {adminPreviewMessage?.tab === tab && (
              <span
                className={`admin-create-preview-message ${adminPreviewMessage.type}`}
              >
                {adminPreviewMessage.text}
              </span>
            )}
          </label>
        )}
      </div>
    );
  };

  const renderEditVariantFields = (
    tab: AdminVariantTab,
    options: { compactTitle?: boolean } = {}
  ) => {
    const configByTab = {
      lightDesign: {
        title: "Light Design",
        imageKey: "image",
        urlKey: "url",
        previewKey: "previewUrl",
        imageLabel: "Image URL",
        copyLabel: "Copy URL",
        previewLabel: "Preview URL",
      },
      lightWireframe: {
        title: "Light Wireframe",
        imageKey: "wireframeImage",
        urlKey: "wireframeUrl",
        previewKey: "wireframePreviewUrl",
        imageLabel: "Wireframe Image URL",
        copyLabel: "Wireframe Copy URL",
        previewLabel: "Wireframe Preview URL",
      },
      darkDesign: {
        title: "Dark Design",
        imageKey: "darkImage",
        urlKey: "darkUrl",
        previewKey: "darkPreviewUrl",
        imageLabel: "Dark Image URL",
        copyLabel: "Dark Copy URL",
        previewLabel: "Dark Preview URL",
      },
      darkWireframe: {
        title: "Dark Wireframe",
        imageKey: "darkWireframeImage",
        urlKey: "darkWireframeUrl",
        previewKey: "darkWireframePreviewUrl",
        imageLabel: "Dark Wireframe Image URL",
        copyLabel: "Dark Wireframe Copy URL",
        previewLabel: "Dark Wireframe Preview URL",
      },
    }[tab] as {
      title: string;
      imageKey: keyof AdminFormState;
      urlKey: keyof AdminFormState;
      previewKey: keyof AdminFormState;
      imageLabel: string;
      copyLabel: string;
      previewLabel: string;
    };

    return (
      <div className="admin-create-variant-panel">
        {!options.compactTitle && (
          <div className="admin-create-group-title">{configByTab.title}</div>
        )}

        <label>
          {configByTab.imageLabel}
          <input
            value={String(editForm[configByTab.imageKey])}
            onChange={(event) =>
              setEditForm((prev) => ({
                ...prev,
                [configByTab.imageKey]: event.target.value,
              }))
            }
            placeholder="https://..."
          />
        </label>

        <label>
          {configByTab.copyLabel}
          <input
            value={String(editForm[configByTab.urlKey])}
            onChange={(event) =>
              setEditForm((prev) => ({
                ...prev,
                [configByTab.urlKey]: event.target.value,
              }))
            }
            placeholder="https://..."
          />
        </label>

        {group !== "components" && (
          <label>
            {configByTab.previewLabel}
            <input
              value={String(editForm[configByTab.previewKey])}
              onChange={(event) =>
                setEditForm((prev) => ({
                  ...prev,
                  [configByTab.previewKey]: event.target.value,
                }))
              }
              placeholder="/preview/..."
            />
          </label>
        )}
      </div>
    );
  };

  const buildEditableItemPayload = (): RawItem => ({
    title: editForm.title || undefined,
    image: editForm.image || undefined,
    url: editForm.url || undefined,
    type: editForm.type,
    previewUrl: editForm.previewUrl || undefined,
    wireframe:
      editForm.wireframeImage || editForm.wireframeUrl || editForm.wireframePreviewUrl
        ? {
            image: editForm.wireframeImage || undefined,
            url: editForm.wireframeUrl || undefined,
            previewUrl: editForm.wireframePreviewUrl || undefined,
          }
        : undefined,
  });

  return (
    <div className="layout-component-page" style={{ padding: 0, scrollMarginTop: "64px" }}>
      <SEO
        title={`${pageTitle} for Framer`}
        description={config.description}
        keywords={`framerkit ${group}, framer ${section?.label ?? group}, ready-to-use sections`}
        canonical={canonicalPath}
      />

      <div className="component-page-header">
        <nav className="component-breadcrumb">
          <Link to={config.rootPath} className="breadcrumb-link">
            {config.breadcrumbRoot}
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">
            {effectiveSectionLabel ?? "Section"}
          </span>
        </nav>
        <h2 className="component-page-title">{pageTitle}</h2>
        <p className="component-page-description">{effectiveSectionDescription}</p>
      </div>

      <SectionHeader
        title={effectiveSectionLabel ?? config.singular}
        filter={filter}
        onFilterChange={setFilter}
        loading={loading}
        hideTitle={true}
        renderMetaBelow={true}
        isWireframeMode={isWireframeMode}
        onWireframeModeChange={setIsWireframeMode}
        hideWireframeToggle={!config.enableWireframe}
        hideThemeSwitcher={false}
        availabilityFilter={availabilityFilter}
        onAvailabilityFilterChange={setAvailabilityFilter}
        sortDirection={sortDirection}
        onSortDirectionChange={setSortDirection}
        searchValue={localSearchQuery}
        onSearchValueChange={setLocalSearchQuery}
        searchPlaceholder={localSearchPlaceholder}
      />

      <div className="gallery-scroll-area" ref={galleryRef}>
        {loading ? (
          <div style={{ minHeight: "200px" }} />
        ) : error ? (
          <p style={{ color: "red", padding: "20px" }}>{error}</p>
        ) : filteredItems.length === 0 && !isAdmin ? (
          <div className="empty-message">
            No items available for the selected filters
          </div>
        ) : (
          <div className="gallery">
            {isAdmin && (
              <button
                type="button"
                className={`card card-admin-create ${filter === "dark" ? "card-dark" : "card-light"}`}
                onClick={() => {
                  resetAdminForm();
                  if (section) {
                    const nextKey = `${baseSlug}-${formattedSequence}`;
                    const nextTitle = `${baseTitle} ${formattedSequence}`;
                    const nextPreview = `/preview/${baseSlug}/${nextKey}`;
                    const nextWireframePreview = `/preview/${baseSlug}/${nextKey}-wireframe`;
                    const nextDarkKey = `${nextKey}-dark`;
                    const nextDarkPreview = `/preview/${baseSlug}/${nextDarkKey}`;
                    const nextDarkWireframePreview = `/preview/${baseSlug}/${nextDarkKey}-wireframe`;
                    setAdminForm((prev) => ({
                      ...prev,
                      title: nextTitle,
                      previewUrl: nextPreview,
                      wireframePreviewUrl: nextWireframePreview,
                      darkPreviewUrl: nextDarkPreview,
                      darkWireframePreviewUrl: nextDarkWireframePreview,
                    }));
                  }
                  setShowAdminModal(true);
                }}
              >
                <div className="cardImage card-admin-create-image">
                  <Plus size={30} />
                </div>
                <div className="cardInfo">
                  <h3>Add New Component</h3>
                </div>
              </button>
            )}
            {filteredItems.map((item) => {
              const canCopy = isAuthenticated || item.type === "free";
              const isCopied = copiedKey === item.key;
              const displayImage =
                config.enableWireframe && isWireframeMode && item.wireframe?.image
                  ? item.wireframe.image
                  : item.image;
              const displayUrl =
                config.enableWireframe && isWireframeMode && item.wireframe?.url
                  ? item.wireframe.url
                  : item.url;
              const displayPreviewUrl =
                config.enableWireframe && isWireframeMode
                  ? item.wireframe?.previewUrl
                  : item.previewUrl;

              return (
                <div
                  key={item.key}
                  className={`card ${filter === "dark" ? "card-dark" : "card-light"}`}
                >
                  <div className="cardImage">
                    {item.type === "free" && <span className="card-free-badge">Free</span>}
                    <img src={displayImage || PLACEHOLDER} alt={item.title} loading="lazy" />
                  </div>

                  <div className="cardInfo">
                    <h3>{item.title}</h3>
                    <div className="card-actions">
                      {group !== "components" && displayPreviewUrl ? (
                        <div
                          className="iconButton"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            openPreview(displayPreviewUrl);
                          }}
                          onMouseEnter={() => setHoveredPreviewKey(item.key)}
                          onMouseLeave={() => setHoveredPreviewKey(null)}
                        >
                          <Eye size={16} color="currentColor" />
                          {hoveredPreviewKey === item.key && (
                            <div className="tooltip">Preview</div>
                          )}
                        </div>
                      ) : group !== "components" ? (
                        <div className="iconButton disabled" style={{ cursor: "not-allowed", opacity: 0.4 }}>
                          <Eye size={16} />
                        </div>
                      ) : null}

                      <div
                        className={`iconButton ${isCopied ? "copied" : ""} ${!canCopy ? "locked" : ""}`}
                        onClick={() => {
                          void handleCopy(item, displayUrl);
                        }}
                        onMouseEnter={() => !isCopied && setHoveredKey(item.key)}
                        onMouseLeave={() => setHoveredKey(null)}
                      >
                        {isCopied ? (
                          <CircleCheck size={20} color="#22c55e" strokeWidth={2.5} />
                        ) : canCopy ? (
                          <Copy size={16} color={filter === "dark" ? "#ccc" : "currentColor"} />
                        ) : (
                          <Lock size={16} color={filter === "dark" ? "#ccc" : "currentColor"} />
                        )}

                        {(isCopied || hoveredKey === item.key) && (
                          <div className="tooltip">
                            {isCopied ? "Copied" : canCopy ? "Copy" : "Sign in to copy"}
                          </div>
                        )}
                      </div>

                      {isAdmin && (
                        <div
                          className="iconButton"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                          }}
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            openEditItemModal(item);
                          }}
                          onMouseEnter={() => setHoveredPreviewKey(`edit:${item.key}`)}
                          onMouseLeave={() => setHoveredPreviewKey(null)}
                          aria-label={`Edit ${item.title}`}
                          title="Edit item JSON"
                        >
                          <Pencil size={16} color="currentColor" />
                          {hoveredPreviewKey === `edit:${item.key}` && (
                            <div className="tooltip">Edit</div>
                          )}
                        </div>
                      )}

                      {isAdmin && (
                        <div
                          className={`iconButton ${deletingItemKey === item.key ? "disabled" : ""}`}
                          onMouseDown={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                          }}
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            if (deletingItemKey === item.key) return;
                            void handleDeleteItem(item);
                          }}
                          onMouseEnter={() => setHoveredPreviewKey(`delete:${item.key}`)}
                          onMouseLeave={() => setHoveredPreviewKey(null)}
                          aria-label={`Delete ${item.title}`}
                          title="Delete item"
                        >
                          <X size={16} color="currentColor" />
                          {hoveredPreviewKey === `delete:${item.key}` && (
                            <div className="tooltip">
                              {deletingItemKey === item.key ? "Deleting..." : "Delete"}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAdminModal && (
        <div
          className="admin-create-modal-overlay"
          onMouseDown={(event) => {
            shouldCloseAdminModalOnOverlayClickRef.current =
              event.target === event.currentTarget;
          }}
          onClick={(event) => {
            const isDirectOverlayClick = event.target === event.currentTarget;
            if (
              isDirectOverlayClick &&
              shouldCloseAdminModalOnOverlayClickRef.current
            ) {
              closeAdminModal();
            }
            shouldCloseAdminModalOnOverlayClickRef.current = false;
          }}
        >
          <div
            className="admin-create-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-create-modal-header">
              <h3>Add Component</h3>
              <button
                type="button"
                className="admin-create-close"
                onClick={closeAdminModal}
              >
                <X size={18} />
              </button>
            </div>

            <form className="admin-create-form" onSubmit={handleCreateItem}>
              <label>
                Title
                <input
                  value={adminForm.title}
                  onChange={(event) =>
                    setAdminForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                  placeholder={`${baseTitle} ${formattedSequence} (auto)`}
                />
              </label>

              <label>
                Type
                <select
                  value={adminForm.type}
                  onChange={(event) =>
                    setAdminForm((prev) => ({
                      ...prev,
                      type: event.target.value as "free" | "paid",
                    }))
                  }
                >
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </label>

              {group === "layout" ? (
                <>
                  <div className="admin-create-mode-switch admin-create-mode-switch-quad">
                    {ADMIN_VARIANT_TABS.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        className={adminVariantTab === tab.id ? "active" : ""}
                        aria-label={tab.label}
                        onClick={() => setAdminVariantTab(tab.id)}
                      >
                        <span>{tab.eyebrow}</span>
                        <strong>{tab.tone}</strong>
                      </button>
                    ))}
                  </div>

                  {renderAdminVariantFields(adminVariantTab, { compactTitle: true })}
                </>
              ) : (
                <>
                  {renderAdminVariantFields("lightDesign")}
                  <div className="admin-create-group-title">Dark Variant (optional)</div>
                  {renderAdminVariantFields("darkDesign", { compactTitle: true })}
                </>
              )}

                {adminError && <p className="admin-create-error">{adminError}</p>}

                <button type="submit" disabled={adminSubmitting}>
                  {adminSubmitting ? "Saving..." : "Add Component"}
                </button>
              </form>
          </div>
        </div>
      )}

      {editingItemKey && (
        <div
          className="admin-create-modal-overlay"
          onMouseDown={(event) => {
            shouldCloseEditItemModalOnOverlayClickRef.current =
              event.target === event.currentTarget;
          }}
          onClick={(event) => {
            const isDirectOverlayClick = event.target === event.currentTarget;
            if (
              isDirectOverlayClick &&
              shouldCloseEditItemModalOnOverlayClickRef.current
            ) {
              closeEditItemModal();
            }
            shouldCloseEditItemModalOnOverlayClickRef.current = false;
          }}
        >
          <div
            className="admin-create-modal"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-create-modal-header">
              <h3>Edit Component</h3>
              <button
                type="button"
                className="admin-create-close"
                onClick={closeEditItemModal}
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-create-form">
              <label>
                Title
                <input
                  value={editForm.title}
                  onChange={(event) =>
                    setEditForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                  placeholder="Component title"
                />
              </label>

              <label>
                Type
                <select
                  value={editForm.type}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      type: event.target.value as "free" | "paid",
                    }))
                  }
                >
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </label>

              {group === "layout" ? (
                <>
                  <div className="admin-create-mode-switch">
                    {EDIT_LAYOUT_VARIANT_TABS.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        className={editVariantTab === tab.id ? "active" : ""}
                        aria-label={tab.label}
                        onClick={() => setEditVariantTab(tab.id)}
                      >
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {renderEditVariantFields(editVariantTab, { compactTitle: true })}
                </>
              ) : (
                renderEditVariantFields("lightDesign")
              )}

              {editItemError ? <p className="admin-create-error">{editItemError}</p> : null}

              <button type="button" onClick={() => void handleUpdateItem()} disabled={editItemSubmitting}>
                {editItemSubmitting ? "Saving..." : "Save Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
