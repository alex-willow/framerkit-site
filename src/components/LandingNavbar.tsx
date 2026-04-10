// src/components/LandingNavbar.tsx
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { Menu, LogOut, Moon, Sun } from "lucide-react";

type LandingNavbarProps = {
  isMobile: boolean;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
  onSignInOpen?: () => void;
  onGetAccess?: () => void;
  theme: "light" | "dark";
  onThemeToggle: () => void;
};

export default function LandingNavbar({
  isMobile,
  isMenuOpen,
  onMenuToggle,
  isAuthenticated,
  onLogout,
  onSignInOpen,
  onGetAccess,
  theme,
  onThemeToggle,
}: LandingNavbarProps) {
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const navItems = [
    { id: "getting-started", label: "Getting Started" },
    { id: "layout-sections", label: "Layout" },
    { id: "ui-components", label: "Components" },
    { id: "get-framerkit", label: "Pricing" },
    { id: "faq-contact", label: "FAQ" },
  ];

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.replaceState(null, "", "/");
    if (isMobile && isMenuOpen) onMenuToggle();
  };

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `/#${id}`);
    if (isMobile && isMenuOpen) onMenuToggle();
  };

  useEffect(() => {
    if (!isMobile || !isMenuOpen) return;

    const handleOutsideClick = (event: Event) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (mobileMenuRef.current?.contains(target)) return;
      if (hamburgerRef.current?.contains(target)) return;
      onMenuToggle();
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isMobile, isMenuOpen, onMenuToggle]);
  
  // 🔥 ДЕСКТОП
  if (!isMobile) {
    return (
      <header className="landing-navbar">
        <div className="landing-navbar-inner">
          {/* Лого */}
          <Link to="/" className="landing-navbar-logo" onClick={handleLogoClick}>
            <img src="/Logo.png" alt="FramerKit" className="logo-icon" />
            <span className="logo-text">FramerKit</span>
          </Link>

          <nav className="landing-navbar-links" aria-label="Landing sections">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className="landing-nav-link"
                onClick={() => handleScrollTo(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          {/* Кнопки */}
          <div className="landing-navbar-buttons">
            {isAuthenticated ? (
              <button className="logoutButton" onClick={onLogout}>
                <LogOut size={16} /> Log out
              </button>
            ) : (
              <>
                <button className="logoutButton" onClick={onSignInOpen}>Log in</button>
                <button className="authButton" onClick={onGetAccess}>Get Full Access</button>
              </>
            )}
            <button
              type="button"
              className={`theme-toggle-btn ${theme === "dark" ? "active" : ""}`}
              onClick={() => {
                setShowTooltip(false);
                onThemeToggle();
              }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              aria-label={theme === "dark" ? "Dark theme" : "Light theme"}
              title=""
            >
              {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
              {showTooltip && (
                <div className="theme-toggle-tooltip">
                  {theme === "dark" ? "Dark theme" : "Light theme"}
                </div>
              )}
            </button>
          </div>
        </div>
      </header>
    );
  }

  // 🔥 МОБИЛЬНЫЙ: Лого + гамбургер
  return (
    <header className="landing-navbar-mobile">
      {/* Лого */}
      <Link to="/" className="landing-navbar-logo" onClick={handleLogoClick}>
        <img src="/Logo.png" alt="FramerKit" className="logo-icon" />
        <span className="logo-text">FramerKit</span>
      </Link>

      {/* Переключатель темы перед гамбургером */}
      <div className="header-actions">
        <button
          className="theme-toggle-btn-header"
          onClick={onThemeToggle}
          aria-label={theme === "dark" ? "Dark theme" : "Light theme"}
        >
          {theme === "dark" ? <Moon size={20} color="currentColor" /> : <Sun size={20} color="currentColor" />}
        </button>

        {/* Гамбургер */}
        <button ref={hamburgerRef} className="nav-menu-toggle" onClick={onMenuToggle} aria-label="Menu">
          <Menu size={24} />
        </button>
      </div>

      {isMenuOpen && (
        <div className="landing-mobile-menu" ref={mobileMenuRef}>
          <div className="landing-mobile-menu-links">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className="landing-mobile-link"
                onClick={() => handleScrollTo(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="landing-mobile-menu-actions">
            {isAuthenticated ? (
              <button className="logoutButton" onClick={onLogout}>
                <LogOut size={16} /> Log out
              </button>
            ) : (
              <>
                <button className="logoutButton" onClick={onSignInOpen}>Log in</button>
                <button className="authButton" onClick={onGetAccess}>Get Full Access</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}