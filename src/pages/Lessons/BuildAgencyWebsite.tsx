import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";

export const LESSON_SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "trust", label: "Build Trust" },
  { id: "services", label: "Show Services" },
  { id: "portfolio", label: "Portfolio Section" },
  { id: "contact", label: "Contact & CTA" },
  { id: "result", label: "Result" },
];

export const lessonMeta = {
  slug: "build-agency-website",
  title: "Build an Agency Website",
  order: 13,
  isLocked: true,
  category: "Build Websites",
  description: "Learn how to build a professional agency website using FramerKit.",
  excerpt: "Create an agency website that presents your services and builds client trust.",
  readTime: "8 min",
  image: "https://via.placeholder.com/1280x720?text=Agency+Website",
  videoPlanned: true,
  seoIntent: "agency website framer, build agency site, web design agency layout",
};

type BuildAgencyWebsiteProps = { onSectionChange: (sectionId: string) => void };

export default function BuildAgencyWebsite({ onSectionChange }: BuildAgencyWebsiteProps) {
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
          <p className="docs-text">In this lesson, you will build an agency website focused on clarity, trust, and strong presentation. Agency websites must communicate expertise and reliability.</p>
        </div>
      </section>

      <section id="trust" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Build Trust</h2>
          <p className="docs-subtitle">Clients need to trust your agency.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Professional hero section</li>
            <li>Client logos</li>
            <li>Team photos</li>
            <li>Testimonials</li>
          </ol>
        </div>
      </section>

      <section id="services" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Show Services</h2>
          <p className="docs-subtitle">Clearly list what you offer.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/services-section.jpg" alt="Services section" caption="Services section" />
          <ol className="resource-ordered-list">
            <li>Service cards</li>
            <li>Clear descriptions</li>
            <li>Visual icons</li>
          </ol>
        </div>
      </section>

      <section id="portfolio" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Portfolio Section</h2>
          <p className="docs-subtitle">Showcase your best work.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/portfolio-section.jpg" alt="Portfolio section" caption="Portfolio section" />
          <ol className="resource-ordered-list">
            <li>Case study previews</li>
            <li>Project thumbnails</li>
            <li>Results and metrics</li>
          </ol>
        </div>
      </section>

      <section id="contact" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Contact & CTA</h2>
          <p className="docs-subtitle">Make it easy to get in touch.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Contact form</li>
            <li>Email and phone</li>
            <li>Clear CTA buttons</li>
          </ol>
        </div>
      </section>

      <section id="result" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Result</h2>
          <p className="docs-subtitle">A professional agency presence.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/agency-result.jpg" alt="Agency website result" caption="Agency website result" />
          <p className="docs-text">Your agency website establishes credibility and attracts potential clients.</p>
        </div>
      </section>

      <div className="lesson-navigation">
        <div className="lesson-progress">Lesson {lessonMeta.order} / 24</div>
        <div className="lesson-nav-buttons">
          <Link to="/learn/lessons/build-app-landing-page" className="lesson-nav-button">← App Landing</Link>
          <Link to="/learn/lessons/build-portfolio-website" className="lesson-nav-button next">Build Portfolio →</Link>
        </div>
      </div>
    </div>
  );
}
