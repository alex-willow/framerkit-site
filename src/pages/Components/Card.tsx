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

type CardPageProps = {
  isAuthenticated: boolean;
  setIsSignInOpen: (open: boolean) => void;
};

// ✅ Исправлен PLACEHOLDER (убраны пробелы)
const PLACEHOLDER = "https://via.placeholder.com/280x160?text=No+Image";
const FIXED_SKELETON_COUNT = 8;

export default function CardPage({ isAuthenticated, setIsSignInOpen }: CardPageProps) {
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
          "https://raw.githubusercontent.com/alex-willow/framerkit-data/components/card.json",
          { cache: "force-cache" }
        );
        if (!res.ok) throw new Error("Failed to load card data");
        const json = await res.json();
        const loadedItems = json.card || [];
        setItems(loadedItems);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load Card components");
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
    const section = document.getElementById("card-page");
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
    <div id="card-page" style={{ padding: 0, scrollMarginTop: "64px" }}>
      
      {/* 🔥 SEO META TAGS */}
      <SEO
        title="Card Components for Framer"
        description="Versatile card components for Framer. Light & dark themes. Copy-paste ready content cards, product cards, and profile cards for modern web layouts."
        keywords="framer card component, content card, product card, profile card, framer ui kit, copy paste card, responsive card layout"
        image="/og-card.jpg"
        canonical="https://www.framerkit.site/components/card"
      />

      {/* 🔥 H1 для поисковиков (визуально скрыт, но индексируется) */}
      <h1 className="sr-only">Card Components for Framer — Content & Product Cards</h1>

      <SectionHeader
        title="Card"
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
          <div className="empty-message">No card components available for the selected theme</div>
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
                      alt={`${item.title} - Card component for Framer`} 
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
          Card Components for Framer
        </h2>
        <p style={{ marginBottom: '12px', lineHeight: 1.6 }}>
          Organize and present content beautifully with these versatile card components for Framer. 
          Each card is designed for flexibility, featuring clean layouts, optional media areas, and 
          interactive hover states that help you showcase products, articles, profiles, or any content 
          in an engaging, scannable format.
        </p>
        <p style={{ marginBottom: '12px', lineHeight: 1.6 }}>
          Perfect for e-commerce product grids, blog post listings, team member profiles, and dashboard widgets. 
          All components support light and dark themes, with instant copy-paste functionality 
          for rapid implementation in your Framer projects.
        </p>
        <p style={{ lineHeight: 1.6 }}>
          <strong>Features:</strong> Responsive layout · Dark/Light themes · Media support · 
          Instant copy-paste · Framer-compatible · Hover effects · Flexible content areas · Mobile-optimized.
        </p>
      </article>
    </div>
  );
}