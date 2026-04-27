import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";

export const LESSON_SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "purpose", label: "Purpose of App Landing" },
  { id: "sections", label: "Key Sections" },
  { id: "visuals", label: "Visuals and Screenshots" },
  { id: "cta", label: "Strong CTA" },
  { id: "result", label: "Result" },
];

export const lessonMeta = {
  slug: "build-app-landing-page",
  title: "Build an App Landing Page",
  order: 14,
  isLocked: true,
  category: "Build Websites",
  description: "Learn how to build a modern app landing page using FramerKit.",
  excerpt: "Create a landing page that showcases your app and drives downloads.",
  readTime: "7 min",
  image: "https://via.placeholder.com/1280x720?text=App+Landing",
  videoPlanned: true,
  seoIntent: "app landing page framer, mobile app website design, app landing layout",
};

type BuildAppLandingPageProps = { onSectionChange: (sectionId: string) => void };

export default function BuildAppLandingPage({ onSectionChange }: BuildAppLandingPageProps) {
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
          <p className="docs-text">App landing pages focus on clarity, visuals, and simplicity. In this lesson, you will build a landing page that showcases an app and encourages users to download it.</p>
        </div>
      </section>

      <section id="purpose" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Purpose of App Landing</h2>
          <p className="docs-subtitle">Explain what the app does and why users need it.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Clear headline</li>
            <li>Key benefits</li>
            <li>Download buttons</li>
          </ol>
        </div>
      </section>

      <section id="sections" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Key Sections</h2>
          <p className="docs-subtitle">Every app landing needs these.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/app-sections.jpg" alt="App landing sections" caption="App landing sections" />
          <ol className="resource-ordered-list">
            <li>Hero with app screenshot</li>
            <li>Features grid</li>
            <li>How it works</li>
            <li>Download CTA</li>
          </ol>
        </div>
      </section>

      <section id="visuals" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Visuals and Screenshots</h2>
          <p className="docs-subtitle">Show the app interface.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/app-screenshots.jpg" alt="App screenshots" caption="App screenshots" />
          <ol className="resource-ordered-list">
            <li>Use device mockups</li>
            <li>Show real app screens</li>
            <li>Highlight key features</li>
          </ol>
        </div>
      </section>

      <section id="cta" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Strong CTA</h2>
          <p className="docs-subtitle">Make downloading easy.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>App Store button</li>
            <li>Google Play button</li>
            <li>Clear above the fold</li>
          </ol>
        </div>
      </section>

      <section id="result" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Result</h2>
          <p className="docs-subtitle">A professional app landing page.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/app-landing-result.jpg" alt="App landing result" caption="App landing result" />
          <p className="docs-text">Your app landing page is ready to drive downloads and user engagement.</p>
        </div>
      </section>

      <div className="lesson-navigation">
        <div className="lesson-progress">Lesson {lessonMeta.order} / 24</div>
        <div className="lesson-nav-buttons">
          <Link to="/learn/lessons/build-one-page-website" className="lesson-nav-button">← One Page Website</Link>
          <Link to="/learn/lessons/build-agency-website" className="lesson-nav-button next">Build Agency →</Link>
        </div>
      </div>
    </div>
  );
}
