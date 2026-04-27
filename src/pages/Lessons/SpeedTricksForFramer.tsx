import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";

export const LESSON_SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "keyboard", label: "Keyboard Shortcuts" },
  { id: "reusable", label: "Reusable Elements" },
  { id: "batch", label: "Batch Your Work" },
  { id: "plugin", label: "Use the Plugin" },
  { id: "result", label: "Result" },
];

export const lessonMeta = {
  slug: "speed-tricks-for-framer",
  title: "Speed Tricks for Framer",
  order: 16,
  isLocked: true,
  category: "Freelance & Money",
  description: "Learn simple tricks that help you build pages much faster in Framer.",
  excerpt: "Speed up your workflow by removing unnecessary steps and using smart habits.",
  readTime: "6 min",
  image: "https://via.placeholder.com/1280x720?text=Speed+Tricks",
  videoPlanned: true,
  seoIntent: "framer speed tips, design faster framer, workflow optimization framer",
};

type SpeedTricksForFramerProps = { onSectionChange: (sectionId: string) => void };

export default function SpeedTricksForFramer({ onSectionChange }: SpeedTricksForFramerProps) {
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
            <Link to="/learn/lessons#lesson-freelance-money" className="breadcrumb-link">Freelance &amp; Money</Link>
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
          <p className="docs-text">Speed is one of the biggest advantages of working with FramerKit. Small changes in your workflow can save hours of work.</p>
        </div>
      </section>

      <section id="keyboard" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Keyboard Shortcuts</h2>
          <p className="docs-subtitle">Learn the shortcuts that matter.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Copy/Paste styles</li>
            <li>Duplicate elements</li>
            <li>Quick navigation</li>
          </ol>
        </div>
      </section>

      <section id="reusable" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Reusable Elements</h2>
          <p className="docs-subtitle">Don&apos;t rebuild what you already built.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/reusable-elements.jpg" alt="Reusable elements" caption="Reusable elements" />
          <ol className="resource-ordered-list">
            <li>Save components</li>
            <li>Reuse across pages</li>
            <li>Maintain consistency</li>
          </ol>
        </div>
      </section>

      <section id="batch" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Batch Your Work</h2>
          <p className="docs-subtitle">Group similar tasks together.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/batch-work.jpg" alt="Batch work" caption="Batch work" />
          <ol className="resource-ordered-list">
            <li>Do all images at once</li>
            <li>Apply all styles at once</li>
            <li>Edit all text at once</li>
          </ol>
        </div>
      </section>

      <section id="plugin" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Use the Plugin</h2>
          <p className="docs-subtitle">FramerKit plugin saves even more time.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>One-click sections</li>
            <li>Instant color sets</li>
            <li>Quick text styles</li>
          </ol>
        </div>
      </section>

      <section id="result" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Result</h2>
          <p className="docs-subtitle">You finish projects faster and take on more work.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/faster-workflow.jpg" alt="Faster workflow" caption="Faster workflow" />
          <p className="docs-text">Small time savings add up to huge productivity gains over multiple projects.</p>
        </div>
      </section>

      <div className="lesson-navigation">
        <div className="lesson-progress">Lesson {lessonMeta.order} / 24</div>
        <div className="lesson-nav-buttons">
          <Link to="/learn/lessons/build-one-page-website" className="lesson-nav-button">← Build One Page</Link>
          <Link to="/learn/lessons/framerkit-for-freelance" className="lesson-nav-button next">FramerKit for Freelance →</Link>
        </div>
      </div>
    </div>
  );
}
