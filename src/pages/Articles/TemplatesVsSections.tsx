import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";

// TOC sections for this article
export const ARTICLE_SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "what-are-sections", label: "What are Sections?" },
  { id: "what-are-templates", label: "What are Templates?" },
  { id: "when-use-sections", label: "When to Use Sections" },
  { id: "when-use-templates", label: "When to Use Templates" },
  { id: "best-workflow", label: "Best Workflow" },
];

// Article metadata
export const articleMeta = {
  slug: "templates-vs-sections-framerkit",
  title: "Templates vs Sections in FramerKit",
  category: "Workflow",
  description: "Understand when to use templates and when to use sections in FramerKit.",
  excerpt: "Learn the difference between templates and sections and how to use both effectively.",
  readTime: "6 min",
  image: "https://via.placeholder.com/1280x720?text=Templates+vs+Sections",
  seoIntent: "framer templates vs sections, framerkit templates, website structure framer",
};

type TemplatesVsSectionsProps = {
  onSectionChange: (sectionId: string) => void;
};

export default function TemplatesVsSections({ onSectionChange }: TemplatesVsSectionsProps) {
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
            <Link to="/learn/articles#article-workflow" className="breadcrumb-link">
              Workflow
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
            FramerKit gives you two ways to build pages: using Sections or using Templates. 
            Understanding the difference between them helps you work faster and choose the right approach for each project.
          </p>
        </div>
      </section>

      <section id="what-are-sections" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">What are Sections?</h2>
          <p className="docs-subtitle">
            Sections are individual building blocks of a page.
          </p>
        </div>

        <div className="docs-content-block">
          <ImageFrame
            src="/images/articles/library-sections.jpg"
            alt="Library with sections"
            caption="Library with sections (Hero, Feature, CTA)"
          />

          <ol className="resource-ordered-list">
            <li>Hero sections</li>
            <li>Feature sections</li>
            <li>CTA blocks</li>
            <li>Footers and navigation</li>
          </ol>

          <p className="docs-text">
            You combine sections together to build a full page step by step.
          </p>
        </div>
      </section>

      <section id="what-are-templates" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">What are Templates?</h2>
          <p className="docs-subtitle">
            Templates are complete page structures built from multiple sections.
          </p>
        </div>

        <div className="docs-content-block">
          <ImageFrame
            src="/images/articles/template-preview.jpg"
            alt="Template preview"
            caption="Template preview page"
          />

          <ol className="resource-ordered-list">
            <li>Full landing pages</li>
            <li>Pre-arranged section flow</li>
            <li>Ready-to-use layouts</li>
          </ol>

          <p className="docs-text">
            Instead of building from scratch, you start with a full structure and customize it.
          </p>
        </div>
      </section>

      <section id="when-use-sections" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">When to Use Sections</h2>
        </div>

        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>When you want full control over layout</li>
            <li>When building custom pages</li>
            <li>When experimenting with structure</li>
          </ol>

          <p className="docs-text">
            Sections are flexible and perfect for building unique designs.
          </p>
        </div>
      </section>

      <section id="when-use-templates" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">When to Use Templates</h2>
        </div>

        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>When you want to build quickly</li>
            <li>When you need a proven layout</li>
            <li>When you don&apos;t want to think about structure</li>
          </ol>

          <p className="docs-text">
            Templates are ideal for fast results and ready-made page flows.
          </p>
        </div>
      </section>

      <section id="best-workflow" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Best Workflow</h2>
          <p className="docs-subtitle">
            The best way to use FramerKit is to combine both approaches.
          </p>
        </div>

        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Start with a template for structure</li>
            <li>Replace sections if needed</li>
            <li>Customize content and styles</li>
          </ol>

          <p className="docs-text">
            This gives you both speed and flexibility.
          </p>

          <p className="docs-text">
            Sections give you flexibility. Templates give you speed. Together, they create a powerful workflow inside FramerKit.
          </p>
        </div>
      </section>
    </div>
  );
}
