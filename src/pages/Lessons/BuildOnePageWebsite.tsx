import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";

export const LESSON_SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "what-is", label: "What is a One Page Website" },
  { id: "structure", label: "Structure" },
  { id: "build", label: "Build Step by Step" },
  { id: "tips", label: "Tips for One Page Sites" },
  { id: "result", label: "Result" },
];

export const lessonMeta = {
  slug: "build-one-page-website",
  title: "Build a Simple One Page Website",
  order: 15,
  isLocked: true,
  category: "Build Websites",
  description: "Learn how to build a simple and effective one-page website using FramerKit.",
  excerpt: "Create a clean one-page website with a clear structure and flow.",
  readTime: "7 min",
  image: "https://via.placeholder.com/1280x720?text=One+Page+Website",
  videoPlanned: true,
  seoIntent: "one page website framer, simple landing page design, single page layout",
};

type BuildOnePageWebsiteProps = { onSectionChange: (sectionId: string) => void };

export default function BuildOnePageWebsite({ onSectionChange }: BuildOnePageWebsiteProps) {
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
            <Link to="/learn/lessons#lesson-build-websites" className="breadcrumb-link">Build Websites</Link>
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
          <p className="docs-text">One-page websites are one of the most common and practical types of projects. In this lesson, you will learn how to build a simple, clean, and effective one-page layout.</p>
        </div>
      </section>

      <section id="what-is" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">What is a One Page Website</h2>
          <p className="docs-subtitle">All content on a single page with clear sections.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Hero section</li>
            <li>Features</li>
            <li>About</li>
            <li>Contact/CTA</li>
          </ol>
        </div>
      </section>

      <section id="structure" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Structure</h2>
          <p className="docs-subtitle">Keep it simple and logical.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/one-page-structure.jpg" alt="One page structure" caption="One page structure" />
          <ol className="resource-ordered-list">
            <li>Start with hero</li>
            <li>Explain what you offer</li>
            <li>Add social proof</li>
            <li>End with clear CTA</li>
          </ol>
        </div>
      </section>

      <section id="build" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Build Step by Step</h2>
          <p className="docs-subtitle">Use FramerKit sections.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/add-sections.jpg" alt="Add sections" caption="Add sections" />
          <ol className="resource-ordered-list">
            <li>Choose a hero</li>
            <li>Add features section</li>
            <li>Include testimonials</li>
            <li>Add contact/CTA</li>
          </ol>
        </div>
      </section>

      <section id="tips" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Tips for One Page Sites</h2>
          <p className="docs-subtitle">Make it scroll smoothly.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Clear navigation links</li>
            <li>Smooth scroll between sections</li>
            <li>Consistent spacing</li>
          </ol>
        </div>
      </section>

      <section id="result" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Result</h2>
          <p className="docs-subtitle">A clean, focused website.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/one-page-result.jpg" alt="One page result" caption="One page result" />
          <p className="docs-text">One-page sites are perfect for simple projects and quick launches.</p>
        </div>
      </section>

      <div className="lesson-navigation">
        <div className="lesson-progress">Lesson {lessonMeta.order} / 24</div>
        <div className="lesson-nav-buttons">
          <Link to="/learn/lessons/speed-tricks-framer" className="lesson-nav-button">← Speed Tricks</Link>
          <Link to="/learn/lessons/build-app-landing-page" className="lesson-nav-button next">Build App Landing →</Link>
        </div>
      </div>
    </div>
  );
}
