import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/SEO";
import ImageFrame from "../../components/ImageFrame";
import HoverVideo from "../../components/HoverVideo";

// Sidebar sections for this lesson
export const LESSON_SECTIONS = [
  { id: "intro", title: "Introduction" },
  { id: "what-build", title: "What You Will Build" },
  { id: "step-1", title: "Step 1: Add Hero Section" },
  { id: "step-2", title: "Step 2: Add Feature Section" },
  { id: "step-3", title: "Step 3: Add Social Proof" },
  { id: "step-4", title: "Step 4: Add CTA" },
  { id: "step-5", title: "Step 5: Apply Styles" },
  { id: "result", title: "Result" },
];

// Lesson metadata
export const lessonMeta = {
  slug: "build-first-landing-fast",
  title: "Build Your First Landing Fast",
  order: 1,
  isLocked: false,
  category: "Getting Started",
  description: "Build a complete landing page in Framer using FramerKit sections in minutes.",
  excerpt: "Learn how to quickly assemble a landing page using sections and basic structure.",
  readTime: "8 min",
  image: "https://via.placeholder.com/1280x720?text=Build+Landing+Fast",
  videoPlanned: true,
  seoIntent: "framer landing page tutorial, build landing fast framer, framerkit sections",
};

type BuildFirstLandingFastProps = {
  onSectionChange: (sectionId: string) => void;
};

export default function BuildFirstLandingFast({ onSectionChange }: BuildFirstLandingFastProps) {
  const location = useLocation();
  const onSectionChangeRef = useRef(onSectionChange);

  useEffect(() => {
    onSectionChangeRef.current = onSectionChange;
  }, [onSectionChange]);

  // Hash scroll
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (!hash) return;

    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: "auto", block: "start" });
      onSectionChangeRef.current(hash);
    }
  }, [location]);

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

        <div className="docs-content-block">
          <p className="docs-text">
            In this lesson, you will build a complete landing page using FramerKit sections. 
            The goal is not to design from scratch, but to assemble a clean and working structure quickly.
          </p>
        </div>

        <ImageFrame
          src="/images/lessons/final-landing-structure.jpg"
          alt="Final landing page structure"
          caption="The landing page you will build"
        />
      </section>

      {/* What You Will Build */}
      <section id="what-build" className="docs-content-block">
        <h3 className="docs-section-title">What You Will Build</h3>

        <p className="docs-text">
          You will create a landing page with a clear structure using ready-made sections.
        </p>

        <ol className="resource-ordered-list">
          <li>Hero section</li>
          <li>Feature section</li>
          <li>Social proof</li>
          <li>CTA section</li>
          <li>Footer</li>
        </ol>
      </section>

      {/* Step 1 */}
      <section id="step-1" className="docs-content-block">
        <h3 className="docs-section-title">Step 1: Add Hero Section</h3>

        <p className="docs-text">
          Start by adding a Hero section. This is the first thing users see, so keep it simple and clear.
        </p>

        <ImageFrame
          src="/images/lessons/hero-section-library.jpg"
          alt="Hero section in library"
          caption="Choose any Hero you like from the library"
        />

        <p className="docs-text">
          Choose any Hero you like and copy it into your Framer project.
        </p>
      </section>

      {/* Step 2 */}
      <section id="step-2" className="docs-content-block">
        <h3 className="docs-section-title">Step 2: Add Feature Section</h3>

        <p className="docs-text">
          Next, explain your product or service using a Feature section.
        </p>

        <ImageFrame
          src="/images/lessons/feature-sections.jpg"
          alt="Feature sections"
          caption="Pick a feature layout that matches your content"
        />

        <p className="docs-text">
          Keep the content short and focused on value.
        </p>
      </section>

      {/* Step 3 */}
      <section id="step-3" className="docs-content-block">
        <h3 className="docs-section-title">Step 3: Add Social Proof</h3>

        <p className="docs-text">
          Add testimonials or logos to build trust.
        </p>

        <ImageFrame
          src="/images/lessons/social-proof-sections.jpg"
          alt="Social proof sections"
          caption="Use testimonials or logos for credibility"
        />
      </section>

      {/* Step 4 */}
      <section id="step-4" className="docs-content-block">
        <h3 className="docs-section-title">Step 4: Add CTA</h3>

        <p className="docs-text">
          Add a clear call to action that tells users what to do next.
        </p>

        <ImageFrame
          src="/images/lessons/cta-sections.jpg"
          alt="CTA sections"
          caption="Choose a CTA that matches your goal"
        />
      </section>

      {/* Step 5 */}
      <section id="step-5" className="docs-content-block">
        <h3 className="docs-section-title">Step 5: Apply Styles</h3>

        <p className="docs-text">
          Apply a Color Set and Text Styles to make your page consistent.
        </p>

        <ol className="resource-ordered-list">
          <li>Apply Color Set</li>
          <li>Apply Text Styles</li>
        </ol>

        <p className="docs-text">
          This step makes your layout look clean instantly.
        </p>

        <HoverVideo
          src="/videos/apply-styles-demo.mp4"
          caption="Watch how to apply styles in seconds"
        />
      </section>

      {/* Result */}
      <section id="result" className="docs-content-block">
        <h3 className="docs-section-title">Result</h3>

        <ImageFrame
          src="/images/lessons/final-result.jpg"
          alt="Final clean landing page"
          caption="Your finished landing page"
        />

        <p className="docs-text">
          You now have a complete landing page built in minutes using FramerKit.
        </p>

        <p className="docs-text">
          This approach lets you focus on structure and content instead of spending time building layouts from scratch.
        </p>
      </section>

      {/* Lesson Navigation */}
      <div className="lesson-navigation">
        <div className="lesson-progress">
          Lesson {lessonMeta.order} / 24
        </div>

        <div className="lesson-nav-buttons">
          <div /> {/* No previous */}

          <Link
            to="/learn/lessons/templates-vs-sections-framerkit"
            className="lesson-nav-button next"
          >
            Templates vs Sections →
          </Link>
        </div>
      </div>
    </div>
  );
}
