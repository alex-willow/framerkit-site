import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";

export const LESSON_SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "why-templates", label: "Why Templates Are Powerful" },
  { id: "start-template", label: "Start with a Template" },
  { id: "customize", label: "Customize Sections" },
  { id: "apply-styles", label: "Apply Styles" },
  { id: "combine", label: "Combine Templates + Sections" },
  { id: "result", label: "Result" },
];

export const lessonMeta = {
  slug: "build-faster-with-templates",
  title: "Build Faster with Templates (Pro Workflow)",
  order: 22,
  isLocked: true,
  category: "Freelance & Money",
  description: "Learn how to use templates to build websites even faster using a professional workflow.",
  excerpt: "Understand how to combine templates and sections for maximum speed.",
  readTime: "7 min",
  image: "https://via.placeholder.com/1280x720?text=Pro+Workflow",
  videoPlanned: true,
  seoIntent: "framer templates workflow, build faster framer templates, framerkit templates usage",
};

type BuildFasterWithTemplatesProps = { onSectionChange: (sectionId: string) => void };

export default function BuildFasterWithTemplates({ onSectionChange }: BuildFasterWithTemplatesProps) {
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
          <p className="docs-text">Templates are one of the fastest ways to build websites in FramerKit. Instead of starting from scratch, you begin with a complete structure and customize it.</p>
        </div>
      </section>

      <section id="why-templates" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Why Templates Are Powerful</h2>
          <p className="docs-subtitle">Templates remove the need to think about layout from the beginning.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Pre-built structure</li>
            <li>Proven layout flow</li>
            <li>Faster starting point</li>
          </ol>
        </div>
      </section>

      <section id="start-template" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Start with a Template</h2>
          <p className="docs-subtitle">Choose a template that matches your goal.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/template-preview.jpg" alt="Template preview" caption="Template preview" />
          <ol className="resource-ordered-list">
            <li>SaaS</li>
            <li>Portfolio</li>
            <li>Agency</li>
          </ol>
        </div>
      </section>

      <section id="customize" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Customize Sections</h2>
          <p className="docs-subtitle">Templates are flexible — you can replace sections easily.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/replacing-sections.jpg" alt="Replacing sections" caption="Replacing sections" />
          <ol className="resource-ordered-list">
            <li>Remove sections you don&apos;t need</li>
            <li>Add new sections from the library</li>
            <li>Adjust layout</li>
          </ol>
        </div>
      </section>

      <section id="apply-styles" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Apply Styles</h2>
          <p className="docs-subtitle">Use Color Sets and Text Styles to unify the design.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Apply colors</li>
            <li>Apply typography</li>
          </ol>
          <p className="docs-text">This makes your template look custom instantly.</p>
        </div>
      </section>

      <section id="combine" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Combine Templates + Sections</h2>
          <p className="docs-subtitle">The most powerful workflow is combining both.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Start with template</li>
            <li>Modify with sections</li>
            <li>Adjust content</li>
          </ol>
        </div>
      </section>

      <section id="result" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Result</h2>
          <p className="docs-subtitle">You build high-quality websites in a fraction of the time.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/final-customized-template.jpg" alt="Final customized template" caption="Final customized template" />
          <p className="docs-text">Templates are not limiting — they are a starting point for faster and smarter work.</p>
        </div>
      </section>

      <div className="lesson-navigation">
        <div className="lesson-progress">Lesson {lessonMeta.order} / 24</div>
        <div className="lesson-nav-buttons">
          <Link to="/learn/lessons/deliver-projects-without-revisions" className="lesson-nav-button">← Deliver Projects</Link>
          <div />
        </div>
      </div>
    </div>
  );
}
