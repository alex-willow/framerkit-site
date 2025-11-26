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

type CardPageProps = {
  components: ComponentItem[];
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  isAuthenticated: boolean;
  setIsSignInOpen: (open: boolean) => void;
  galleryRef: React.RefObject<HTMLDivElement>;
};

const PLACEHOLDER = "https://via.placeholder.com/280x160?text=No+Image";

export default function CardPage({ 
  components, 
  theme, 
  setTheme, 
  isAuthenticated, 
  setIsSignInOpen, 
  galleryRef 
}: CardPageProps) {
  const [filtered, setFiltered] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const cardItems = components.filter(item => item.section === "components/card");
      const filteredItems = cardItems.filter(item =>
        theme === "dark" ? item.key.includes("dark") : !item.key.includes("dark")
      );
      setFiltered(filteredItems);
      setLoading(false);
    };
    load();
  }, [components, theme]);

  return (
    <div style={{ padding: 0 }}>
      {/* Sticky header — как у Layout/Components */}
      <div className="section-header-sticky">
        <h2 className="title">Card</h2>
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