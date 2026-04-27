import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";

export const LESSON_SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "hero-copy", label: "Hero Copy" },
  { id: "features-copy", label: "Features Copy" },
  { id: "social-proof", label: "Social Proof" },
  { id: "cta-copy", label: "CTA Copy" },
  { id: "result", label: "Result" },
];

export const lessonMeta = {
  slug: "content-and-copy-sections",
  title: "Content & Copy: What to Write in Your Sections",
  order: 6,
  isLocked: true,
  category: "Core Skills",
  description: "Learn what to write in each section so your page feels clear and professional.",
  excerpt: "Write compelling copy that converts visitors into users.",
  readTime: "8 min",
  image: "https://via.placeholder.com/1280x720?text=Content+Copy",
  videoPlanned: true,
  seoIntent: "website copywriting, section content, landing page text",
};

type ContentAndCopySectionsProps = { onSectionChange: (sectionId: string) => void };

export default function ContentAndCopySections({ onSectionChange }: ContentAndCopySectionsProps) {
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
          <p className="docs-text">Good design needs good content. In this lesson, you will learn what to write in each section so your page feels clear, professional, and persuasive.</p>
        </div>
      </section>

      <section id="hero-copy" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Hero Copy</h2>
          <p className="docs-subtitle">The most important text on the page.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/hero-copy.jpg" alt="Hero copy" caption="Hero copy" />
          <ol className="resource-ordered-list">
            <li>Clear headline - what you offer</li>
            <li>Subheadline - why it matters</li>
            <li>CTA button - what to do next</li>
          </ol>
        </div>
      </section>

      <section id="features-copy" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Features Copy</h2>
          <p className="docs-subtitle">Focus on benefits, not features.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>What it does</li>
            <li>Why it helps</li>
            <li>How it saves time/money</li>
          </ol>
        </div>
      </section>

      <section id="social-proof" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Social Proof</h2>
          <p className="docs-subtitle">Build trust with real content.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/social-proof.jpg" alt="Social proof" caption="Social proof" />
          <ol className="resource-ordered-list">
            <li>Customer quotes</li>
            <li>Results and numbers</li>
            <li>Client logos</li>
          </ol>
        </div>
      </section>

      <section id="cta-copy" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">CTA Copy</h2>
          <p className="docs-subtitle">Make action clear and urgent.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Action words (Get, Start, Try)</li>
            <li>Value reminder</li>
            <li>Remove friction (free, instant)</li>
          </ol>
        </div>
      </section>

      <section id="result" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Result</h2>
          <p className="docs-subtitle">Clear copy that converts.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/good-copy-result.jpg" alt="Good copy result" caption="Good copy result" />
          <p className="docs-text">With strong copy, your design works harder to convert visitors into customers.</p>
        </div>
      </section>

      <div className="lesson-navigation">
        <div className="lesson-progress">Lesson {lessonMeta.order} / 24</div>
        <div className="lesson-nav-buttons">
          <Link to="/learn/lessons/improve-page-small-changes" className="lesson-nav-button">← Improve Page</Link>
          <Link to="/learn/lessons/navbar-to-cta-flow" className="lesson-nav-button next">Navbar to CTA →</Link>
        </div>
      </div>
    </div>
  );
}
