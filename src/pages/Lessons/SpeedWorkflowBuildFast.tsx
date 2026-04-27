import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";

export const LESSON_SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "templates", label: "Use Templates" },
  { id: "sections", label: "Sections Library" },
  { id: "styles", label: "Apply Styles Fast" },
  { id: "workflow", label: "Optimized Workflow" },
  { id: "result", label: "Result" },
];

export const lessonMeta = {
  slug: "speed-workflow-build-fast",
  title: "Speed Workflow: Build Pages in Minutes",
  order: 9,
  isLocked: true,
  category: "Core Skills",
  description: "Learn how to build pages extremely fast using FramerKit workflow.",
  excerpt: "Master the speed workflow and complete projects in record time.",
  readTime: "6 min",
  image: "https://via.placeholder.com/1280x720?text=Speed+Workflow",
  videoPlanned: true,
  seoIntent: "build website fast framer, framerkit workflow speed, fast landing page design",
};

type SpeedWorkflowBuildFastProps = { onSectionChange: (sectionId: string) => void };

export default function SpeedWorkflowBuildFast({ onSectionChange }: SpeedWorkflowBuildFastProps) {
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
          <p className="docs-text">One of the biggest advantages of FramerKit is speed. Instead of building layouts from scratch, you can assemble full pages in minutes.</p>
        </div>
      </section>

      <section id="templates" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Use Templates</h2>
          <p className="docs-subtitle">Start with a complete foundation.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Choose a template</li>
            <li>Customize in minutes</li>
            <li>Skip hours of work</li>
          </ol>
        </div>
      </section>

      <section id="sections" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Sections Library</h2>
          <p className="docs-subtitle">Drag and drop pre-built sections.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/sections-library.jpg" alt="Sections library" caption="Sections library" />
          <ol className="resource-ordered-list">
            <li>Browse by category</li>
            <li>One-click add</li>
            <li>Mix and match</li>
          </ol>
        </div>
      </section>

      <section id="styles" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Apply Styles Fast</h2>
          <p className="docs-subtitle">Color sets and text styles.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/apply-styles.jpg" alt="Apply styles" caption="Apply styles" />
          <ol className="resource-ordered-list">
            <li>Apply color set</li>
            <li>Apply text styles</li>
            <li>Done in seconds</li>
          </ol>
        </div>
      </section>

      <section id="workflow" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Optimized Workflow</h2>
          <p className="docs-subtitle">Work smarter, not harder.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Plan structure first</li>
            <li>Add sections</li>
            <li>Apply styles</li>
            <li>Edit content</li>
          </ol>
        </div>
      </section>

      <section id="result" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Result</h2>
          <p className="docs-subtitle">Complete pages in minutes, not hours.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/fast-result.jpg" alt="Fast result" caption="Fast result" />
          <p className="docs-text">With the speed workflow, you can deliver more projects in less time.</p>
        </div>
      </section>

      <div className="lesson-navigation">
        <div className="lesson-progress">Lesson {lessonMeta.order} / 24</div>
        <div className="lesson-nav-buttons">
          <Link to="/learn/lessons/common-mistakes-framer" className="lesson-nav-button">← Common Mistakes</Link>
          <Link to="/learn/lessons/wireframe-design-dark-modes" className="lesson-nav-button next">Wireframe & Design →</Link>
        </div>
      </div>
    </div>
  );
}
