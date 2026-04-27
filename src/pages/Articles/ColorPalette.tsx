import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";

// TOC sections for this article
export const ARTICLE_SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "sets-vs-palette", label: "Color Sets vs Color Palette" },
  { id: "how-work", label: "How Color Palettes Work" },
  { id: "choosing", label: "Choosing a Palette" },
  { id: "applying", label: "Applying Colors" },
  { id: "best-practices", label: "Best Practices" },
];

// Article metadata
export const articleMeta = {
  slug: "color-palette-in-framerkit",
  title: "Color Palette in FramerKit",
  category: "Design System",
  description: "Use structured color palettes in FramerKit to build flexible and scalable design systems.",
  excerpt: "Learn how to use color palettes in FramerKit for full control over your design system.",
  readTime: "6 min",
  image: "https://via.placeholder.com/1280x720?text=Color+Palette+in+FramerKit",
  seoIntent: "framer color palette, design system colors framer, ui color system",
};

type ColorPaletteProps = {
  onSectionChange: (sectionId: string) => void;
};

export default function ColorPalette({ onSectionChange }: ColorPaletteProps) {
  const location = useLocation();
  const onSectionChangeRef = useRef(onSectionChange);
  const suppressSidebarUntilRef = useRef(0);

  useEffect(() => {
    onSectionChangeRef.current = onSectionChange;
  }, [onSectionChange]);

  // Hash scroll
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (!hash) return;

    const el = document.getElementById(hash);
    if (el) {
      suppressSidebarUntilRef.current = Date.now() + 900;
      el.scrollIntoView({ behavior: "auto", block: "start" });
      onSectionChangeRef.current(hash);
    }
  }, [location]);

  // Intersection Observer for sidebar highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < suppressSidebarUntilRef.current) return;

        const visible = entries.find((e) => e.isIntersecting);
        if (visible) {
          onSectionChangeRef.current(visible.target.id);
        }
      },
      {
        root: null,
        threshold: 0.2,
        rootMargin: "-20% 0px -20% 0px",
      }
    );

    ARTICLE_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-docs-layout">
      <SEO
        title={articleMeta.title}
        description={articleMeta.description}
        keywords={articleMeta.seoIntent}
        canonical={`https://www.framerkit.site/learn/articles/${articleMeta.slug}`}
      />

      <section id="intro" className="docs-overview">
        <div className="docs-header">
          <nav className="component-breadcrumb">
            <Link to="/learn/articles" className="breadcrumb-link">
              Articles
            </Link>
            <span className="breadcrumb-separator">›</span>
            <Link to="/learn/articles#article-design-system" className="breadcrumb-link">
              Design System
            </Link>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">{articleMeta.title}</span>
          </nav>

          <h1 className="docs-title">{articleMeta.title}</h1>
          <p className="docs-subtitle">{articleMeta.description}</p>
        </div>

        <div className="docs-content-block" style={{ marginTop: "24px" }}>
          <ImageFrame
            src={articleMeta.image}
            alt={articleMeta.title}
            caption="Article cover"
          />
        </div>

        <div className="docs-content-block">
          <p className="docs-text">
            Color Palette in FramerKit gives you full control over your color system by organizing colors into structured scales. 
            Instead of using random colors across your project, you work with predictable shades that make your design consistent and scalable.
          </p>
        </div>
      </section>

      <section id="sets-vs-palette" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Color Sets vs Color Palette</h2>
          <p className="docs-subtitle">
            FramerKit provides two different ways to work with colors.
          </p>
        </div>

        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Color Sets — ready-made themed color combinations</li>
            <li>Color Palette — structured color system with shades</li>
          </ol>

          <p className="docs-text">
            Use Color Sets when you want speed. Use Color Palette when you want control.
          </p>
        </div>
      </section>

      <section id="how-work" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">How Color Palettes Work</h2>
          <p className="docs-subtitle">
            Each color in the palette is divided into multiple shades, from light to dark.
          </p>
        </div>

        <div className="docs-content-block">
          <ImageFrame
            src="/images/articles/color-palette-shades.jpg"
            alt="Color palette with shades"
            caption="Color palette with multiple shades per color"
          />

          <ol className="resource-ordered-list">
            <li>Lighter tones for backgrounds</li>
            <li>Medium tones for UI elements</li>
            <li>Darker tones for text and contrast</li>
          </ol>

          <p className="docs-text">
            This structure helps you avoid random color usage and keeps your UI visually balanced.
          </p>
        </div>
      </section>

      <section id="choosing" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Choosing a Palette</h2>
          <p className="docs-subtitle">
            FramerKit includes multiple palette systems you can switch between.
          </p>
        </div>

        <div className="docs-content-block">
          <ImageFrame
            src="/images/articles/palette-dropdown.jpg"
            alt="Palette dropdown"
            caption="Dropdown with multiple palette options"
          />

          <ol className="resource-ordered-list">
            <li>Default palette</li>
            <li>Apple-inspired palette</li>
            <li>Material-style palette</li>
          </ol>

          <p className="docs-text">
            Each palette is built with different design philosophies, so you can choose what fits your project best.
          </p>
        </div>
      </section>

      <section id="applying" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Applying Colors to Your Project</h2>
          <p className="docs-subtitle">
            You can apply all colors at once directly from the plugin.
          </p>
        </div>

        <div className="docs-content-block">
          <ImageFrame
            src="/images/articles/add-all-colors.jpg"
            alt="Add All button"
            caption="Add All button for color palette"
          />

          <ol className="resource-ordered-list">
            <li>Select a palette</li>
            <li>Click &quot;Add All&quot;</li>
            <li>Colors are added to your Framer styles</li>
          </ol>

          <ImageFrame
            src="/images/articles/framer-color-panel.jpg"
            alt="Framer color panel"
            caption="Framer color styles panel"
          />

          <p className="docs-text">
            After applying, all colors become reusable styles across your project.
          </p>
        </div>
      </section>

      <section id="best-practices" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Best Practices</h2>
        </div>

        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Use lighter shades for backgrounds</li>
            <li>Use mid tones for UI components</li>
            <li>Use dark tones for text and contrast</li>
            <li>Avoid mixing unrelated palettes</li>
          </ol>

          <p className="docs-text">
            A structured palette makes your design easier to maintain and scale.
          </p>

          <p className="docs-text">
            Color Palette in FramerKit is built to give you flexibility without losing consistency, 
            so you can design faster while keeping full control.
          </p>
        </div>
      </section>
    </div>
  );
}
