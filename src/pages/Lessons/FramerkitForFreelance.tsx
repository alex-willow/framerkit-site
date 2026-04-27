import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";

export const LESSON_SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "speed", label: "Build Faster" },
  { id: "quality", label: "Better Quality" },
  { id: "workflow", label: "Freelance Workflow" },
  { id: "client-happy", label: "Keep Clients Happy" },
  { id: "result", label: "Result" },
];

export const lessonMeta = {
  slug: "framerkit-for-freelance",
  title: "FramerKit for Freelance Work",
  order: 17,
  isLocked: true,
  category: "Freelance & Money",
  description: "Learn how to use FramerKit to complete freelance projects faster and more efficiently.",
  excerpt: "Understand how to build client websites quickly and deliver better results.",
  readTime: "8 min",
  image: "https://via.placeholder.com/1280x720?text=Freelance+Work",
  videoPlanned: true,
  seoIntent: "framer freelance work, build client websites fast, framerkit freelance workflow",
};

type FramerkitForFreelanceProps = { onSectionChange: (sectionId: string) => void };

export default function FramerkitForFreelance({ onSectionChange }: FramerkitForFreelanceProps) {
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
          <p className="docs-text">FramerKit is not just a design tool — it can significantly improve your freelance workflow. In this lesson, you will learn how to use it to complete projects faster and deliver better results.</p>
        </div>
      </section>

      <section id="speed" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Build Faster</h2>
          <p className="docs-subtitle">Complete projects in hours, not days.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Use pre-built sections</li>
            <li>Skip the blank page problem</li>
            <li>Reuse components</li>
          </ol>
        </div>
      </section>

      <section id="quality" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Better Quality</h2>
          <p className="docs-subtitle">Deliver professional results every time.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/professional-quality.jpg" alt="Professional quality" caption="Professional quality" />
          <ol className="resource-ordered-list">
            <li>Consistent design</li>
            <li>Responsive layouts</li>
            <li>Modern aesthetics</li>
          </ol>
        </div>
      </section>

      <section id="workflow" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Freelance Workflow</h2>
          <p className="docs-subtitle">Integrate FramerKit into your process.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/freelance-workflow.jpg" alt="Freelance workflow" caption="Freelance workflow" />
          <ol className="resource-ordered-list">
            <li>Start with templates</li>
            <li>Customize with sections</li>
            <li>Apply client branding</li>
          </ol>
        </div>
      </section>

      <section id="client-happy" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Keep Clients Happy</h2>
          <p className="docs-subtitle">Faster delivery means happier clients.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Show progress quickly</li>
            <li>Make changes easily</li>
            <li>Deliver on time</li>
          </ol>
        </div>
      </section>

      <section id="result" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Result</h2>
          <p className="docs-subtitle">You take on more projects and earn more.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/more-projects.jpg" alt="More projects" caption="More projects" />
          <p className="docs-text">FramerKit helps you work smarter, not harder — delivering quality work in less time.</p>
        </div>
      </section>

      <div className="lesson-navigation">
        <div className="lesson-progress">Lesson {lessonMeta.order} / 24</div>
        <div className="lesson-nav-buttons">
          <Link to="/learn/lessons/speed-tricks-for-framer" className="lesson-nav-button">← Speed Tricks</Link>
          <Link to="/learn/lessons/how-to-find-clients" className="lesson-nav-button next">Find Clients →</Link>
        </div>
      </div>
    </div>
  );
}
