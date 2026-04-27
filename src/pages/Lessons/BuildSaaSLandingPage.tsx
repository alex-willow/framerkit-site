import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";

export const LESSON_SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "value-prop", label: "Value Proposition" },
  { id: "features", label: "Features Section" },
  { id: "social-proof", label: "Social Proof" },
  { id: "pricing", label: "Pricing" },
  { id: "result", label: "Result" },
];

export const lessonMeta = {
  slug: "build-saas-landing-page",
  title: "Build a SaaS Landing Page",
  order: 11,
  isLocked: true,
  category: "Build Websites",
  description: "Learn how to build a modern SaaS landing page using FramerKit.",
  excerpt: "Create a landing page that explains your product and drives signups.",
  readTime: "8 min",
  image: "https://via.placeholder.com/1280x720?text=SaaS+Landing",
  videoPlanned: true,
  seoIntent: "saas landing page framer, build saas website, framerkit saas layout",
};

type BuildSaaSLandingPageProps = { onSectionChange: (sectionId: string) => void };

export default function BuildSaaSLandingPage({ onSectionChange }: BuildSaaSLandingPageProps) {
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
          <p className="docs-text">In this lesson, you will build a modern SaaS landing page using FramerKit sections. The goal is to create a clear and structured page that explains your product and drives conversions.</p>
        </div>
      </section>

      <section id="value-prop" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Value Proposition</h2>
          <p className="docs-subtitle">Explain the core value clearly.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Strong headline</li>
            <li>Clear subheadline</li>
            <li>Product screenshot or demo</li>
          </ol>
        </div>
      </section>

      <section id="features" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Features Section</h2>
          <p className="docs-subtitle">Show what your product does.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/saas-features.jpg" alt="SaaS features" caption="SaaS features" />
          <ol className="resource-ordered-list">
            <li>Feature cards</li>
            <li>Icons and descriptions</li>
            <li>Benefit-focused copy</li>
          </ol>
        </div>
      </section>

      <section id="social-proof" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Social Proof</h2>
          <p className="docs-subtitle">Build credibility.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/saas-social-proof.jpg" alt="Social proof" caption="Social proof" />
          <ol className="resource-ordered-list">
            <li>Customer logos</li>
            <li>Testimonials</li>
            <li>Usage statistics</li>
          </ol>
        </div>
      </section>

      <section id="pricing" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Pricing</h2>
          <p className="docs-subtitle">Make pricing clear.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Simple pricing tiers</li>
            <li>Clear feature lists</li>
            <li>CTA buttons</li>
          </ol>
        </div>
      </section>

      <section id="result" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Result</h2>
          <p className="docs-subtitle">A high-converting SaaS landing page.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/saas-result.jpg" alt="SaaS landing result" caption="SaaS landing result" />
          <p className="docs-text">Your SaaS landing page is ready to attract users and drive signups.</p>
        </div>
      </section>

      <div className="lesson-navigation">
        <div className="lesson-progress">Lesson {lessonMeta.order} / 24</div>
        <div className="lesson-nav-buttons">
          <Link to="/learn/lessons/build-portfolio-website" className="lesson-nav-button">← Portfolio</Link>
          <Link to="/learn/lessons/common-mistakes-framer" className="lesson-nav-button next">Common Mistakes →</Link>
        </div>
      </div>
    </div>
  );
}
