import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";

export const LESSON_SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "personal-brand", label: "Personal Brand" },
  { id: "showcase", label: "Showcase Work" },
  { id: "about", label: "About Section" },
  { id: "contact", label: "Contact" },
  { id: "result", label: "Result" },
];

export const lessonMeta = {
  slug: "build-portfolio-website",
  title: "Build a Portfolio Website",
  order: 12,
  isLocked: true,
  category: "Build Websites",
  description: "Learn how to build a clean and modern portfolio website using FramerKit.",
  excerpt: "Create a portfolio that presents your work and attracts opportunities.",
  readTime: "7 min",
  image: "https://via.placeholder.com/1280x720?text=Portfolio+Website",
  videoPlanned: true,
  seoIntent: "portfolio website framer, build portfolio website, designer portfolio layout",
};

type BuildPortfolioWebsiteProps = { onSectionChange: (sectionId: string) => void };

export default function BuildPortfolioWebsite({ onSectionChange }: BuildPortfolioWebsiteProps) {
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
          <p className="docs-text">In this lesson, you will build a portfolio website that presents your work clearly and professionally. The goal is to create a simple structure that highlights your projects and builds trust.</p>
        </div>
      </section>

      <section id="personal-brand" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Personal Brand</h2>
          <p className="docs-subtitle">Present yourself clearly.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Your name and title</li>
            <li>Your expertise</li>
            <li>Professional photo</li>
          </ol>
        </div>
      </section>

      <section id="showcase" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Showcase Work</h2>
          <p className="docs-subtitle">Display your best projects.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/portfolio-showcase.jpg" alt="Portfolio showcase" caption="Portfolio showcase" />
          <ol className="resource-ordered-list">
            <li>Project thumbnails</li>
            <li>Project descriptions</li>
            <li>Your role in each project</li>
          </ol>
        </div>
      </section>

      <section id="about" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">About Section</h2>
          <p className="docs-subtitle">Tell your story.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Short bio</li>
            <li>Your skills</li>
            <li>Experience</li>
          </ol>
        </div>
      </section>

      <section id="contact" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Contact</h2>
          <p className="docs-subtitle">Make it easy to reach you.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Email address</li>
            <li>Social links</li>
            <li>Simple contact form</li>
          </ol>
        </div>
      </section>

      <section id="result" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Result</h2>
          <p className="docs-subtitle">A portfolio that opens doors.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/portfolio-result.jpg" alt="Portfolio result" caption="Portfolio result" />
          <p className="docs-text">Your portfolio website showcases your skills and helps you land new opportunities.</p>
        </div>
      </section>

      <div className="lesson-navigation">
        <div className="lesson-progress">Lesson {lessonMeta.order} / 24</div>
        <div className="lesson-nav-buttons">
          <Link to="/learn/lessons/build-agency-website" className="lesson-nav-button">← Agency Website</Link>
          <Link to="/learn/lessons/build-saas-landing-page" className="lesson-nav-button next">Build SaaS Landing →</Link>
        </div>
      </div>
    </div>
  );
}
