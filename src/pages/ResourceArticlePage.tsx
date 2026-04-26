import { useEffect, useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import SEO from "../components/SEO";
import { RESOURCES, RESOURCE_BY_SLUG } from "./resourcesData";

const toLessonGroupId = (groupName: string) =>
  `lesson-${groupName
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")}`;

export default function ResourceArticlePage() {
  const { slug = "" } = useParams();
  const location = useLocation();
  const resource = RESOURCE_BY_SLUG[slug];

  const isLessonRoute = location.pathname.startsWith("/learn/lessons");


  const baseListPath = isLessonRoute ? "/learn/lessons" : "/learn/articles";
  const baseLabel = isLessonRoute ? "Lessons" : "Articles";

  const lessons = useMemo(() => {
    return RESOURCES
      .filter((item) => item.type === "lesson")
      .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
  }, []);

  const currentLessonIndex = useMemo(() => {
    if (!resource || resource.type !== "lesson") return -1;
    return lessons.findIndex((item) => item.slug === resource.slug);
  }, [lessons, resource]);

  const previousLesson =
    currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null;

  const nextLesson =
    currentLessonIndex >= 0 && currentLessonIndex < lessons.length - 1
      ? lessons[currentLessonIndex + 1]
      : null;


      useEffect(() => {
        const containers = Array.from(
          document.querySelectorAll<HTMLElement>(".docs-hover-video")
        );
      
        const cleanups: Array<() => void> = [];
      
        containers.forEach((container) => {
          const video = container.querySelector("video");
          if (!video) return;
      
          const handleMouseEnter = async () => {
            try {
              await video.play();
            } catch {}
          };
      
          const handleMouseLeave = () => {
            video.pause();
            video.currentTime = 0;
          };
      
          container.addEventListener("mouseenter", handleMouseEnter);
          container.addEventListener("mouseleave", handleMouseLeave);
      
          cleanups.push(() => {
            container.removeEventListener("mouseenter", handleMouseEnter);
            container.removeEventListener("mouseleave", handleMouseLeave);
          });
        });
      
        return () => {
          cleanups.forEach((fn) => fn());
        };
      }, [resource]);    

  if (!resource) {
    return (
      <div className="home-docs-layout">
        <section className="docs-overview">
          <div className="docs-header">
            <h1 className="docs-title">Resource Not Found</h1>
            <p className="docs-subtitle">This page does not exist yet.</p>
          </div>

          <p className="docs-text">
            Go back to{" "}
            <Link to="/learn/lessons" className="breadcrumb-link">
              Lessons
            </Link>
            .
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="home-docs-layout">
      <SEO
        title={resource.title}
        description={resource.description}
        keywords={resource.seoIntent}
        canonical={`https://www.framerkit.site${baseListPath}/${resource.slug}`}
      />

      <section className="docs-overview">
        <div className="docs-header">
          <nav className="component-breadcrumb">
            <Link to={baseListPath} className="breadcrumb-link">
              {baseLabel}
            </Link>
            {resource.category ? (
              <>
                <span className="breadcrumb-separator">›</span>
                <Link
                  to={`${baseListPath}#${toLessonGroupId(resource.category)}`}
                  className="breadcrumb-link"
                >
                  {resource.category}
                </Link>
              </>
            ) : null}
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">{resource.title}</span>
          </nav>

          <h1 className="docs-title">{resource.title}</h1>
          <p className="docs-subtitle">{resource.description}</p>
        </div>

        <div className="docs-content-block">
          <div className="docs-image-placeholder" style={{ marginTop: 0 }}>
            <span>Image placeholder: add article cover (1280x720)</span>
          </div>
        </div>

        {resource.slug === "framerkit-workflow-basics" ? (
          <>
            <div className="docs-content-block">
              <p className="resource-article-excerpt">
                This lesson gives you a clean FramerKit workflow from first
                structure to final copy-ready page, without confusion in modes.
                The goal is to keep work predictable, easy to edit, and fast to
                publish.
              </p>
            </div>

            <section className="docs-content-block">
              <h3 className="docs-section-title">What You Will Build</h3>
              <p className="docs-text">
                You will assemble a full first-pass page with FramerKit
                sections: Navbar, Hero, Feature, Social Proof, Pricing, FAQ, and
                CTA. By the end, you will have a clear structure that is easy to
                iterate and improve.
              </p>
            </section>

            <section className="docs-content-block">
              <h3 className="docs-section-title">
                Step 1: Choose Sections by Flow
              </h3>
              <p className="docs-text">
                Start from the Layout library and pick one section per role.
                Focus on story order first: what users see first, why it
                matters, and where they click next.
              </p>
              <p className="docs-text">Recommended base order:</p>
              <ol className="resource-ordered-list">
                <li>Navbar with one primary action</li>
                <li>Hero with one headline and one CTA</li>
                <li>Feature section for value explanation</li>
                <li>Testimonial or logo section for trust</li>
                <li>Pricing with one clearly highlighted choice</li>
                <li>FAQ for objections</li>
                <li>Final CTA and clean footer</li>
              </ol>
            </section>

            <section className="docs-content-block">
              <h3 className="docs-section-title">
                Step 2: Understand Wireframe and Design Correctly
              </h3>
              <p className="docs-text">
                Wireframe and Design are the same section types. Both are
                copy-ready. The difference is only visual state:
              </p>
              <ol className="resource-ordered-list">
                <li>
                  Wireframe: simpler/empty visual version for structure speed
                </li>
                <li>
                  Design: same section with image/placeholder visual context
                </li>
              </ol>
              <p className="docs-text">
                So you can copy either option depending on your task, not
                because they are different components.
              </p>
            </section>

            <section className="docs-content-block">
              <h3 className="docs-section-title">
                Step 3: Keep Content Practical
              </h3>
              <p className="docs-text">
                Keep copy short before visual polish. Long placeholder text
                breaks spacing and creates fake layout decisions. Use one intent
                per section and one primary action per screen.
              </p>
              <p className="docs-text">Quick consistency checklist:</p>
              <ol className="resource-ordered-list">
                <li>Same primary button style in navbar, hero, and CTA</li>
                <li>Consistent border radius across cards</li>
                <li>One heading scale system (H1/H2/H3)</li>
                <li>Predictable vertical rhythm between sections</li>
                <li>Dark mode readability check on all key actions</li>
              </ol>
            </section>

            <section className="docs-content-block">
              <h3 className="docs-section-title">
                Step 4: QA and Search Intent
              </h3>
              <p className="docs-text">
                Test CTA flow on desktop and mobile. Remove repeated messages
                and keep only the strongest section for each purpose.
              </p>
              <p className="docs-text">
                For Google visibility, keep topic intent obvious in title, hero
                heading, and section headers. Clear intent helps both users and
                search indexing.
              </p>
            </section>

            {resource.type === "lesson" && (
              <div className="docs-content-block">
                <div
                  className="docs-image-placeholder"
                  style={{ aspectRatio: "16 / 9" }}
                >
                  <span>
                    Video placeholder: add walkthrough embed (YouTube/Vimeo) +
                    short summary + timestamps
                  </span>
                </div>
              </div>
            )}

            <p className="docs-text">
              SEO focus: {resource.seoIntent}. This lesson targets real Framer
              users who need a clear production workflow, not theory.
            </p>
          </>
        ) : resource.content ? (
          <>
            <div
              className="resource-article-content"
              dangerouslySetInnerHTML={{ __html: resource.content }}
            />
            <p className="docs-text">
              SEO focus: {resource.seoIntent}. This page is prepared as a
              dedicated route with clear topic intent for Framer users.
            </p>
          </>
        ) : (
          <>
            <div className="docs-content-block">
              <p className="docs-text">{resource.excerpt}</p>
            </div>

            {resource.type === "lesson" && (
              <div className="docs-content-block">
                <div
                  className="docs-image-placeholder"
                  style={{ aspectRatio: "16 / 9" }}
                >
                  <span>
                    Video placeholder: add walkthrough embed (YouTube/Vimeo) +
                    short summary + timestamps
                  </span>
                </div>
              </div>
            )}

            <p className="docs-text">
              SEO focus: {resource.seoIntent}. This page is prepared as a
              dedicated route with clear topic intent for Framer users.
            </p>
          </>
        )}

        {resource.type === "lesson" && (
          <div className="lesson-navigation">
            <div className="lesson-progress">
              Lesson {resource.order ?? currentLessonIndex + 1} / {lessons.length}
            </div>

            <div className="lesson-nav-buttons">
              {previousLesson ? (
                <Link
                  to={`/learn/lessons/${previousLesson.slug}`}
                  className="lesson-nav-button"
                >
                  ← {previousLesson.title}
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link
                  to={`/learn/lessons/${nextLesson.slug}`}
                  className="lesson-nav-button next"
                >
                  {nextLesson.title} →
                </Link>
              ) : null}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
