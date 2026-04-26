import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, X } from "lucide-react";
import { fetchJsonWithCache } from "../lib/remoteCache";
import { getLayoutSectionUrl } from "../shared/catalogManifest";
import { useCatalogManifest } from "../hooks/useCatalogManifest";
import { CATALOG_ADMIN_ENDPOINT } from "../lib/env";
import { buildAdminHeaders } from "../lib/adminApi";
import AdminEditSectionButton from "./AdminEditSectionButton";

type ComponentItem = {
  key: string;
  title: string;
  image: string;
  url: string;
  type: "free" | "paid";
  previewUrl?: string;
  wireframe?: {
    image: string;
    url: string;
    previewUrl?: string;
  };
};

type RandomSectionCardsProps = {
  wireframeMode?: boolean;
  theme?: "light" | "dark";
  darkOnly?: boolean;
  isAdmin?: boolean;
};

const isDarkVariant = (item: ComponentItem): boolean => {
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

const getDisplayImage = (item: ComponentItem, wireframeMode: boolean) =>
  wireframeMode && item.wireframe?.image ? item.wireframe.image : item.image;

const formatSectionLabel = (sectionId: string, sectionLabelById: Record<string, string>) =>
  sectionLabelById[sectionId] || sectionId.charAt(0).toUpperCase() + sectionId.slice(1);

const getSectionCountLabel = (sectionId: string, count: number, sectionLabelById: Record<string, string>) =>
  `${formatSectionLabel(sectionId, sectionLabelById)} (${count})`;

const resolveItemsByKey = (
  payload: Record<string, ComponentItem[]>,
  key: string
): ComponentItem[] => {
  const exact = payload[key];
  if (Array.isArray(exact)) return exact;

  const ciKey = Object.keys(payload).find(
    (payloadKey) => payloadKey.toLowerCase() === key.toLowerCase()
  );
  return ciKey && Array.isArray(payload[ciKey]) ? payload[ciKey] : [];
};

export default function RandomSectionCards({
  wireframeMode = false,
  theme = "light",
  darkOnly = false,
  isAdmin = false,
}: RandomSectionCardsProps) {
  const { manifest } = useCatalogManifest();
  const [optimisticallyRemovedSections, setOptimisticallyRemovedSections] = useState<Set<string>>(
    () => new Set(),
  );
  const staticSections = useMemo(
    () =>
      manifest.layout
        .map((section) => ({
          id: section.id,
          jsonKey: section.jsonKey || section.id,
        }))
        .filter((section) => !optimisticallyRemovedSections.has(section.id)),
    [manifest.layout, optimisticallyRemovedSections],
  );
  const sectionLabelById = useMemo(
    () => Object.fromEntries(manifest.layout.map((section) => [section.id, section.label])) as Record<string, string>,
    [manifest.layout],
  );
  const sectionDescriptionById = useMemo(
    () =>
      Object.fromEntries(
        manifest.layout.map((section) => [section.id, section.description || ""])
      ) as Record<string, string>,
    [manifest.layout],
  );

  const [cards, setCards] = useState<(ComponentItem | null)[]>([]);
  const [loaded, setLoaded] = useState<boolean[]>([]);
  const [fading, setFading] = useState<boolean[]>([]);
  const [sectionCounts, setSectionCounts] = useState<Record<string, number>>({});
  const [deletingSection, setDeletingSection] = useState<string | null>(null);

  const hoveredRef = useRef<boolean[]>([]);
  const lastChangeRef = useRef<number[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rotatingRef = useRef(false);
  const itemsBySection = useRef<Record<string, ComponentItem[]>>({});

  useEffect(() => {
    setCards(Array(staticSections.length).fill(null));
    setLoaded(Array(staticSections.length).fill(false));
    setFading(Array(staticSections.length).fill(false));
    hoveredRef.current = Array(staticSections.length).fill(false);
    lastChangeRef.current = Array(staticSections.length).fill(0);
    setSectionCounts({});
  }, [staticSections]);

  useEffect(() => {
    if (!staticSections.length) return;

    let cancelled = false;

    const clearScheduledWork = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const scheduleRotateOne = (delayMs: number) => {
      timeoutRef.current = setTimeout(() => {
        if (cancelled || rotatingRef.current) return;

        const now = Date.now();
        const minInterval = 5000;
        const eligible: number[] = [];

        for (let i = 0; i < staticSections.length; i += 1) {
          if (!hoveredRef.current[i] && now - lastChangeRef.current[i] >= minInterval) {
            eligible.push(i);
          }
        }

        if (!eligible.length) {
          scheduleRotateOne(1000);
          return;
        }

        const randomEligibleIndex = Math.floor(Math.random() * eligible.length);
        const index = eligible[randomEligibleIndex];
        const section = staticSections[index].id;
        const list = itemsBySection.current[section] || [];

        if (!list.length) {
          scheduleRotateOne(1000);
          return;
        }

        const randomItemIndex = Math.floor(Math.random() * list.length);
        const nextItem = list[randomItemIndex];
        rotatingRef.current = true;

        setFading((prev) => {
          const arr = [...prev];
          arr[index] = true;
          return arr;
        });

        const preload = new Image();
        preload.src = getDisplayImage(nextItem, wireframeMode);

        const swap = () => {
          window.setTimeout(() => {
            if (cancelled) return;

            setCards((prev) => {
              const arr = [...prev];
              arr[index] = nextItem;
              return arr;
            });

            lastChangeRef.current[index] = Date.now();

            setFading((prev) => {
              const arr = [...prev];
              arr[index] = false;
              return arr;
            });

            rotatingRef.current = false;
            scheduleRotateOne(1500);
          }, 400);
        };

        preload.onload = swap;
        preload.onerror = swap;
      }, delayMs);
    };

    const load = async () => {
      clearScheduledWork();

      const data: Record<string, ComponentItem[]> = {};
      const entries = await Promise.all(
        staticSections.map(async ({ id, jsonKey }) => {
          try {
            const json = await fetchJsonWithCache<Record<string, ComponentItem[]>>(
              `layout-section:${id}`,
              getLayoutSectionUrl(id),
              undefined,
              { bypassCache: true },
            );
            const allItems: ComponentItem[] = resolveItemsByKey(json, jsonKey);
            const darkItems = allItems.filter(isDarkVariant);
            const lightItems = allItems.filter((item) => !isDarkVariant(item));

            const filtered = darkOnly
              ? darkItems
              : theme === "dark"
                ? darkItems.length
                  ? darkItems
                  : allItems
                : lightItems.length
                  ? lightItems
                  : allItems;
            return [id, filtered] as const;
          } catch {
            return [id, [] as ComponentItem[]] as const;
          }
        }),
      );

      for (const [section, items] of entries) {
        data[section] = items;
      }

      if (cancelled) return;

      itemsBySection.current = data;
      setSectionCounts(
        Object.fromEntries(staticSections.map(({ id }) => [id, data[id]?.length || 0])),
      );

      const now = Date.now();
      const initial = staticSections.map(({ id }) => {
        const items = data[id];
        if (!items.length) return null;

        const randomIndex = Math.floor(Math.random() * items.length);
        return items[randomIndex];
      });

      initial.forEach((item) => {
        if (!item) return;
        const img = new Image();
        img.src = getDisplayImage(item, wireframeMode);
      });

      setCards(initial);
      setLoaded(staticSections.map(() => true));
      lastChangeRef.current = initial.map(() => now);
      scheduleRotateOne(6000);
    };

    void load();

    return () => {
      cancelled = true;
      clearScheduledWork();
    };
  }, [darkOnly, theme, wireframeMode, staticSections]);

  return (
    <>
      {staticSections.map(({ id: sectionId }, index) => {
        const item = cards[index];
        const count = sectionCounts[sectionId] || 0;
        const displayImage = item ? getDisplayImage(item, wireframeMode) : null;
        const manifestSection = manifest.layout.find((entry) => entry.id === sectionId);

        return (
          <div
            key={sectionId}
            className={`card ${theme === "dark" ? "card-dark" : "card-light"}`}
            onMouseEnter={() => {
              hoveredRef.current[index] = true;
            }}
            onMouseLeave={() => {
              hoveredRef.current[index] = false;
            }}
          >
            {isAdmin && (
              <>
                {manifestSection ? (
                  <AdminEditSectionButton group="layout" section={manifestSection} />
                ) : null}
                <button
                  type="button"
                  className="card-section-delete"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  onClick={async (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    if (!CATALOG_ADMIN_ENDPOINT) return;
                    if (!window.confirm(`Delete "${formatSectionLabel(sectionId, sectionLabelById)}" section?`)) {
                      return;
                    }

                    const adminAuthToken = localStorage.getItem("framerkitAdminAuth") || "";
                    const adminFlag = localStorage.getItem("framerkitAdmin") === "true";
                    if (!adminAuthToken || !adminFlag) return;

                    try {
                      setDeletingSection(sectionId);
                      const response = await fetch(CATALOG_ADMIN_ENDPOINT, {
                        method: "POST",
                        headers: buildAdminHeaders(adminAuthToken),
                        body: JSON.stringify({
                          action: "delete_section",
                          group: "layout",
                          id: sectionId,
                        }),
                      });
                      const payload = (await response.json().catch(() => null)) as
                        | { error?: string; message?: string }
                        | null;
                      if (!response.ok) {
                        window.alert(payload?.error || "Failed to delete section.");
                        return;
                      }
                      setOptimisticallyRemovedSections((prev) => {
                        const next = new Set(prev);
                        next.add(sectionId);
                        return next;
                      });
                      window.dispatchEvent(
                        new CustomEvent("framerkit-manifest-hide-section", {
                          detail: { group: "layout", id: sectionId },
                        })
                      );
                      window.dispatchEvent(new Event("framerkit-manifest-refresh"));
                    } finally {
                      setDeletingSection(null);
                    }
                  }}
                  disabled={deletingSection === sectionId}
                  aria-label="Delete section"
                  title="Delete section"
                >
                  <X size={14} />
                </button>
              </>
            )}

            <Link
              to={`/layout/${sectionId}${wireframeMode ? "?mode=wireframe" : ""}`}
              state={{
                sectionLabel: sectionLabelById[sectionId],
                sectionDescription: sectionDescriptionById[sectionId] || undefined,
              }}
              className="card-link-shell"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {!loaded[index] && (
                <div className="skeleton-card">
                  <div className="skeleton-card-image" />
                  <div className="skeleton-card-info" />
                </div>
              )}

              {loaded[index] && !item && (
                <div
                  className="card-name-only"
                  style={{
                    background: "transparent",
                    height: "100%",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "flex-end",
                    padding: "12px",
                  }}
                >
                  <div className="cardInfo">
                    <h3>{getSectionCountLabel(sectionId, 0, sectionLabelById)}</h3>
                    <div className="iconButton2">
                      <ArrowUpRight size={16} className="explore-icon" />
                    </div>
                  </div>
                </div>
              )}

              {loaded[index] && item && displayImage && (
                <>
                  <div className={`cardImage ${fading[index] ? "fadeOut" : "fadeIn"}`}>
                    <img
                      src={displayImage}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/280x160?text=Preview";
                      }}
                    />
                  </div>
                  <div className="cardInfo">
                    <h3>{getSectionCountLabel(sectionId, count, sectionLabelById)}</h3>
                    <div className="iconButton2">
                      <ArrowUpRight size={16} className="explore-icon" />
                    </div>
                  </div>
                </>
              )}
            </Link>
          </div>
        );
      })}
    </>
  );
}
