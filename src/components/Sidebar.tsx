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

  // === Секции ===
  const homeSections = [
    { id: "overview", label: "Overview" },
    { id: "getting-started", label: "Getting Started" },
    { id: "layout-sections", label: "Layout Sections" },
    { id: "ui-components", label: "UI Cmponents" },
    { id: "get-framerkit", label: "Get Framerkit" },
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

  // === Обработчики ===
  const handleHomeSectionClick = (id: string) => {
    onSectionChange(id);
    onMenuClose();

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOtherSectionClick = (id: string, basePath: string) => {
    onSectionChange(id);
    onMenuClose();
    navigate(`/${basePath}/${id}`);
  };

  // === Проверка активности ===
  const isActive = (id: string, basePath?: string): boolean => {
    if (location.pathname === "/") {
      return activeSection === id;
    }
    if (basePath) {
      return location.pathname === `/${basePath}/${id}`;
    }
    return location.pathname === `/${id}`;
  };

  // === Рендер пунктов секции ===
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

  // === Содержимое сайдбара ===
  const sidebarContent = (
    <>
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

      <div className="sidebar-header" style={{ marginTop: 20 }}>
        Layout Section
      </div>
      {renderSectionItems(layoutSections, "layout")}

      <div className="sidebar-header" style={{ marginTop: 20 }}>
        Components
      </div>
      {renderSectionItems(componentSections, "components")}

      <div className="sidebar-header" style={{ marginTop: 20 }}>
        Templates
      </div>
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

  // === Мобильная версия ===
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

  // === Десктопная версия ===
  return <nav className="sidebar">{sidebarContent}</nav>;
}