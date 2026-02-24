import { useState, useEffect, useRef } from "react";
import { Copy, CircleCheck, Lock } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeader from "../../components/SectionHeader";

type ComponentItem = {
  key: string;
  title: string;
  image: string;
  url: string;
  type: "free" | "paid";
  wireframe?: {
    image: string;
    url: string;
  };
};

type TestimonialPageProps = {
  isAuthenticated: boolean;
  setIsSignInOpen: (open: boolean) => void;
};

const PLACEHOLDER = "https://via.placeholder.com/280x160?text=No+Image";

export default function TestimonialPage({ isAuthenticated, setIsSignInOpen }: TestimonialPageProps) {
  const [items, setItems] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"light" | "dark">("light");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [isWireframeMode, setIsWireframeMode] = useState(true);

  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/alex-willow/framerkit-data/main/testimonial.json"
        );
        if (!res.ok) throw new Error("Failed to load testimonial components");
        const json = await res.json();
        const loadedItems = json.testimonial || [];
        setItems(loadedItems);

        const imagePromises = loadedItems.flatMap((item: ComponentItem) => {
          const images = [item.image || PLACEHOLDER];
          if (item.wireframe?.image) images.push(item.wireframe.image);
          
          return images.map(
            (src) =>
              new Promise<void>((resolve) => {
                const img = new Image();
                img.onload = img.onerror = () => resolve();
                img.src = src;
              })
          );
        });

        await Promise.all(imagePromises);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load testimonial components");
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (galleryRef.current) {
      galleryRef.current.scrollTo({ top: 0 });
    }
  }, [filter, isWireframeMode]);

  useEffect(() => {
    const section = document.getElementById("testimonial-page");
    if (section) {
      section.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, []);

  const filtered = items.filter(item =>
    filter === "dark" ? item.key.includes("dark") : !item.key.includes("dark")
  );

  const handleCopy = async (item: ComponentItem, url: string) => {
    if (!isAuthenticated && item.type === "paid") {
      setIsSignInOpen(true);
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopiedKey(item.key);
    setTimeout(() => setCopiedKey(null), 4000);
  };

  const skeletonCards = Array.from({ length: 6 });

  return (
    <div id="testimonial-page" style={{ padding: 0, scrollMarginTop: "64px" }}>
      <SectionHeader
        title="Testimonial"
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
          <div className="empty-message">
            No testimonial components available for the selected theme.
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
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

                return (
                  <div 
                    key={`${item.key}-${isWireframeMode ? 'wireframe' : 'design'}`} 
                    className={`card ${filter === "dark" ? "card-dark" : "card-light"}`}
                  >
                    <div className="cardImage">
                      <img 
                        src={displayImage} 
                        alt={item.title}
                        loading="lazy"
                      />
                    </div>
                    <div className="cardInfo">
                      <h3>{item.title}</h3>
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
                          <Copy size={16}
                          color={filter === "dark" ? "#ccc" : "currentColor"} 
                           />
                        ) : (
                          <Lock size={16}
                          color={filter === "dark" ? "#ccc" : "currentColor"} 
                           />
                        )}

                        {(isCopied || hoveredKey === item.key) && (
                          <div className="tooltip">
                            {isCopied
                              ? "Copied"
                              : canCopy
                              ? "Copy"
                              : "Sign in to copy"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}