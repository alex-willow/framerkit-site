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
  return (
    <div className="container" data-theme={theme}>
      {/* Header фиксирован */}
      <Header
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
        onSignInOpen={onSignInOpen}
        isMobile={isMobile}
        onMenuToggle={onMenuToggle}
      />

      {/* Основная часть страницы: Sidebar + Контент */}
      <div className="app-layout">
        {/* Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          isMobile={isMobile}
          isMenuOpen={isMenuOpen}
          onMenuClose={onMenuToggle}
        />

        {/* Контент */}
        <main className="content" ref={galleryScrollRef}>
          {children}

          {/* Футер в конце контента */}
          <Footer />
        </main>
      </div>
    </div>
  );
}
