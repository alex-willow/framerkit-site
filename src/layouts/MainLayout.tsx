import { useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import DocsRightToc from "../components/DocsRightToc";

type WindowWithGtag = Window & {
  gtag?: (command: string, id: string, params?: Record<string, string>) => void;
};

type MainLayoutProps = {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  theme?: "light" | "dark";
  onThemeToggle?: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  onSignInOpen: () => void;
  isMobile: boolean;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  galleryScrollRef?: React.RefObject<HTMLDivElement>;
};

export default function MainLayout({
  children,
  activeSection,
  onSectionChange,
  theme,
  onThemeToggle,
  isAuthenticated,
  onLogout,
  onSignInOpen,
  isMobile,
  isMenuOpen,
  onMenuToggle,
  galleryScrollRef,
}: MainLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const internalRef = useRef<HTMLDivElement>(null);
  const contentRef = galleryScrollRef || internalRef;
  const isCatalogPage =
    location.pathname === "/layout" ||
    location.pathname.startsWith("/layout/") ||
    location.pathname === "/components" ||
    location.pathname.startsWith("/components/") ||
    location.pathname === "/templates" ||
    location.pathname.startsWith("/templates/") ||
    location.pathname === "/learn/lessons" ||
    location.pathname.startsWith("/learn/lessons/") ||
    location.pathname === "/learn/articles" ||
    location.pathname.startsWith("/learn/articles/") ||
    location.pathname === "/resources" ||
    location.pathname.startsWith("/resources/") ||
    location.pathname === "/updates" ||
    location.pathname.startsWith("/updates/") ||
    location.pathname === "/support" ||
    location.pathname.startsWith("/support/");
  const isLearnTopStickyPage =
    location.pathname === "/learn/lessons" ||
    location.pathname.startsWith("/learn/lessons/") ||
    location.pathname === "/learn/articles" ||
    location.pathname.startsWith("/learn/articles/") ||
    location.pathname === "/support" ||
    location.pathname.startsWith("/support/");
  const showDocsRightToc = !isMobile && location.pathname === "/";
  const docsTocSections = [
    { id: "overview", label: "Overview" },
    { id: "how-it-works", label: "How it Works" },
    { id: "quick-start", label: "Quick Start" },
    { id: "using-the-plugin", label: "Using the Plugin" },
    { id: "video-tutorial", label: "Video Tutorial" },
  ];

  const handlePricingClick = () => {
    navigate("/#get-framerkit");
  };

  // ===============================
  // GA: Инициализация
  // ===============================
  useEffect(() => {
    // добавляем скрипт GA один раз
    const scriptExists = document.querySelector(`script[src*="googletagmanager"]`);
    if (!scriptExists) {
      const script1 = document.createElement("script");
      script1.async = true;
      script1.src = "https://www.googletagmanager.com/gtag/js?id=G-GNZGR575KN";
      document.head.appendChild(script1);

      const script2 = document.createElement("script");
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-GNZGR575KN', { page_path: window.location.pathname });
      `;
      document.head.appendChild(script2);
    }
  }, []);

  // ===============================
  // GA: Отслеживание страниц
  // ===============================
  useEffect(() => {
    const windowWithGtag = window as WindowWithGtag;
    if (windowWithGtag.gtag) {
      windowWithGtag.gtag("config", "G-GNZGR575KN", {
        page_path: location.pathname + location.hash,
      });
    }
  }, [location.pathname, location.hash]);

  // ===============================
  // Скролл в начало при смене страницы
  // ===============================
  useEffect(() => {
    if (location.hash) return;

    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [location.pathname, location.hash, contentRef]);

  return (
    <div className="container" data-theme={theme} data-framer-theme={theme}>
      <Header
        isMobile={isMobile}
        onMenuToggle={onMenuToggle}
        theme={theme}
        onThemeToggle={onThemeToggle}
      />

      <div className="app-layout">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          isMobile={isMobile}
          isMenuOpen={isMenuOpen}
          onMenuClose={onMenuToggle}
          isAuthenticated={isAuthenticated}
          onLogout={onLogout}
          onSignInOpen={onSignInOpen}
        />

        <main className="content" ref={contentRef}>
          {!isMobile && isCatalogPage && (
            <div
              className={`desktop-header-actions ${
                isLearnTopStickyPage ? "desktop-header-actions-sticky" : ""
              }`}
            >
              {isAuthenticated ? (
                <button className="logoutButton" onClick={onLogout}>
                  Log out
                </button>
              ) : (
                <>
                  <button className="logoutButton" onClick={onSignInOpen}>
                    Log in
                  </button>
                  <button
                    className="authButton"
                    onClick={handlePricingClick}
                  >
                    Get Full Access
                  </button>
                </>
              )}
              {onThemeToggle && (
                <button
                  type="button"
                  className={`theme-toggle-btn ${theme === "dark" ? "active" : ""}`}
                  onClick={onThemeToggle}
                  aria-label={theme === "dark" ? "Dark theme" : "Light theme"}
                  title=""
                >
                  {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
                </button>
              )}
            </div>
          )}
          {children}
          {showDocsRightToc && <DocsRightToc sections={docsTocSections} />}
        </main>
      </div>
    </div>
  );
}
