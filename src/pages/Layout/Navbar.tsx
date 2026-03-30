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

type NavbarPageProps = {
  isAuthenticated: boolean;
  setIsSignInOpen: (open: boolean) => void;
};

// ✅ Исправлен PLACEHOLDER (убраны пробелы)
const PLACEHOLDER = "https://via.placeholder.com/280x160?text=No+Image";

export default function NavbarPage({
  isAuthenticated,
  setIsSignInOpen,
}: NavbarPageProps) {
  const [items, setItems] = useState<ComponentItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"light" | "dark">("light");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [hoveredPreviewKey, setHoveredPreviewKey] = useState<string | null>(null);
  const [isWireframeMode, setIsWireframeMode] = useState(true);

  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const galleryRef = useRef<HTMLDivElement>(null);

  // ================================
  // DATA LOAD
  // ================================
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/alex-willow/framerkit-data/main/navbar.json",
          { cache: "force-cache" }
        );
        if (!res.ok) throw new Error("Failed to load navbar");

        const json = await res.json();
        setItems(json.navbar || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load navbar components");
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
    return items.filter(item =>
      filter === "dark"
        ? item.key.includes("dark")
        : !item.key.includes("dark")
    );
  }, [items, filter]);

  // ================================
  // IMAGE LOAD
  // ================================
  const handleImageLoad = (key: string) => {
    setLoadedImages(prev => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  };

  // ================================
  // PREVIEW
  // ================================
  const openPreview = (url: string) => {
    try {
      let path = url.trim();
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

  // ================================
  // RENDER
  // ================================
  return (
    <div id="navbar-page" style={{ padding: 0, scrollMarginTop: "64px" }}>
      
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

      <SectionHeader
        title="Navbar"
        count={filtered.length}
        filter={filter}
        onFilterChange={setFilter}
        loading={false}
        isWireframeMode={isWireframeMode}
        onWireframeModeChange={setIsWireframeMode}
      />

      <div className="gallery-scroll-area" ref={galleryRef}>
        {error ? (
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

              const isLoaded = loadedImages.has(item.key);

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
          Responsive Navbar Components for Framer
        </h2>
        <p style={{ marginBottom: '12px', lineHeight: 1.6 }}>
          Copy and paste these responsive navigation bar components directly into your Framer project. 
          Each navbar is available in light and dark themes, with wireframe and design modes for rapid prototyping.
        </p>
        <p style={{ marginBottom: '12px', lineHeight: 1.6 }}>
          Perfect for landing pages, SaaS websites, portfolios, and e-commerce stores. 
          All components are fully customizable and optimized for mobile, tablet, and desktop.
        </p>
        <p style={{ lineHeight: 1.6 }}>
          <strong>Features:</strong> Responsive layout · Dark/Light themes · Wireframe mode · 
          Instant copy-paste · Framer-compatible · No coding required.
        </p>
      </article>
    </div>
  );
}