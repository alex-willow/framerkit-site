// src/pages/Components/PricingCard.tsx
import { useState, useEffect, useRef } from "react";
import { Copy, Lock } from "lucide-react";

type ComponentItem = {
  key: string;
  title: string;
  image: string;
  url: string;
  type: "free" | "paid";
  section: string;
};

type PricingCardPageProps = {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  isAuthenticated: boolean;
  setIsSignInOpen: (open: boolean) => void;
  galleryRef: React.RefObject<HTMLDivElement>;
};

const PLACEHOLDER = "https://via.placeholder.com/280x160?text=No+Image";

export default function PricingCardPage({ 
  theme, 
  setTheme, 
  isAuthenticated, 
  setIsSignInOpen, 
  galleryRef 
}: PricingCardPageProps) {
  const [filtered, setFiltered] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        // ✅ Загружаем напрямую
        const res = await fetch(
          "https://raw.githubusercontent.com/alex-willow/framerkit-data/refs/heads/components/pricingcard.json"
        );
        if (!res.ok) throw new Error("Failed to load pricingcard");

        const json = await res.json();
        const items = json.Pricingcard || []; // ✅ ключ в JSON

        // ✅ Фильтруем по теме
        const filteredItems = items.filter(item =>
          theme === "dark" ? item.key.includes("Dark") : !item.key.includes("Dark")
        );

        setFiltered(filteredItems);
        setLoading(false);
      } catch (err) {
        setError("Не удалось загрузить компоненты Pricing Card");
        setLoading(false);
      }
    };

    load();
  }, [theme]);

  return (
    <div style={{ padding: 0 }}>
      {/* Sticky header */}
      <div className="section-header-sticky">
        <h2 className="title">Pricing Card</h2>
        <div className="subtitleRow">
          <p className="subtitle">
            {loading ? "Loading..." : `${filtered.length} layouts`} in the "{theme === "light" ? "Light" : "Dark"}" theme
          </p>
          <div className="themeSwitcher">
            <span className="modeLabel">Mode:</span>
            <button
              className="themeToggle"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
        <div className="title-divider" />
      </div>

      {/* Gallery scroll area */}
      <div className="gallery-scroll-area" ref={galleryRef}>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : filtered.length === 0 ? (
          <div className="empty-message">Пусто — в этой секции нет компонентов для выбранной темы.</div>
        ) : (
          <div className="gallery">
            {filtered.map(item => (
              <div key={item.key} className="card">
                <div className="cardImage">
                  <img src={item.image || PLACEHOLDER} alt={item.title} loading="lazy" />
                </div>
                <div className="cardInfo">
                  <h3>{item.title}</h3>
                  {isAuthenticated || item.type === "free" ? (
                    <div
                      className="iconButton"
                      onClick={() => navigator.clipboard.writeText(item.url)}
                    >
                      <Copy size={16} />
                    </div>
                  ) : (
                    <div
                      className="iconButton lock"
                      onClick={() => setIsSignInOpen(true)}
                    >
                      <Lock size={16} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}