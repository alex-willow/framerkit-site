import { useState, useEffect, useRef, useMemo } from "react";
import { Copy, CircleCheck, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SectionHeader from "../../components/SectionHeader";
import SEO from "../../components/SEO";
import { fetchJsonWithCache } from "../../lib/remoteCache";

type ComponentItem = {
  key: string;
  title: string;
  image: string;
  url: string;
  type: "free" | "paid";
};

type PricingCardPageProps = {
  isAuthenticated: boolean;
  setIsSignInOpen: (open: boolean) => void;
};

// ✅ Исправлен PLACEHOLDER (убраны пробелы)
const PLACEHOLDER = "https://via.placeholder.com/280x160?text=No+Image";

export default function PricingCardPage({ isAuthenticated, setIsSignInOpen }: PricingCardPageProps) {
  const [items, setItems] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);
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
          "remote:https://raw.githubusercontent.com/alex-willow/framerkit-data/components/pricingcard.json",
          "https://raw.githubusercontent.com/alex-willow/framerkit-data/components/pricingcard.json"
        );

        // ⚠️ Используем ключ точно как в JSON
        const loadedItems = json.PricingCard || json.Pricingcard || [];
        setItems(loadedItems);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load Pricing Card components");
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
    const section = document.getElementById("pricing-card-page");
    if (section) {
      section.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, []);

  // ================================
  // Фильтрация (useMemo)
  // ================================
  const filtered = useMemo(() => {
    return items.filter(item =>
      filter === "dark"
        ? item.key.toLowerCase().includes("dark")
        : !item.key.toLowerCase().includes("dark")
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
    <div id="pricing-card-page" style={{ padding: 0, scrollMarginTop: "64px" }}>
      
      {/* 🔥 SEO META TAGS */}
      <SEO
        title="Pricing Card Components for Framer"
        description="Beautiful pricing card components for Framer. Light & dark themes. Copy-paste ready pricing tables, subscription cards, and tier layouts for SaaS and e-commerce."
        keywords="framer pricing card, subscription card, pricing table, tier card, framer ui kit, copy paste pricing card, responsive pricing"
        image="/og-pricing-card.jpg"
        canonical="https://www.framerkit.site/components/pricingcard"
      />

      {/* 🔥 H1 для поисковиков (визуально скрыт, но индексируется) */}
      <h1 className="sr-only">Pricing Card Components for Framer — Subscription & Tier Cards</h1>

      {/* Header intro */}

      <div className="component-page-header">
        <nav className="component-breadcrumb">
          <Link to="/components" className="breadcrumb-link">UI Components</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Pricing Card</span>
        </nav>
        <h2 className="component-page-title">Pricing Card Components</h2>
        <p className="component-page-description">
          Pricing cards help users compare plans in seconds. Highlight the recommended option, key limits,
          and a clear CTA so decision-making feels easy.
        </p>
      </div>

      <SectionHeader
        title="Pricing Card"
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
          <div className="empty-message">No pricing card components available for the selected theme</div>
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
                      alt={`${item.title} - Pricing Card component for Framer`} 
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
