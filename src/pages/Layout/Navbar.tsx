import { useState, useEffect, useRef, useMemo } from "react";
import { Copy, CircleCheck, Lock, Eye } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeader from "../../components/SectionHeader";

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
  // PREVIEW (FIXED ✅)
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
            No components available for the selected theme
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
                  animate={{
                    opacity: isLoaded ? 1 : 0,
                    y: isLoaded ? 0 : 10,
                  }}
                  transition={{ duration: 0.2 }}
                  className={`card ${
                    filter === "dark" ? "card-dark" : "card-light"
                  }`}
                >
                  {/* IMAGE */}
                  <div className="cardImage">
                    {!isLoaded && <div className="image-placeholder" />}

                    <img
                      src={displayImage}
                      alt={item.title}
                      loading="lazy"
                      onLoad={() => handleImageLoad(item.key)}
                      style={{
                        opacity: isLoaded ? 1 : 0,
                        position: "absolute",
                        inset: 0,
                      }}
                    />
                  </div>

                  {/* INFO */}
                  <div className="cardInfo">
                    <h3>{item.title}</h3>

                    <div className="card-actions">
                      {/* PREVIEW */}
                      {displayPreviewUrl ? (
                        <div
                          className="iconButton"
                          onClick={() => openPreview(displayPreviewUrl)}
                          onMouseEnter={() =>
                            setHoveredPreviewKey(item.key)
                          }
                          onMouseLeave={() =>
                            setHoveredPreviewKey(null)
                          }
                        >
                          <Eye size={16} />
                          {hoveredPreviewKey === item.key && (
                            <div className="tooltip">Preview</div>
                          )}
                        </div>
                      ) : (
                        <div className="iconButton disabled">
                          <Eye size={16} />
                        </div>
                      )}

                      {/* COPY */}
                      <div
                        className={`iconButton ${isCopied ? "copied" : ""}`}
                        onClick={() => handleCopy(item, displayUrl)}
                        onMouseEnter={() =>
                          !isCopied && setHoveredKey(item.key)
                        }
                        onMouseLeave={() => setHoveredKey(null)}
                      >
                        {isCopied ? (
                          <CircleCheck size={20} color="#22c55e" />
                        ) : canCopy ? (
                          <Copy size={16} />
                        ) : (
                          <Lock size={16} />
                        )}

                        {(isCopied || hoveredKey === item.key) && (
                          <div className="tooltip">
                            {isCopied
                              ? "Copied"
                              : canCopy
                              ? "Copy"
                              : "Sign in"}
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