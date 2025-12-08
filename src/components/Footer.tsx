// src/components/Footer.tsx
import { useNavigate, useLocation } from "react-router-dom";
import { InstagramLogo, YoutubeLogo, TiktokLogo, TwitterLogo } from "phosphor-react";
import "../App.css";

export default function Footer({
  activeSection,
  onSectionChange,
}: {
  activeSection: string;
  onSectionChange: (id: string) => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();

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

  // === Исправленный обработчик клика
  const handleClick = (id: string, basePath?: string) => {
    if (basePath) {
      // Для подстраниц: навигация без вызова onSectionChange
      navigate(`/${basePath}/${id}`);
      return;
    }

    // Для главной страницы
    onSectionChange(id);
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const renderLinks = (list: { id: string; label: string }[], basePath?: string) =>
    list.map(({ id, label }) => (
      <a
        key={id}
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleClick(id, basePath);
        }}
        className={activeSection === id ? "active-footer-link" : ""}
      >
        {label}
      </a>
    ));

  return (
    <footer className="footer">
      <div className="footer-grid">
     
        <div className="footer-col">
          <h4 className="footer-title">Layout Sections</h4>
          {renderLinks(layoutSections, "layout")}
        </div>

        <div className="footer-col">
          <h4 className="footer-title">UI Components</h4>
          {renderLinks(componentSections, "components")}
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Templates</h4>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/templates/framerkitdaily");
            }}
          >
            Framer Kit Daily
          </a>
        </div>

        <div className="footer-col">
          <h4 className="footer-title">Social</h4>
          <div className="footer-socials">
            <a href="https://x.com/framer_kit" target="_blank" rel="noopener noreferrer">
              <TwitterLogo size={20} />
            </a>
            <a href="https://www.instagram.com/framer.kit/" target="_blank" rel="noopener noreferrer">
              <InstagramLogo size={20} />
            </a>
            <a href="https://www.youtube.com/@framerkit_plugin" target="_blank" rel="noopener noreferrer">
              <YoutubeLogo size={20} />
            </a>
            <a href="https://www.tiktok.com/@framer_plugin" target="_blank" rel="noopener noreferrer">
              <TiktokLogo size={20} />
            </a>
          </div>
        </div>
      </div>

   
    </footer>
  );
}