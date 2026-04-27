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

type FAQPageProps = {
  isAuthenticated: boolean;
  setIsSignInOpen: (open: boolean) => void;
};

// ✅ Исправлен PLACEHOLDER (убраны пробелы)
const PLACEHOLDER = "https://via.placeholder.com/280x160?text=No+Image";
const DATA_URL = "https://raw.githubusercontent.com/alex-willow/framerkit-data/main/faq.json";
const CACHE_KEY = `remote:${DATA_URL}`;
const DATA_KEY = "faq" as const;


export default function FAQPage({ isAuthenticated, setIsSignInOpen }: FAQPageProps) {
  const initialItems = readJsonCache<Record<string, ComponentItem[]>>(CACHE_KEY)?.[DATA_KEY] || [];
  const [items, setItems] = useState<ComponentItem[]>(initialItems);
  const [loading, setLoading] = useState(initialItems.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"light" | "dark">("light");
  const [availabilityFilter, setAvailabilityFilter] = useState<"paid" | "free">("free");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Load theme from localStorage on mount (same as landing page)
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setFilter(savedTheme);
    }
  }, []);

  // Listen for theme changes from SectionHeader and other components
  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ theme: "light" | "dark" }>;
      const nextTheme = customEvent.detail?.theme;
      if (nextTheme === "light" || nextTheme === "dark") {
        setFilter(nextTheme);
      }
    };

    window.addEventListener("framerkit-component-theme-change", handleThemeChange as EventListener);
    return () => {
      window.removeEventListener("framerkit-component-theme-change", handleThemeChange as EventListener);
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
        const loadedItems = json.faq || [];
        setItems(loadedItems);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load FAQ components");
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
    const section = document.getElementById("faq-page");
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
    <div id="faq-page" style={{ padding: 0, scrollMarginTop: "64px" }}>
      
      {/* 🔥 SEO META TAGS */}
      <SEO
        title="FAQ Section Components for Framer"
        description="Professional FAQ accordion components for Framer. Light & dark themes, wireframe & design modes. Copy-paste ready FAQ sections to reduce support tickets and improve UX."
        keywords="framer faq section, accordion component, frequently asked questions, help center layout, framer ui kit, copy paste faq, responsive accordion"
        image="/og-faq.jpg"
        canonical="https://www.framerkit.site/layout/faq"
      />

      {/* 🔥 H1 для поисковиков (визуально скрыт, но индексируется) */}
      <h1 className="sr-only">FAQ Section Components for Framer — Accordion Questions & Answers</h1>

      {/* 🔥 Breadcrumb + Header */}
      <div className="component-page-header">
        <nav className="component-breadcrumb">
          <Link to="/layout" className="breadcrumb-link">Layout Sections</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">FAQ</span>
        </nav>
        <h2 className="component-page-title">FAQ Components</h2>
        <p className="component-page-description">
          Use FAQ sections to handle objections before users leave. Answer the real practical questions: setup time, limits, support, updates, and fit for their use case.
        </p>
      </div>

      <SectionHeader
        title="FAQ"
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
          <div className="empty-message">No FAQ components available for the selected theme</div>
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
                      alt={`${item.title} - ${isWireframeMode ? 'Wireframe' : 'Design'} FAQ accordion component for Framer`} 
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
