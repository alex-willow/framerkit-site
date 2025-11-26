// src/pages/Layout/Navbar.tsx
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

type NavbarPageProps = {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  isAuthenticated: boolean;
  setIsSignInOpen: (open: boolean) => void;
};

export default function NavbarPage({ theme, setTheme, isAuthenticated, setIsSignInOpen }: NavbarPageProps) {
  const [items, setItems] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/alex-willow/framerkit-data/main/navbar.json"
        );
        if (!res.ok) throw new Error("Failed to load navbar");
        const json = await res.json();
        setItems(json.navbar || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load navbar", err);
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = items.filter(item =>
    theme === "dark" ? item.key.includes("dark") : !item.key.includes("dark")
  );

  useEffect(() => {
    console.log("isAuthenticated changed:", isAuthenticated); // Для отладки
  }, [isAuthenticated]); // Это сработает при изменении isAuthenticated

  return (
    <div style={{ padding: 0 }}>
      {/* Sticky header */}
      <div className="section-header-sticky">
        <h2 className="title">Navbar</h2>
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
      <div className="gallery-scroll-area">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="gallery">
            {filtered.map(item => (
              <div key={item.key} className="card">
                <div className="cardImage">
                  <img src={item.image || "https://via.placeholder.com/280x160?text=No+Image"} alt={item.title} loading="lazy" />
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
