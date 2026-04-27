import { useEffect, useState } from "react";
import RandomComponentCards from "../components/RandomComponentCards";
import RandomComponentCardsDark from "../components/RandomComponentCardsDark";
import SectionHeader from "../components/SectionHeader";
import SEO from "../components/SEO";
import AdminCreateSectionCard from "../components/AdminCreateSectionCard";

type ComponentPageProps = {
  theme: "light" | "dark";
  isAdmin: boolean;
};

export default function ComponentPage({ isAdmin }: ComponentPageProps) {
  const [filter, setFilter] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      setFilter(saved);
    }

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
        title="UI Components"
        description="Explore FramerKit UI components and pick ready-to-use blocks for faster page building."
        keywords="framer ui components, framerkit components, button card input accordion"
        canonical="https://www.framerkit.site/components"
      />
      <div className="component-page-header">
        <nav className="component-breadcrumb">
          <span className="breadcrumb-current">UI Components</span>
        </nav>
        <h2 className="component-page-title">UI Components</h2>
        <p className="component-page-description">
          A practical library of reusable UI blocks. Start with the component you need, adapt the content
          and style, and keep one consistent system across your whole site.
        </p>
      </div>

      <SectionHeader
        title="UI Components"
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
          <AdminCreateSectionCard group="components" theme={filter} isAdmin={isAdmin} />
          {filter === "dark" ? (
            <RandomComponentCardsDark isAdmin={isAdmin} />
          ) : (
            <RandomComponentCards theme={filter} isAdmin={isAdmin} />
          )}
        </div>
      </div>
    </div>
  );
}
