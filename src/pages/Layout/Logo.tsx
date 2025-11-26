// src/pages/Layout/Logo.tsx
import { useState, useEffect } from "react";
import { Copy, Lock } from "lucide-react";

type ComponentItem = {
  key: string;
  title: string;
  image: string;
  url: string;
  type: "free" | "paid";
  section: string;
};

type LogoPageProps = {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  isAuthenticated: boolean;
  setIsSignInOpen: (open: boolean) => void;
};

const PLACEHOLDER = "https://via.placeholder.com/280x160?text=No+Image";

export default function LogoPage({ theme, setTheme, isAuthenticated, setIsSignInOpen }: LogoPageProps) {
  const [items, setItems] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Updated URL for raw logo.json file
        const res = await fetch(
          "https://raw.githubusercontent.com/alex-willow/framerkit-data/main/logo.json"
        );
        if (!res.ok) throw new Error("Failed to load logo data");
        const json = await res.json();
        setItems(json.logo || []);
        setLoading(false);
      } catch (err) {
        setError("Не удалось загрузить логотипы");
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = items.filter(item =>
    theme === "dark" ? item.key.includes("dark") : !item.key.includes("dark")
  );

  return (
    <div style={{ padding: 0 }}>
      {/* Sticky header */}
      <div className="section-header-sticky">
        <h2 className="title">Logo</h2>
        <div className="subtitleRow">
          <p className="subtitle">
            {loading ? "Loading..." : `${filtered.length} logos`} in the "{theme === "light" ? "Light" : "Dark"}" theme
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
      <div className="gallery-scroll-area">
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
