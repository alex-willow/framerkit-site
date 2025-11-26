import { useNavigate, useLocation } from "react-router-dom";

type SidebarProps = {
  activeSection: string;
  onSectionChange: (section: string) => void;
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
  const location = useLocation(); // Получаем текущий путь из location

  // Список секций с путями и отображаемыми текстами
  const sectionsList = [
    { path: "overview", label: "Overview" },
    { path: "installation", label: "Installation" },
    { path: "how-it-works", label: "How It Works" },
    { path: "faq", label: "FAQ" },
  ];

  const layoutSectionsList = [
    { path: "navbar", label: "Navbar" },
    { path: "hero", label: "Hero" },
    { path: "logo", label: "Logo" },
    { path: "feature", label: "Feature" },
    { path: "gallery", label: "Gallery" },
    { path: "testimonial", label: "Testimonial" },
    { path: "contact", label: "Contact" },
    { path: "pricing", label: "Pricing" },
    { path: "cta", label: "CTA" },
    { path: "footer", label: "Footer" },
  ];

  const componentsList = [
    { path: "accordion", label: "Accordion" },
    { path: "accordiongroup", label: "Accordion Group" },
    { path: "avatar", label: "Avatar" },
    { path: "avatargroup", label: "Avatar Group" },
    { path: "badge", label: "Badge" },
    { path: "button", label: "Button" },
    { path: "card", label: "Card" },
    { path: "icon", label: "Icon" },
    { path: "input", label: "Input" },
    { path: "form", label: "Form" },
    { path: "pricingcard", label: "Pricing Card" },
    { path: "rating", label: "Rating" },
    { path: "testimonialcard", label: "Testimonial Card" },
  ];

  const templatesList = [
    { path: "templates/framerkitdaily", label: "Framer Kit Daily" },
  ];

  // Функция для обработки кликов по кнопкам
  const handleNavigation = (section: string) => {
    onSectionChange(section); // Обновляем активную секцию
    navigate(`/${section.toLowerCase().replace(/\s+/g, "-")}`); // Переход по маршруту
    onMenuClose();
  };

  // Функция для форматирования текста
  const formatText = (text: string) => {
    return text
      .replace(/\b\w/g, (char) => char.toUpperCase()) // Преобразуем первую букву каждого слова в заглавную
      .replace(/-/g, " "); // Заменяем дефисы на пробелы
  };

  // Проверка активной секции
  const isActive = (section: string) => {
    const path = `/${section.toLowerCase().replace(/\s+/g, "-")}`;
    return location.pathname === path ? "active" : ""; // Проверяем активность по пути
  };

  if (isMobile) {
    return (
      <>
        {isMenuOpen && (
          <div className="sidebar-overlay" onClick={onMenuClose}></div>
        )}
        <nav className={`sidebar-mobile ${isMenuOpen ? "open" : ""}`} aria-label="Main navigation">
          {/* Getting Started */}
          <div className="sidebar-header">Getting Started</div>
          {sectionsList.map((page) => (
            <button
              key={page.path}
              onClick={() => handleNavigation(page.path)}
              className={`sidebar-item ${isActive(page.path)}`}
            >
              {page.label}
            </button>
          ))}

          {/* Layout Section */}
          <div className="sidebar-header" style={{ marginTop: 20 }}>Layout Section</div>
          {layoutSectionsList.map((sec) => (
            <button
              key={sec.path}
              onClick={() => handleNavigation(`layout/${sec.path}`)}
              className={`sidebar-item ${isActive(`layout/${sec.path}`)}`}
            >
              {sec.label}
            </button>
          ))}

          {/* Components */}
          <div className="sidebar-header" style={{ marginTop: 20 }}>Components</div>
          {componentsList.map((comp) => (
            <button
              key={comp.path}
              onClick={() => handleNavigation(`components/${comp.path}`)}
              className={`sidebar-item ${isActive(`components/${comp.path}`)}`}
            >
              {comp.label}
            </button>
          ))}

          {/* Templates */}
          <div className="sidebar-header" style={{ marginTop: 20 }}>Templates</div>
          {templatesList.map((tpl) => (
            <button
              key={tpl.path}
              onClick={() => handleNavigation(tpl.path)}
              className={`sidebar-item ${isActive(tpl.path)}`}
            >
              {tpl.label}
            </button>
          ))}
        </nav>
      </>
    );
  }

  return (
    <nav className="sidebar" aria-label="Main navigation">
      {/* Getting Started */}
      <div className="sidebar-header">Getting Started</div>
      {sectionsList.map((page) => (
        <button
          key={page.path}
          onClick={() => handleNavigation(page.path)}
          className={`sidebar-item ${isActive(page.path)}`}
        >
          {page.label}
        </button>
      ))}

      {/* Layout Section */}
      <div className="sidebar-header" style={{ marginTop: 20 }}>Layout Section</div>
      {layoutSectionsList.map((sec) => (
        <button
          key={sec.path}
          onClick={() => handleNavigation(`layout/${sec.path}`)}
          className={`sidebar-item ${isActive(`layout/${sec.path}`)}`}
        >
          {sec.label}
        </button>
      ))}

      {/* Components */}
      <div className="sidebar-header" style={{ marginTop: 20 }}>Components</div>
      {componentsList.map((comp) => (
        <button
          key={comp.path}
          onClick={() => handleNavigation(`components/${comp.path}`)}
          className={`sidebar-item ${isActive(`components/${comp.path}`)}`}
        >
          {comp.label}
        </button>
      ))}

      {/* Templates */}
      <div className="sidebar-header" style={{ marginTop: 20 }}>Templates</div>
      {templatesList.map((tpl) => (
        <button
          key={tpl.path}
          onClick={() => handleNavigation(tpl.path)}
          className={`sidebar-item ${isActive(tpl.path)}`}
        >
          {tpl.label}
        </button>
      ))}
    </nav>
  );
}
