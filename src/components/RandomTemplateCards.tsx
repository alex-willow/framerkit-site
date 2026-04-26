import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, X } from "lucide-react";
import { fetchJsonWithCache } from "../lib/remoteCache";
import { getTemplateSectionUrl } from "../shared/catalogManifest";
import { useCatalogManifest } from "../hooks/useCatalogManifest";
import { CATALOG_ADMIN_ENDPOINT } from "../lib/env";
import { buildAdminHeaders } from "../lib/adminApi";
import AdminEditSectionButton from "./AdminEditSectionButton";

type TemplateItem = {
  key: string;
  title: string;
  image: string;
  previewUrl?: string;
};

type RandomTemplateCardsProps = {
  theme?: "light" | "dark";
  isAdmin?: boolean;
};

const isDarkVariant = (item: TemplateItem): boolean => {
  const haystack = [item.key, item.title, item.image, item.previewUrl]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes("dark");
};

const resolveItems = (payload: unknown, jsonKey: string): TemplateItem[] => {
  if (Array.isArray(payload)) return payload as TemplateItem[];
  if (!payload || typeof payload !== "object") return [];

  const source = payload as Record<string, unknown>;
  const exact = source[jsonKey];
  if (Array.isArray(exact)) return exact as TemplateItem[];

  const ciKey = Object.keys(source).find(
    (key) => key.toLowerCase() === jsonKey.toLowerCase()
  );
  if (ciKey && Array.isArray(source[ciKey])) {
    return source[ciKey] as TemplateItem[];
  }

  const firstArray = Object.values(source).find((value) => Array.isArray(value));
  return Array.isArray(firstArray) ? (firstArray as TemplateItem[]) : [];
};

export default function RandomTemplateCards({
  theme = "light",
  isAdmin = false,
}: RandomTemplateCardsProps) {
  const { manifest } = useCatalogManifest();
  const [optimisticallyRemovedSections, setOptimisticallyRemovedSections] = useState<Set<string>>(
    () => new Set(),
  );
  const templateSections = useMemo(
    () => manifest.templates.filter((section) => !optimisticallyRemovedSections.has(section.id)),
    [manifest.templates, optimisticallyRemovedSections],
  );
  const [cards, setCards] = useState<(TemplateItem | null)[]>([]);
  const [loaded, setLoaded] = useState<boolean[]>([]);
  const [sectionCounts, setSectionCounts] = useState<Record<string, number>>({});
  const [deletingSection, setDeletingSection] = useState<string | null>(null);

  useEffect(() => {
    setCards(Array(templateSections.length).fill(null));
    setLoaded(Array(templateSections.length).fill(false));
    setSectionCounts({});
  }, [templateSections]);

  useEffect(() => {
    if (!templateSections.length) return;
    let cancelled = false;

    const load = async () => {
      const nextCards: (TemplateItem | null)[] = [];
      const nextCounts: Record<string, number> = {};

      for (const section of templateSections) {
        try {
          const payload = await fetchJsonWithCache<unknown>(
            `templates-section:${section.id}`,
            getTemplateSectionUrl(section.id)
          );
          const allItems = resolveItems(payload, section.jsonKey);
          const darkItems = allItems.filter(isDarkVariant);
          const lightItems = allItems.filter((item) => !isDarkVariant(item));
          const filtered =
            theme === "dark"
              ? darkItems.length
                ? darkItems
                : allItems
              : lightItems.length
                ? lightItems
                : allItems;

          nextCounts[section.id] = filtered.length;
          nextCards.push(filtered.length ? filtered[0] : null);
        } catch {
          nextCounts[section.id] = 0;
          nextCards.push(null);
        }
      }

      if (cancelled) return;
      setCards(nextCards);
      setSectionCounts(nextCounts);
      setLoaded(templateSections.map(() => true));
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [templateSections, theme]);

  return (
    <>
      {templateSections.map((section, index) => {
        const item = cards[index];
        const count = sectionCounts[section.id] || 0;

        return (
          <div
            key={section.id}
            className={`card ${theme === "dark" ? "card-dark" : "card-light"}`}
          >
            {isAdmin && (
              <>
                <AdminEditSectionButton group="templates" section={section} />
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
                    if (!window.confirm(`Delete "${section.label}" section?`)) return;

                    const adminAuthToken = localStorage.getItem("framerkitAdminAuth") || "";
                    const adminFlag = localStorage.getItem("framerkitAdmin") === "true";
                    if (!adminAuthToken || !adminFlag) return;

                    try {
                      setDeletingSection(section.id);
                      const response = await fetch(CATALOG_ADMIN_ENDPOINT, {
                        method: "POST",
                        headers: buildAdminHeaders(adminAuthToken),
                        body: JSON.stringify({
                          action: "delete_section",
                          group: "templates",
                          id: section.id,
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
                        next.add(section.id);
                        return next;
                      });
                      window.dispatchEvent(
                        new CustomEvent("framerkit-manifest-hide-section", {
                          detail: { group: "templates", id: section.id },
                        })
                      );
                      window.dispatchEvent(new Event("framerkit-manifest-refresh"));
                    } finally {
                      setDeletingSection(null);
                    }
                  }}
                  disabled={deletingSection === section.id}
                  aria-label="Delete section"
                  title="Delete section"
                >
                  <X size={14} />
                </button>
              </>
            )}

            <Link
              to={`/templates/${section.id}`}
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
                  <div className="cardImage">
                    <img
                      src={item.image}
                      alt={item.title}
                      onError={(event) => {
                        event.currentTarget.src =
                          "https://via.placeholder.com/280x160?text=Preview";
                      }}
                    />
                  </div>
                  <div className="cardInfo">
                    <h3>{`${section.label} (${count})`}</h3>
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
                    <h3>{`${section.label} (0)`}</h3>
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
