import { useState, useEffect, useRef } from "react";
import { Copy, CircleCheck } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeader from "../../components/SectionHeader";

type TemplateItem = {
  key: string;
  image: string;
  url: string;
};

const PLACEHOLDER = "https://via.placeholder.com/280x160?text=No+Image";

export default function FramerKitDailyPage() {
  const [items, setItems] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const galleryRef = useRef<HTMLDivElement>(null);

  // === Load JSON
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/alex-willow/framerkit-data/refs/heads/main/framerkitdaily"
        );
        if (!res.ok) throw new Error("Failed to load FramerKitDaily templates");
        const json = await res.json();
        setItems(json.framerkitdaily || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load FramerKitDaily templates");
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleCopy = async (item: TemplateItem) => {
    await navigator.clipboard.writeText(item.url);
    setCopiedKey(item.key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const skeletonCards = Array.from({ length: 10 });

  return (
    <div id="framerkitdaily-page" style={{ padding: 0, scrollMarginTop: "64px" }}>
      <SectionHeader
        title="FramerKit Daily Templates"
        count={items.length}
        filter="light"
        onFilterChange={() => {}}
        loading={loading}
      />

      <div className="gallery-scroll-area" ref={galleryRef}>
        {loading ? (
          <div className="skeleton-gallery">
            {skeletonCards.map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-card-image" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p style={{ color: "red", padding: "20px" }}>{error}</p>
        ) : items.length === 0 ? (
          <div className="empty-message">No templates available.</div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="daily-grid">
              {items.map((item) => {
                const isCopied = copiedKey === item.key;

                return (
                  <div key={item.key} className="daily-card">
                    {/* IMAGE + OVERLAY */}
                    <div className="daily-card-image-wrapper">
                      <div className="daily-card-image">
                        <img src={item.image || PLACEHOLDER} alt={item.key} />
                      </div>

                      <div className="daily-card-overlay">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="overlay-view-button"
                        >
                          Preview
                        </a>
                      </div>
                    </div>

                    {/* DAY + COPY */}
                    <div className="daily-card-title-row">
                      <span className="daily-day">{item.key.replace("Day", "Day ")}</span>

                      <button
                        className={`copy-icon-btn ${isCopied ? "copied" : ""}`}
                        onClick={() => handleCopy(item)}
                      >
                        {isCopied ? (
                          <CircleCheck size={20} color="#22c55e" />
                        ) : (
                          <Copy size={18} />
                        )}
                      </button>
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
