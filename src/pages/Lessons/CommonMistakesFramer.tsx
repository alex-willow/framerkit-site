import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";

export const LESSON_SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "clutter", label: "Overdesigning" },
  { id: "copy", label: "Weak Copy" },
  { id: "cta", label: "Unclear CTA" },
  { id: "mobile", label: "Ignoring Mobile" },
  { id: "result", label: "Result" },
];

export const lessonMeta = {
  slug: "common-mistakes-framer",
  title: "Common Mistakes Beginners Make in Framer",
  order: 10,
  isLocked: true,
  category: "Core Skills",
  description: "Avoid the most common mistakes when building pages in Framer.",
  excerpt: "Learn what not to do and how to fix common problems.",
  readTime: "7 min",
  image: "https://via.placeholder.com/1280x720?text=Common+Mistakes",
  videoPlanned: true,
  seoIntent: "framer mistakes beginners, web design mistakes, landing page errors",
};

type CommonMistakesFramerProps = { onSectionChange: (sectionId: string) => void };

export default function CommonMistakesFramer({ onSectionChange }: CommonMistakesFramerProps) {
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
          <p className="docs-text">Most beginners struggle not because Framer is difficult, but because they repeat the same mistakes. In this lesson, you will learn how to avoid them.</p>
        </div>
      </section>

      <section id="clutter" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Overdesigning</h2>
          <p className="docs-subtitle">Less is more.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Too many colors</li>
            <li>Too many fonts</li>
            <li>Unnecessary animations</li>
          </ol>
          <p className="docs-text">Fix: Stick to simple color schemes and clean layouts.</p>
        </div>
      </section>

      <section id="copy" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Weak Copy</h2>
          <p className="docs-subtitle">Words matter as much as design.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Generic headlines</li>
            <li>No clear benefits</li>
            <li>Too much text</li>
          </ol>
          <p className="docs-text">Fix: Write clear, benefit-focused copy.</p>
        </div>
      </section>

      <section id="cta" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Unclear CTA</h2>
          <p className="docs-subtitle">Users need clear direction.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/weak-cta.jpg" alt="Weak vs strong CTA" caption="Weak vs strong CTA" />
          <ol className="resource-ordered-list">
            <li>Multiple competing CTAs</li>
            <li>Weak button text</li>
            <li>CTA buried at bottom</li>
          </ol>
          <p className="docs-text">Fix: One clear CTA per section, strong action words.</p>
        </div>
      </section>

      <section id="mobile" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Ignoring Mobile</h2>
          <p className="docs-subtitle">Most users are on mobile.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/mobile-mistake.jpg" alt="Mobile issues" caption="Mobile issues" />
          <ol className="resource-ordered-list">
            <li>Not testing on mobile</li>
            <li>Text too small</li>
            <li>Buttons too close</li>
          </ol>
          <p className="docs-text">Fix: Design mobile-first, test on real devices.</p>
        </div>
      </section>

      <section id="result" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Result</h2>
          <p className="docs-subtitle">Avoid these mistakes and build better pages.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/clean-result.jpg" alt="Clean result" caption="Clean result" />
          <p className="docs-text">By avoiding common mistakes, your pages will look more professional and convert better.</p>
        </div>
      </section>

      <div className="lesson-navigation">
        <div className="lesson-progress">Lesson {lessonMeta.order} / 24</div>
        <div className="lesson-nav-buttons">
          <Link to="/learn/lessons/build-saas-landing-page" className="lesson-nav-button">← SaaS Landing</Link>
          <Link to="/learn/lessons/speed-workflow-build-fast" className="lesson-nav-button next">Speed Workflow →</Link>
        </div>
      </div>
    </div>
  );
}
