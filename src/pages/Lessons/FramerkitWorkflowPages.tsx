import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";

// TOC sections for this lesson
export const LESSON_SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "wrong-way", label: "The Wrong Way" },
  { id: "right-workflow", label: "The Right Workflow" },
  { id: "step-1", label: "Step 1: Build Structure" },
  { id: "step-2", label: "Step 2: Add Content" },
  { id: "step-3", label: "Step 3: Apply Styles" },
  { id: "result", label: "Result" },
];

// Lesson metadata
export const lessonMeta = {
  slug: "framerkit-workflow-pages",
  title: "FramerKit Workflow: Build Pages the Right Way",
  order: 2,
  isLocked: true,
  category: "Getting Started",
  description: "Learn the correct workflow for building pages in Framer using FramerKit.",
  excerpt: "Understand how to build pages faster using a structured workflow instead of random design.",
  readTime: "7 min",
  image: "https://via.placeholder.com/1280x720?text=FramerKit+Workflow",
  videoPlanned: true,
  seoIntent: "framer workflow tutorial, build pages framer, framerkit workflow",
};

type FramerkitWorkflowPagesProps = {
  onSectionChange: (sectionId: string) => void;
};

export default function FramerkitWorkflowPages({ onSectionChange }: FramerkitWorkflowPagesProps) {
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
            <Link to="/learn/lessons" className="breadcrumb-link">
              Lessons
            </Link>
            <span className="breadcrumb-separator">›</span>
            <Link to="/learn/lessons#lesson-getting-started" className="breadcrumb-link">
              Getting Started
            </Link>
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
            Building pages in FramerKit is not about randomly adding sections. 
            A clear workflow helps you move faster, avoid mistakes, and keep your layouts consistent.
          </p>
        </div>
      </section>

      <section id="wrong-way" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">The Wrong Way</h2>
          <p className="docs-subtitle">
            Most beginners start by randomly adding sections without a clear structure.
          </p>
        </div>

        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Adding random blocks</li>
            <li>Changing styles constantly</li>
            <li>No clear flow</li>
          </ol>

          <p className="docs-text">
            This leads to messy layouts and wasted time.
          </p>
        </div>
      </section>

      <section id="right-workflow" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">The Right Workflow</h2>
          <p className="docs-subtitle">
            A better approach is to build your page step by step with a clear structure.
          </p>
        </div>

        <div className="docs-content-block">
          <ImageFrame
            src="/images/lessons/page-structure-overview.jpg"
            alt="Page structure overview"
            caption="Clean page structure overview"
          />

          <ol className="resource-ordered-list">
            <li>Start with structure</li>
            <li>Add sections in order</li>
            <li>Apply styles at the end</li>
          </ol>
        </div>
      </section>

      <section id="step-1" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Step 1: Build Structure First</h2>
          <p className="docs-subtitle">
            Start with layout only. Don&apos;t focus on design yet.
          </p>
        </div>

        <div className="docs-content-block">
          <ImageFrame
            src="/images/lessons/wireframe-sections.jpg"
            alt="Wireframe sections"
            caption="Wireframe sections for faster layout"
          />

          <p className="docs-text">
            Use wireframe sections if you want to move faster.
          </p>
        </div>
      </section>

      <section id="step-2" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Step 2: Add Content</h2>
          <p className="docs-subtitle">
            Fill sections with real content before styling.
          </p>
        </div>

        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Headlines</li>
            <li>Descriptions</li>
            <li>CTA buttons</li>
          </ol>

          <p className="docs-text">
            This helps you understand if your layout actually works.
          </p>
        </div>
      </section>

      <section id="step-3" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Step 3: Apply Styles</h2>
          <p className="docs-subtitle">
            Only after structure and content are ready, apply styles.
          </p>
        </div>

        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Apply Color Set</li>
            <li>Apply Text Styles</li>
          </ol>

          <p className="docs-text">
            This keeps your design consistent and clean.
          </p>
        </div>
      </section>

      <section id="result" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Result</h2>
          <p className="docs-subtitle">
            You get a clean, structured page built faster and with fewer mistakes.
          </p>
        </div>

        <div className="docs-content-block">
          <ImageFrame
            src="/images/lessons/final-clean-page.jpg"
            alt="Final clean page"
            caption="Final clean page result"
          />

          <p className="docs-text">
            A clear workflow is the difference between struggling with design and building pages efficiently.
          </p>
        </div>
      </section>

      {/* Lesson Navigation */}
      <div className="lesson-navigation">
        <div className="lesson-progress">
          Lesson {lessonMeta.order} / 24
        </div>

        <div className="lesson-nav-buttons">
          <Link
            to="/learn/lessons/build-first-landing-fast"
            className="lesson-nav-button"
          >
            ← Build Your First Landing Fast
          </Link>

          <Link
            to="/learn/lessons/combine-sections-better-layouts"
            className="lesson-nav-button next"
          >
            Combine Sections →
          </Link>
        </div>
      </div>
    </div>
  );
}
