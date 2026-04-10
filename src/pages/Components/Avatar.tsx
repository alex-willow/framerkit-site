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

type AvatarPageProps = {
  isAuthenticated: boolean;
  setIsSignInOpen: (open: boolean) => void;
};

// ✅ Исправлен PLACEHOLDER (убраны пробелы)
const PLACEHOLDER = "https://via.placeholder.com/280x160?text=No+Image";

export default function AvatarPage({ isAuthenticated, setIsSignInOpen }: AvatarPageProps) {
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
      const nextTheme = (event as CustomEvent<"light" | "dark">).detail;
      if (nextTheme === "light" || nextTheme === "dark") {
        setFilter(nextTheme);
      }
    };

    window.addEventListener("framerkit-theme-change", handleGlobalThemeChange as EventListener);
    return () => {
      window.removeEventListener("framerkit-theme-change", handleGlobalThemeChange as EventListener);
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
        const res = await fetch(
          "https://raw.githubusercontent.com/alex-willow/framerkit-data/components/avatar.json",
          { cache: "force-cache" }
        );
        if (!res.ok) throw new Error("Failed to load avatar data");
        const json = await res.json();
        const loadedItems = json.avatar || [];
        setItems(loadedItems);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load Avatar components");
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
    const section = document.getElementById("avatar-page");
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
    <div id="avatar-page" style={{ padding: 0, scrollMarginTop: "64px" }}>
      
      {/* 🔥 SEO META TAGS */}
      <SEO
        title="Avatar Components for Framer"
        description="User avatar components for Framer. Light & dark themes. Copy-paste ready profile pictures, user icons, and avatar groups for team sections."
        keywords="framer avatar component, user profile picture, avatar icon, team member avatar, framer ui kit, copy paste avatar, responsive avatar"
        image="/og-avatar.jpg"
        canonical="https://www.framerkit.site/components/avatar"
      />

      {/* 🔥 H1 для поисковиков (визуально скрыт, но индексируется) */}
      <h1 className="sr-only">Avatar Components for Framer — User Profile Pictures</h1>

      <SectionHeader
        title="Avatar"
        count={filtered.length}
        filter={filter}
        onFilterChange={setFilter}
        loading={loading}
      />

      <div className="gallery-scroll-area" ref={galleryRef}>
        {loading ? (
          <div style={{ minHeight: '200px' }}></div>
        ) : error ? (
          <p style={{ color: "red", padding: "20px" }}>{error}</p>
        ) : filtered.length === 0 ? (
          <div className="empty-message">No avatar components available for the selected theme</div>
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
                      alt={`${item.title} - Avatar component for Framer`} 
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