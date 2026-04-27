import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";

// TOC sections for this lesson
export const LESSON_SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "workflow", label: "Your Workflow" },
  { id: "what-next", label: "What to Focus On Next" },
  { id: "daily-use", label: "Use FramerKit Daily" },
  { id: "keep-simple", label: "Keep It Simple" },
  { id: "result", label: "Result" },
];

// Lesson metadata
export const lessonMeta = {
  slug: "what-to-do-next",
  title: "What to Do Next + FramerKit Workflow Recap",
  order: 24,
  isLocked: true,
  category: "Final Path",
  description: "Understand what to do after learning the basics and how to continue improving your workflow.",
  excerpt: "Review the full workflow and learn how to move forward with real projects.",
  readTime: "6 min",
  image: "https://via.placeholder.com/1280x720?text=Next+Steps",
  videoPlanned: true,
  seoIntent: "framer workflow recap, what to do after learning web design, next steps framer",
};

type WhatToDoNextProps = {
  onSectionChange: (sectionId: string) => void;
};

export default function WhatToDoNext({ onSectionChange }: WhatToDoNextProps) {
  const location = useLocation();
  const onSectionChangeRef = useRef(onSectionChange);
  const suppressSidebarUntilRef = useRef(0);

  useEffect(() => {
    onSectionChangeRef.current = onSectionChange;
  }, [onSectionChange]);

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

    LESSON_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-docs-layout">
      <SEO
        title={lessonMeta.title}
        description={lessonMeta.description}
        keywords={lessonMeta.seoIntent}
        canonical={`https://www.framerkit.site/learn/lessons/${lessonMeta.slug}`}
      />

      <section id="intro" className="docs-overview">
        <div className="docs-header">
          <nav className="component-breadcrumb">
            <Link to="/learn/lessons" className="breadcrumb-link">Lessons</Link>
            <span className="breadcrumb-separator">›</span>
            <Link to="/learn/lessons#lesson-final-path" className="breadcrumb-link">Final Path</Link>
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
          <p className="docs-text">
            You have learned how to build pages, improve layouts, work with clients, and deliver projects. 
            Now it&apos;s time to understand what to do next and how to keep improving.
          </p>
        </div>
      </section>

      <section id="workflow" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Your Workflow</h2>
          <p className="docs-subtitle">A simple workflow you can follow for every project.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Build structure using sections</li>
            <li>Add content</li>
            <li>Apply styles</li>
            <li>Improve layout</li>
            <li>Make it responsive</li>
            <li>Deliver the project</li>
          </ol>
          <ImageFrame src="/images/lessons/full-workflow-overview.jpg" alt="Full workflow overview" caption="Full workflow overview" />
        </div>
      </section>

      <section id="what-next" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">What to Focus On Next</h2>
          <p className="docs-subtitle">The best way to improve is by doing real work.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Build more projects</li>
            <li>Improve your portfolio</li>
            <li>Work with real clients</li>
          </ol>
        </div>
      </section>

      <section id="daily-use" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Use FramerKit Daily</h2>
          <p className="docs-subtitle">The more you use FramerKit, the faster and more confident you become.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Use sections for every project</li>
            <li>Use templates to save time</li>
            <li>Build faster with practice</li>
          </ol>
        </div>
      </section>

      <section id="keep-simple" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Keep It Simple</h2>
          <p className="docs-subtitle">Don&apos;t overcomplicate your work.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Simple layouts work best</li>
            <li>Clear content is more effective</li>
            <li>Consistency beats complexity</li>
          </ol>
        </div>
      </section>

      <section id="result" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Result</h2>
          <p className="docs-subtitle">You now have a clear path forward and the tools to continue improving.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/multiple-completed-projects.jpg" alt="Multiple completed projects" caption="Multiple completed projects" />
          <p className="docs-text">The next step is simple: keep building, keep improving, and keep moving forward.</p>
        </div>
      </section>

      <div className="lesson-navigation">
        <div className="lesson-progress">Lesson {lessonMeta.order} / 24</div>
        <div className="lesson-nav-buttons">
          <Link to="/learn/lessons/zero-to-first-client" className="lesson-nav-button">← From Zero to First Client</Link>
          <div /> {/* No next - this is the last lesson */}
        </div>
      </div>
    </div>
  );
}
