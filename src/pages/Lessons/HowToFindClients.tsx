import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";

export const LESSON_SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "where-look", label: "Where to Look" },
  { id: "portfolio", label: "Use Your Portfolio" },
  { id: "reach-out", label: "How to Reach Out" },
  { id: "start-small", label: "Start Small" },
  { id: "result", label: "Result" },
];

export const lessonMeta = {
  slug: "how-to-find-clients",
  title: "How to Find Your First Freelance Clients",
  order: 18,
  isLocked: true,
  category: "Freelance & Money",
  description: "Learn simple ways to find your first freelance clients using your skills.",
  excerpt: "Understand where to look for clients and how to get your first projects.",
  readTime: "7 min",
  image: "https://via.placeholder.com/1280x720?text=Find+Clients",
  videoPlanned: true,
  seoIntent: "find freelance clients web design, first client web designer, freelance beginners guide",
};

type HowToFindClientsProps = { onSectionChange: (sectionId: string) => void };

export default function HowToFindClients({ onSectionChange }: HowToFindClientsProps) {
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
          <p className="docs-text">One of the biggest challenges for beginners is not building websites — it&apos;s finding clients. In this lesson, you will learn simple and realistic ways to get your first projects.</p>
        </div>
      </section>

      <section id="where-look" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Where to Look</h2>
          <p className="docs-subtitle">Start with platforms and communities.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Freelance platforms (Upwork, Fiverr)</li>
            <li>Social media (LinkedIn, Twitter)</li>
            <li>Local business groups</li>
            <li>Your personal network</li>
          </ol>
        </div>
      </section>

      <section id="portfolio" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Use Your Portfolio</h2>
          <p className="docs-subtitle">Show what you can build.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/portfolio-showcase.jpg" alt="Portfolio showcase" caption="Portfolio showcase" />
          <ol className="resource-ordered-list">
            <li>Build 3-5 example projects</li>
            <li>Show different types of sites</li>
            <li>Make it easy to contact you</li>
          </ol>
        </div>
      </section>

      <section id="reach-out" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">How to Reach Out</h2>
          <p className="docs-subtitle">Be proactive, not passive.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/reach-out.jpg" alt="Reach out" caption="Reach out" />
          <ol className="resource-ordered-list">
            <li>Contact small businesses</li>
            <li>Offer a free audit</li>
            <li>Share your portfolio</li>
          </ol>
        </div>
      </section>

      <section id="start-small" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Start Small</h2>
          <p className="docs-subtitle">Your first projects don&apos;t need to be big.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Single page websites</li>
            <li>Local businesses</li>
            <li>Personal projects for friends</li>
          </ol>
        </div>
      </section>

      <section id="result" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Result</h2>
          <p className="docs-subtitle">You get your first client and start building experience.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/first-client.jpg" alt="First client" caption="First client" />
          <p className="docs-text">Finding clients takes effort, but each project makes the next one easier.</p>
        </div>
      </section>

      <div className="lesson-navigation">
        <div className="lesson-progress">Lesson {lessonMeta.order} / 24</div>
        <div className="lesson-nav-buttons">
          <Link to="/learn/lessons/framerkit-for-freelance" className="lesson-nav-button">← FramerKit for Freelance</Link>
          <Link to="/learn/lessons/how-to-price-your-work" className="lesson-nav-button next">How to Price →</Link>
        </div>
      </div>
    </div>
  );
}
