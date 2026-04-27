import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";

// TOC sections for this lesson
export const LESSON_SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "why-flow", label: "Why Flow Matters" },
  { id: "ideal-flow", label: "The Ideal Flow" },
  { id: "navbar", label: "Navbar: Keep It Simple" },
  { id: "hero", label: "Hero: First Impression" },
  { id: "build-trust", label: "Build Trust" },
  { id: "cta", label: "CTA: Make It Clear" },
  { id: "result", label: "Result" },
];

// Lesson metadata
export const lessonMeta = {
  slug: "navbar-to-cta-flow",
  title: "Navbar to CTA: Guide Users Through Your Page",
  order: 5,
  isLocked: true,
  category: "Getting Started",
  description: "Learn how to structure your page so users clearly understand what to do and where to click.",
  excerpt: "Understand how to guide users from the first screen to the final action.",
  readTime: "8 min",
  image: "https://via.placeholder.com/1280x720?text=Navbar+to+CTA",
  videoPlanned: true,
  seoIntent: "landing page structure ux, navbar to cta flow, conversion design framer",
};

type NavbarToCtaFlowProps = {
  onSectionChange: (sectionId: string) => void;
};

export default function NavbarToCtaFlow({ onSectionChange }: NavbarToCtaFlowProps) {
  const location = useLocation();
  const onSectionChangeRef = useRef(onSectionChange);
  const suppressSidebarUntilRef = useRef(0);

  useEffect(() => {
    onSectionChangeRef.current = onSectionChange;
  }, [onSectionChange]);

  // Hash scroll
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

  // Intersection Observer for sidebar highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < suppressSidebarUntilRef.current) return;

        const visible = entries.find((e) => e.isIntersecting);
        if (visible) {
          onSectionChangeRef.current(visible.target.id);
        }
      },
      {
        root: null,
        threshold: 0.2,
        rootMargin: "-20% 0px -20% 0px",
      }
    );

    LESSON_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-docs-layout">
      <SEO
        title={lessonMeta.title}
        description={lessonMeta.description}
        keywords={lessonMeta.seoIntent}
        canonical={`https://www.framerkit.site/learn/lessons/${lessonMeta.slug}`}
      />

      <section id="intro" className="docs-overview">
        <div className="docs-header">
          <nav className="component-breadcrumb">
            <Link to="/learn/lessons" className="breadcrumb-link">
              Lessons
            </Link>
            <span className="breadcrumb-separator">›</span>
            <Link to="/learn/lessons#lesson-getting-started" className="breadcrumb-link">
              Getting Started
            </Link>
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
          <p className="docs-text">
            A good page is not just a collection of sections. 
            It is a guided experience that leads users from the first impression to a clear action.
          </p>
        </div>
      </section>

      <section id="why-flow" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Why Flow Matters</h2>
          <p className="docs-subtitle">
            Users don&apos;t read pages randomly. They scan and decide quickly whether to stay or leave.
          </p>
        </div>

        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Confusing layout → users leave</li>
            <li>No clear action → no clicks</li>
            <li>Weak structure → low conversion</li>
          </ol>

          <p className="docs-text">
            A clear flow solves this problem.
          </p>
        </div>
      </section>

      <section id="ideal-flow" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">The Ideal Flow</h2>
          <p className="docs-subtitle">
            Each section has a clear role in guiding the user forward.
          </p>
        </div>

        <div className="docs-content-block">
          <ImageFrame
            src="/images/lessons/page-flow-navbar-cta.jpg"
            alt="Page flow from navbar to CTA"
            caption="Page flow from navbar to CTA"
          />

          <ol className="resource-ordered-list">
            <li>Navbar — navigation and first action</li>
            <li>Hero — explain what this is</li>
            <li>Feature — explain why it matters</li>
            <li>Social proof — build trust</li>
            <li>CTA — guide user to action</li>
          </ol>
        </div>
      </section>

      <section id="navbar" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Navbar: Keep It Simple</h2>
          <p className="docs-subtitle">
            Your navbar should not overwhelm the user.
          </p>
        </div>

        <div className="docs-content-block">
          <ImageFrame
            src="/images/lessons/simple-navbar.jpg"
            alt="Simple navbar with one primary button"
            caption="Simple navbar with one primary button"
          />

          <ol className="resource-ordered-list">
            <li>Limit number of links</li>
            <li>Use one primary CTA button</li>
            <li>Keep it clean and readable</li>
          </ol>
        </div>
      </section>

      <section id="hero" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Hero: First Impression</h2>
          <p className="docs-subtitle">
            The hero section must instantly explain what your product or service is.
          </p>
        </div>

        <div className="docs-content-block">
          <ImageFrame
            src="/images/lessons/strong-hero.jpg"
            alt="Strong hero section"
            caption="Strong hero section"
          />

          <ol className="resource-ordered-list">
            <li>Clear headline</li>
            <li>Short description</li>
            <li>Primary CTA</li>
          </ol>
        </div>
      </section>

      <section id="build-trust" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Build Trust</h2>
          <p className="docs-subtitle">
            Users need to trust your product before taking action.
          </p>
        </div>

        <div className="docs-content-block">
          <ImageFrame
            src="/images/lessons/testimonials-logos.jpg"
            alt="Testimonials or logos"
            caption="Testimonials or logos for trust"
          />

          <ol className="resource-ordered-list">
            <li>Testimonials</li>
            <li>Client logos</li>
            <li>Numbers or metrics</li>
          </ol>
        </div>
      </section>

      <section id="cta" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">CTA: Make It Clear</h2>
          <p className="docs-subtitle">
            The call to action should be obvious and easy to follow.
          </p>
        </div>

        <div className="docs-content-block">
          <ImageFrame
            src="/images/lessons/strong-cta.jpg"
            alt="Strong CTA section"
            caption="Strong CTA section"
          />

          <ol className="resource-ordered-list">
            <li>Clear action text</li>
            <li>Visible button</li>
            <li>No confusion</li>
          </ol>
        </div>
      </section>

      <section id="result" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Result</h2>
          <p className="docs-subtitle">
            Users understand your page, trust your product, and know exactly what to do next.
          </p>
        </div>

        <div className="docs-content-block">
          <ImageFrame
            src="/images/lessons/clean-user-flow.jpg"
            alt="Clean user flow from top to bottom"
            caption="Clean user flow from top to bottom"
          />

          <p className="docs-text">
            Good design is not just visual — it guides users toward action. 
            A clear flow turns visitors into users.
          </p>
        </div>
      </section>

      {/* Lesson Navigation */}
      <div className="lesson-navigation">
        <div className="lesson-progress">
          Lesson {lessonMeta.order} / 24
        </div>

        <div className="lesson-nav-buttons">
          <Link
            to="/learn/lessons/responsive-layout-framer"
            className="lesson-nav-button"
          >
            ← Responsive Layout
          </Link>

          <div /> {/* No next lesson - end of Getting Started */}
        </div>
      </div>
    </div>
  );
}
