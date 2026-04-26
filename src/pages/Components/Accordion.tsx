import { useState, useEffect, useRef, useMemo } from "react";
import { Copy, CircleCheck, Lock } from "lucide-react";
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
};

type AccordionPageProps = {
  isAuthenticated: boolean;
  setIsSignInOpen: (open: boolean) => void;
};

// ✅ Исправлен PLACEHOLDER (убраны пробелы)
const PLACEHOLDER = "https://via.placeholder.com/280x160?text=No+Image";
const DATA_URL = "https://raw.githubusercontent.com/alex-willow/framerkit-data/components/accordion.json";
const CACHE_KEY = `remote:${DATA_URL}`;
const DATA_KEY = "accordion" as const;


export default function AccordionPage({ isAuthenticated, setIsSignInOpen }: AccordionPageProps) {
  const initialItems = readJsonCache<Record<string, ComponentItem[]>>(CACHE_KEY)?.[DATA_KEY] || [];
  const [items, setItems] = useState<ComponentItem[]>(initialItems);
  const [loading, setLoading] = useState(initialItems.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"light" | "dark">("light");

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

  const galleryRef = useRef<HTMLDivElement>(null);

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
        const loadedItems = json.accordion || [];
        setItems(loadedItems);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load Accordion components");
        setLoading(false);
      }
    };
    load();
  }, []);

  // ================================
  // Сброс скролла при смене фильтра
  // ================================
  useEffect(() => {
    if (galleryRef.current) {
      galleryRef.current.scrollTo({ top: 0 });
    }
  }, [filter]);

  // ================================
  // Скролл к секции
  // ================================
  useEffect(() => {
    const section = document.getElementById("accordion-page");
    if (section) {
      section.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, []);

  // ================================
  // Фильтрация (useMemo)
  // ================================
  const filtered = useMemo(() => {
    return items.filter(item =>
      filter === "dark" ? item.key.includes("dark") : !item.key.includes("dark")
    );
  }, [items, filter]);

  // ================================
  // Copy
  // ================================
  const handleCopy = async (item: ComponentItem) => {
    if (!isAuthenticated && item.type === "paid") {
      setIsSignInOpen(true);
      return;
    }

    await navigator.clipboard.writeText(item.url);
    setCopiedKey(item.key);
    setTimeout(() => setCopiedKey(null), 4000);
  };



  // ================================
  // Render
  // ================================
  return (
    <div id="accordion-page" style={{ padding: 0, scrollMarginTop: "64px" }}>
      
      {/* 🔥 SEO META TAGS */}
      <SEO
        title="Accordion Components for Framer"
        description="Collapsible accordion components for Framer. Light & dark themes. Copy-paste ready FAQ accordions, collapsible sections, and expandable content blocks."
        keywords="framer accordion component, collapsible section, FAQ accordion, expandable content, framer ui kit, copy paste accordion, responsive accordion"
        image="/og-accordion.jpg"
        canonical="https://www.framerkit.site/components/accordion"
      />

      {/* 🔥 H1 для поисковиков (визуально скрыт, но индексируется) */}
      <h1 className="sr-only">Accordion Components for Framer — Collapsible FAQ Sections</h1>

      {/* Header intro */}

      <div className="component-page-header">
        <nav className="component-breadcrumb">
          <Link to="/components" className="breadcrumb-link">UI Components</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Accordion</span>
        </nav>
        <h2 className="component-page-title">Accordion Components</h2>
        <p className="component-page-description">
          Use accordions to hide secondary details without making pages too long. Great for FAQs, policies,
          and step-by-step help where users need quick answers on demand.
        </p>
      </div>

      <SectionHeader
        title="Accordion"
        count={filtered.length}
        filter={filter}
        onFilterChange={setFilter}
        loading={loading}
        hideTitle
        renderMetaBelow={true}
      />

      <div className="gallery-scroll-area" ref={galleryRef}>
        {loading ? (
          <div style={{ minHeight: '200px' }}></div>
        ) : error ? (
          <p style={{ color: "red", padding: "20px" }}>{error}</p>
        ) : filtered.length === 0 ? (
          <div className="empty-message">No accordion components available for the selected theme</div>
        ) : (
          <div className="gallery">
            {filtered.map(item => {
              const canCopy = isAuthenticated || item.type === "free";
              const isCopied = copiedKey === item.key;

              return (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`card ${filter === "dark" ? "card-dark" : "card-light"}`}
                >
                  <div className="cardImage">
                    {/* 🔥 Alt-текст с ключевыми словами */}
                    <img 
                      src={item.image || PLACEHOLDER} 
                      alt={`${item.title} - Accordion component for Framer`} 
                      loading="lazy" 
                    />
                  </div>
                  <div className="cardInfo">
                    <h3>{item.title}</h3>
                    <div
                      className={`iconButton ${isCopied ? "copied" : ""} ${
                        !canCopy ? "locked" : ""
                      }`}
                      onClick={() => handleCopy(item)}
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
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🔥 SEO-контент для поисковиков (текст внизу страницы) */}
      <article 
        className="seo-content" 
        style={{ 
          padding: '40px 20px', 
          color: 'var(--framer-color-text-secondary)',
          maxWidth: '800px',
          margin: '0 auto'
        }}
      >
              </article>
    </div>
  );
}
