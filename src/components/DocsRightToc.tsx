import { useEffect, useMemo, useRef, useState } from "react";

type TocSection = {
  id: string;
  label: string;
};

type DocsRightTocProps = {
  sections: TocSection[];
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

export default function DocsRightToc({ sections }: DocsRightTocProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const sectionIds = useMemo(() => sections.map((section) => section.id), [sections]);
  const tocRef = useRef<HTMLElement | null>(null);
  const tocListRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const suppressAutoHighlightUntilRef = useRef(0);
  const lockedTargetIdRef = useRef<string | null>(null);
  const desiredSectionTopRef = useRef<number | null>(null);
  const previousScrollTopRef = useRef(0);
  const scrollDirectionRef = useRef<"up" | "down">("down");

  useEffect(() => {
    const initialHash = window.location.hash.replace("#", "");
    if (initialHash && sectionIds.includes(initialHash)) {
      setActiveId(initialHash);
    }
  }, [sectionIds]);

  useEffect(() => {
    const overview = document.getElementById("overview");
    if (!overview) return;

    const scrollContainer = getScrollContainer(overview);
    const isWindowContainer = scrollContainer === window;

    const measureDesiredTop = () => {
      const overviewRect = overview.getBoundingClientRect();
      if (isWindowContainer) {
        desiredSectionTopRef.current = overviewRect.top;
      } else {
        const containerRect = (scrollContainer as HTMLElement).getBoundingClientRect();
        desiredSectionTopRef.current = overviewRect.top - containerRect.top;
      }
    };

    measureDesiredTop();
    window.addEventListener("resize", measureDesiredTop);
    return () => {
      window.removeEventListener("resize", measureDesiredTop);
    };
  }, []);

  useEffect(() => {
    const sectionElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (!sectionElements.length) return;
    const scrollContainer = getScrollContainer(sectionElements[0]);
    const isWindowContainer = scrollContainer === window;
    previousScrollTopRef.current = isWindowContainer ? window.scrollY : (scrollContainer as HTMLElement).scrollTop;

    const computeActiveSection = () => {
      if (Date.now() < suppressAutoHighlightUntilRef.current) {
        return;
      }

      const lockedTargetId = lockedTargetIdRef.current;
      if (lockedTargetId) {
        const lockedTargetElement = document.getElementById(lockedTargetId);
        if (lockedTargetElement) {
          const targetTop = isWindowContainer
            ? lockedTargetElement.getBoundingClientRect().top + window.scrollY
            : lockedTargetElement.getBoundingClientRect().top -
              (scrollContainer as HTMLElement).getBoundingClientRect().top +
              (scrollContainer as HTMLElement).scrollTop;

          const containerScrollTopForLock = isWindowContainer
            ? window.scrollY
            : (scrollContainer as HTMLElement).scrollTop;
          const distanceToTarget = Math.abs(targetTop - containerScrollTopForLock);

          if (distanceToTarget > 22) {
            setActiveId((current) => (current === lockedTargetId ? current : lockedTargetId));
            return;
          }
        }
        lockedTargetIdRef.current = null;
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
      const isScrollingUp = scrollDirectionRef.current === "up";
      previousScrollTopRef.current = containerScrollTop;
      const BOTTOM_TRIGGER_OFFSET = 110;
      const TOP_TRIGGER_OFFSET = isWindowContainer ? 96 : 24;
      const activationLine = isScrollingUp
        ? containerScrollTop + TOP_TRIGGER_OFFSET
        : containerScrollTop + containerViewportHeight - BOTTOM_TRIGGER_OFFSET;
      let nextActive = sectionElements[0].id;

      if (containerScrollTop <= 8) {
        setActiveId((current) => (current === sectionElements[0].id ? current : sectionElements[0].id));
        return;
      }

      sectionElements.forEach((sectionElement) => {
        const sectionTop = isWindowContainer
          ? sectionElement.getBoundingClientRect().top + window.scrollY
          : sectionElement.getBoundingClientRect().top -
            (scrollContainer as HTMLElement).getBoundingClientRect().top +
            (scrollContainer as HTMLElement).scrollTop;

        if (sectionTop <= activationLine) {
          nextActive = sectionElement.id;
        }
      });

      setActiveId((current) => {
        if (current === nextActive) return current;

        // Hysteresis to prevent rapid flip-flop near the section boundary.
        const nextEl = sectionElements.find((el) => el.id === nextActive);
        if (!nextEl) return nextActive;

        const nextTop = isWindowContainer
          ? nextEl.getBoundingClientRect().top + window.scrollY
          : nextEl.getBoundingClientRect().top -
            (scrollContainer as HTMLElement).getBoundingClientRect().top +
            (scrollContainer as HTMLElement).scrollTop;
        const boundaryDistance = Math.abs(activationLine - nextTop);

        if (boundaryDistance < 14) {
          return current;
        }

        return nextActive;
      });
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
      (scrollContainer as HTMLElement).addEventListener("scroll", onScrollOrResize, { passive: true });
    }
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("hashchange", onScrollOrResize);

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
      window.removeEventListener("hashchange", onScrollOrResize);
    };
  }, [sectionIds]);

  const handleSectionClick = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const scrollContainer = getScrollContainer(target);
    const isWindowContainer = scrollContainer === window;

    const targetTop = isWindowContainer
      ? target.getBoundingClientRect().top + window.scrollY
      : target.getBoundingClientRect().top -
        (scrollContainer as HTMLElement).getBoundingClientRect().top +
        (scrollContainer as HTMLElement).scrollTop;

    const desiredTop = desiredSectionTopRef.current ?? (isWindowContainer ? 124 : 14);
    const nextTop = Math.max(0, targetTop - desiredTop);

    suppressAutoHighlightUntilRef.current = Date.now() + 420;
    lockedTargetIdRef.current = id;
    if (isWindowContainer) {
      window.scrollTo({ top: nextTop, behavior: "smooth" });
    } else {
      (scrollContainer as HTMLElement).scrollTo({ top: nextTop, behavior: "smooth" });
    }
    window.history.replaceState({}, "", `/#${id}`);
    setActiveId(id);
  };

  useEffect(() => {
    const INDICATOR_LENGTH = 22;
    const updateIndicatorPosition = () => {
      const toc = tocRef.current;
      const tocList = tocListRef.current;
      const activeItem = itemRefs.current[activeId];
      if (!toc || !tocList || !activeItem) return;
      const tocRect = tocList.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      const centeredY = itemRect.top - tocRect.top + itemRect.height / 2 - INDICATOR_LENGTH / 2;
      const maxY = Math.max(0, tocRect.height - INDICATOR_LENGTH);
      const clampedY = Math.max(0, Math.min(centeredY, maxY));
      tocList.style.setProperty("--toc-snake-length", `${INDICATOR_LENGTH}px`);
      tocList.style.setProperty("--toc-snake-y", `${clampedY}px`);
      tocList.classList.add("is-snake-ready");
    };

    updateIndicatorPosition();
    const onResize = () => updateIndicatorPosition();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [activeId, sections]);

  return (
    <aside className="docs-right-toc" aria-label="On this page" ref={tocRef}>
      <nav className="docs-right-toc-list" ref={tocListRef}>
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            className={`docs-right-toc-item ${activeId === section.id ? "active" : ""}`}
            onClick={() => handleSectionClick(section.id)}
            ref={(node) => {
              itemRefs.current[section.id] = node;
            }}
          >
            {section.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
