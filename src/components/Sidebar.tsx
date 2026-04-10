import { useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { LogOut } from "lucide-react";

const trackEvent = (event: string, params?: Record<string, any>) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", event, params);
  }
};

type SidebarProps = {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  isMobile: boolean;
  isMenuOpen: boolean;
  onMenuClose: () => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
  onSignInOpen?: () => void;
};

export default function Sidebar({
  activeSection,
  onSectionChange,
  isMobile,
  isMenuOpen,
  onMenuClose,
  isAuthenticated,
  onLogout,
  onSignInOpen
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  // 🔥 Getting Started
  const homeSections = [
    { id: "overview", label: "Overview" },
    { id: "what-is-framer", label: "What is Framer?" },
    { id: "how-it-works", label: "How it Works" },
    { id: "quick-start", label: "Quick Start" },
    { id: "video", label: "Video Tutorial" },
  ];

  // 🔥 Layout Sections (все сразу видны)
  const layoutSections = [
    { id: "navbar", label: "Navbar" },
    { id: "hero", label: "Hero" },
    { id: "logo", label: "Logo" },
    { id: "feature", label: "Feature" },
    { id: "gallery", label: "Gallery" },
    { id: "testimonial", label: "Testimonial" },
    { id: "contact", label: "Contact" },
    { id: "pricing", label: "Pricing" },
    { id: "faq", label: "FAQ" },
    { id: "cta", label: "CTA" },
    { id: "footer", label: "Footer" },
  ];

  // 🔥 Components (все сразу видны)
  const componentSections = [
    { id: "accordion", label: "Accordion" },
    { id: "accordiongroup", label: "Accordion Group" },
    { id: "avatar", label: "Avatar" },
    { id: "avatargroup", label: "Avatar Group" },
    { id: "badge", label: "Badge" },
    { id: "button", label: "Button" },
    { id: "card", label: "Card" },
    { id: "icon", label: "Icon" },
    { id: "input", label: "Input" },
    { id: "form", label: "Form" },
    { id: "pricingcard", label: "Pricing Card" },
    { id: "rating", label: "Rating" },
    { id: "testimonialcard", label: "Testimonial Card" },
  ];

  // 🔥 Templates
  const templatesSections = [
    { id: "framerkitdaily", label: "Framer Kit Daily" },
  ];

  // 🔥 Learn (заглушки)
  const learnCategories = [
    { id: "getting-started", label: "Getting Started", count: 0 },
    { id: "components", label: "Components", count: 0 },
    { id: "animations", label: "Animations", count: 0 },
  ];

  // 🔥 Blog (заглушки)
  const blogCategories = [
    { id: "tutorials", label: "Tutorials", count: 0 },
    { id: "tips", label: "Tips & Tricks", count: 0 },
    { id: "updates", label: "Updates", count: 0 },
  ];

  // 🔥 Скролл к активному элементу
  useEffect(() => {
    if (!scrollRef.current) return;
  
    const activeItem = scrollRef.current.querySelector(
      ".sidebar-item.active"
    ) as HTMLElement | null;
  
    if (activeItem) {
      activeItem.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeSection, location.pathname]);

  const handleHomeSectionClick = (id: string) => {
    onSectionChange(id);
    if (isMobile) onMenuClose();
    if (location.pathname === "/") {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
      }
    } else {
      navigate(`/#${id}`);
    }
  };

  const getLinkPath = (id: string, basePath?: string) => {
    if (!basePath) return `/#${id}`;
    return `/${basePath}/${id}`;
  };

  const isActive = (id: string, basePath?: string) => {
    if (location.pathname === "/") return activeSection === id;
    if (basePath) return location.pathname === `/${basePath}/${id}`;
    return location.pathname === `/${id}`;
  };

  // 🔥 Рендер элементов секций
  const renderSectionItems = (list: { id: string; label: string }[], basePath: string) =>
    list.map(({ id, label }) => (
      <Link
        key={id}
        to={getLinkPath(id, basePath)}
        className={`sidebar-item ${isActive(id, basePath) ? "active" : ""}`}
        onClick={() => {
          onSectionChange(id);
          if (isMobile) onMenuClose();
        }}
      >
        {label}
      </Link>
    ));

  // 🔥 Рендер категорий со счётчиком
  const renderCategoryItems = (
    list: Array<{ id: string; label: string; count: number }>,
    basePath: string
  ) =>
    list.map(({ id, label, count }) => (
      <Link
        key={id}
        to={`/${basePath}/${id}`}
        className={`sidebar-item ${location.pathname === `/${basePath}/${id}` ? "active" : ""}`}
        onClick={() => {
          if (isMobile) onMenuClose();
        }}
      >
        <span>{label}</span>
        {count > 0 && <span className="item-count">{count}</span>}
      </Link>
    ));

    const sidebarContent = (
      <div className="sidebar-inner" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Logo */}
        {!isMobile && (
          <Link
            to="/"
            className="sidebar-logo-container"
            onClick={() => {
              onSectionChange("overview");
              // Сбрасываем URL на / и убираем hash
              navigate("/", { replace: true });
              window.history.replaceState(null, "", "/");
              // Скроллим наверх
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <img src="/Logo.png" alt="FramerKit" className="sidebar-logo-icon" />
            <span className="sidebar-logo-text">FramerKit</span>
          </Link>
        )}
    
        <div
          ref={scrollRef}
          className="sidebar-scroll"
          style={{ flexGrow: 1, overflowY: "auto" }}
        >
          {/* 🔥 Getting Started */}
          <div className="sidebar-section">
            
            {homeSections.map(({ id, label }) => (
              <Link
                key={id}
                to={`/#${id}`}
                className={`sidebar-item ${isActive(id) ? "active" : ""}`}
                onClick={() => handleHomeSectionClick(id)}
              >
                {label}
              </Link>
            ))}
          </div>
    
          {/* 🔥 Layout Sections */}
          <div className="sidebar-section">
            <span className="sidebar-header">Layout Sections</span>
            {renderSectionItems(layoutSections, "layout")}
          </div>
    
          {/* 🔥 Components */}
          <div className="sidebar-section">
            <span className="sidebar-header">Components</span>
            {renderSectionItems(componentSections, "components")}
          </div>
    
          {/* 🔥 Templates */}
          <div className="sidebar-section">
            <span className="sidebar-header">Templates</span>
            {renderSectionItems(templatesSections, "templates")}
          </div>
    
          {/* 🔥 Learn */}
          <div className="sidebar-section">
            <span className="sidebar-header">Learn</span>
            {renderCategoryItems(learnCategories, "learn")}
          </div>
    
          {/* 🔥 Blog */}
          <div className="sidebar-section">
            <span className="sidebar-header">Blog</span>
            {renderCategoryItems(blogCategories, "blog")}
          </div>
        </div>
    
        {/* Sidebar bottom */}
        <div className="sidebar-bottom">
          {isAuthenticated ? (
            <button className="logoutButton" onClick={onLogout}>
              <LogOut size={16} /> Log out
            </button>
          ) : (
            <>
              <button
                className="authButton"
                onClick={() => {
                  trackEvent("cta_click", {
                    location: "sidebar",
                    action: "get_full_access",
                  });
    
                  if (location.pathname === "/") {
                    const el = document.getElementById("get-framerkit");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  } else {
                    navigate("/#get-framerkit");
                  }
                }}
              >
                Get Full Access
              </button>
    
              <button
                className="loginButton"
                onClick={() => {
                  trackEvent("login_click", {
                    location: "sidebar",
                  });
                  onSignInOpen?.();
                }}
              >
                Log in
              </button>
            </>
          )}
        </div>
      </div>
    );

  if (isMobile) {
    return (
      <>
        {isMenuOpen && <div className="sidebar-overlay" onClick={onMenuClose} />}
        <nav className={`sidebar-mobile ${isMenuOpen ? "open" : ""}`}>{sidebarContent}</nav>
      </>
    );
  }

  return <nav className="sidebar">{sidebarContent}</nav>;
}