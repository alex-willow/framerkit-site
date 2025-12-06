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
};

type IconPageProps = {
  isAuthenticated: boolean;
  setIsSignInOpen: (open: boolean) => void;
};

const PLACEHOLDER = "https://via.placeholder.com/280x160?text=No+Image";

export default function IconPage({ isAuthenticated, setIsSignInOpen }: IconPageProps) {
  const [items, setItems] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"light" | "dark">("light");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/alex-willow/framerkit-data/components/icon.json"
        );
        if (!res.ok) throw new Error("Failed to load icon data");
        const json = await res.json();
        const loadedItems = json.icon || [];
        setItems(loadedItems);

        const imagePromises = loadedItems.map(
          (item: ComponentItem) =>
            new Promise<void>((resolve) => {
              const img = new Image();
              img.onload = img.onerror = () => resolve();
              img.src = item.image || PLACEHOLDER;
            })
        );

        await Promise.all(imagePromises);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load Icon components");
        setLoading(false);
      }
    };

    load();
  }, []);

  // Сброс прокрутки галереи при смене фильтра
  useEffect(() => {
    if (galleryRef.current) {
      galleryRef.current.scrollTo({ top: 0 });
    }
  }, [filter]);

  // Прокрутка страницы под header при входе
  useEffect(() => {
    const section = document.getElementById("icon-page");
    if (section) {
      section.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, []);

  const filtered = items.filter(item =>
    filter === "dark" ? item.key.includes("dark") : !item.key.includes("dark")
  );

  const handleCopy = async (item: ComponentItem) => {
    if (!isAuthenticated && item.type === "paid") {
      setIsSignInOpen(true);
      return;
    }

    await navigator.clipboard.writeText(item.url);
    setCopiedKey(item.key);
    setTimeout(() => setCopiedKey(null), 4000);
  };

  const skeletonCards = Array.from({ length: 6 });

  return (
    <div id="icon-page" style={{ padding: 0, scrollMarginTop: "64px" }}>
      <SectionHeader
        title="Icon"
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
          <div className="empty-message">No components available for the selected theme.</div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="gallery">
              {filtered.map(item => {
                const canCopy = isAuthenticated || item.type === "free";
                const isCopied = copiedKey === item.key;

                return (
                  <div key={item.key} className="card">
                    <div className="cardImage">
                      <img src={item.image || PLACEHOLDER} alt={item.title} />
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