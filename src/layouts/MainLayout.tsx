// src/layouts/MainLayout.tsx
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

type MainLayoutProps = {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  theme?: "light" | "dark";      // ← сделали необязательным
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
  galleryScrollRef, // ← добавь деструктуризацию
}: MainLayoutProps) {
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
        {!isMobile && (
          <Sidebar
            activeSection={activeSection}
            onSectionChange={onSectionChange}
            isMobile={false}
            isMenuOpen={false}
            onMenuClose={() => {}}
          />
        )}

        {isMobile && (
          <Sidebar
            activeSection={activeSection}
            onSectionChange={onSectionChange}
            isMobile={true}
            isMenuOpen={isMenuOpen}
            onMenuClose={onMenuToggle}
          />
        )}

        {/* === Контент === */}
        {/* Вот сюда передаём galleryScrollRef */}
        <main className="content" ref={galleryScrollRef}>
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}