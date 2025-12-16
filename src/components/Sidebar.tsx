import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp, LogOut } from "lucide-react";

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

  useEffect(() => {
    if (!isMenuOpen) return;
    const path = location.pathname;
    if (path.startsWith("/components")) {
      setComponentsOpen(true);
      setLayoutOpen(false);
      setTemplatesOpen(false);
    } else if (path.startsWith("/layout")) {
      setLayoutOpen(true);
      setComponentsOpen(false);
      setTemplatesOpen(false);
    } else if (path.startsWith("/templates")) {
      setTemplatesOpen(true);
      setLayoutOpen(false);
      setComponentsOpen(false);
    } else {
      setLayoutOpen(false);
      setComponentsOpen(false);
      setTemplatesOpen(false);
    }
  }, [isMenuOpen, location.pathname]);

  const handleHomeSectionClick = (id: string) => {
    onSectionChange(id);
    if (isMobile) onMenuClose();
    if (location.pathname === "/") {
      // Уже на главной — скроллим
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // Переходим на главную + хэш
      navigate(`/#${id}`);
    }
  };

  const handleOtherSectionClick = (id: string, basePath: string) => {
    onSectionChange(id);
    if (isMobile) onMenuClose();
    navigate(`/${basePath}/${id}`);
  };

  const isActive = (id: string, basePath?: string) => {
    if (location.pathname === "/") return activeSection === id;
    if (basePath) return location.pathname === `/${basePath}/${id}`;
    return location.pathname === `/${id}`;
  };

  const renderSectionItems = (list: { id: string; label: string }[], basePath: string) =>
    list.map(({ id, label }) => (
      <button
        key={id}
        className={`sidebar-item ${isActive(id, basePath) ? "active" : ""}`}
        onClick={() => handleOtherSectionClick(id, basePath)}
      >
        {label}
      </button>
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
      <div
        className="sidebar-header collapsible"
        onClick={() => setOpen(!open)}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <span>{title}</span>
        {open ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </div>
      <div className={`collapsible-content ${open ? "open" : ""}`}>{children}</div>
    </div>
  );

  const renderTemplatesSection = () => (
    <CollapsibleSection title="Templates" open={templatesOpen} setOpen={setTemplatesOpen}>
      <button
        className={`sidebar-item ${location.pathname === "/templates/framerkitdaily" ? "active" : ""}`}
        onClick={() => {
          onSectionChange("framerkitdaily");
          if (isMobile) onMenuClose();
          navigate("/templates/framerkitdaily");
        }}
      >
        Framer Kit Daily
      </button>
    </CollapsibleSection>
  );

  const sidebarContent = (
    <div className="sidebar-inner" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      {!isMobile && (
        <div className="sidebar-logo-container" onClick={() => navigate("/")}>
          <img src="/Logo.png" alt="FramerKit" className="sidebar-logo-icon" />
          <h1 className="sidebar-logo-text">FramerKit</h1>
        </div>
      )}

      <div className="sidebar-scroll" style={{ flexGrow: 1, overflowY: "auto" }}>
        <div className="sidebar-header">Getting Started</div>
        {homeSections.map(({ id, label }) => (
          <button
            key={id}
            className={`sidebar-item ${isActive(id) ? "active" : ""}`}
            onClick={() => handleHomeSectionClick(id)}
          >
            {label}
          </button>
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
          <button className="logoutButton" onClick={onLogout}>
            <LogOut size={16} /> Log out
          </button>
        ) : (
          <>
            <button
              className="authButton"
              onClick={() => {
                if (location.pathname === "/") {
                  const el = document.getElementById("get-framerkit");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                } else {
                  navigate("/#get-framerkit"); // ← ключевое изменение
                }
              }}
            >
              Get Full Access
            </button>
            <button className="loginButton" onClick={onSignInOpen}>
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