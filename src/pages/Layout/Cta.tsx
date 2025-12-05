// src/pages/Layout/Cta.tsx
import { useState, useEffect, useRef } from "react";
import { Copy, CircleCheck, Lock } from "lucide-react";
import SectionHeader from "../../components/SectionHeader";

type ComponentItem = {
  key: string;
  title: string;
  image: string;
  url: string;
  type: "free" | "paid";
};

type CtaPageProps = {
  isAuthenticated: boolean;
  setIsSignInOpen: (open: boolean) => void;
};

const PLACEHOLDER = "https://via.placeholder.com/280x160?text=No+Image";

export default function CtaPage({ isAuthenticated, setIsSignInOpen }: CtaPageProps) {
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
          "https://raw.githubusercontent.com/alex-willow/framerkit-data/main/cta.json"
        );
        if (!res.ok) throw new Error("Failed to load CTA components");
        const json = await res.json();
        setItems(json.cta || []);
      } catch {
        setError("Failed to load CTA components");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (galleryRef.current) {
      galleryRef.current.scrollTo({ top: 0 });
    }
  }, [filter, loading]);

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

  return (
    <div style={{ padding: 0 }}>
      <SectionHeader
        title="CTA"
        count={filtered.length}
        filter={filter}
        onFilterChange={setFilter}
        loading={loading}
      />

      <div className="gallery-scroll-area" ref={galleryRef}>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : filtered.length === 0 ? (
          <div className="empty-message">
            No components available for the selected theme.
          </div>
        ) : (
          <div className="gallery">
            {filtered.map(item => {
              const canCopy = isAuthenticated || item.type === "free";
              const isCopied = copiedKey === item.key;

              return (
                <div key={item.key} className="card">
                  <div className="cardImage">
                    <img src={item.image || PLACEHOLDER} alt={item.title} loading="lazy" />
                  </div>
                  <div className="cardInfo">
                    <h3>{item.title}</h3>

                    <div
                      className={`iconButton ${isCopied ? "copied" : ""} ${!canCopy ? "locked" : ""}`}
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
                          {isCopied ? "Copied" : canCopy ? "Copy" : "Sign in to copy"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
