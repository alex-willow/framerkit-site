import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";
import HoverVideo from "../../components/HoverVideo";

// TOC sections for this article
export const ARTICLE_SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "what-are", label: "What are Color Sets?" },
  { id: "example", label: "Example" },
  { id: "why-matter", label: "Why Color Sets Matter" },
  { id: "how-add", label: "How to Add Color Sets" },
];

// Article metadata
export const articleMeta = {
  slug: "color-sets-in-framerkit",
  title: "Color Sets in FramerKit",
  category: "Design System",
  description: "Use ready-made color sets in FramerKit to keep your design consistent and apply a full color system in seconds.",
  excerpt: "Learn how to use Color Sets in FramerKit, why they matter, and how to add them through the plugin inside Framer.",
  readTime: "5 min",
  image: "https://via.placeholder.com/1280x720?text=Color+Sets+in+FramerKit",
  seoIntent: "framer color system, framerkit color sets, framer plugin colors, ui color palette",
};

type ColorSetsProps = {
  onSectionChange: (sectionId: string) => void;
};

export default function ColorSets({ onSectionChange }: ColorSetsProps) {
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
            Design without a clear color system quickly becomes inconsistent. You start with one color, 
            add another, then a third — and the page loses visual balance.
          </p>

          <p className="docs-text">
            FramerKit solves this with <strong>ready-made Color Sets</strong> that you can apply instantly. 
            Instead of manually picking colors, you start with a complete system.
          </p>
        </div>
      </section>

      <section id="what-are" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">What are Color Sets?</h2>
          <p className="docs-subtitle">
            Color Sets are pre-built palettes where all colors are already designed to work together.
          </p>
        </div>

        <div className="docs-content-block">
          <ImageFrame
            src="/images/articles/color-sets-list.jpg"
            alt="Color Sets in FramerKit"
            caption="Available Color Sets in the plugin"
          />

          <p className="docs-text">
            Each set includes primary colors, secondary tones, background colors, and accents.
          </p>
        </div>
      </section>

      <section id="example" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Example</h2>
          <p className="docs-subtitle">
            A set like <strong>Oceanic Cactus</strong> gives you everything needed for a full page.
          </p>
        </div>

        <div className="docs-content-block">
          <ImageFrame
            src="/images/articles/oceanic-cactus.jpg"
            alt="Oceanic Cactus Color Set"
            caption="Oceanic Cactus color set example"
          />

          <p className="docs-text">
            Dark base, mid tones, light backgrounds, and an accent color — all working together.
          </p>
        </div>
      </section>

      <section id="why-matter" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Why Color Sets Matter</h2>
          <p className="docs-subtitle">
            Using random colors creates inconsistent UI, poor readability, and messy layouts.
          </p>
        </div>

        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li><strong>Consistency</strong> — all sections look like one system</li>
            <li><strong>Speed</strong> — no need to choose colors manually</li>
            <li><strong>Better design</strong> — you use a proven palette instead of guessing</li>
          </ol>

          <p className="docs-text">
            With Color Sets you get consistency, speed, and better design decisions.
          </p>
        </div>
      </section>

      <section id="how-add" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">How to Add Color Sets in Framer</h2>
          <p className="docs-subtitle">
            Open your project in Framer and launch the FramerKit plugin.
          </p>
        </div>

        <div className="docs-content-block">
          <p className="docs-text">
            Then go to <strong>Styles → Color Sets</strong>, choose any palette, and click <strong>Add All</strong>. 
            All colors will be added to your project as styles.
          </p>

          <HoverVideo
            src="/videos/add-color-sets.mp4"
            caption="Watch how to add Color Sets in seconds"
          />

          <p className="docs-text">
            After applying, all colors become reusable styles across your project.
          </p>
        </div>
      </section>
    </div>
  );
}
