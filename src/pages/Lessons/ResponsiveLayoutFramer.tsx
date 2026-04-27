import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";

// TOC sections for this lesson
export const LESSON_SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "why-matters", label: "Why Responsive Matters" },
  { id: "breakpoints", label: "Breakpoints in Framer" },
  { id: "step-1", label: "Step 1: Start with Desktop" },
  { id: "step-2", label: "Step 2: Adjust for Tablet" },
  { id: "step-3", label: "Step 3: Optimize for Mobile" },
  { id: "keep-simple", label: "Keep It Simple" },
  { id: "result", label: "Result" },
];

// Lesson metadata
export const lessonMeta = {
  slug: "responsive-layout-framer",
  title: "Responsive Layout in Framer: Make Your Design Work Everywhere",
  order: 4,
  isLocked: true,
  category: "Getting Started",
  description: "Learn how to make your layouts responsive and look good on all screen sizes.",
  excerpt: "Understand how to adapt your design for desktop, tablet, and mobile in Framer.",
  readTime: "8 min",
  image: "https://via.placeholder.com/1280x720?text=Responsive+Layout",
  videoPlanned: true,
  seoIntent: "framer responsive design, framer mobile layout, adaptive design framer",
};

type ResponsiveLayoutFramerProps = {
  onSectionChange: (sectionId: string) => void;
};

export default function ResponsiveLayoutFramer({ onSectionChange }: ResponsiveLayoutFramerProps) {
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
            A good layout is not only about how it looks on desktop. 
            It must work across all screen sizes, from large monitors to mobile devices.
          </p>
        </div>
      </section>

      <section id="why-matters" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Why Responsive Design Matters</h2>
          <p className="docs-subtitle">
            Most users will see your site on mobile. If your layout breaks, users leave.
          </p>
        </div>

        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Text becomes unreadable</li>
            <li>Elements overlap</li>
            <li>Buttons are hard to click</li>
          </ol>

          <p className="docs-text">
            Responsive design ensures your layout works everywhere.
          </p>
        </div>
      </section>

      <section id="breakpoints" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Breakpoints in Framer</h2>
          <p className="docs-subtitle">
            Framer allows you to preview your design across different breakpoints.
          </p>
        </div>

        <div className="docs-content-block">
          <ImageFrame
            src="/images/lessons/breakpoint-switcher.jpg"
            alt="Desktop / Tablet / Mobile preview switch"
            caption="Desktop / Tablet / Mobile preview switch"
          />

          <ol className="resource-ordered-list">
            <li>Desktop — main layout</li>
            <li>Tablet — medium screens</li>
            <li>Mobile — small screens</li>
          </ol>
        </div>
      </section>

      <section id="step-1" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Step 1: Start with Desktop</h2>
          <p className="docs-subtitle">
            Always design your layout for desktop first.
          </p>
        </div>

        <div className="docs-content-block">
          <ImageFrame
            src="/images/lessons/desktop-layout.jpg"
            alt="Desktop layout"
            caption="Desktop layout"
          />

          <p className="docs-text">
            Focus on structure and spacing before thinking about smaller screens.
          </p>
        </div>
      </section>

      <section id="step-2" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Step 2: Adjust for Tablet</h2>
          <p className="docs-subtitle">
            Tablet layouts usually require small adjustments.
          </p>
        </div>

        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Reduce spacing</li>
            <li>Stack columns</li>
            <li>Simplify layouts</li>
          </ol>

          <ImageFrame
            src="/images/lessons/tablet-layout.jpg"
            alt="Tablet layout changes"
            caption="Tablet layout changes"
          />
        </div>
      </section>

      <section id="step-3" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Step 3: Optimize for Mobile</h2>
          <p className="docs-subtitle">
            Mobile layouts require more attention because of limited space.
          </p>
        </div>

        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Stack everything vertically</li>
            <li>Increase text readability</li>
            <li>Make buttons larger</li>
          </ol>

          <ImageFrame
            src="/images/lessons/mobile-layout.jpg"
            alt="Mobile layout"
            caption="Mobile layout"
          />
        </div>
      </section>

      <section id="keep-simple" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Keep It Simple</h2>
          <p className="docs-subtitle">
            The simpler your layout, the easier it is to make it responsive.
          </p>
        </div>

        <div className="docs-content-block">
          <ol className="resource-ordered-list">
            <li>Avoid complex nested layouts</li>
            <li>Use consistent spacing</li>
            <li>Stick to simple structures</li>
          </ol>
        </div>
      </section>

      <section id="result" className="docs-section">
        <div className="docs-header">
          <h2 className="docs-section-title">Result</h2>
          <p className="docs-subtitle">
            Your layout works smoothly across all devices and looks clean everywhere.
          </p>
        </div>

        <div className="docs-content-block">
          <ImageFrame
            src="/images/lessons/responsive-all-devices.jpg"
            alt="Same layout across all devices"
            caption="Same layout across all devices"
          />

          <p className="docs-text">
            Responsive design is not about fixing layouts — it&apos;s about building them correctly from the start.
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
            to="/learn/lessons/combine-sections-better-layouts"
            className="lesson-nav-button"
          >
            ← Combine Sections
          </Link>

          <Link
            to="/learn/lessons/navbar-to-cta-flow"
            className="lesson-nav-button next"
          >
            Navbar to CTA Flow →
          </Link>
        </div>
      </div>
    </div>
  );
}
