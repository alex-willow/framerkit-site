// src/components/MobileMenuContent.tsx
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp, LogOut } from "lucide-react";
import { useState } from "react";

type MobileMenuContentProps = {
  activeSection: string;
  onSectionChange: (id: string) => void;
  onMenuClose: () => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
  onSignInOpen?: () => void;
  onGetAccess?: () => void;
};

export default function MobileMenuContent({
  activeSection,
  onSectionChange,
  onMenuClose,
  isAuthenticated,
  onLogout,
  onSignInOpen,
  onGetAccess,
}: MobileMenuContentProps) {
  const location = useLocation();
  const [layoutOpen, setLayoutOpen] = useState(false);
  const [componentsOpen, setComponentsOpen] = useState(false);

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
    { id: "button", label: "Button" },
    { id: "card", label: "Card" },
    { id: "input", label: "Input" },
    // ... добавь остальные по необходимости
  ];

  const handleSectionClick = (id: string, basePath?: string) => {
    onSectionChange(id);
    onMenuClose();
    if (basePath) {
      // Навигация на страницу компонента (обработает роутер)
    } else if (location.pathname === "/") {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const CollapsibleItem = ({ title, open, setOpen, children }: any) => (
    <div className="collapsible-item" style={{ marginBottom: "8px" }}>
      <button 
        className="collapsible-header"
        onClick={() => setOpen(!open)}
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          width: "100%",
          padding: "12px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--framer-color-text)",
          fontWeight: 600,
          textAlign: "left"
        }}
      >
        <span>{title}</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className="collapsible-children" style={{ paddingLeft: "16px" }}>{children}</div>}
    </div>
  );

  return (
    <div className="mobile-menu-content-inner" style={{ padding: "20px" }}>
      {/* Logo */}
      <Link to="/" onClick={onMenuClose} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", textDecoration: "none", color: "inherit" }}>
        <img src="/Logo.png" alt="FramerKit" style={{ width: "32px", height: "32px" }} />
        <span style={{ fontWeight: 700 }}>FramerKit</span>
      </Link>

      {/* Getting Started */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontWeight: 600, marginBottom: "12px", color: "var(--framer-color-text-secondary)", fontSize: "12px", textTransform: "uppercase" }}>Getting Started</div>
        {homeSections.map(({ id, label }) => (
          <Link
            key={id}
            to={`/#${id}`}
            onClick={(e) => { e.preventDefault(); handleSectionClick(id); }}
            style={{
              display: "block",
              padding: "10px 0",
              textDecoration: "none",
              color: activeSection === id ? "#6E3FF3" : "var(--framer-color-text)",
              fontWeight: activeSection === id ? 600 : 500
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Layout Sections */}
      <CollapsibleItem title="Layout Sections" open={layoutOpen} setOpen={setLayoutOpen}>
        {layoutSections.map(({ id, label }) => (
          <Link
            key={id}
            to={`/layout/${id}`}
            onClick={() => { handleSectionClick(id, "layout"); }}
            style={{ display: "block", padding: "8px 0", textDecoration: "none", color: "var(--framer-color-text-secondary)" }}
          >
            {label}
          </Link>
        ))}
      </CollapsibleItem>

      {/* Components */}
      <CollapsibleItem title="Components" open={componentsOpen} setOpen={setComponentsOpen}>
        {componentSections.map(({ id, label }) => (
          <Link
            key={id}
            to={`/components/${id}`}
            onClick={() => { handleSectionClick(id, "components"); }}
            style={{ display: "block", padding: "8px 0", textDecoration: "none", color: "var(--framer-color-text-secondary)" }}
          >
            {label}
          </Link>
        ))}
      </CollapsibleItem>

      {/* Auth buttons */}
      <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid var(--framer-color-border)" }}>
        {isAuthenticated ? (
          <button className="btn-outline" onClick={() => { onLogout?.(); onMenuClose(); }} style={{ width: "100%", padding: "12px", background: "transparent", border: "1px solid var(--framer-color-border)", borderRadius: "8px", color: "var(--framer-color-text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <LogOut size={16} /> Log out
          </button>
        ) : (
          <>
            <button className="btn-outline" onClick={() => { onSignInOpen?.(); onMenuClose(); }} style={{ width: "100%", padding: "12px", marginBottom: "8px", background: "transparent", border: "1px solid var(--framer-color-border)", borderRadius: "8px", color: "var(--framer-color-text)", cursor: "pointer" }}>
              Log in
            </button>
            <button className="btn-primary" onClick={() => { onGetAccess?.(); onMenuClose(); }} style={{ width: "100%", padding: "12px", background: "#6E3FF3", border: "none", borderRadius: "8px", color: "white", fontWeight: 600, cursor: "pointer" }}>
              Get Full Access
            </button>
          </>
        )}
      </div>
    </div>
  );
}