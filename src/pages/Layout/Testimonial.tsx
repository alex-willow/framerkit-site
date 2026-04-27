import { useState, useEffect, useRef, useMemo } from "react";
import { Copy, CircleCheck, Lock, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SectionHeader from "../../components/SectionHeader";
import SEO from "../../components/SEO";
import { fetchJsonWithCache, readJsonCache } from "../../lib/remoteCache";

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

type TestimonialPageProps = {
  isAuthenticated: boolean;
  setIsSignInOpen: (open: boolean) => void;
};

// ✅ Исправлен PLACEHOLDER (убраны пробелы)
const PLACEHOLDER = "https://via.placeholder.com/280x160?text=No+Image";
const DATA_URL = "https://raw.githubusercontent.com/alex-willow/framerkit-data/main/testimonial.json";
const CACHE_KEY = `remote:${DATA_URL}`;
const DATA_KEY = "testimonial" as const;


export default function TestimonialPage({ isAuthenticated, setIsSignInOpen }: TestimonialPageProps) {
  const initialItems = readJsonCache<Record<string, ComponentItem[]>>(CACHE_KEY)?.[DATA_KEY] || [];
  const [items, setItems] = useState<ComponentItem[]>(initialItems);
  const [loading, setLoading] = useState(initialItems.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"light" | "dark">("light");
  const [availabilityFilter, setAvailabilityFilter] = useState<"paid" | "free">("free");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute("data-framer-theme")
      || document.body.getAttribute("data-framer-theme")
      || document.querySelector("[data-framer-theme]")?.getAttribute("data-framer-theme");
    if (currentTheme === "light" || currentTheme === "dark") {
      setFilter(currentTheme);
    }

    const handleGlobalThemeChange = (event: Event) => {
      const detail = (event as CustomEvent<{ theme?: "light" | "dark" } | "light" | "dark">).detail;
      const nextTheme = typeof detail === "string" ? detail : detail?.theme;
      if (nextTheme === "light" || nextTheme === "dark") {
        setFilter(nextTheme);
      }
    };

    window.addEventListener("framerkit-component-theme-change", handleGlobalThemeChange as EventListener);
    return () => {
      window.removeEventListener("framerkit-component-theme-change", handleGlobalThemeChange as EventListener);
    };
  }, []);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [hoveredPreviewKey, setHoveredPreviewKey] = useState<string | null>(null);
  // Инициализируем wireframeMode прямо из localStorage
  const [isWireframeMode, setIsWireframeMode] = useState(() => {
    try {
      const saved = localStorage.getItem("wireframeMode");
      return saved !== null ? saved === "true" : true;
    } catch {
      return true;
    }
  });

  const galleryRef = useRef<HTMLDivElement>(null);

  // Сохраняем wireframeMode при изменении
  useEffect(() => {
    try {
      localStorage.setItem("wireframeMode", isWireframeMode.toString());
    } catch (e) {
      console.warn("Failed to save wireframeMode to localStorage", e);
    }
  }, [isWireframeMode]);

  // ================================
  // Загрузка данных
  // ================================
  useEffect(() => {
    const load = async () => {
      try {
        const json = await fetchJsonWithCache<Record<string, ComponentItem[]>>(
          CACHE_KEY,
          DATA_URL
        );
        const loadedItems = json.testimonial || [];
        setItems(loadedItems);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load testimonial components");
        setLoading(false);
      }
    };
    load();
  }, []);

  // ================================
  // Сброс скролла при смене фильтра или wireframe
  // ================================
  useEffect(() => {
    if (galleryRef.current) {
      galleryRef.current.scrollTo({ top: 0 });
    }
  }, [filter, isWireframeMode]);

  // ================================
  // Скролл к секции
  // ================================
  useEffect(() => {
    const section = document.getElementById("testimonial-page");
    if (section) {
      section.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, []);

  // ================================
  // Фильтрация (useMemo)
  // ================================
  const filtered = useMemo(() => {
    const base = items.filter((item) => {
      const themeMatch =
        filter === "dark" ? item.key.includes("dark") : !item.key.includes("dark");

      if (!themeMatch) return false;
      return item.type === availabilityFilter;
    });

    return sortDirection === "asc" ? base : [...base].reverse();
  }, [items, filter, availabilityFilter, sortDirection]);

  // ================================
  // Copy
  // ================================
  const handleCopy = async (item: ComponentItem, url: string) => {
    if (!isAuthenticated && item.type === "paid") {
      setIsSignInOpen(true);
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopiedKey(item.key);
    setTimeout(() => setCopiedKey(null), 4000);
  };

  // ================================
  // Render
  // ================================
  return (
    <div id="testimonial-page" style={{ padding: 0, scrollMarginTop: "64px" }}>
      
      {/* 🔥 SEO META TAGS */}
      <SEO
        title="Testimonial Section Components for Framer"
        description="Professional testimonial section components for Framer. Light & dark themes, wireframe & design modes. Copy-paste ready customer review layouts to build trust and social proof."
        keywords="framer testimonial section, customer reviews component, social proof layout, client testimonials, framer ui kit, copy paste testimonials, responsive review section"
        image="/og-testimonial.jpg"
        canonical="https://www.framerkit.site/layout/testimonial"
      />

      {/* 🔥 H1 для поисковиков (визуально скрыт, но индексируется) */}
      <h1 className="sr-only">Testimonial Section Components for Framer — Social Proof & Reviews</h1>

      {/* 🔥 Breadcrumb + Header */}
      <div className="component-page-header">
        <nav className="component-breadcrumb">
          <Link to="/layout" className="breadcrumb-link">Layout Sections</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Testimonial</span>
        </nav>
        <h2 className="component-page-title">Testimonial Components</h2>
        <p className="component-page-description">
          Use testimonial sections to reduce risk and increase confidence. Choose specific quotes with context (role, company, result), not generic praise.
        </p>
      </div>

      <SectionHeader
        title="Testimonial"
                filter={filter}
        onFilterChange={setFilter}
        loading={loading}
        isWireframeMode={isWireframeMode}
        onWireframeModeChange={setIsWireframeMode}
        availabilityFilter={availabilityFilter}
        onAvailabilityFilterChange={setAvailabilityFilter}
        sortDirection={sortDirection}
        onSortDirectionChange={setSortDirection}
        hideWireframeToggle={false}
        renderMetaBelow={true}
      />

      <div className="gallery-scroll-area" ref={galleryRef}>
        {loading ? (
          <div style={{ minHeight: '200px' }}></div>
        ) : error ? (
          <p style={{ color: "red", padding: "20px" }}>{error}</p>
        ) : filtered.length === 0 ? (
          <div className="empty-message">No testimonial components available for the selected theme</div>
        ) : (
          <div className="gallery">
            {filtered.map(item => {
              const canCopy = isAuthenticated || item.type === "free";
              const isCopied = copiedKey === item.key;

              const displayImage = isWireframeMode && item.wireframe?.image
                ? item.wireframe.image
                : item.image || PLACEHOLDER;

              const displayUrl = isWireframeMode && item.wireframe?.url
                ? item.wireframe.url
                : item.url;

              const displayPreviewUrl = isWireframeMode
                ? item.wireframe?.previewUrl
                : item.previewUrl;

              return (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`card ${filter === "dark" ? "card-dark" : "card-light"}`}
                >
                  <div className="cardImage">
                    {item.type === "free" && <span className="card-free-badge">Free</span>}
                    {/* 🔥 Alt-текст с ключевыми словами */}
                    <img 
                      src={displayImage} 
                      alt={`${item.title} - ${isWireframeMode ? 'Wireframe' : 'Design'} testimonial section component for Framer`} 
                      loading="lazy" 
                    />
                  </div>
                  <div className="cardInfo">
                    <h3>{item.title}</h3>
                    <div className="card-actions">
                      {/* Preview */}
                      {displayPreviewUrl ? (
                        <div
                          className="iconButton"
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();

                            try {
                              const path = displayPreviewUrl.trim();
                              let cleanPath = "";

                              if (path.startsWith("/")) {
                                cleanPath = path.replace("/preview/", "").replace(/\/$/, "");
                              } else if (path.startsWith("http")) {
                                const url = new URL(path);
                                cleanPath = url.pathname.replace("/preview/", "").replace(/\/$/, "");
                              }

                              const viewerUrl = `/p/${cleanPath}`;
                              window.open(viewerUrl, "_blank", "noopener,noreferrer");
                            } catch {
                              window.open(displayPreviewUrl, "_blank", "noopener,noreferrer");
                            }
                          }}
                          onMouseEnter={() => setHoveredPreviewKey(item.key)}
                          onMouseLeave={() => setHoveredPreviewKey(null)}
                        >
                          <Eye size={16} color="currentColor" />
                          {hoveredPreviewKey === item.key && (
                            <div className="tooltip">Preview</div>
                          )}
                        </div>
                      ) : (
                        <div
                          className="iconButton disabled"
                          style={{ cursor: "not-allowed", opacity: 0.4 }}
                        >
                          <Eye size={16} color="currentColor" />
                          {hoveredPreviewKey === item.key && (
                            <div className="tooltip">Coming soon</div>
                          )}
                        </div>
                      )}

                      {/* Copy */}
                      <div
                        className={`iconButton ${isCopied ? "copied" : ""} ${
                          !canCopy ? "locked" : ""
                        }`}
                        onClick={() => handleCopy(item, displayUrl)}
                        onMouseEnter={() => !isCopied && setHoveredKey(item.key)}
                        onMouseLeave={() => setHoveredKey(null)}
                      >
                        {isCopied ? (
                          <CircleCheck size={20} color="#22c55e" strokeWidth={2.5} />
                        ) : canCopy ? (
                          <Copy size={16} color="currentColor" />
                        ) : (
                          <Lock size={16} color="currentColor" />
                        )}

                        {(isCopied || hoveredKey === item.key) && (
                          <div className="tooltip">
                            {isCopied ? "Copied" : canCopy ? "Copy" : "Sign in to copy"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
