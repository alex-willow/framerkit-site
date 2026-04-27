import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";

// TOC sections for this lesson
export const LESSON_SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "why-wrong", label: "Why Layout Feels Wrong" },
  { id: "logical-flow", label: "Build Logical Flow" },
  { id: "visual-rhythm", label: "Keep Visual Rhythm" },
  { id: "avoid-repetition", label: "Avoid Repetition" },
  { id: "use-contrast", label: "Use Contrast" },
  { id: "result", label: "Result" },
];

// Lesson metadata
export const lessonMeta = {
  slug: "combine-sections-better-layouts",
  title: "Combine Sections: Build Better Layouts",
  order: 3,
  isLocked: true,
  category: "Getting Started",
  description: "Learn how to combine sections правильно to create clean and balanced layouts.",
  excerpt: "Understand how to structure sections so your pages look professional and consistent.",
  readTime: "7 min",
  image: "https://via.placeholder.com/1280x720?text=Combine+Sections",
  videoPlanned: true,
  seoIntent: "framer layout design, combine sections framer, website structure design",
};

type CombineSectionsBetterLayoutsProps = {
  onSectionChange: (sectionId: string) => void;
};

export default function CombineSectionsBetterLayouts({ onSectionChange }: CombineSectionsBetterLayoutsProps) {
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
            Building a page is not just about adding sections. The way you combine them defines how your layout looks and feels.
          </p>
        </div>
      </section>

      <section id="why-wrong" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Why Layout Feels Wrong</h2>
          <p className="docs-subtitle">
            Even with good sections, layouts can look messy if they are combined incorrectly.
          </p>
        </div>

        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Sections feel disconnected</li>
            <li>Spacing looks random</li>
            <li>No visual flow</li>
          </ol>

          <p className="docs-text">
            This usually happens when sections are added without thinking about how they work together.
          </p>
        </div>
      </section>

      <section id="logical-flow" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Build Logical Flow</h2>
          <p className="docs-subtitle">
            A strong layout follows a clear flow from top to bottom.
          </p>
        </div>

        <div className="docs-content-block">
          <ImageFrame
            src="/images/lessons/section-flow.jpg"
            alt="Section flow from hero to CTA"
            caption="Section flow from hero to CTA"
          />

          <ol className="resource-ordered-list">
            <li>Hero — explain what this is</li>
            <li>Feature — explain why it matters</li>
            <li>Social proof — build trust</li>
            <li>CTA — guide the user</li>
          </ol>

          <p className="docs-text">
            Each section has a clear role in guiding the user forward.
          </p>
        </div>
      </section>

      <section id="visual-rhythm" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Keep Visual Rhythm</h2>
          <p className="docs-subtitle">
            Rhythm is created by consistent spacing and predictable structure.
          </p>
        </div>

        <div className="docs-content-block">
          <ImageFrame
            src="/images/lessons/consistent-spacing.jpg"
            alt="Consistent spacing between sections"
            caption="Consistent spacing between sections"
          />

          <ol className="resource-ordered-list">
            <li>Use similar spacing between sections</li>
            <li>Avoid sudden size changes</li>
            <li>Keep alignment consistent</li>
          </ol>
        </div>
      </section>

      <section id="avoid-repetition" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Avoid Repetition</h2>
          <p className="docs-subtitle">
            Using the same type of section too many times makes the page feel boring.
          </p>
        </div>

        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Don&apos;t stack similar layouts</li>
            <li>Mix different section types</li>
            <li>Create variation in structure</li>
          </ol>

          <p className="docs-text">
            Variety keeps the page visually interesting.
          </p>
        </div>
      </section>

      <section id="use-contrast" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Use Contrast Between Sections</h2>
          <p className="docs-subtitle">
            Contrast helps separate sections and improve readability.
          </p>
        </div>

        <div className="docs-content-block">
          <ImageFrame
            src="/images/lessons/light-dark-contrast.jpg"
            alt="Light and dark sections contrast"
            caption="Light and dark sections contrast"
          />

          <ol className="resource-ordered-list">
            <li>Alternate background colors</li>
            <li>Use different layouts</li>
            <li>Highlight important sections</li>
          </ol>
        </div>
      </section>

      <section id="result" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Result</h2>
          <p className="docs-subtitle">
            When sections are combined правильно, the page feels structured, balanced, and professional.
          </p>
        </div>

        <div className="docs-content-block">
          <ImageFrame
            src="/images/lessons/clean-structured-layout.jpg"
            alt="Clean structured layout"
            caption="Clean structured layout"
          />

          <p className="docs-text">
            Good layout is not about adding more sections — it&apos;s about connecting them into a clear and consistent flow.
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
            to="/learn/lessons/framerkit-workflow-pages"
            className="lesson-nav-button"
          >
            ← FramerKit Workflow
          </Link>

          <Link
            to="/learn/lessons/responsive-layout-framer"
            className="lesson-nav-button next"
          >
            Responsive Layout →
          </Link>
        </div>
      </div>
    </div>
  );
}
