import { useNavigate, useLocation } from "react-router-dom";

type SidebarProps = {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  isMobile: boolean;
  isMenuOpen: boolean;
  onMenuClose: () => void;
};

export default function Sidebar({
  activeSection,
  onSectionChange,
  isMobile,
  isMenuOpen,
  onMenuClose,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const homeSections = [
    { id: "overview", label: "Overview" },
    { id: "getting-started", label: "Getting Started" },
    { id: "installation", label: "Installation" },
    { id: "how-it-works", label: "How It Works" },
    { id: "get-framerkit", label: "Get FramerKit" },
  ];

  const layoutSections = [
    "navbar", "hero", "logo", "feature", "gallery",
    "testimonial", "contact", "pricing", "faq", "cta", "footer"
  ];

  const componentSections = [
    "accordion", "accordiongroup", "avatar", "avatargroup", "badge", "button",
    "card", "icon", "input", "form", "pricingcard", "rating", "testimonialcard"
  ];

  const handleHomeSectionClick = (id: string) => {
    // Обновляем активную секцию
    onSectionChange(id);
    onMenuClose();

    if (location.pathname !== "/") {
      // Переход на главную и скролл
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    } else {
      // Просто скроллим
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleOtherSectionClick = (section: string, basePath: string) => {
    onSectionChange(section);
    onMenuClose();
    navigate(`/${basePath}/${section}`);
  };

  const isActive = (id: string, basePath?: string): boolean => {
    if (location.pathname === "/") {
      // На главной — активна секция по id
      return activeSection === id;
    }
    // На других — активна по совпадению URL
    if (basePath) {
      return location.pathname === `/${basePath}/${id}`;
    }
    return location.pathname === `/${id}`;
  };

  const renderHomeItems = () =>
    homeSections.map(({ id, label }) => (
      <button
        key={id}
        className={`sidebar-item ${isActive(id) ? "active" : ""}`}
        onClick={() => handleHomeSectionClick(id)}
      >
        {label}
      </button>
    ));

  const renderSectionItems = (list: string[], basePath: string) =>
    list.map(id => (
      <button
        key={id}
        className={`sidebar-item ${isActive(id, basePath) ? "active" : ""}`}
        onClick={() => handleOtherSectionClick(id, basePath)}
      >
        {id
          .split("-")
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")}
      </button>
    ));

  const sidebarContent = (
    <>
      <div className="sidebar-header">Getting Started</div>
      {renderHomeItems()}

      <div className="sidebar-header" style={{ marginTop: 20 }}>Layout Section</div>
      {renderSectionItems(layoutSections, "layout")}

      <div className="sidebar-header" style={{ marginTop: 20 }}>Components</div>
      {renderSectionItems(componentSections, "components")}

      <div className="sidebar-header" style={{ marginTop: 20 }}>Templates</div>
      <button
        className="sidebar-item"
        onClick={() => {
          navigate("/templates/framerkitdaily");
          onMenuClose();
        }}
      >
        Framer Kit Daily
      </button>
    </>
  );

  if (isMobile) {
    return (
      <>
        {isMenuOpen && <div className="sidebar-overlay" onClick={onMenuClose} />}
        <nav className={`sidebar-mobile ${isMenuOpen ? "open" : ""}`}>
          {sidebarContent}
        </nav>
      </>
    );
  }

  return <nav className="sidebar">{sidebarContent}</nav>;
}