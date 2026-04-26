import { useEffect, useState } from "react";
import RandomSectionCards from "../components/RandomSectionCards";
import RandomSectionCardsDark from "../components/RandomSectionCardsDark";
import SectionHeader from "../components/SectionHeader";
import SEO from "../components/SEO";
import AdminCreateSectionCard from "../components/AdminCreateSectionCard";

type LayoutPageProps = {
  isAdmin: boolean;
};

export default function LayoutPage({ isAdmin }: LayoutPageProps) {
  const [filter, setFilter] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" ? "dark" : "light";
  });
  const [isWireframeMode, setIsWireframeMode] = useState(() => {
    try {
      const saved = localStorage.getItem("wireframeMode");
      return saved !== null ? saved === "true" : true;
    } catch {
      return true;
    }
  });
  const layoutCount = 11;

  useEffect(() => {
    try {
      localStorage.setItem("wireframeMode", isWireframeMode.toString());
    } catch (error) {
      console.warn("Failed to save wireframeMode to localStorage", error);
    }
  }, [isWireframeMode]);

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
        title="Layout Sections"
        description="Browse FramerKit layout sections in one place and choose the exact block variant you need."
        keywords="framer layout sections, framerkit layout, navbar hero footer sections"
        canonical="https://www.framerkit.site/layout"
      />

      {/* 🔥 Breadcrumb + Header */}
      <div className="component-page-header">
        <nav className="component-breadcrumb">
          <span className="breadcrumb-current">Layout Sections</span>
        </nav>
        <h2 className="component-page-title">Layout Sections</h2>
        <p className="component-page-description">
          Quick start: choose a section type, switch between Wireframe and Design, then copy and paste the
          exact variant you need. Both options are ready blocks, so you can pick by screenshot and insert
          the one that matches your page faster.
        </p>
      </div>

      <SectionHeader
        title="Layout Sections"
        count={layoutCount}
        filter={filter}
        onFilterChange={setFilter}
        loading={false}
        hideThemeSwitcher={true}
        isWireframeMode={isWireframeMode}
        onWireframeModeChange={setIsWireframeMode}
        hideWireframeToggle={false}
        hideTitle={true}
        renderMetaBelow={true}
        controlsAlign="left"
      />

      <div className="gallery-scroll-area layout-catalog-scroll-area">
        <div className="gallery layout-catalog-grid">
          <AdminCreateSectionCard group="layout" theme={filter} isAdmin={isAdmin} />
          {filter === "dark" ? (
            <RandomSectionCardsDark wireframeMode={isWireframeMode} isAdmin={isAdmin} />
          ) : (
            <RandomSectionCards
              wireframeMode={isWireframeMode}
              theme={filter}
              isAdmin={isAdmin}
            />
          )}
        </div>
      </div>
    </div>
  );
}
