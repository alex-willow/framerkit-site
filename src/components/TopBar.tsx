import { useState } from "react";
import { Moon, Sun } from "lucide-react";

type TopBarProps = {
  theme: "light" | "dark";
  onThemeToggle: () => void;
};

export default function TopBar({ theme, onThemeToggle }: TopBarProps) {
  const isDarkTheme = theme === "dark";
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="home-overview-topbar">
      <button
        type="button"
        className={`theme-toggle-btn ${isDarkTheme ? "active" : ""}`}
        onClick={() => {
          setShowTooltip(false);
          onThemeToggle();
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label={isDarkTheme ? "Dark theme" : "Light theme"}
        title=""
      >
        {isDarkTheme ? <Moon size={20} /> : <Sun size={20} />}
        {showTooltip && (
          <div className="theme-toggle-tooltip">
            {isDarkTheme ? "Dark theme" : "Light theme"}
          </div>
        )}
      </button>
    </div>
  );
}
