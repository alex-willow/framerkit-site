import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import SEO from "../components/SEO";
import AdminCreateSectionCard from "../components/AdminCreateSectionCard";
import RandomTemplateCards from "../components/RandomTemplateCards";
type TemplatesPageProps = {
  theme: "light" | "dark";
  isAdmin: boolean;
};

export default function TemplatesPage({ isAdmin }: TemplatesPageProps) {
  const [filter, setFilter] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ theme?: "light" | "dark" } | "light" | "dark">;
      const nextTheme =
        typeof customEvent.detail === "string"
          ? customEvent.detail
          : customEvent.detail?.theme;

      if (nextTheme === "light" || nextTheme === "dark") {
        setFilter(nextTheme);
      }
    };

    window.addEventListener("framerkit-theme-change", handleThemeChange as EventListener);

    return () => {
      window.removeEventListener("framerkit-theme-change", handleThemeChange as EventListener);
    };
  }, []);

  return (
    <div className="layout-catalog-page">
      <SEO
        title="Templates"
        description="Browse FramerKit templates and open full-page starters ready for production."
        keywords="framer templates, framerkit templates, website starter templates"
        canonical="https://www.framerkit.site/templates"
      />

      <div className="component-page-header">
        <nav className="component-breadcrumb">
          <span className="breadcrumb-current">Templates</span>
        </nav>
        <h2 className="component-page-title">Templates</h2>
        <p className="component-page-description">
          Ready-made full-page starters. Choose a template and open it as a base for your next project.
        </p>
      </div>

      <SectionHeader
        title="Templates"
        filter={filter}
        onFilterChange={setFilter}
        loading={false}
        hideTitle={true}
        hideThemeSwitcher={true}
        hideWireframeToggle={true}
        renderMetaBelow={true}
      />

      <div className="gallery-scroll-area layout-catalog-scroll-area">
        <div className="gallery layout-catalog-grid">
          <AdminCreateSectionCard group="templates" theme={filter} isAdmin={isAdmin} />
          <RandomTemplateCards theme={filter} isAdmin={isAdmin} />
        </div>
      </div>
    </div>
  );
}
