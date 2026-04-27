import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";

export const LESSON_SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "wireframe", label: "Wireframe Version" },
  { id: "design", label: "Design Version" },
  { id: "dark", label: "Dark Mode" },
  { id: "choose", label: "How to Choose" },
  { id: "result", label: "Result" },
];

export const lessonMeta = {
  slug: "wireframe-design-dark-modes",
  title: "Wireframe, Design, Dark: Choose the Right Version",
  order: 8,
  isLocked: true,
  category: "Core Skills",
  description: "Learn how to choose between wireframe, design, and dark versions in FramerKit.",
  excerpt: "Understand when to use each version for different project stages.",
  readTime: "6 min",
  image: "https://via.placeholder.com/1280x720?text=Wireframe+Design+Dark",
  videoPlanned: true,
  seoIntent: "framer wireframe vs design, dark ui framerkit, section versions framer",
};

type WireframeDesignDarkModesProps = { onSectionChange: (sectionId: string) => void };

export default function WireframeDesignDarkModes({ onSectionChange }: WireframeDesignDarkModesProps) {
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
          <p className="docs-text">FramerKit sections come in three versions: wireframe, design, and dark. Each serves a different purpose in your workflow.</p>
        </div>
      </section>

      <section id="wireframe" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Wireframe Version</h2>
          <p className="docs-subtitle">Structure without styling.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/wireframe-version.jpg" alt="Wireframe version" caption="Wireframe version" />
          <ol className="resource-ordered-list">
            <li>Gray boxes and placeholders</li>
            <li>Focus on layout</li>
            <li>Quick iteration</li>
          </ol>
          <p className="docs-text">Use for: Early planning, client approval on structure</p>
        </div>
      </section>

      <section id="design" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Design Version</h2>
          <p className="docs-subtitle">Polished and ready.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/design-version.jpg" alt="Design version" caption="Design version" />
          <ol className="resource-ordered-list">
            <li>Full colors and typography</li>
            <li>Real images and content</li>
            <li>Production-ready</li>
          </ol>
          <p className="docs-text">Use for: Final designs, client presentations, live sites</p>
        </div>
      </section>

      <section id="dark" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Dark Mode</h2>
          <p className="docs-subtitle">Modern and sleek.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/dark-version.jpg" alt="Dark version" caption="Dark version" />
          <ol className="resource-ordered-list">
            <li>Dark background</li>
            <li>Light text</li>
            <li>High contrast</li>
          </ol>
          <p className="docs-text">Use for: Modern products, portfolios, tech companies</p>
        </div>
      </section>

      <section id="choose" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">How to Choose</h2>
          <p className="docs-subtitle">Match version to your stage.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Planning → Wireframe</li>
            <li>Final design → Design</li>
            <li>Modern look → Dark</li>
          </ol>
        </div>
      </section>

      <section id="result" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Result</h2>
          <p className="docs-subtitle">Right version for the right stage.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/version-result.jpg" alt="Version result" caption="Version result" />
          <p className="docs-text">Choose the appropriate version to work efficiently and deliver the right thing at the right time.</p>
        </div>
      </section>

      <div className="lesson-navigation">
        <div className="lesson-progress">Lesson {lessonMeta.order} / 24</div>
        <div className="lesson-nav-buttons">
          <Link to="/learn/lessons/speed-workflow-build-fast" className="lesson-nav-button">← Speed Workflow</Link>
          <Link to="/learn/lessons/improve-page-small-changes" className="lesson-nav-button next">Improve Page →</Link>
        </div>
      </div>
    </div>
  );
}
