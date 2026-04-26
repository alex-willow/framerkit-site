import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
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

type CollapsibleSectionProps = {
  title: string;
  open: boolean;
  onToggle: () => void;
  onTitleClick?: () => void;
  titleActive?: boolean;
  children: React.ReactNode;
};

function CollapsibleSection({
  title,
  open,
  onToggle,
  onTitleClick,
  titleActive = false,
  children,
}: CollapsibleSectionProps) {
  return (
    <div className="collapsible-section">
      <div className="sidebar-header collapsible">
        <button
          type="button"
          className={`sidebar-header-button ${titleActive ? "active" : ""}`}
          onClick={onTitleClick ?? onToggle}
        >
          {title}
        </button>
        <button
          type="button"
          className="sidebar-header-toggle"
          onClick={onToggle}
          aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
        >
          {open ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>
      <div className={`collapsible-content ${open ? "open" : ""}`}>{children}</div>
    </div>
  );
}

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
  const routeLayoutOpen = location.pathname.startsWith("/layout");
  const routeComponentsOpen = location.pathname.startsWith("/components");
  const routeTemplatesOpen = location.pathname.startsWith("/templates");
  const isLayoutOpen = routeLayoutOpen || layoutOpen;
  const isComponentsOpen = routeComponentsOpen || componentsOpen;
  const isTemplatesOpen = routeTemplatesOpen || templatesOpen;

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

  const handleDocumentationClick = () => {
    onSectionChange("overview");
    if (isMobile) onMenuClose();
    navigate("/#overview");
  };

  const handleResourcesClick = () => {
    onSectionChange("resources");
    if (isMobile) onMenuClose();
    navigate("/resources");
  };

  const handleOtherSectionClick = (id: string, basePath: string) => {
    onSectionChange(id);
    if (isMobile) onMenuClose();
    navigate(`/${basePath}/${id}`);
  };

  const handleSectionOverviewClick = (basePath: string) => {
    onSectionChange(basePath);
    if (isMobile) onMenuClose();
    navigate(`/${basePath}`);
  };

  const isActive = (id: string, basePath?: string) => {
    if (id === "documentation") return location.pathname === "/" && Boolean(location.hash);
    if (location.pathname === "/") return activeSection === id;
    if (basePath) return location.pathname === `/${basePath}/${id}`;
    if (id === "resources") return location.pathname === "/resources" || location.pathname.startsWith("/resources/");
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

  const renderTemplatesSection = () => (
    <CollapsibleSection
      title="Templates"
      open={isTemplatesOpen}
      onToggle={() => setTemplatesOpen((current) => !current)}
    >
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
      {/* Logo on top — показываем только на десктопе */}
      {!isMobile && (
        <Link to="/" className="sidebar-logo-container" onClick={() => (window.location.href = "/")}>
          <img src="/Logo.png" alt="FramerKit" className="sidebar-logo-icon" />
          <span className="sidebar-logo-text">FramerKit</span>
        </Link>
      )}

      {/* Scrollable section content */}
      <div className="sidebar-scroll" style={{ flexGrow: 1, overflowY: "auto" }}>
        <div className="sidebar-header">Documentation</div>
        <button
          className={`sidebar-item ${isActive("documentation") ? "active" : ""}`}
          onClick={handleDocumentationClick}
        >
          Documentation
        </button>

        <div className="sidebar-divider" role="separator" aria-hidden="true" />
        <button
          className={`sidebar-item ${isActive("resources") ? "active" : ""}`}
          onClick={handleResourcesClick}
        >
          Resources
        </button>

        <CollapsibleSection
          title="Layout Sections"
          open={isLayoutOpen}
          onToggle={() => setLayoutOpen((current) => !current)}
          onTitleClick={() => handleSectionOverviewClick("layout")}
          titleActive={location.pathname === "/layout"}
        >
          <button
            className={`sidebar-item ${location.pathname === "/layout" ? "active" : ""}`}
            onClick={() => handleSectionOverviewClick("layout")}
          >
            Overview
          </button>
          {renderSectionItems(layoutSections, "layout")}
        </CollapsibleSection>

        <CollapsibleSection
          title="Components"
          open={isComponentsOpen}
          onToggle={() => setComponentsOpen((current) => !current)}
          onTitleClick={() => handleSectionOverviewClick("components")}
          titleActive={location.pathname === "/components"}
        >
          <button
            className={`sidebar-item ${location.pathname === "/components" ? "active" : ""}`}
            onClick={() => handleSectionOverviewClick("components")}
          >
            Overview
          </button>
          {renderSectionItems(componentSections, "components")}
        </CollapsibleSection>

        {renderTemplatesSection()}
      </div>

      {/* Buttons at bottom */}
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
                      // Уже на главной — просто скроллим
                      const el = document.getElementById("get-framerkit");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                      }
                    } else {
                      // На другой странице — переходим на главную с флагом
                      navigate("/", {
                        state: { scrollTo: "get-framerkit", fromSidebar: true },
                      });
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

  // Mobile sidebar
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
