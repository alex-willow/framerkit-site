import { useState, useEffect, useRef, useMemo } from "react";
import { Copy, CircleCheck, Lock, Eye } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeader from "../../components/SectionHeader";
import SEO from "../../components/SEO";

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

type CtaPageProps = {
  isAuthenticated: boolean;
  setIsSignInOpen: (open: boolean) => void;
};

// ✅ Исправлен PLACEHOLDER (убраны пробелы)
const PLACEHOLDER = "https://via.placeholder.com/280x160?text=No+Image";


export default function CtaPage({ isAuthenticated, setIsSignInOpen }: CtaPageProps) {
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
  const [hoveredPreviewKey, setHoveredPreviewKey] = useState<string | null>(null);
  const [isWireframeMode, setIsWireframeMode] = useState(true);

  const galleryRef = useRef<HTMLDivElement>(null);

  // Загружаем wireframeMode из localStorage при монтировании
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wireframeMode");
      if (saved !== null) {
        setIsWireframeMode(saved === "true");
      }
    } catch (e) {
      console.warn("Failed to load wireframeMode from localStorage", e);
    }
  }, []);

  // ================================
  // Загрузка данных
  // ================================
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/alex-willow/framerkit-data/main/cta.json",
          { cache: "force-cache" }
        );
        if (!res.ok) throw new Error("Failed to load cta");
        const json = await res.json();
        const loadedItems = json.cta || [];
        setItems(loadedItems);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load CTA components");
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
    const section = document.getElementById("cta-page");
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
    <div id="cta-page" style={{ padding: 0, scrollMarginTop: "64px" }}>
      
      {/* 🔥 SEO META TAGS */}
      <SEO
        title="CTA Section Components for Framer"
        description="High-converting call-to-action section components for Framer. Light & dark themes, wireframe & design modes. Copy-paste ready CTA banners to boost conversions."
        keywords="framer cta section, call to action component, conversion banner, signup section, framer ui kit, copy paste cta, responsive cta button"
        image="/og-cta.jpg"
        canonical="https://www.framerkit.site/layout/cta"
      />

      {/* 🔥 H1 для поисковиков (визуально скрыт, но индексируется) */}
      <h1 className="sr-only">CTA Section Components for Framer — Call-to-Action Banners</h1>

      <SectionHeader
        title="CTA"
        count={filtered.length}
        filter={filter}
        onFilterChange={setFilter}
        loading={loading}
        isWireframeMode={isWireframeMode}
        onWireframeModeChange={setIsWireframeMode}
        hideWireframeToggle={false}
        renderMetaBelow={true}
      />

      <div className="gallery-scroll-area" ref={galleryRef}>
        {loading ? (
          <div style={{ minHeight: '200px' }}></div>
        ) : error ? (
          <p style={{ color: "red", padding: "20px" }}>{error}</p>
        ) : filtered.length === 0 ? (
          <div className="empty-message">No CTA components available for the selected theme</div>
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`card ${filter === "dark" ? "card-dark" : "card-light"}`}
                >
                  <div className="cardImage">
                    {/* 🔥 Alt-текст с ключевыми словами */}
                    <img 
                      src={displayImage} 
                      alt={`${item.title} - ${isWireframeMode ? 'Wireframe' : 'Design'} CTA section component for Framer`} 
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
                              let path = displayPreviewUrl.trim();
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
                          <Eye size={16} color={filter === "dark" ? "#ccc" : "#5b6170"} />
                          {hoveredPreviewKey === item.key && (
                            <div className="tooltip">Preview</div>
                          )}
                        </div>
                      ) : (
                        <div
                          className="iconButton disabled"
                          style={{ cursor: "not-allowed", opacity: 0.4 }}
                        >
                          <Eye size={16} color={filter === "dark" ? "#666" : "#999"} />
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
                          <Copy size={16} color={filter === "dark" ? "#ccc" : "#5b6170"} />
                        ) : (
                          <Lock size={16} color={filter === "dark" ? "#ccc" : "#5b6170"} />
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