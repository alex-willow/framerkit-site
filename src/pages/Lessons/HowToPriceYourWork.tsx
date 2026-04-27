import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";

export const LESSON_SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "pricing-problem", label: "The Pricing Problem" },
  { id: "factors", label: "What Affects Price" },
  { id: "pricing-models", label: "Simple Pricing Models" },
  { id: "increase", label: "How to Increase Prices" },
  { id: "result", label: "Result" },
];

export const lessonMeta = {
  slug: "how-to-price-your-work",
  title: "How to Price Your Web Design Work",
  order: 19,
  isLocked: true,
  category: "Freelance & Money",
  description: "Learn how to price your web design work correctly as a beginner.",
  excerpt: "Understand how to set prices, avoid underpricing, and grow your income.",
  readTime: "7 min",
  image: "https://via.placeholder.com/1280x720?text=Pricing",
  videoPlanned: true,
  seoIntent: "how to price web design, freelance pricing beginner, web design rates",
};

type HowToPriceYourWorkProps = { onSectionChange: (sectionId: string) => void };

export default function HowToPriceYourWork({ onSectionChange }: HowToPriceYourWorkProps) {
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
          <p className="docs-text">Pricing your work is one of the hardest parts of freelance. Many beginners undervalue their work and lose money. In this lesson, you will learn how to approach pricing in a simple and practical way.</p>
        </div>
      </section>

      <section id="pricing-problem" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">The Pricing Problem</h2>
          <p className="docs-subtitle">Most beginners charge too little.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>They don&apos;t know what their work is worth</li>
            <li>They&apos;re afraid of losing the client</li>
            <li>They don&apos;t account for all the time spent</li>
          </ol>
        </div>
      </section>

      <section id="factors" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">What Affects Price</h2>
          <p className="docs-subtitle">Consider these factors when setting your rate.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/pricing-factors.jpg" alt="Pricing factors" caption="Pricing factors" />
          <ol className="resource-ordered-list">
            <li>Complexity of the project</li>
            <li>Number of pages</li>
            <li>Deadline pressure</li>
            <li>Your experience level</li>
          </ol>
        </div>
      </section>

      <section id="pricing-models" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Simple Pricing Models</h2>
          <p className="docs-subtitle">Choose what works best for you.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li><strong>Fixed price</strong> — per project</li>
            <li><strong>Hourly rate</strong> — for ongoing work</li>
            <li><strong>Package deal</strong> — multiple pages</li>
          </ol>
        </div>
      </section>

      <section id="increase" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">How to Increase Prices</h2>
          <p className="docs-subtitle">Raise your rates as you grow.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Build a strong portfolio</li>
            <li>Get testimonials</li>
            <li>Specialize in a niche</li>
          </ol>
        </div>
      </section>

      <section id="result" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Result</h2>
          <p className="docs-subtitle">You price fairly and earn what you deserve.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/fair-pricing.jpg" alt="Fair pricing" caption="Fair pricing" />
          <p className="docs-text">Good pricing means you can sustain your freelance work and grow your business.</p>
        </div>
      </section>

      <div className="lesson-navigation">
        <div className="lesson-progress">Lesson {lessonMeta.order} / 24</div>
        <div className="lesson-nav-buttons">
          <Link to="/learn/lessons/how-to-find-clients" className="lesson-nav-button">← How to Find Clients</Link>
          <Link to="/learn/lessons/how-to-talk-to-clients" className="lesson-nav-button next">How to Talk →</Link>
        </div>
      </div>
    </div>
  );
}
