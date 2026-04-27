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

type NavbarPageProps = {
  isAuthenticated: boolean;
  setIsSignInOpen: (open: boolean) => void;
};

// ✅ Исправлен PLACEHOLDER (убраны пробелы)
const PLACEHOLDER = "https://via.placeholder.com/280x160?text=No+Image";
const DATA_URL = "https://raw.githubusercontent.com/alex-willow/framerkit-data/main/navbar.json";
const CACHE_KEY = `remote:${DATA_URL}`;
const DATA_KEY = "navbar" as const;


export default function NavbarPage({
  isAuthenticated,
  setIsSignInOpen,
}: NavbarPageProps) {
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

  // Listen for theme changes from other components
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
  // DATA LOAD
  // ================================
  useEffect(() => {
    const load = async () => {
      try {
        const json = await fetchJsonWithCache<Record<string, ComponentItem[]>>(
          CACHE_KEY,
          DATA_URL
        );
        setItems(json.navbar || []);
        setLoading(false); // 🔥 Отключаем загрузку
      } catch (err) {
        console.error(err);
        setError("Failed to load navbar components");
        setLoading(false); // 🔥 Отключаем загрузку даже при ошибке
      }
    };

    load();
  }, []);

  // ================================
  // SCROLL
  // ================================
  useEffect(() => {
    galleryRef.current?.scrollTo({ top: 0 });
  }, [filter, isWireframeMode]);

  useEffect(() => {
    document.getElementById("navbar-page")?.scrollIntoView({
      behavior: "auto",
      block: "start",
    });
  }, []);

  // ================================
  // FILTER
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
  // PREVIEW
  // ================================
  const openPreview = (url: string) => {
    try {
      const path = url.trim();
      let cleanPath = "";

      if (path.startsWith("/")) {
        cleanPath = path.replace("/preview/", "").replace(/\/$/, "");
      } else if (path.startsWith("http")) {
        const u = new URL(path);
        cleanPath = u.pathname.replace("/preview/", "").replace(/\/$/, "");
      }

      window.open(`/p/${cleanPath}`, "_blank", "noopener,noreferrer");
    } catch {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // ================================
  // COPY
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

  // 🔥 Массив для скелетонов


  // ================================
  // RENDER
  // ================================
  return (
    <div id="navbar-page" className="layout-component-page" style={{ padding: 0, scrollMarginTop: "64px" }}>
      
      {/* 🔥 SEO META TAGS */}
      <SEO
        title="Navbar Components for Framer"
        description="Responsive navigation bar components for Framer. Light & dark themes, wireframe & design modes. Copy-paste ready navbars for faster web design."
        keywords="framer navbar, navigation component, responsive menu, dark mode navbar, wireframe navbar, framer ui kit, copy paste navbar"
        image="/og-navbar.jpg"
        canonical="https://www.framerkit.site/layout/navbar"
      />

      {/* 🔥 H1 для поисковиков (визуально скрыт, но индексируется) */}
      <h1 className="sr-only">Navbar Components for Framer — Responsive Navigation Bars</h1>

      {/* 🔥 Breadcrumb + Header */}
      <div className="component-page-header">
        <nav className="component-breadcrumb">
          <Link to="/layout" className="breadcrumb-link">Layout Sections</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Navbar</span>
        </nav>
        <h2 className="component-page-title">Navbar Components</h2>
        <p className="component-page-description">
          Use a navbar to orient users quickly and keep key actions visible. Pick a simple variant for content-heavy pages and a stronger CTA variant for landing pages.
        </p>
      </div>

      <SectionHeader
        title="Navbar"
                filter={filter}
        onFilterChange={setFilter}
        loading={loading}
        isWireframeMode={isWireframeMode}
        onWireframeModeChange={setIsWireframeMode}
        availabilityFilter={availabilityFilter}
        onAvailabilityFilterChange={setAvailabilityFilter}
        sortDirection={sortDirection}
        onSortDirectionChange={setSortDirection}
        renderMetaBelow={true}
      />

      <div className="gallery-scroll-area" ref={galleryRef}>
        {/* 🔥 Проверка: загрузка / ошибка / контент */}
        {loading ? (
          <div style={{ minHeight: '200px' }}></div>
        ) : error ? (
          <p style={{ color: "red", padding: "20px" }}>{error}</p>
        ) : filtered.length === 0 ? (
          <div className="empty-message">
            No navbar components available for the selected theme
          </div>
        ) : (
          <div className="gallery">
            {filtered.map(item => {
              const canCopy = isAuthenticated || item.type === "free";
              const isCopied = copiedKey === item.key;

              const displayImage =
                isWireframeMode && item.wireframe?.image
                  ? item.wireframe.image
                  : item.image || PLACEHOLDER;

              const displayUrl =
                isWireframeMode && item.wireframe?.url
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
                    <img 
                      src={displayImage} 
                      alt={`${item.title} - ${isWireframeMode ? 'Wireframe' : 'Design'} navbar component for Framer`} 
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
