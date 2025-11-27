// src/pages/Layout/Hero.tsx
import { useState, useEffect, useRef } from "react";
import { Copy, Lock } from "lucide-react";

type ComponentItem = {
  key: string;
  title: string;
  image: string;
  url: string;
  type: "free" | "paid";
  // section не используется — можно убрать
};

type HeroPageProps = {
  isAuthenticated: boolean;
  setIsSignInOpen: (open: boolean) => void;
  // theme, setTheme, galleryRef — УДАЛЕНЫ
};

const PLACEHOLDER = "https://via.placeholder.com/280x160?text=No+Image";

export default function HeroPage({ isAuthenticated, setIsSignInOpen }: HeroPageProps) {
  const [items, setItems] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light"); // ← локальное состояние
  const galleryRef = useRef<HTMLDivElement>(null); // ← локальный ref

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/alex-willow/framerkit-data/main/hero.json"
        );
        if (!res.ok) throw new Error("Failed to load hero");
        const json = await res.json();
        setItems(json.hero || []);
        setLoading(false);
      } catch (err) {
        setError("Не удалось загрузить компоненты Hero");
        setLoading(false);
      }
    };
    load();
  }, []);

  // Прокрутка наверх при смене темы или загрузке
  useEffect(() => {
    if (galleryRef.current) {
      galleryRef.current.scrollTo({ top: 0 });
    }
  }, [theme, loading]);

  const filtered = items.filter(item =>
    theme === "dark" ? item.key.includes("dark") : !item.key.includes("dark")
  );

  return (
    <div style={{ padding: 0 }}>
      <div className="section-header-sticky">
        <h2 className="title">Hero</h2>
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

      <div className="gallery-scroll-area" ref={galleryRef}>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
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