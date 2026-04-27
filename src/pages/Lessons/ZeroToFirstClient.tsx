import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";

// TOC sections for this lesson
export const LESSON_SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "step-1", label: "Step 1: Learn the Basics" },
  { id: "step-2", label: "Step 2: Build Simple Pages" },
  { id: "step-3", label: "Step 3: Improve Your Skills" },
  { id: "step-4", label: "Step 4: Build a Portfolio" },
  { id: "step-5", label: "Step 5: Find Your First Client" },
  { id: "step-6", label: "Step 6: Deliver and Improve" },
  { id: "key-idea", label: "The Key Idea" },
  { id: "result", label: "Result" },
];

// Lesson metadata
export const lessonMeta = {
  slug: "zero-to-first-client",
  title: "From Zero to First Client (Full Path)",
  order: 23,
  isLocked: true,
  category: "Final Path",
  description: "Understand the full path from learning Framer to getting your first client.",
  excerpt: "See how everything connects into one clear workflow from zero to freelance work.",
  readTime: "8 min",
  image: "https://via.placeholder.com/1280x720?text=Full+Path",
  videoPlanned: true,
  seoIntent: "learn framer full path, from beginner to freelance web design, first client guide",
};

type ZeroToFirstClientProps = {
  onSectionChange: (sectionId: string) => void;
};

export default function ZeroToFirstClient({ onSectionChange }: ZeroToFirstClientProps) {
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
            By now, you have learned different parts of building websites with FramerKit. 
            In this lesson, we connect everything into one clear path — from zero to your first client.
          </p>
        </div>
      </section>

      <section id="step-1" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Step 1: Learn the Basics</h2>
          <p className="docs-subtitle">Start with understanding structure and layout.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Sections and components</li>
            <li>Page structure</li>
            <li>Basic workflow</li>
          </ol>
        </div>
      </section>

      <section id="step-2" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Step 2: Build Simple Pages</h2>
          <p className="docs-subtitle">Practice by building real pages.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Landing pages</li>
            <li>Portfolio</li>
            <li>Simple layouts</li>
          </ol>
          <ImageFrame src="/images/lessons/early-projects.jpg" alt="Early projects" caption="Early projects" />
        </div>
      </section>

      <section id="step-3" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Step 3: Improve Your Skills</h2>
          <p className="docs-subtitle">Learn how to make your designs better.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Spacing</li>
            <li>Hierarchy</li>
            <li>Content clarity</li>
          </ol>
        </div>
      </section>

      <section id="step-4" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Step 4: Build a Portfolio</h2>
          <p className="docs-subtitle">Create a simple portfolio with your best work.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/portfolio-page.jpg" alt="Portfolio page" caption="Portfolio page" />
        </div>
      </section>

      <section id="step-5" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Step 5: Find Your First Client</h2>
          <p className="docs-subtitle">Start small and focus on real projects.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Reach out</li>
            <li>Use your portfolio</li>
            <li>Start with simple projects</li>
          </ol>
        </div>
      </section>

      <section id="step-6" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Step 6: Deliver and Improve</h2>
          <p className="docs-subtitle">Complete your first project and learn from it.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Follow a clear process</li>
            <li>Communicate with clients</li>
            <li>Improve with each project</li>
          </ol>
        </div>
      </section>

      <section id="key-idea" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">The Key Idea</h2>
        </div>
        <div className="docs-content-block">
          <p className="docs-text">
            You don&apos;t need to be perfect. You need to take action and move step by step.
          </p>
        </div>
      </section>

      <section id="result" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Result</h2>
          <p className="docs-subtitle">You go from learning to building, from building to clients, and from clients to real experience.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/completed-project-client.jpg" alt="Completed project and client" caption="Completed project and client" />
          <p className="docs-text">The path is simple: learn → build → improve → get clients → grow.</p>
        </div>
      </section>

      <div className="lesson-navigation">
        <div className="lesson-progress">Lesson {lessonMeta.order} / 24</div>
        <div className="lesson-nav-buttons">
          <div />
          <Link to="/learn/lessons/what-to-do-next" className="lesson-nav-button next">What to Do Next →</Link>
        </div>
      </div>
    </div>
  );
}
