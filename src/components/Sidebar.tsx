import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom"; // 🔥 Добавили Link
import { ChevronDown, ChevronUp, LogOut } from "lucide-react";

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
  const [layoutOpen, setLayoutOpen] = useState(false);
  const [componentsOpen, setComponentsOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);

  const homeSections = [
    { id: "overview", label: "Overview" },
    { id: "getting-started", label: "Getting Started" },
    { id: "layout-sections", label: "Layout Sections" },
    { id: "ui-components", label: "UI Components" },
    { id: "get-framerkit", label: "Get FramerKit" },
    { id: "faq-contact", label: "FAQ" },
  ];

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

  const layoutIds = layoutSections.map(s => s.id);
  const componentIds = componentSections.map(s => s.id);

  useEffect(() => {
    if (
      location.pathname.startsWith("/layout") ||
      layoutIds.includes(activeSection)
    ) {
      setLayoutOpen(true);
      setComponentsOpen(false);
      setTemplatesOpen(false);
      return;
    }
  
    if (
      location.pathname.startsWith("/components") ||
      componentIds.includes(activeSection)
    ) {
      setComponentsOpen(true);
      setLayoutOpen(false);
      setTemplatesOpen(false);
      return;
    }
  
    if (location.pathname.startsWith("/templates")) {
      setTemplatesOpen(true);
      setLayoutOpen(false);
      setComponentsOpen(false);
      return;
    }
  }, [location.pathname, activeSection]);
  
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

  // 🔥 НОВАЯ ФУНКЦИЯ: Возвращает путь для Link
  const getLinkPath = (id: string, basePath?: string) => {
    if (!basePath) return `/#${id}`;
    return `/${basePath}/${id}`;
  };

  const isActive = (id: string, basePath?: string) => {
    if (location.pathname === "/") return activeSection === id;
    if (basePath) return location.pathname === `/${basePath}/${id}`;
    return location.pathname === `/${id}`;
  };

  // 🔥 ИСПРАВЛЕНО: renderSectionItems теперь возвращает <Link>
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

  const CollapsibleSection = ({
    title,
    open,
    setOpen,
    children,
  }: {
    title: string;
    open: boolean;
    setOpen: (v: boolean) => void;
    children: React.ReactNode;
  }) => (
    <div className="collapsible-section">
      {/* 🔥 Заголовок секции — кнопка, потому что это действие (открыть/закрыть) */}
      <div
        className="sidebar-header collapsible"
        onClick={() => setOpen(!open)}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
      >
        <span>{title}</span>
        {open ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </div>
      <div className={`collapsible-content ${open ? "open" : ""}`}>{children}</div>
    </div>
  );

  const renderTemplatesSection = () => (
    <CollapsibleSection title="Templates" open={templatesOpen} setOpen={setTemplatesOpen}>
      {/* 🔥 Template item — тоже ссылка */}
      <Link
        to="/templates/framerkitdaily"
        className={`sidebar-item ${location.pathname === "/templates/framerkitdaily" ? "active" : ""}`}
        onClick={() => {
          onSectionChange("framerkitdaily");
          if (isMobile) onMenuClose();
        }}
      >
        Framer Kit Daily
      </Link>
    </CollapsibleSection>
  );

  const sidebarContent = (
    <div className="sidebar-inner" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo — ссылка на главную */}
      {!isMobile && (
        <Link to="/" className="sidebar-logo-container" onClick={() => onSectionChange("overview")}>
          <img src="/Logo.png" alt="FramerKit" className="sidebar-logo-icon" />
          <h1 className="sidebar-logo-text">FramerKit</h1>
        </Link>
      )}

      <div
        ref={scrollRef}
        className="sidebar-scroll"
        style={{ flexGrow: 1, overflowY: "auto" }}
      >
        <div className="sidebar-header">Getting Started</div>
        
        {/* 🔥 Home sections — ссылки с хэшем */}
        {homeSections.map(({ id, label }) => (
          <Link
            key={id}
            to={`/#${id}`}
            className={`sidebar-item ${isActive(id) ? "active" : ""}`}
            onClick={() => {
              handleHomeSectionClick(id);
            }}
          >
            {label}
          </Link>
        ))}

        <CollapsibleSection title="Layout Sections" open={layoutOpen} setOpen={setLayoutOpen}>
          {renderSectionItems(layoutSections, "layout")}
        </CollapsibleSection>

        <CollapsibleSection title="Components" open={componentsOpen} setOpen={setComponentsOpen}>
          {renderSectionItems(componentSections, "components")}
        </CollapsibleSection>

        {renderTemplatesSection()}
      </div>

      <div className="sidebar-bottom">
        {isAuthenticated ? (
          // 🔥 Logout — остаётся кнопкой, это действие!
          <button className="logoutButton" onClick={onLogout}>
            <LogOut size={16} /> Log out
          </button>
        ) : (
          <>
            {/* 🔥 Get Full Access — кнопка, это действие (скролл + трекинг) */}
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

            {/* 🔥 Login — кнопка, это действие (открыть модалку) */}
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