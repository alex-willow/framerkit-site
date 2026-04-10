import { Menu, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";

type HeaderProps = {
  isMobile: boolean;
  onMenuToggle: () => void;
  theme?: "light" | "dark";
  onThemeToggle?: () => void;
};

export default function Header({ isMobile, onMenuToggle, theme = "light", onThemeToggle }: HeaderProps) {
  if (!isMobile) return null;

  return (
    <header className="header">
      <Link
        to="/"
        className="landing-navbar-logo"
        onClick={() => (window.location.href = "/")}
      >
        <img src="/Logo.png" alt="FramerKit" className="logo-icon" />
        <span className="logo-text">FramerKit</span>
      </Link>

      <div className="header-actions">
        {onThemeToggle && (
          <button
            className="theme-toggle-btn-header"
            onClick={onThemeToggle}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        )}
        <button
          className="nav-menu-toggle"
          onClick={onMenuToggle}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}
