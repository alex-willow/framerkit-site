import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";

export const LESSON_SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "why-communication", label: "Why Communication Matters" },
  { id: "first-contact", label: "First Contact" },
  { id: "ask-questions", label: "Ask the Right Questions" },
  { id: "set-expectations", label: "Set Clear Expectations" },
  { id: "result", label: "Result" },
];

export const lessonMeta = {
  slug: "how-to-talk-to-clients",
  title: "How to Talk to Clients (Without Stress)",
  order: 20,
  isLocked: true,
  category: "Freelance & Money",
  description: "Learn how to communicate with clients clearly and confidently.",
  excerpt: "Understand how to talk to clients, ask the right questions, and avoid confusion.",
  readTime: "7 min",
  image: "https://via.placeholder.com/1280x720?text=Client+Communication",
  videoPlanned: true,
  seoIntent: "freelance client communication, talk to clients web design, client questions web design",
};

type HowToTalkToClientsProps = { onSectionChange: (sectionId: string) => void };

export default function HowToTalkToClients({ onSectionChange }: HowToTalkToClientsProps) {
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
          <p className="docs-text">Communication is just as important as design. Many beginners lose projects not because of their skills, but because they don&apos;t know how to talk to clients.</p>
        </div>
      </section>

      <section id="why-communication" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Why Communication Matters</h2>
          <p className="docs-subtitle">Good communication builds trust and prevents problems.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Clients hire people they trust</li>
            <li>Clear questions lead to clear results</li>
            <li>Less confusion = less revisions</li>
          </ol>
        </div>
      </section>

      <section id="first-contact" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">First Contact</h2>
          <p className="docs-subtitle">Make a strong first impression.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/first-contact.jpg" alt="First contact" caption="First contact" />
          <ol className="resource-ordered-list">
            <li>Respond quickly</li>
            <li>Be professional but friendly</li>
            <li>Show interest in their project</li>
          </ol>
        </div>
      </section>

      <section id="ask-questions" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Ask the Right Questions</h2>
          <p className="docs-subtitle">Understand the project before you start.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/ask-questions.jpg" alt="Ask questions" caption="Ask questions" />
          <ol className="resource-ordered-list">
            <li>What is the goal of the website?</li>
            <li>Who is the target audience?</li>
            <li>What content do you have?</li>
            <li>What is the deadline?</li>
          </ol>
        </div>
      </section>

      <section id="set-expectations" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Set Clear Expectations</h2>
          <p className="docs-subtitle">Define what you will deliver and when.</p>
        </div>
        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Explain your process</li>
            <li>Set delivery milestones</li>
            <li>Define what&apos;s included</li>
          </ol>
        </div>
      </section>

      <section id="result" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Result</h2>
          <p className="docs-subtitle">You build trust and win more projects.</p>
        </div>
        <div className="docs-content-block">
          <ImageFrame src="/images/lessons/client-trust.jpg" alt="Client trust" caption="Client trust" />
          <p className="docs-text">Good communication turns potential clients into paying clients.</p>
        </div>
      </section>

      <div className="lesson-navigation">
        <div className="lesson-progress">Lesson {lessonMeta.order} / 24</div>
        <div className="lesson-nav-buttons">
          <Link to="/learn/lessons/how-to-price-your-work" className="lesson-nav-button">← How to Price Your Work</Link>
          <Link to="/learn/lessons/deliver-projects-without-revisions" className="lesson-nav-button next">Deliver Projects →</Link>
        </div>
      </div>
    </div>
  );
}
