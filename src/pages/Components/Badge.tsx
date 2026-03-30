import { useState, useEffect, useRef, useMemo } from "react";
import { Copy, CircleCheck, Lock } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeader from "../../components/SectionHeader";
import SEO from "../../components/SEO";

type ComponentItem = {
  key: string;
  title: string;
  image: string;
  url: string;
  type: "free" | "paid";
};

type BadgePageProps = {
  isAuthenticated: boolean;
  setIsSignInOpen: (open: boolean) => void;
};

// ✅ Исправлен PLACEHOLDER (убраны пробелы)
const PLACEHOLDER = "https://via.placeholder.com/280x160?text=No+Image";
const FIXED_SKELETON_COUNT = 8;

export default function BadgePage({ isAuthenticated, setIsSignInOpen }: BadgePageProps) {
  const [items, setItems] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"light" | "dark">("light");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const galleryRef = useRef<HTMLDivElement>(null);

  // ================================
  // Загрузка данных
  // ================================
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/alex-willow/framerkit-data/components/badge.json",
          { cache: "force-cache" }
        );
        if (!res.ok) throw new Error("Failed to load badge data");
        const json = await res.json();
        const loadedItems = json.badge || [];
        setItems(loadedItems);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load Badge components");
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
    const section = document.getElementById("badge-page");
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

  const skeletonCards = Array.from({ length: FIXED_SKELETON_COUNT });

  // ================================
  // Render
  // ================================
  return (
    <div id="badge-page" style={{ padding: 0, scrollMarginTop: "64px" }}>
      
      {/* 🔥 SEO META TAGS */}
      <SEO
        title="Badge Components for Framer"
        description="Status badge and label components for Framer. Light & dark themes. Copy-paste ready notification badges, tags, and status indicators for UI elements."
        keywords="framer badge component, status badge, label tag, notification badge, framer ui kit, copy paste badge, responsive badge"
        image="/og-badge.jpg"
        canonical="https://www.framerkit.site/components/badge"
      />

      {/* 🔥 H1 для поисковиков (визуально скрыт, но индексируется) */}
      <h1 className="sr-only">Badge Components for Framer — Status Labels & Tags</h1>

      <SectionHeader
        title="Badge"
        count={filtered.length}
        filter={filter}
        onFilterChange={setFilter}
        loading={loading}
      />

      <div className="gallery-scroll-area" ref={galleryRef}>
        {loading ? (
          <div className="skeleton-gallery">
            {skeletonCards.map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-card-image" />
                <div className="skeleton-card-info" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p style={{ color: "red", padding: "20px" }}>{error}</p>
        ) : filtered.length === 0 ? (
          <div className="empty-message">No badge components available for the selected theme</div>
        ) : (
          <div className="gallery">
            {filtered.map(item => {
              const canCopy = isAuthenticated || item.type === "free";
              const isCopied = copiedKey === item.key;

              return (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`card ${filter === "dark" ? "card-dark" : "card-light"}`}
                >
                  <div className="cardImage">
                    {/* 🔥 Alt-текст с ключевыми словами */}
                    <img 
                      src={item.image || PLACEHOLDER} 
                      alt={`${item.title} - Badge component for Framer`} 
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
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: 'var(--framer-color-text)' }}>
          Badge Components for Framer
        </h2>
        <p style={{ marginBottom: '12px', lineHeight: 1.6 }}>
          Highlight important information with these professional badge components for Framer. 
          Each badge is designed for status indicators, notification counts, category tags, and 
          promotional labels, featuring clean pill shapes, vibrant colors, and flexible positioning 
          that enhances any interface without cluttering your design.
        </p>
        <p style={{ marginBottom: '12px', lineHeight: 1.6 }}>
          Perfect for dashboards, e-commerce product cards, user profiles, and admin panels. 
          All components support light and dark themes, with instant copy-paste functionality 
          for rapid implementation in your Framer projects.
        </p>
        <p style={{ lineHeight: 1.6 }}>
          <strong>Features:</strong> Responsive layout · Dark/Light themes · Multiple styles · 
          Instant copy-paste · Framer-compatible · Positioning variants · Color variants · Mobile-optimized sizing.
        </p>
      </article>
    </div>
  );
}