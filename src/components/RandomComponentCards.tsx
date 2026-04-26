import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, X } from "lucide-react";
import { fetchJsonWithCache } from "../lib/remoteCache";
import { getComponentSectionUrl } from "../shared/catalogManifest";
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

type RandomComponentCardsProps = {
  theme?: "light" | "dark";
  darkOnly?: boolean;
  wireframeMode?: boolean;
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

const formatComponentLabel = (section: string, componentLabelById: Record<string, string>) =>
  componentLabelById[section] || section.charAt(0).toUpperCase() + section.slice(1);

const getComponentCountLabel = (section: string, count: number, componentLabelById: Record<string, string>) =>
  `${formatComponentLabel(section, componentLabelById)} (${count})`;

export default function RandomComponentCards({
  theme = "light",
  darkOnly = false,
  wireframeMode = false,
  isAdmin = false,
}: RandomComponentCardsProps) {
  const { manifest } = useCatalogManifest();
  const [optimisticallyRemovedSections, setOptimisticallyRemovedSections] = useState<Set<string>>(
    () => new Set(),
  );
  const componentSections = useMemo(
    () =>
      manifest.components
        .map((section) => section.id)
        .filter((id) => !optimisticallyRemovedSections.has(id)),
    [manifest.components, optimisticallyRemovedSections],
  );
  const componentLabelById = useMemo(
    () =>
      Object.fromEntries(manifest.components.map((section) => [section.id, section.label])) as Record<
        string,
        string
      >,
    [manifest.components],
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
    setCards(Array(componentSections.length).fill(null));
    setLoaded(Array(componentSections.length).fill(false));
    setFading(Array(componentSections.length).fill(false));
    hoveredRef.current = Array(componentSections.length).fill(false);
    lastChangeRef.current = Array(componentSections.length).fill(0);
    setSectionCounts({});
  }, [componentSections]);

  useEffect(() => {
    if (!componentSections.length) return;

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

        for (let i = 0; i < componentSections.length; i += 1) {
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
        const section = componentSections[index];
        const list = itemsBySection.current[section] || [];

        if (!list.length) {
          scheduleRotateOne(1000);
          return;
        }

        const randomCardIndex = Math.floor(Math.random() * list.length);
        const nextCard = list[randomCardIndex];
        rotatingRef.current = true;

        setFading((prev) => {
          const arr = [...prev];
          arr[index] = true;
          return arr;
        });

        const preload = new Image();
        preload.src =
          wireframeMode && nextCard.wireframe ? nextCard.wireframe.image : nextCard.image;

        const swap = () => {
          window.setTimeout(() => {
            if (cancelled) return;

            setCards((prev) => {
              const arr = [...prev];
              arr[index] = nextCard;
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
          }, 500);
        };

        preload.onload = swap;
        preload.onerror = swap;
      }, delayMs);
    };

    const load = async () => {
      clearScheduledWork();

      const data: Record<string, ComponentItem[]> = {};
      const entries = await Promise.all(
        componentSections.map(async (section) => {
          try {
            const json = await fetchJsonWithCache<Record<string, ComponentItem[]>>(
              `components-section:${section}`,
              getComponentSectionUrl(section),
            );
            const jsonKey = Object.keys(json).find((key) => key.toLowerCase() === section.toLowerCase());
            const allItems: ComponentItem[] = jsonKey ? json[jsonKey] : [];
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

            return [section, filtered] as const;
          } catch {
            return [section, [] as ComponentItem[]] as const;
          }
        }),
      );

      for (const [section, items] of entries) {
        data[section] = items;
      }

      if (cancelled) return;

      itemsBySection.current = data;
      setSectionCounts(
        Object.fromEntries(componentSections.map((section) => [section, data[section]?.length || 0])),
      );

      const now = Date.now();
      const initial = componentSections.map((section) => {
        const items = data[section];
        if (!items || !items.length) return null;

        const randomIndex = Math.floor(Math.random() * items.length);
        return items[randomIndex];
      });

      setCards(initial);
      setLoaded(componentSections.map(() => true));
      lastChangeRef.current = initial.map(() => now);
      scheduleRotateOne(6000);
    };

    void load();

    return () => {
      cancelled = true;
      clearScheduledWork();
    };
  }, [darkOnly, theme, wireframeMode, componentSections]);

  return (
    <>
      {componentSections.map((section, index) => {
        const item = cards[index];
        const count = sectionCounts[section] || 0;
        const manifestSection = manifest.components.find((entry) => entry.id === section);

        return (
          <div
            key={section}
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
                  <AdminEditSectionButton group="components" section={manifestSection} />
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
                    if (!window.confirm(`Delete "${formatComponentLabel(section, componentLabelById)}" section?`)) {
                      return;
                    }

                    const adminAuthToken = localStorage.getItem("framerkitAdminAuth") || "";
                    const adminFlag = localStorage.getItem("framerkitAdmin") === "true";
                    if (!adminAuthToken || !adminFlag) return;

                    try {
                      setDeletingSection(section);
                      const response = await fetch(CATALOG_ADMIN_ENDPOINT, {
                        method: "POST",
                        headers: buildAdminHeaders(adminAuthToken),
                        body: JSON.stringify({
                          action: "delete_section",
                          group: "components",
                          id: section,
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
                        next.add(section);
                        return next;
                      });
                      window.dispatchEvent(
                        new CustomEvent("framerkit-manifest-hide-section", {
                          detail: { group: "components", id: section },
                        })
                      );
                      window.dispatchEvent(new Event("framerkit-manifest-refresh"));
                    } finally {
                      setDeletingSection(null);
                    }
                  }}
                  disabled={deletingSection === section}
                  aria-label="Delete section"
                  title="Delete section"
                >
                  <X size={14} />
                </button>
              </>
            )}

            <Link
              to={`/components/${section}${wireframeMode ? "?mode=wireframe" : ""}`}
              className="card-link-shell"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {!loaded[index] && (
                <div className="skeleton-card">
                  <div className="skeleton-card-image" />
                  <div className="skeleton-card-info" />
                </div>
              )}

              {loaded[index] && item && (
                <>
                  <div className={`cardImage ${fading[index] ? "fadeOut" : "fadeIn"}`}>
                    <img
                      src={wireframeMode && item.wireframe ? item.wireframe.image : item.image}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/280x160?text=Preview";
                      }}
                    />
                  </div>
                  <div className="cardInfo">
                    <h3>{getComponentCountLabel(section, count, componentLabelById)}</h3>
                    <div className="iconButton2">
                      <ArrowUpRight size={16} className="explore-icon" />
                    </div>
                  </div>
                </>
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
                    <h3>{getComponentCountLabel(section, 0, componentLabelById)}</h3>
                    <div className="iconButton2">
                      <ArrowUpRight size={16} className="explore-icon" />
                    </div>
                  </div>
                </div>
              )}
            </Link>
          </div>
        );
      })}
    </>
  );
}
