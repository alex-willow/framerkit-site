import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";

// TOC sections for this article
export const ARTICLE_SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "why-matter", label: "Why Text Styles Matter" },
  { id: "what-you-get", label: "What You Get" },
  { id: "choosing-fonts", label: "Choosing Fonts" },
  { id: "font-weight", label: "Adjusting Font Weight" },
  { id: "applying", label: "Apply Styles" },
  { id: "best-practices", label: "Best Practices" },
];

// Article metadata
export const articleMeta = {
  slug: "text-styles-in-framerkit",
  title: "Text Styles in FramerKit",
  category: "Design System",
  description: "Create consistent typography using FramerKit text styles system.",
  excerpt: "Learn how to use text styles in FramerKit to build clean and scalable typography.",
  readTime: "6 min",
  image: "https://via.placeholder.com/1280x720?text=Text+Styles+in+FramerKit",
  seoIntent: "framer text styles, typography system framer, framer fonts setup",
};

type TextStylesProps = {
  onSectionChange: (sectionId: string) => void;
};

export default function TextStyles({ onSectionChange }: TextStylesProps) {
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
            Text Styles in FramerKit help you build consistent typography across your entire website 
            without manually adjusting every text layer. Instead of changing font size, weight, and spacing 
            over and over again, you define a system once and reuse it everywhere.
          </p>
        </div>
      </section>

      <section id="why-matter" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Why Text Styles Matter</h2>
          <p className="docs-subtitle">
            Typography is one of the most important parts of any website.
          </p>
        </div>

        <div className="docs-content-block">
          <p className="docs-text">
            Without a clear system, pages quickly become inconsistent and harder to read. 
            Text Styles solve this by creating a structured hierarchy that keeps your design predictable and easy to scale.
          </p>

          <ol className="resource-ordered-list">
            <li>Consistent heading sizes across all pages</li>
            <li>Balanced spacing and readability</li>
            <li>Faster editing when updating fonts or styles</li>
            <li>Clean and professional visual hierarchy</li>
          </ol>
        </div>
      </section>

      <section id="what-you-get" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">What You Get in FramerKit</h2>
          <p className="docs-subtitle">
            FramerKit provides a ready-to-use typography system.
          </p>
        </div>

        <div className="docs-content-block">
          <ImageFrame
            src="/images/articles/text-styles-panel.jpg"
            alt="Text Styles panel"
            caption="Text Styles panel with H1–H6 and Body preview"
          />

          <ol className="resource-ordered-list">
            <li>H1 — main page heading</li>
            <li>H2 — section titles</li>
            <li>H3–H6 — supporting hierarchy</li>
            <li>Body — main readable text</li>
          </ol>

          <p className="docs-text">
            Each style already includes size, line height, and spacing tuned for responsive layouts.
          </p>
        </div>
      </section>

      <section id="choosing-fonts" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Choosing Fonts</h2>
          <p className="docs-subtitle">
            You can quickly change typography by selecting fonts for headings and body text.
          </p>
        </div>

        <div className="docs-content-block">
          <ImageFrame
            src="/images/articles/font-dropdown.jpg"
            alt="Font dropdown"
            caption="Font dropdown with different font options"
          />

          <ol className="resource-ordered-list">
            <li>Choose a font for headings for stronger visual identity</li>
            <li>Choose a font for body for better readability</li>
            <li>Mix styles carefully to keep visual balance</li>
          </ol>
        </div>
      </section>

      <section id="font-weight" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Adjusting Font Weight</h2>
          <p className="docs-subtitle">
            Font weight controls how strong or subtle your text appears.
          </p>
        </div>

        <div className="docs-content-block">
          <ImageFrame
            src="/images/articles/font-weight-dropdown.jpg"
            alt="Font weight dropdown"
            caption="Font weight dropdown from Thin to Bold"
          />

          <ol className="resource-ordered-list">
            <li>Use Bold for headings to create contrast</li>
            <li>Use Regular for body text for readability</li>
            <li>Avoid too many different weights in one layout</li>
          </ol>
        </div>
      </section>

      <section id="applying" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Apply Styles to Your Project</h2>
          <p className="docs-subtitle">
            Once you are happy with your typography setup, you can apply everything instantly.
          </p>
        </div>

        <div className="docs-content-block">
          <ImageFrame
            src="/images/articles/update-text-styles.jpg"
            alt="Update All Text Styles"
            caption="Update All Text Styles button"
          />

          <ol className="resource-ordered-list">
            <li>Click Update All Text Styles</li>
            <li>All text styles are added to your Framer project</li>
            <li>They appear in the Styles panel inside Framer</li>
          </ol>

          <ImageFrame
            src="/images/articles/framer-styles-panel.jpg"
            alt="Framer Styles panel"
            caption="Framer Styles panel with applied text styles"
          />
        </div>
      </section>

      <section id="best-practices" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Best Practices</h2>
        </div>

        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Stick to one heading font and one body font</li>
            <li>Keep a clear size hierarchy from H1 to H6</li>
            <li>Avoid random font overrides inside sections</li>
            <li>Always test readability on mobile</li>
          </ol>

          <p className="docs-text">
            Text Styles in FramerKit are designed to remove repetitive work and give you a clean, scalable foundation for any project.
          </p>
        </div>
      </section>
    </div>
  );
}
