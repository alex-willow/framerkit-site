import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

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
  isAuthenticated,
  onLogout,
  onSignInOpen,
  isMobile,
  isMenuOpen,
  onMenuToggle,
  galleryScrollRef,
}: MainLayoutProps) {
  const location = useLocation();
  const internalRef = useRef<HTMLDivElement>(null);
  const contentRef = galleryScrollRef || internalRef;

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
    if ((window as any).gtag) {
      (window as any).gtag("config", "G-GNZGR575KN", {
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
    <div className="container" data-theme={theme}>
      <Header
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
        onSignInOpen={onSignInOpen}
        isMobile={isMobile}
        onMenuToggle={onMenuToggle}
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
          {children}
          <Footer activeSection={activeSection} onSectionChange={onSectionChange} />
        </main>
      </div>
    </div>
  );
}
