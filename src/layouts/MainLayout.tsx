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

  // Скролл наверх при смене маршрута
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [location.pathname, contentRef]);

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
          isAuthenticated={isAuthenticated} // добавляем
          onLogout={onLogout}               // добавляем
          onSignInOpen={onSignInOpen}       // добавляем
        />

        <main className="content" ref={contentRef}>
          {children}
          <Footer activeSection={activeSection} onSectionChange={onSectionChange} />
        </main>
      </div>
    </div>
  );
}
