import { useEffect, useMemo, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import SEO from "../components/SEO";
import { RESOURCES } from "./resourcesData";

type ResourcesPageProps = {
  type: "lessons" | "articles";
};

const getScrollContainer = (element: HTMLElement): Window | HTMLElement => {
  let parent: HTMLElement | null = element.parentElement;

  while (parent) {
    const style = window.getComputedStyle(parent);
    const overflowY = style.overflowY;
    const canScroll = /(auto|scroll|overlay)/.test(overflowY);
    if (canScroll && parent.scrollHeight > parent.clientHeight) {
      return parent;
    }
    parent = parent.parentElement;
  }

  return window;
};

const getGroupId = (groupName: string) =>
  `lesson-${groupName
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")}`;

export default function ResourcesPage({ type }: ResourcesPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const previousScrollTopRef = useRef(0);
  const scrollDirectionRef = useRef<"up" | "down">("down");
  const lockedTargetIdRef = useRef<string | null>(null);
  const suppressAutoHighlightUntilRef = useRef(0);

  const contentType = type === "lessons" ? "lesson" : "article";

  const sortedResources = useMemo(() => {
    return RESOURCES.filter((item) => item.type === contentType).sort((a, b) => {
      const aOrder = a.order ?? 9999;
      const bOrder = b.order ?? 9999;
      return aOrder - bOrder;
    });
  }, [contentType]);

  const groupedResources = useMemo(() => {
    return sortedResources.reduce<Record<string, typeof sortedResources>>(
      (acc, item) => {
        const groupName =
          item.category ?? (type === "lessons" ? "Lessons" : "Articles");

        if (!acc[groupName]) {
          acc[groupName] = [];
        }

        acc[groupName].push(item);
        return acc;
      },
      {}
    );
  }, [sortedResources, type]);


  useEffect(() => {
    if (!location.hash) return;

    const targetId = location.hash.replace("#", "");
    const el = document.getElementById(targetId);

    if (!el) return;

    const timer = window.setTimeout(() => {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(".resource-group[id]")
    );

    if (!sections.length) return;
    const scrollContainer = getScrollContainer(sections[0]);
    const isWindowContainer = scrollContainer === window;
    previousScrollTopRef.current = isWindowContainer
      ? window.scrollY
      : (scrollContainer as HTMLElement).scrollTop;

    const computeActiveSection = () => {
      if (Date.now() < suppressAutoHighlightUntilRef.current) {
        return;
      }

      const containerScrollTop = isWindowContainer
        ? window.scrollY
        : (scrollContainer as HTMLElement).scrollTop;
      const containerViewportHeight = isWindowContainer
        ? window.innerHeight
        : (scrollContainer as HTMLElement).clientHeight;

      const scrollDelta = containerScrollTop - previousScrollTopRef.current;
      if (Math.abs(scrollDelta) >= 4) {
        scrollDirectionRef.current = scrollDelta < 0 ? "up" : "down";
      }
      previousScrollTopRef.current = containerScrollTop;

      const isScrollingUp = scrollDirectionRef.current === "up";
      const BOTTOM_TRIGGER_OFFSET = 110;
      const TOP_TRIGGER_OFFSET = isWindowContainer ? 96 : 24;
      const activationLine = isScrollingUp
        ? containerScrollTop + TOP_TRIGGER_OFFSET
        : containerScrollTop + containerViewportHeight - BOTTOM_TRIGGER_OFFSET;

      let nextActive = sections[0].id;

      const lockedTargetId = lockedTargetIdRef.current;
      if (lockedTargetId) {
        const lockedTargetElement = document.getElementById(lockedTargetId);
        if (lockedTargetElement) {
          const targetTop = isWindowContainer
            ? lockedTargetElement.getBoundingClientRect().top + window.scrollY
            : lockedTargetElement.getBoundingClientRect().top -
              (scrollContainer as HTMLElement).getBoundingClientRect().top +
              (scrollContainer as HTMLElement).scrollTop;

          const distanceToTarget = Math.abs(targetTop - containerScrollTop);
          if (distanceToTarget > 22) {
            const lockedHash = `#${lockedTargetId}`;
            if (location.hash !== lockedHash) {
              navigate(
                {
                  pathname: location.pathname,
                  hash: lockedHash,
                },
                { replace: true }
              );
            }
            return;
          }
        }
        lockedTargetIdRef.current = null;
      }

      if (containerScrollTop <= 8) {
        nextActive = sections[0].id;
      } else {
        sections.forEach((section) => {
          const sectionTop = isWindowContainer
            ? section.getBoundingClientRect().top + window.scrollY
            : section.getBoundingClientRect().top -
              (scrollContainer as HTMLElement).getBoundingClientRect().top +
              (scrollContainer as HTMLElement).scrollTop;

          if (sectionTop <= activationLine) {
            nextActive = section.id;
          }
        });
      }

      const nextHash = `#${nextActive}`;
      if (location.hash === nextHash) return;

      navigate(
        {
          pathname: location.pathname,
          hash: nextHash,
        },
        { replace: true }
      );
    };

    let rafId: number | null = null;
    const onScrollOrResize = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        computeActiveSection();
      });
    };

    computeActiveSection();
    if (isWindowContainer) {
      window.addEventListener("scroll", onScrollOrResize, { passive: true });
    } else {
      (scrollContainer as HTMLElement).addEventListener("scroll", onScrollOrResize, {
        passive: true,
      });
    }
    window.addEventListener("resize", onScrollOrResize);

    const handleResourcesNavClick = (event: Event) => {
      const detail = (
        event as CustomEvent<{ id?: string }>
      ).detail;
      const targetId = detail?.id;
      if (!targetId) return;
      lockedTargetIdRef.current = targetId;
      suppressAutoHighlightUntilRef.current = Date.now() + 250;
    };

    window.addEventListener(
      "framerkit-resources-nav-click",
      handleResourcesNavClick as EventListener
    );

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      if (isWindowContainer) {
        window.removeEventListener("scroll", onScrollOrResize);
      } else {
        (scrollContainer as HTMLElement).removeEventListener("scroll", onScrollOrResize);
      }
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener(
        "framerkit-resources-nav-click",
        handleResourcesNavClick as EventListener
      );
    };
  }, [type, location.pathname, navigate, location.hash]);

  const pageTitle = type === "lessons" ? "Lessons" : "Articles";
  const pageDescription =
    type === "lessons"
      ? "Step-by-step FramerKit lessons that help you build real pages, improve workflow, and move from basics to freelance-ready projects."
      : "Practical FramerKit articles about design systems, workflow decisions, structure, and better website building.";

  const canonical =
    type === "lessons"
      ? "https://www.framerkit.site/learn/lessons"
      : "https://www.framerkit.site/learn/articles";

  return (
    <div className="layout-catalog-page">
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={
          type === "lessons"
            ? "framer lessons, framer tutorials, framerkit lessons, build websites in framer"
            : "framer articles, framer design system, framer workflow, framerkit articles"
        }
        canonical={canonical}
      />

      <div className="component-page-header resources-page-header">
        <nav className="component-breadcrumb">
          <span className="breadcrumb-current">{pageTitle}</span>
        </nav>

        <h2 className="component-page-title">{pageTitle}</h2>
        <p className="component-page-description">{pageDescription}</p>
      </div>

      <div className="gallery-scroll-area layout-catalog-scroll-area">
        <div className="resource-groups">
          {Object.entries(groupedResources).map(([groupName, items]) => {
            const groupId = getGroupId(groupName);

            return (
              <section
                key={groupName}
                id={groupId}
                className="resource-group"
                style={{ scrollMarginTop: "110px" }}
              >
                <div className="gallery layout-catalog-grid">
                  <div className="resource-group-header resource-group-header-grid">
                    <h3 className="resource-group-title">{groupName}</h3>
                    <span className="resource-group-count">
                      {items.length} {items.length === 1 ? "item" : "items"}
                    </span>
                  </div>

                  {items.map((item) => {
                    const cardContent = (
                      <>
                        <div className="cardImage resource-card-image">
                          {type === "lessons" && item.order ? (
                            <>
                              <img
                                src={`/images/Lesson-${String(item.order).padStart(2, "0")}.png`}
                                alt={item.title}
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                  const fallback =
                                    e.currentTarget.nextElementSibling as HTMLElement | null;
                                  if (fallback) {
                                    fallback.style.display = "flex";
                                  }
                                }}
                              />

                        <div className={`resource-image-placeholder resource-image-placeholder--${type}`}>
                          <div className="resource-image-label">
                            {item.isLocked ? "" : ""}
                          </div>
                        </div>
                            </>
                          ) : (
                            <div
                              className={`resource-image-placeholder resource-image-placeholder--${type}`}
                            >
                              <div className="resource-image-label">
                                {type === "lessons" && item.order
                                  ? `Lesson ${String(item.order).padStart(2, "0")}`
                                  : "Article"}
                              </div>
                            </div>
                          )}

                          
                        </div>

                        <div className="resource-card-body">
                          
                          <h3 className="resource-card-title">{item.title}</h3>
                          <p className="resource-card-text">{item.description}</p>

                          <div className="resource-card-footer">
                              <span className="resource-time">
                                  {item.readTime}
                                </span>

                              <span className="iconButton">
                                <ArrowUpRight size={16} />
                              </span>
                          </div>
                        </div>
                      </>
                    );

                    return (
                      <Link
                        key={item.slug}
                        to={`/${
                          type === "lessons"
                            ? "learn/lessons"
                            : "learn/articles"
                        }/${item.slug}`}
                        className="card"
                      >
                        {cardContent}
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
