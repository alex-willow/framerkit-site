import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";

export const LESSON_SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "why-revisions", label: "Why Revisions Happen" },
  { id: "clear-process", label: "Set a Clear Process" },
  { id: "approval", label: "Get Approval Early" },
  { id: "limits", label: "Set Revision Limits" },
  { id: "result", label: "Result" },
];

export const lessonMeta = {
  slug: "deliver-projects-without-revisions",
  title: "How to Deliver Projects (Without Endless Revisions)",
  order: 21,
  isLocked: true,
  category: "Freelance & Money",
  description: "Learn how to deliver projects smoothly and avoid endless revisions.",
  excerpt: "Understand how to structure your process to keep projects under control.",
  readTime: "7 min",
  image: "https://via.placeholder.com/1280x720?text=Project+Delivery",
  videoPlanned: true,
  seoIntent: "freelance project delivery, avoid revisions web design, client revisions problem",
};

type DeliverProjectsWithoutRevisionsProps = { onSectionChange: (sectionId: string) => void };

export default function DeliverProjectsWithoutRevisions({ onSectionChange }: DeliverProjectsWithoutRevisionsProps) {
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
          <p className="docs-text">Many freelancers struggle with endless revisions. Projects drag on, clients keep asking for changes, and the process becomes stressful. This lesson will help you avoid that.</p>
        </div>
      </section>

      <section id="why-revisions" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Why Revisions Happen</h2>
          <p className="docs-subtitle">Understanding the root cause helps you prevent them.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Unclear expectations</li>
            <li>No approval process</li>
            <li>Unlimited changes</li>
          </ol>
        </div>
      </section>

      <section id="clear-process" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Set a Clear Process</h2>
          <p className="docs-subtitle">Define how you work from the beginning.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/clear-process.jpg" alt="Clear process" caption="Clear process" />
          <ol className="resource-ordered-list">
            <li>Explain your workflow</li>
            <li>Set milestones</li>
            <li>Define deliverables</li>
          </ol>
        </div>
      </section>

      <section id="approval" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Get Approval Early</h2>
          <p className="docs-subtitle">Don&apos;t wait until the end to show your work.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/early-approval.jpg" alt="Early approval" caption="Early approval" />
          <ol className="resource-ordered-list">
            <li>Show wireframes first</li>
            <li>Confirm structure</li>
            <li>Then add details</li>
          </ol>
        </div>
      </section>

      <section id="limits" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Set Revision Limits</h2>
          <p className="docs-subtitle">Protect your time and scope.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Include 2-3 rounds in your price</li>
            <li>Charge extra for more</li>
            <li>Be clear upfront</li>
          </ol>
        </div>
      </section>

      <section id="result" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Result</h2>
          <p className="docs-subtitle">Projects finish on time and clients are satisfied.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/project-delivered.jpg" alt="Project delivered" caption="Project delivered" />
          <p className="docs-text">Clear process and boundaries lead to smoother projects and happier clients.</p>
        </div>
      </section>

      <div className="lesson-navigation">
        <div className="lesson-progress">Lesson {lessonMeta.order} / 24</div>
        <div className="lesson-nav-buttons">
          <Link to="/learn/lessons/how-to-talk-to-clients" className="lesson-nav-button">← How to Talk to Clients</Link>
          <Link to="/learn/lessons/build-faster-with-templates" className="lesson-nav-button next">Build Faster →</Link>
        </div>
      </div>
    </div>
  );
}
