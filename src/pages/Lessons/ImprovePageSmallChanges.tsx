import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";

export const LESSON_SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "spacing", label: "Fix Spacing" },
  { id: "typography", label: "Improve Typography" },
  { id: "hierarchy", label: "Visual Hierarchy" },
  { id: "details", label: "Small Details" },
  { id: "result", label: "Result" },
];

export const lessonMeta = {
  slug: "improve-page-small-changes",
  title: "Improve Your Page: Small Changes That Make a Big Difference",
  order: 7,
  isLocked: true,
  category: "Core Skills",
  description: "Learn how small improvements can make your page look more professional and polished.",
  excerpt: "Small tweaks that elevate your design quality significantly.",
  readTime: "7 min",
  image: "https://via.placeholder.com/1280x720?text=Improve+Page",
  videoPlanned: true,
  seoIntent: "improve web design, small design changes, page polish tips",
};

type ImprovePageSmallChangesProps = { onSectionChange: (sectionId: string) => void };

export default function ImprovePageSmallChanges({ onSectionChange }: ImprovePageSmallChangesProps) {
  const location = useLocation();
  const onSectionChangeRef = useRef(onSectionChange);
  const suppressSidebarUntilRef = useRef(0);

  useEffect(() => { onSectionChangeRef.current = onSectionChange; }, [onSectionChange]);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < suppressSidebarUntilRef.current) return;
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) onSectionChangeRef.current(visible.target.id);
      },
      { root: null, threshold: 0.2, rootMargin: "-20% 0px -20% 0px" }
    );
    LESSON_SECTIONS.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-docs-layout">
      <SEO title={lessonMeta.title} description={lessonMeta.description} keywords={lessonMeta.seoIntent} canonical={`https://www.framerkit.site/learn/lessons/${lessonMeta.slug}`} />
      <section id="intro" className="docs-overview">
        <div className="docs-header">
          <nav className="component-breadcrumb">
            <Link to="/learn/lessons" className="breadcrumb-link">Lessons</Link>
            <span className="breadcrumb-separator">›</span>
            <Link to="/learn/lessons#lesson-core-skills" className="breadcrumb-link">Core Skills</Link>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">{lessonMeta.title}</span>
          </nav>
          <h1 className="docs-title">{lessonMeta.title}</h1>
          <p className="docs-subtitle">{lessonMeta.description}</p>
        </div>
        <div className="docs-content-block" style={{ marginTop: "24px" }}>
          <ImageFrame
            src={lessonMeta.image}
            alt={lessonMeta.title}
            caption="Lesson cover"
          />
        </div>
        <div className="docs-content-block">
          <p className="docs-text">You don&apos;t always need big changes to improve a page. Often, small adjustments make the biggest difference in how professional your design looks.</p>
        </div>
      </section>

      <section id="spacing" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Fix Spacing</h2>
          <p className="docs-subtitle">Consistent spacing creates calm.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/spacing-fix.jpg" alt="Spacing fix" caption="Spacing fix" />
          <ol className="resource-ordered-list">
            <li>Equal margins</li>
            <li>Consistent padding</li>
            <li>Breathing room</li>
          </ol>
        </div>
      </section>

      <section id="typography" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Improve Typography</h2>
          <p className="docs-subtitle">Text should be easy to read.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Increase line height</li>
            <li>Adjust font sizes</li>
            <li>Limit font weights</li>
          </ol>
        </div>
      </section>

      <section id="hierarchy" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Visual Hierarchy</h2>
          <p className="docs-subtitle">Guide the eye.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/hierarchy.jpg" alt="Visual hierarchy" caption="Visual hierarchy" />
          <ol className="resource-ordered-list">
            <li>Headlines first</li>
            <li>Subheadlines second</li>
            <li>Body text last</li>
          </ol>
        </div>
      </section>

      <section id="details" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Small Details</h2>
          <p className="docs-subtitle">The finishing touches.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Button hover states</li>
            <li>Link underlines</li>
            <li>Image borders</li>
          </ol>
        </div>
      </section>

      <section id="result" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Result</h2>
          <p className="docs-subtitle">A more polished, professional page.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/improved-page.jpg" alt="Improved page" caption="Improved page" />
          <p className="docs-text">Small changes add up to a significantly better user experience.</p>
        </div>
      </section>

      <div className="lesson-navigation">
        <div className="lesson-progress">Lesson {lessonMeta.order} / 24</div>
        <div className="lesson-nav-buttons">
          <Link to="/learn/lessons/wireframe-design-dark-modes" className="lesson-nav-button">← Wireframe & Design</Link>
          <Link to="/learn/lessons/content-and-copy-sections" className="lesson-nav-button next">Content & Copy →</Link>
        </div>
      </div>
    </div>
  );
}
