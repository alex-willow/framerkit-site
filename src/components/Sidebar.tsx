import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, Dispatch, MouseEvent, SetStateAction } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  LifeBuoy,
  History,
  LogOut,
  Search,
  X,
} from "lucide-react";
import { trackGtagEvent } from "../utils/gtag";
import { fetchJsonWithCache } from "../lib/remoteCache";
import { RESOURCES, RESOURCE_BY_SLUG } from "../pages/resourcesData";
import { useCatalogManifest } from "../hooks/useCatalogManifest";
import {
  getComponentSectionUrl,
  getLayoutSectionUrl,
  getTemplateSectionUrl,
} from "../shared/catalogManifest";

type SidebarProps = {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  isMobile: boolean;
  isMenuOpen: boolean;
  onMenuClose: () => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
  onSignInOpen?: () => void;
};

type PrefetchTarget = {
  cacheKey: string;
  url: string;
};

type GlobalSearchItem = {
  id: string;
  title: string;
  path: string;
  kind: "page" | "layout" | "component" | "template" | "lesson" | "article";
  subtitle: string;
  keywords: string;
  activeTarget?: string;
  openGroup?: "lessons" | "articles" | "layout" | "components" | "templates" | null;
};

const lessonGroups = [
  { id: "lesson-getting-started", label: "Getting Started" },
  { id: "lesson-core-skills", label: "Core Skills" },
  { id: "lesson-build-websites", label: "Build Websites" },
  { id: "lesson-freelance-money", label: "Freelance & Money" },
  { id: "lesson-final-path", label: "Final Path" },
];

const toLessonGroupId = (groupName: string) =>
  `lesson-${groupName
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")}`;

const getPrefetchTarget = (
  basePath: "layout" | "components" | "templates",
  id: string
): PrefetchTarget => {
  const url =
    basePath === "layout"
      ? getLayoutSectionUrl(id)
      : basePath === "components"
        ? getComponentSectionUrl(id)
        : getTemplateSectionUrl(id);

  return {
    cacheKey: `remote:${url}`,
    url,
  };
};

export default function Sidebar({
  activeSection,
  onSectionChange,
  isMobile,
  isMenuOpen,
  onMenuClose,
  isAuthenticated,
  onLogout,
  onSignInOpen
}: SidebarProps) {
  const { manifest } = useCatalogManifest();
  const navigate = useNavigate();
  const location = useLocation();
  const isLayoutRoute = location.pathname === "/layout" || location.pathname.startsWith("/layout/");
  const isComponentsRoute = location.pathname === "/components" || location.pathname.startsWith("/components/");
  const isTemplatesRoute = location.pathname === "/templates" || location.pathname.startsWith("/templates/");
  const isStartLearningActive = location.pathname === "/";

  const isLessonsActive = location.pathname.startsWith("/learn/lessons");
  const isArticlesActive = location.pathname.startsWith("/learn/articles");
  const currentLessonsHash = location.hash.replace("#", "");
  const currentArticlesHash = location.hash.replace("#", "");
  const articleGroups = useMemo(() => {
    const groups = new Set<string>();
    RESOURCES.filter((item) => item.type === "article").forEach((item) => {
      const groupName = item.category ?? "Articles";
      groups.add(groupName);
    });
    return Array.from(groups).map((groupName) => ({
      id: toLessonGroupId(groupName),
      label: groupName,
    }));
  }, []);
  const lessonDetailSlug = location.pathname.startsWith("/learn/lessons/")
    ? decodeURIComponent(
        location.pathname
          .replace(/^\/learn\/lessons\//, "")
          .split("/")[0]
          .trim()
      )
    : "";
  const lessonDetailResource = lessonDetailSlug
    ? RESOURCE_BY_SLUG[lessonDetailSlug]
    : undefined;
  const lessonDetailCategory = lessonDetailResource?.category ?? "";
  const lessonDetailGroupId =
    lessonDetailCategory &&
    lessonGroups.some((group) => group.id === toLessonGroupId(lessonDetailCategory))
      ? toLessonGroupId(lessonDetailCategory)
      : "";
  const isLessonGroupActive = (groupId: string) =>
    isLessonsActive &&
    (currentLessonsHash === groupId || lessonDetailGroupId === groupId);
  const articleDetailSlug = location.pathname.startsWith("/learn/articles/")
    ? decodeURIComponent(
        location.pathname
          .replace(/^\/learn\/articles\//, "")
          .split("/")[0]
          .trim()
      )
    : "";
  const articleDetailResource = articleDetailSlug
    ? RESOURCE_BY_SLUG[articleDetailSlug]
    : undefined;
  const articleDetailCategory = articleDetailResource?.category ?? "";
  const articleDetailGroupId =
    articleDetailCategory &&
    articleGroups.some((group) => group.id === toLessonGroupId(articleDetailCategory))
      ? toLessonGroupId(articleDetailCategory)
      : "";
  const isArticleGroupActive = (groupId: string) =>
    isArticlesActive &&
    (currentArticlesHash === groupId || articleDetailGroupId === groupId);
  const isLayoutSectionRoute = location.pathname.startsWith("/layout/");
  const isComponentsSectionRoute = location.pathname.startsWith("/components/");
  const isTemplatesSectionRoute = location.pathname.startsWith("/templates/");
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const prefetchTimersRef = useRef<Map<string, number>>(new Map());
  const prefetchedRef = useRef<Set<string>>(new Set());
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [lessonsOpen, setLessonsOpen] = useState(() =>
    location.pathname.startsWith("/learn/lessons")
  );
  const [articlesOpen, setArticlesOpen] = useState(() =>
    location.pathname.startsWith("/learn/articles")
  );
  const [layoutOpen, setLayoutOpen] = useState(() => location.pathname.startsWith("/layout/"));
  const [componentsOpen, setComponentsOpen] = useState(() => location.pathname.startsWith("/components/"));
  const [templatesOpen, setTemplatesOpen] = useState(() => location.pathname.startsWith("/templates/"));
  const lessonsContentRef = useRef<HTMLDivElement>(null);
  const articlesContentRef = useRef<HTMLDivElement>(null);
  const layoutContentRef = useRef<HTMLDivElement>(null);
  const componentsContentRef = useRef<HTMLDivElement>(null);
  const templatesContentRef = useRef<HTMLDivElement>(null);
  
  const [lessonsIndicator, setLessonsIndicator] = useState({
    top: 0,
    height: 0,
    visible: false,
  });
  const [layoutIndicator, setLayoutIndicator] = useState({
    top: 0,
    height: 0,
    visible: false,
  });
  const [articlesIndicator, setArticlesIndicator] = useState({
    top: 0,
    height: 0,
    visible: false,
  });
  const [componentsIndicator, setComponentsIndicator] = useState({
    top: 0,
    height: 0,
    visible: false,
  });
  const [templatesIndicator, setTemplatesIndicator] = useState({
    top: 0,
    height: 0,
    visible: false,
  });
  const isLayoutOpen = layoutOpen;
  const isComponentsOpen = componentsOpen;
  const isTemplatesOpen = templatesOpen;

  const setExclusiveOpenGroup = (
    group: "lessons" | "articles" | "layout" | "components" | "templates" | null
  ) => {
    setLessonsOpen(group === "lessons");
    setArticlesOpen(group === "articles");
    setLayoutOpen(group === "layout");
    setComponentsOpen(group === "components");
    setTemplatesOpen(group === "templates");
  };

  const toggleExclusiveOpenGroup = (
    group: "lessons" | "articles" | "layout" | "components" | "templates",
    isCurrentlyOpen: boolean
  ) => {
    setExclusiveOpenGroup(isCurrentlyOpen ? null : group);
  };

  useEffect(() => {
    if (isLessonsActive) {
      setExclusiveOpenGroup("lessons");
      return;
    }
    if (isArticlesActive) {
      setExclusiveOpenGroup("articles");
      return;
    }
    if (isLayoutSectionRoute) {
      setExclusiveOpenGroup("layout");
      return;
    }
    if (isComponentsSectionRoute) {
      setExclusiveOpenGroup("components");
      return;
    }
    if (isTemplatesSectionRoute) {
      setExclusiveOpenGroup("templates");
    }
  }, [
    isLessonsActive,
    location.pathname,
    location.hash,
    isLayoutSectionRoute,
    isComponentsSectionRoute,
    isTemplatesSectionRoute,
  ]);

  useLayoutEffect(() => {
    const updateIndicator = (
      container: HTMLDivElement | null,
      setIndicator: Dispatch<
        SetStateAction<{ top: number; height: number; visible: boolean }>
      >
    ) => {
      if (!container) {
        setIndicator((current) =>
          current.visible ? { top: 0, height: 0, visible: false } : current
        );
        return;
      }
  
      const activeItem = container.querySelector(
        ".sidebar-item.active"
      ) as HTMLElement | null;
  
      if (!activeItem) {
        setIndicator((current) =>
          current.visible ? { top: 0, height: 0, visible: false } : current
        );
        return;
      }
  
      const INDICATOR_HEIGHT = 22;
      const centeredTop =
        activeItem.offsetTop + activeItem.offsetHeight / 2 - INDICATOR_HEIGHT / 2;
      const top = Math.max(0, centeredTop);
      const height = INDICATOR_HEIGHT;
  
      setIndicator({
        top,
        height,
        visible: true,
      });
    };
  
    const frameId = window.requestAnimationFrame(() => {
      updateIndicator(lessonsContentRef.current, setLessonsIndicator);
      updateIndicator(articlesContentRef.current, setArticlesIndicator);
      updateIndicator(layoutContentRef.current, setLayoutIndicator);
      updateIndicator(componentsContentRef.current, setComponentsIndicator);
      updateIndicator(templatesContentRef.current, setTemplatesIndicator);
    });
  
    return () => window.cancelAnimationFrame(frameId);
  }, [
    location.pathname,
    location.hash,
    activeSection,
    lessonsOpen,
    articlesOpen,
    isLayoutOpen,
    isComponentsOpen,
    isTemplatesOpen,
  ]);

  useEffect(() => {
    const handleResize = () => {
      const updateOnResize = (
        container: HTMLDivElement | null,
        setIndicator: Dispatch<
          SetStateAction<{ top: number; height: number; visible: boolean }>
        >
      ) => {
        if (!container) return;
  
        const activeItem = container.querySelector(
          ".sidebar-item.active"
        ) as HTMLElement | null;
  
        if (!activeItem) return;
  
        const INDICATOR_HEIGHT = 22;
        const centeredTop =
          activeItem.offsetTop + activeItem.offsetHeight / 2 - INDICATOR_HEIGHT / 2;
        const top = Math.max(0, centeredTop);
        const height = INDICATOR_HEIGHT;
        setIndicator({ top, height, visible: true });
      };
  
      updateOnResize(lessonsContentRef.current, setLessonsIndicator);
      updateOnResize(articlesContentRef.current, setArticlesIndicator);
      updateOnResize(layoutContentRef.current, setLayoutIndicator);
      updateOnResize(componentsContentRef.current, setComponentsIndicator);
      updateOnResize(templatesContentRef.current, setTemplatesIndicator);
    };
  
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const layoutSections = useMemo(
    () => manifest.layout.map((item) => ({ id: item.id, label: item.label })),
    [manifest.layout]
  );
  const componentSections = useMemo(
    () => manifest.components.map((item) => ({ id: item.id, label: item.label })),
    [manifest.components]
  );
  const templatesSections = useMemo(
    () => manifest.templates.map((item) => ({ id: item.id, label: item.label })),
    [manifest.templates]
  );

  const globalSearchItems = useMemo<GlobalSearchItem[]>(() => {
    const staticPages: GlobalSearchItem[] = [
      {
        id: "page-overview",
        title: "Start Learning",
        path: "/#overview",
        kind: "page",
        subtitle: "Page",
        keywords: "start learning overview home getting started framerkit",
        activeTarget: "overview",
        openGroup: null,
      },
      {
        id: "page-layout",
        title: "Layout Sections",
        path: "/layout",
        kind: "page",
        subtitle: "Library",
        keywords: "layout sections library hero navbar faq contact pricing footer gallery",
        activeTarget: "layout",
        openGroup: "layout",
      },
      {
        id: "page-components",
        title: "Components",
        path: "/components",
        kind: "page",
        subtitle: "Library",
        keywords: "components ui library button input badge card avatar form rating",
        activeTarget: "components",
        openGroup: "components",
      },
      {
        id: "page-templates",
        title: "Templates",
        path: "/templates",
        kind: "page",
        subtitle: "Library",
        keywords: "templates library website app startup saas framerkit",
        activeTarget: "templates",
        openGroup: "templates",
      },
      {
        id: "page-lessons",
        title: "Lessons",
        path: "/learn/lessons",
        kind: "page",
        subtitle: "Learn",
        keywords: "lessons learning tutorials framer workflow freelance",
        activeTarget: "lessons",
        openGroup: "lessons",
      },
      {
        id: "page-articles",
        title: "Articles",
        path: "/learn/articles",
        kind: "page",
        subtitle: "Learn",
        keywords: "articles guides tutorials resources framerkit",
        activeTarget: "articles",
        openGroup: "articles",
      },
      {
        id: "page-updates",
        title: "Updates",
        path: "/updates",
        kind: "page",
        subtitle: "Product",
        keywords: "updates changelog website plugin releases",
        activeTarget: "updates",
        openGroup: null,
      },
      {
        id: "page-support",
        title: "Support",
        path: "/support",
        kind: "page",
        subtitle: "Product",
        keywords: "support help contact feedback issue bug request",
        activeTarget: "support",
        openGroup: null,
      },
    ];

    const layoutItems = manifest.layout.map((item) => ({
      id: `layout-${item.id}`,
      title: item.label,
      path: `/layout/${item.id}`,
      kind: "layout" as const,
      subtitle: "Layout Section",
      keywords: `${item.label} ${item.id} layout section`,
      activeTarget: item.id,
      openGroup: "layout" as const,
    }));

    const componentItems = manifest.components.map((item) => ({
      id: `component-${item.id}`,
      title: item.label,
      path: `/components/${item.id}`,
      kind: "component" as const,
      subtitle: "Component",
      keywords: `${item.label} ${item.id} component ui`,
      activeTarget: item.id,
      openGroup: "components" as const,
    }));

    const templateItems = manifest.templates.map((item) => ({
      id: `template-${item.id}`,
      title: item.label,
      path: `/templates/${item.id}`,
      kind: "template" as const,
      subtitle: "Template",
      keywords: `${item.label} ${item.id} template`,
      activeTarget: item.id,
      openGroup: "templates" as const,
    }));

    const resourceItems = RESOURCES.map((item) => ({
      id: `${item.type}-${item.slug}`,
      title: item.title,
      path: item.type === "lesson" ? `/learn/lessons/${item.slug}` : `/learn/articles/${item.slug}`,
      kind: item.type,
      subtitle: item.type === "lesson" ? "Lesson" : "Article",
      keywords: `${item.title} ${item.slug} ${item.category ?? ""} ${item.description} ${item.excerpt}`,
      activeTarget: item.type === "lesson"
        ? toLessonGroupId(item.category ?? "Lessons")
        : toLessonGroupId(item.category ?? "Articles"),
      openGroup: item.type === "lesson" ? "lessons" as const : "articles" as const,
    }));

    return [
      ...staticPages,
      ...layoutItems,
      ...componentItems,
      ...templateItems,
      ...resourceItems,
    ];
  }, [manifest.components, manifest.layout, manifest.templates]);

  const globalSearchResults = useMemo(() => {
    const query = globalSearchQuery.trim().toLowerCase();
    if (!query) return [];

    const scored = globalSearchItems
      .map((item) => {
        const title = item.title.toLowerCase();
        const subtitle = item.subtitle.toLowerCase();
        const keywords = item.keywords.toLowerCase();

        let score = 0;
        if (title === query) score += 120;
        if (title.startsWith(query)) score += 80;
        if (title.includes(query)) score += 50;
        if (keywords.includes(query)) score += 24;
        if (subtitle.includes(query)) score += 8;

        return { item, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
      .slice(0, 10);

    return scored.map((entry) => entry.item);
  }, [globalSearchItems, globalSearchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (!searchRef.current) return;
      if (!searchRef.current.contains(event.target as Node)) {
        setIsGlobalSearchOpen(false);
        searchInputRef.current?.blur();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsGlobalSearchOpen(false);
    searchInputRef.current?.blur();
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!scrollRef.current) return;
  
    const activeItem = scrollRef.current.querySelector(
      ".sidebar-item.active"
    ) as HTMLElement | null;
  
    if (activeItem) {
      activeItem.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeSection, location.pathname, location.hash, lessonsOpen, articlesOpen]);

  useEffect(() => {
    return () => {
      prefetchTimersRef.current.forEach((timerId) => {
        window.clearTimeout(timerId);
      });
      prefetchTimersRef.current.clear();
    };
  }, []);

  const runPrefetch = (targets: PrefetchTarget[]) => {
    if (isMobile) return;

    targets.forEach(({ cacheKey, url }) => {
      if (prefetchedRef.current.has(cacheKey)) return;
      prefetchedRef.current.add(cacheKey);

      void fetchJsonWithCache<Record<string, unknown[]>>(cacheKey, url).catch(() => {
        prefetchedRef.current.delete(cacheKey);
      });
    });
  };

  const schedulePrefetch = (timerKey: string, targets: PrefetchTarget[]) => {
    if (isMobile) return;
    if (!targets.length) return;

    const currentTimer = prefetchTimersRef.current.get(timerKey);
    if (currentTimer) {
      window.clearTimeout(currentTimer);
    }

    const nextTimer = window.setTimeout(() => {
      prefetchTimersRef.current.delete(timerKey);
      runPrefetch(targets);
    }, 110);

    prefetchTimersRef.current.set(timerKey, nextTimer);
  };

  const cancelScheduledPrefetch = (timerKey: string) => {
    const timer = prefetchTimersRef.current.get(timerKey);
    if (!timer) return;
    window.clearTimeout(timer);
    prefetchTimersRef.current.delete(timerKey);
  };

  const getPrefetchHandlers = (timerKey: string, targets: PrefetchTarget[]) => ({
    onMouseEnter: () => schedulePrefetch(timerKey, targets),
    onFocus: () => schedulePrefetch(timerKey, targets),
    onMouseLeave: () => cancelScheduledPrefetch(timerKey),
    onBlur: () => cancelScheduledPrefetch(timerKey),
  });

  const handleGetAccessClick = () => {
    trackGtagEvent("cta_click", {
      location: "sidebar",
      action: "get_full_access",
    });

    const pricingSection = document.getElementById("get-framerkit");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth", block: "start" });
      if (isMobile) onMenuClose();
      return;
    }

    navigate("/#get-framerkit");
    if (isMobile) onMenuClose();
  };

  const getLinkPath = (id: string, basePath?: string) => {
    if (!basePath) return `/#${id}`;
    return `/${basePath}/${id}`;
  };

  const isActive = (id: string, basePath?: string) => {
    if (location.pathname === "/") return activeSection === id;
    if (basePath) return location.pathname === `/${basePath}/${id}`;
    if (id === "resources") return location.pathname.startsWith("/resources");
    if (id === "updates") return location.pathname.startsWith("/updates");
    if (id === "support") return location.pathname.startsWith("/support");
    return location.pathname === `/${id}`;
  };

  const handleLessonGroupClick = (
    event: MouseEvent<HTMLAnchorElement>,
    groupId: string
  ) => {
    event.preventDefault();

    setLessonsOpen(true);
    onSectionChange(groupId);

    const lessonsPath = "/learn/lessons";
    const targetHash = `#${groupId}`;
    const isOnLessonsPage = location.pathname === lessonsPath;

    const scrollToGroup = () => {
      const targetElement = document.getElementById(groupId);
      if (!targetElement) return;
      window.dispatchEvent(
        new CustomEvent("framerkit-resources-nav-click", { detail: { id: groupId } })
      );
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    if (isOnLessonsPage) {
      navigate(
        {
          pathname: location.pathname,
          hash: targetHash,
        },
        { replace: false }
      );
      window.requestAnimationFrame(scrollToGroup);
    } else {
      navigate(`${lessonsPath}${targetHash}`);
    }

    if (isMobile) onMenuClose();
  };

  const handleArticleGroupClick = (
    event: MouseEvent<HTMLAnchorElement>,
    groupId: string
  ) => {
    event.preventDefault();

    setArticlesOpen(true);
    onSectionChange(groupId);

    const articlesPath = "/learn/articles";
    const targetHash = `#${groupId}`;
    const isOnArticlesPage = location.pathname === articlesPath;

    const scrollToGroup = () => {
      const targetElement = document.getElementById(groupId);
      if (!targetElement) return;
      window.dispatchEvent(
        new CustomEvent("framerkit-resources-nav-click", { detail: { id: groupId } })
      );
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    if (isOnArticlesPage) {
      navigate(
        {
          pathname: location.pathname,
          hash: targetHash,
        },
        { replace: false }
      );
      window.requestAnimationFrame(scrollToGroup);
    } else {
      navigate(`${articlesPath}${targetHash}`);
    }

    if (isMobile) onMenuClose();
  };

  const handleGlobalSearchNavigate = (item: GlobalSearchItem) => {
    setGlobalSearchQuery("");
    setIsGlobalSearchOpen(false);
    searchInputRef.current?.blur();

    if (item.openGroup !== undefined) {
      setExclusiveOpenGroup(item.openGroup);
    }
    if (item.activeTarget) {
      onSectionChange(item.activeTarget);
    }

    navigate(item.path);
    if (isMobile) onMenuClose();
  };

  // 🔥 Рендер элементов секций
  const renderSectionItems = (
    list: { id: string; label: string }[],
    basePath: "layout" | "components" | "templates"
  ) =>
    list.map(({ id, label }) => {
      const targets = [getPrefetchTarget(basePath, id)];

      return (
      <Link
        key={id}
        to={getLinkPath(id, basePath)}
        className={`sidebar-item ${isActive(id, basePath) ? "active" : ""}`}
        onClick={() => {
          onSectionChange(id);
          if (isMobile) onMenuClose();
        }}
        {...getPrefetchHandlers(`${basePath}:${id}`, targets)}
      >
        {label}
      </Link>
      );
    });

    const sidebarContent = (
      <div className="sidebar-inner" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Logo */}
        {!isMobile && (
          <a
            href="/"
            className="sidebar-logo-container"
            onClick={(e) => {
              e.preventDefault();
              onSectionChange("overview");
              window.location.href = "/";
            }}
          >
            <img src="/Logo.png" alt="FramerKit" className="sidebar-logo-icon" />
            <span className="sidebar-logo-text">FramerKit</span>
          </a>
        )}

        <div
          ref={scrollRef}
          className="sidebar-scroll"
          style={{ flexGrow: 1, overflowY: "auto" }}
        >
        <div
          ref={searchRef}
          className={`sidebar-global-search ${isGlobalSearchOpen ? "open" : ""}`}
        >
          <div className="sidebar-global-search-input-wrap">
            <Search size={15} className="sidebar-global-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              value={globalSearchQuery}
              onFocus={() => setIsGlobalSearchOpen(true)}
              onChange={(event) => {
                setGlobalSearchQuery(event.target.value);
                setIsGlobalSearchOpen(true);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  if (globalSearchQuery) {
                    setGlobalSearchQuery("");
                  } else {
                    setIsGlobalSearchOpen(false);
                  }
                }
              }}
              placeholder="Search..."
              aria-label="Search FramerKit"
            />
            {globalSearchQuery && (
              <button
                type="button"
                className="sidebar-global-search-clear"
                aria-label="Clear search"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setGlobalSearchQuery("");
                  setIsGlobalSearchOpen(false);
                  searchInputRef.current?.blur();
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {isGlobalSearchOpen && globalSearchQuery.trim() && (
            <div className="sidebar-global-search-dropdown">
              {globalSearchResults.length ? (
                globalSearchResults.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="sidebar-global-search-result"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleGlobalSearchNavigate(item)}
                  >
                    <span className={`sidebar-global-search-kind kind-${item.kind}`}>
                      {item.subtitle}
                    </span>
                    <span className="sidebar-global-search-result-text">
                      <strong>{item.title}</strong>
                      <small>{item.kind === "page" ? "Page" : item.subtitle}</small>
                    </span>
                  </button>
                ))
              ) : (
                <div className="sidebar-global-search-empty">
                  No results for “{globalSearchQuery.trim()}”
                </div>
              )}
            </div>
          )}
        </div>

        {/* === START HERE === */}
        <div className="sidebar-group-label">Start Here</div>

            <div className="sidebar-section">
                  <Link
                    to="/#overview"
                    className={`sidebar-section-trigger sidebar-header-link ${
                      isStartLearningActive ? "active" : ""
                    }`}
                    onClick={() => {
                      onSectionChange("overview");
                      if (isMobile) onMenuClose();
                    }}
                  >
                    <span className="sidebar-header-main">
                      <BookOpen size={15} className="sidebar-header-icon" />
                      <span className="sidebar-section-title">Start Learning</span>
                    </span>
                    <span className="sidebar-chevron sidebar-chevron-placeholder">
                      <ChevronRight size={14} />
                    </span>
                  </Link>
                </div>

        <div className="sidebar-divider" />

        {/* === LEARN === */}
        <div className="sidebar-group-label">Learn</div>

        <div className="sidebar-section">
  <div
    className={`sidebar-section-trigger sidebar-group-trigger sidebar-group-header ${
      isLessonsActive ? "active" : ""
    }`}
  >
    <button
      type="button"
      className={`sidebar-group-expand-btn ${lessonsOpen ? "open" : ""}`}
      onClick={() => toggleExclusiveOpenGroup("lessons", lessonsOpen)}
      aria-label={lessonsOpen ? "Collapse Lessons" : "Expand Lessons"}
      aria-expanded={lessonsOpen}
      aria-controls="sidebar-lessons-group"
    >
      <ChevronDown size={14} />
    </button>

    <Link
      to="/learn/lessons"
      className="sidebar-group-main-link"
      onClick={() => {
        setExclusiveOpenGroup("lessons");
        onSectionChange("lessons");
        if (isMobile) onMenuClose();
      }}
    >
      <span className="sidebar-section-title">Lessons</span>
    </Link>
  </div>

  <div
    id="sidebar-lessons-group"
    className={`sidebar-group-content ${lessonsOpen ? "open" : ""}`}
    aria-hidden={!lessonsOpen}
    ref={lessonsContentRef}
    style={
      {
        "--sidebar-active-top": `${lessonsIndicator.top}px`,
        "--sidebar-active-height": `${lessonsIndicator.height}px`,
        "--sidebar-active-opacity": lessonsIndicator.visible ? "1" : "0",
      } as CSSProperties
    }
  >
    <span className="sidebar-group-active-indicator" aria-hidden="true" />

    {lessonGroups.map((group) => (
      <Link
        key={group.id}
        to={`/learn/lessons#${group.id}`}
        className={`sidebar-item ${
          isLessonGroupActive(group.id) ? "active" : ""
        }`}
        onClick={(event) => handleLessonGroupClick(event, group.id)}
      >
        {group.label}
      </Link>
    ))}
  </div>
</div>

        <div className="sidebar-section">
          <div
            className={`sidebar-section-trigger sidebar-group-trigger sidebar-group-header ${
              isArticlesActive ? "active" : ""
            }`}
          >
            <button
              type="button"
              className={`sidebar-group-expand-btn ${articlesOpen ? "open" : ""}`}
              onClick={() => toggleExclusiveOpenGroup("articles", articlesOpen)}
              aria-label={articlesOpen ? "Collapse Articles" : "Expand Articles"}
              aria-expanded={articlesOpen}
              aria-controls="sidebar-articles-group"
            >
              <ChevronDown size={14} />
            </button>

            <Link
              to="/learn/articles"
              className="sidebar-group-main-link"
              onClick={() => {
                setExclusiveOpenGroup("articles");
                onSectionChange("articles");
                if (isMobile) onMenuClose();
              }}
            >
              <span className="sidebar-section-title">Articles</span>
            </Link>
          </div>

          <div
            id="sidebar-articles-group"
            className={`sidebar-group-content ${articlesOpen ? "open" : ""}`}
            aria-hidden={!articlesOpen}
            ref={articlesContentRef}
            style={
              {
                "--sidebar-active-top": `${articlesIndicator.top}px`,
                "--sidebar-active-height": `${articlesIndicator.height}px`,
                "--sidebar-active-opacity": articlesIndicator.visible ? "1" : "0",
              } as CSSProperties
            }
          >
            <span className="sidebar-group-active-indicator" aria-hidden="true" />

            {articleGroups.map((group) => (
              <Link
                key={group.id}
                to={`/learn/articles#${group.id}`}
                className={`sidebar-item ${
                  isArticleGroupActive(group.id) ? "active" : ""
                }`}
                onClick={(event) => handleArticleGroupClick(event, group.id)}
              >
                {group.label}
              </Link>
            ))}
          </div>
        </div>

        

          <div className="sidebar-divider" role="separator" aria-hidden="true" />
          <div className="sidebar-group-label">Library</div>
    
          {/* 🔥 Layout Sections */}
          <div className="sidebar-section">
            <div className={`sidebar-section-trigger sidebar-group-trigger sidebar-group-header ${isLayoutRoute ? "active" : ""}`}>
              <button
                type="button"
                className={`sidebar-group-expand-btn ${isLayoutOpen ? "open" : ""}`}
                onClick={() => toggleExclusiveOpenGroup("layout", isLayoutOpen)}
                aria-label={isLayoutOpen ? "Collapse Layout Sections" : "Expand Layout Sections"}
                aria-expanded={isLayoutOpen}
                aria-controls="sidebar-layout-group"
              >
                <ChevronDown size={14} />
              </button>
              <Link
                to="/layout"
                className="sidebar-group-main-link"
                onClick={() => {
                  setLayoutOpen(false);
                  if (isMobile) onMenuClose();
                }}
                {...getPrefetchHandlers(
                  "layout:overview",
                  manifest.layout.map((item) => getPrefetchTarget("layout", item.id))
                )}
              >
                <span className="sidebar-section-title">Layout Sections</span>
              </Link>
            </div>
            <div
              id="sidebar-layout-group"
              className={`sidebar-group-content ${isLayoutOpen ? "open" : ""}`}
              aria-hidden={!isLayoutOpen}
              ref={layoutContentRef}
              style={
                {
                  "--sidebar-active-top": `${layoutIndicator.top}px`,
                  "--sidebar-active-height": `${layoutIndicator.height}px`,
                  "--sidebar-active-opacity": layoutIndicator.visible ? "1" : "0",
                } as CSSProperties
              }
            >
              <span className="sidebar-group-active-indicator" aria-hidden="true" />
              {renderSectionItems(layoutSections, "layout")}
            </div>
          </div>

          {/* 🔥 Components */}
          <div className="sidebar-section">
            <div className={`sidebar-section-trigger sidebar-group-trigger sidebar-group-header ${isComponentsRoute ? "active" : ""}`}>
              <button
                type="button"
                className={`sidebar-group-expand-btn ${isComponentsOpen ? "open" : ""}`}
                onClick={() => toggleExclusiveOpenGroup("components", isComponentsOpen)}
                aria-label={isComponentsOpen ? "Collapse Components" : "Expand Components"}
                aria-expanded={isComponentsOpen}
                aria-controls="sidebar-components-group"
              >
                <ChevronDown size={14} />
              </button>
              <Link
                to="/components"
                className="sidebar-group-main-link"
                onClick={() => {
                  setComponentsOpen(false);
                  if (isMobile) onMenuClose();
                }}
                {...getPrefetchHandlers(
                  "components:overview",
                  manifest.components.map((item) => getPrefetchTarget("components", item.id))
                )}
              >
                <span className="sidebar-section-title">Components</span>
              </Link>
            </div>
            <div
              id="sidebar-components-group"
              className={`sidebar-group-content ${isComponentsOpen ? "open" : ""}`}
              aria-hidden={!isComponentsOpen}
              ref={componentsContentRef}
              style={
                {
                  "--sidebar-active-top": `${componentsIndicator.top}px`,
                  "--sidebar-active-height": `${componentsIndicator.height}px`,
                  "--sidebar-active-opacity": componentsIndicator.visible ? "1" : "0",
                } as CSSProperties
              }
            >
              <span className="sidebar-group-active-indicator" aria-hidden="true" />
              {renderSectionItems(componentSections, "components")}
            </div>
          </div>

          {/* 🔥 Templates */}
          <div className="sidebar-section">
            <div className={`sidebar-section-trigger sidebar-group-trigger sidebar-group-header ${isTemplatesRoute ? "active" : ""}`}>
              <button
                type="button"
                className={`sidebar-group-expand-btn ${isTemplatesOpen ? "open" : ""}`}
                onClick={() => toggleExclusiveOpenGroup("templates", isTemplatesOpen)}
                aria-label={isTemplatesOpen ? "Collapse Templates" : "Expand Templates"}
                aria-expanded={isTemplatesOpen}
                aria-controls="sidebar-templates-group"
              >
                <ChevronDown size={14} />
              </button>
              <Link
                to="/templates"
                className="sidebar-group-main-link"
                onClick={() => {
                  setTemplatesOpen(false);
                  if (isMobile) onMenuClose();
                }}
                {...getPrefetchHandlers(
                  "templates:overview",
                  manifest.templates.map((item) => getPrefetchTarget("templates", item.id))
                )}
              >
                <span className="sidebar-section-title">Templates</span>
              </Link>
            </div>
            <div
              id="sidebar-templates-group"
              className={`sidebar-group-content ${isTemplatesOpen ? "open" : ""}`}
              aria-hidden={!isTemplatesOpen}
              ref={templatesContentRef}
              style={
                {
                  "--sidebar-active-top": `${templatesIndicator.top}px`,
                  "--sidebar-active-height": `${templatesIndicator.height}px`,
                  "--sidebar-active-opacity": templatesIndicator.visible ? "1" : "0",
                } as CSSProperties
              }
            >
              <span className="sidebar-group-active-indicator" aria-hidden="true" />
              {renderSectionItems(templatesSections, "templates")}
            </div>
          </div>

          <div className="sidebar-divider" role="separator" aria-hidden="true" />
          <div className="sidebar-group-label">Product</div>

          <div className="sidebar-section">
            <Link
              to="/updates"
              className={`sidebar-section-trigger sidebar-header-link ${location.pathname.startsWith("/updates") ? "active" : ""}`}
              onClick={() => {
                onSectionChange("updates");
                if (isMobile) onMenuClose();
              }}
            >
              <span className="sidebar-header-main">
                <History size={15} className="sidebar-header-icon" />
                <span className="sidebar-section-title">Updates</span>
              </span>
              <span className="sidebar-chevron sidebar-chevron-placeholder" aria-hidden="true">
                <ChevronRight size={14} />
              </span>
            </Link>
          </div>

          <div className="sidebar-section">
            <Link
              to="/support"
              className={`sidebar-section-trigger sidebar-header-link ${location.pathname.startsWith("/support") ? "active" : ""}`}
              onClick={() => {
                onSectionChange("support");
                if (isMobile) onMenuClose();
              }}
            >
              <span className="sidebar-header-main">
                <LifeBuoy size={15} className="sidebar-header-icon" />
                <span className="sidebar-section-title">Support</span>
              </span>
              <span className="sidebar-chevron sidebar-chevron-placeholder" aria-hidden="true">
                <ChevronRight size={14} />
              </span>
            </Link>
          </div>
    
        </div>
    
        {/* Sidebar bottom stays only on mobile */}
        {isMobile && (
          <div className="sidebar-bottom">
            {isAuthenticated ? (
              <button className="logoutButton" onClick={onLogout}>
                <LogOut size={16} /> Log out
              </button>
            ) : (
              <>
                <button
                  className="authButton"
                  onClick={handleGetAccessClick}
                >
                  Get Full Access
                </button>

                <button
                  className="loginButton"
                  onClick={() => {
                    trackGtagEvent("login_click", {
                      location: "sidebar",
                    });
                    onSignInOpen?.();
                  }}
                >
                  Log in
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );

  if (isMobile) {
    return (
      <>
        {isMenuOpen && <div className="sidebar-overlay" onClick={onMenuClose} />}
        <nav className={`sidebar-mobile ${isMenuOpen ? "open" : ""}`}>{sidebarContent}</nav>
      </>
    );
  }

  return <nav className="sidebar">{sidebarContent}</nav>;
}
