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

type ContactPageProps = {
  isAuthenticated: boolean;
  setIsSignInOpen: (open: boolean) => void;
};

// ✅ Исправлен PLACEHOLDER (убраны пробелы)
const PLACEHOLDER = "https://via.placeholder.com/280x160?text=No+Image";
const FIXED_SKELETON_COUNT = 8;

export default function ContactPage({ isAuthenticated, setIsSignInOpen }: ContactPageProps) {
  const [items, setItems] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"light" | "dark">("light");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [hoveredPreviewKey, setHoveredPreviewKey] = useState<string | null>(null);
  const [isWireframeMode, setIsWireframeMode] = useState(true);

  const galleryRef = useRef<HTMLDivElement>(null);

  // ================================
  // Загрузка данных
  // ================================
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/alex-willow/framerkit-data/main/contact.json",
          { cache: "force-cache" }
        );
        if (!res.ok) throw new Error("Failed to load contact");
        const json = await res.json();
        const loadedItems = json.contact || [];
        setItems(loadedItems);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load contact components");
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
    const section = document.getElementById("contact-page");
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

  const skeletonCards = Array.from({ length: FIXED_SKELETON_COUNT });

  // ================================
  // Render
  // ================================
  return (
    <div id="contact-page" style={{ padding: 0, scrollMarginTop: "64px" }}>
      
      {/* 🔥 SEO META TAGS */}
      <SEO
        title="Contact Section Components for Framer"
        description="Professional contact section components for Framer. Light & dark themes, wireframe & design modes. Copy-paste ready contact forms and layouts for business websites."
        keywords="framer contact section, contact form component, get in touch section, business contact layout, framer ui kit, copy paste contact, responsive contact form"
        image="/og-contact.jpg"
        canonical="https://www.framerkit.site/layout/contact"
      />

      {/* 🔥 H1 для поисковиков (визуально скрыт, но индексируется) */}
      <h1 className="sr-only">Contact Section Components for Framer — Business Contact Forms</h1>

      <SectionHeader
        title="Contact"
        count={filtered.length}
        filter={filter}
        onFilterChange={setFilter}
        loading={loading}
        isWireframeMode={isWireframeMode}
        onWireframeModeChange={setIsWireframeMode}
        hideWireframeToggle={false}
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
          <div className="empty-message">No contact components available for the selected theme</div>
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
                      alt={`${item.title} - ${isWireframeMode ? 'Wireframe' : 'Design'} contact section component for Framer`} 
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
                          title="Live Preview"
                        >
                          <Eye size={16} color={filter === "dark" ? "#ccc" : "currentColor"} />
                          {hoveredPreviewKey === item.key && (
                            <div className="tooltip">Preview</div>
                          )}
                        </div>
                      ) : (
                        <div
                          className="iconButton disabled"
                          title="Coming soon"
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
          Contact Section Components for Framer
        </h2>
        <p style={{ marginBottom: '12px', lineHeight: 1.6 }}>
          Make it easy for visitors to reach you with these professional contact section components for Framer. 
          Each layout includes contact forms, maps, social links, and business information — all designed 
          to encourage conversions and build trust with your audience.
        </p>
        <p style={{ marginBottom: '12px', lineHeight: 1.6 }}>
          Perfect for business websites, agency portfolios, SaaS landing pages, and e-commerce stores. 
          All components support light and dark themes, with wireframe mode for rapid prototyping 
          and design mode for pixel-perfect previews before implementation.
        </p>
        <p style={{ lineHeight: 1.6 }}>
          <strong>Features:</strong> Responsive layout · Dark/Light themes · Wireframe mode · 
          Instant copy-paste · Framer-compatible · Form-ready · Mobile-optimized · Map integration ready.
        </p>
      </article>
    </div>
  );
}