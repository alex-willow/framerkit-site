import { useEffect, useRef, useState, type MouseEvent } from "react";
import {
  CalendarBlank,
  Clock,
  Eye,
  PuzzlePiece,
  Copy,
  MagnifyingGlass,
  Target,
  Play,
  PlayCircle,
} from "phosphor-react";
import { Moon, Sun, CircleCheck, CircleAlert } from "lucide-react";
import "./framerkit.css";
import "./gettingstarted.css";
import { trackGtagEvent } from "../utils/gtag";
import SEO from "../components/SEO";
import HoverVideo from "../components/HoverVideo";
import ImageFrame from "../components/ImageFrame";




type HeroCollectionItem = {
  key: string;
  title: string;
  image: string;
  url: string;
  previewUrl?: string;
};

const DOC_SECTIONS = [
  "overview",
  "how-it-works",
  "quick-start",
  "using-the-plugin",
  "video-tutorial",
];






type HomePageProps = {
  onSectionChange: (sectionId: string) => void;
  theme: "light" | "dark";
  onThemeToggle: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  onSignInOpen: () => void;
  onGetAccess: () => void;
};

export default function HomePage({
  onSectionChange,
  theme,
  onThemeToggle,
  isAuthenticated,
  onLogout,
  onSignInOpen,
  onGetAccess,
}: HomePageProps) {
  const isDarkTheme = theme === "dark";
  const [showTooltip, setShowTooltip] = useState(false);

  const onSectionChangeRef = useRef(onSectionChange);
  const suppressSidebarUntilRef = useRef(0);
  

  useEffect(() => {
    onSectionChangeRef.current = onSectionChange;
  }, [onSectionChange]);

  const handlePathCardClick = (e: MouseEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    // Prevent sidebar active-state jitter during smooth card navigation.
    suppressSidebarUntilRef.current = Date.now() + 900;
    onSectionChangeRef.current(id);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `/#${id}`);
  };



  // ================================
  // ХЭШ-СКРОЛЛ
  // ================================
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: "auto", block: "start" });
      onSectionChangeRef.current(hash);
    }
  }, []);

  // ================================
  // INTERSECTION OBSERVER
  // ================================
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

    DOC_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = document.getElementById("get-framerkit");
    if (!el) return;

    let fired = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired) {
          fired = true;

          trackGtagEvent("view_pricing", {
            section: "get-framerkit",
          });

          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-docs-layout" data-framer-theme={theme}>
      <SEO
        title="Getting Started"
        description="FramerKit getting started guide: overview, workflow, quick start, plugin usage, and tutorials."
        keywords="framerkit getting started, framer plugin guide, framer components tutorial"
        canonical="https://www.framerkit.site/"
      />
      <div className="home-overview-topbar">
        {isAuthenticated ? (
          <button className="logoutButton" onClick={onLogout}>
            Log out
          </button>
        ) : (
          <>
            <button className="logoutButton" onClick={onSignInOpen}>
              Log in
            </button>
            <button className="authButton" onClick={onGetAccess}>
              Get Full Access
            </button>
          </>
        )}
        <button
          type="button"
          className={`theme-toggle-btn ${isDarkTheme ? "active" : ""}`}
          onClick={() => {
            setShowTooltip(false);
            onThemeToggle();
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          aria-label={isDarkTheme ? "Dark theme" : "Light theme"}
          title=""
        >
          {isDarkTheme ? <Moon size={20} /> : <Sun size={20} />}
          {showTooltip && (
            <div className="theme-toggle-tooltip">
              {isDarkTheme ? "Dark theme" : "Light theme"}
            </div>
          )}
        </button>
      </div>
     {/* ============================================
    OVERVIEW SECTION - CLEAN DOCS STRUCTURE
============================================= */}
<section id="overview" className="docs-overview">
  
  {/* 1. Header */}
  <div className="docs-welcome">
    <h1 className="docs-welcome-title">Overview</h1>
    <p className="docs-welcome-text">
    FramerKit is a Framer component library with ready-made sections designed to help you build complete pages faster using copy, paste, and customize workflow.
    </p>
  </div>

  {/* 2. How to use */}
  <div className="docs-content-block">
  

    <div className="docs-path-grid">

      <div className="path-card" onClick={(e) => handlePathCardClick(e, "how-it-works")} style={{ cursor: 'pointer' }}>
        <div className="path-card-icon"><MagnifyingGlass size={18} weight="duotone" /></div>
        <div className="path-card-content">
          <h3 className="path-card-title">How it Works</h3>
          <p className="path-card-description">
          Learn the basic workflow: browse components, copy them, and use them inside Framer projects.
          </p>
        </div>
      </div>

      <div className="path-card" onClick={(e) => handlePathCardClick(e, "quick-start")} style={{ cursor: 'pointer' }}>
        <div className="path-card-icon"><Play size={18} weight="duotone" /></div>
        <div className="path-card-content">
          <h3 className="path-card-title">Quick Start</h3>
          <p className="path-card-description">
          Try your first component in under a minute with a simple step-by-step guide.
          </p>
        </div>
      </div>

      <div className="path-card" onClick={(e) => handlePathCardClick(e, "using-the-plugin")} style={{ cursor: 'pointer' }}>
        <div className="path-card-icon"><PuzzlePiece size={18} weight="duotone" /></div>
        <div className="path-card-content">
          <h3 className="path-card-title">Using the Plugin</h3>
          <p className="path-card-description">
          Access and insert FramerKit components directly inside Framer without leaving your project.
          </p>
        </div>
      </div>

      <div className="path-card" onClick={(e) => handlePathCardClick(e, "video-tutorial")} style={{ cursor: 'pointer' }}>
        <div className="path-card-icon"><PlayCircle size={18} weight="duotone" /></div>
        <div className="path-card-content">
          <h3 className="path-card-title">Video Tutorial</h3>
          <p className="path-card-description">
          Watch a short walkthrough of how to use FramerKit from start to finish.
          </p>
        </div>
      </div>

    </div>
  </div>


</section>
 
{/* ============================================
    HOW IT WORKS SECTION
============================================= */}
<section id="how-it-works" className="docs-section">
  
  {/* 1. Header */}
  <div className="docs-header">
    <h1 className="docs-title">How it Works</h1>
    <p className="docs-subtitle">
      FramerKit fits directly into your workflow. Follow these simple steps to go from component to finished layout.
    </p>
  </div>

  {/* 2. Steps */}
  <div className="docs-content-block">

    {/* STEP 1 */}
    <div className="docs-step">
      <div className="docs-step-header">
        <span className="docs-step-number">1</span>
        <h3 className="docs-step-title">Browse Components</h3>
      </div>

      <p className="docs-text">
        Open the library and explore available components. Use categories or search to quickly find what fits your layout.
      </p>


      <HoverVideo src="/videos/browse-components.mp4" />
    </div>

  {/* STEP 2 */}
<div className="docs-step">
  <div className="docs-step-header">
    <span className="docs-step-number">2</span>
    <h3 className="docs-step-title">Copy the Component</h3>
  </div>

  <p className="docs-text">
    Click the Copy button on any component. The code is instantly copied and ready to paste into your Framer project.
  </p>

  <HoverVideo
  src="/videos/copy-component.mp4"
/>

  <span className="docs-video-caption">
    Copy any component in one click
  </span>
</div>


   {/* STEP 3 */}
<div className="docs-step">
  <div className="docs-step-header">
    <span className="docs-step-number">3</span>
    <h3 className="docs-step-title">Paste into Framer</h3>
  </div>

  <p className="docs-text">
    Open your Framer project, select a Frame, and paste the component using Cmd/Ctrl + V.
    After inserting, make sure to set the section to <strong>Fill</strong> on tablet and mobile breakpoints so it adapts correctly.
  </p>

  <HoverVideo
    src="/videos/paste-into-framer.mp4"
  />
</div>

  </div>

</section>

 {/* ============================================
    QUICK START SECTION
============================================= */}
<section id="quick-start" className="docs-section">
  
  <div className="docs-header">
    <h1 className="docs-title">Quick Start</h1>
    <p className="docs-subtitle">
    See how FramerKit works in practice by using a real component that is already prepared for you. You can copy it instantly, paste it into your project, and explore how it behaves inside Framer while customizing it to fit your layout.
    </p>
  </div>

  {/* Component Preview + Steps Side by Side */}
  <div className="docs-content-block">
    <h3 className="docs-section-title" style={{ marginBottom: '8px' }}>Try it yourself</h3>
    <p className="docs-text" style={{ marginBottom: '16px' }}>
      Copy your first component and paste it into Framer to understand how quickly you can build and customize real sections.
    </p>
    <div className="quick-start-layout">
      {/* Card - Left */}
      <QuickStartHeroCard theme={theme} />
      
      {/* Steps - Right */}
      <div className="steps-list">
        <div className="step-item">
          <span className="step-number">1</span>
          <span className="step-text">Click "Copy Component"</span>
        </div>
        <div className="step-item">
          <span className="step-number">2</span>
          <span className="step-text">Open Framer and create a Frame</span>
        </div>
        <div className="step-item">
          <span className="step-number">3</span>
          <span className="step-text">Press Cmd/Ctrl + V to paste</span>
        </div>
        <div className="step-item">
          <span className="step-number">4</span>
          <span className="step-text">Customize content and styles</span>
        </div>
      </div>
    </div>
  </div>

  {/* Info Note */}
  <div className="docs-content-block">
    <div className="info-note">
      <CircleAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
      <span style={{ color: 'inherit' }}>Click the Preview button{' '}<Eye size={18} style={{ verticalAlign: 'middle', margin: '0 4px' }} />{' '}to open an interactive sandbox for any component. This is the safest way to ensure the section fits your design perfectly before adding it to your project.</span>
    </div>
  </div>

  

</section>

{/* ============================================
    USING THE PLUGIN
============================================= */}
<section id="using-the-plugin" className="docs-section">
  
  {/* Header */}
  <div className="docs-header">
    <h1 className="docs-title">Use FramerKit Inside Framer</h1>
    <p className="docs-subtitle">
      FramerKit can also be used directly inside Framer through the plugin. This gives you a faster way to access components while building your project.
    </p>
  </div>

  {/* Steps */}
  <div className="docs-content-block">

    {/* STEP 1 */}
    <div className="docs-step">
      <div className="docs-step-header">
        <span className="docs-step-number">1</span>
        <h3 className="docs-step-title">Open the Plugin</h3>
      </div>

      <p className="docs-text">
        Open the FramerKit plugin inside Framer to access the full component library without leaving your workspace.
      </p>

      <HoverVideo
        src="/videos/plugin-open.mp4"
        
      />
    </div>

    {/* STEP 2 */}
    <div className="docs-step">
      <div className="docs-step-header">
        <span className="docs-step-number">2</span>
        <h3 className="docs-step-title">Browse & Copy Components</h3>
      </div>

      <p className="docs-text">
        Browse the library and copy any component with one click. It is instantly ready to use.
      </p>

      <HoverVideo
        src="/videos/plugin-browse-copy.mp4"
        
      />
    </div>

    {/* STEP 3 */}
    <div className="docs-step">
      <div className="docs-step-header">
        <span className="docs-step-number">3</span>
        <h3 className="docs-step-title">Paste into Your Project</h3>
      </div>

      <p className="docs-text">
        Paste the component into your Framer canvas and start customizing it right away.
      </p>

      <ImageFrame
        src="/images/plugin-screenshot.jpg"
        alt="Plugin screenshot"
      />
    </div>

  </div>

</section>

  {/* ============================================
    video-tutorial
============================================= */}

<section id="video-tutorial" className="docs-section">
  
  
  {/* 🔥 1. Header */}
  <div className="docs-header">

    <h1 className="docs-title">Video Tutorial</h1>
    <p className="docs-subtitle">
      Watch a 3-minute walkthrough of FramerKit. Learn how to browse, copy, and customize components in no time.
    </p>
  </div>

  {/* 🔥 2. Main Video */}
  <div className="docs-content-block">
    <div className="video-main-container">
      <div className="video-wrapper">
        <iframe
          src="https://www.youtube.com/embed/YOUR_VIDEO_ID" // 🔥 Замени на свой ID видео
          title="FramerKit Tutorial - Get Started in 3 Minutes"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="video-iframe"
        ></iframe>
      </div>
      
      <div className="video-info">
        <h2 className="video-title">FramerKit Tutorial - Get Started in 3 Minutes</h2>
        <p className="video-description">
          This quick tutorial covers everything you need to know to start using FramerKit. 
          From browsing the library to customizing your first component.
        </p>
        <div className="video-meta">
          <span className="meta-item"><Clock size={14} weight="duotone" /> 3:00 minutes</span>
          <span className="meta-item"><CalendarBlank size={14} weight="duotone" /> Updated: Jan 2025</span>
          <span className="meta-item"><Target size={14} weight="duotone" /> Beginner Level</span>
        </div>
      </div>
    </div>
  </div>


</section>

    </div>
  );
}

{/* Quick Start Hero Card Component - Theme Aware */}
function QuickStartHeroCard({ theme }: { theme: "light" | "dark" }) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredPreview, setHoveredPreview] = useState(false);
  const [heroData, setHeroData] = useState<{ image: string; url: string; previewUrl?: string; title: string } | null>(null);

  useEffect(() => {
    const loadHero = async () => {
      try {
        const res = await fetch("https://raw.githubusercontent.com/alex-willow/framerkit-data/main/hero.json");
        if (!res.ok) return;
        const json = await res.json();
        const heroes: HeroCollectionItem[] = Array.isArray(json.hero) ? json.hero : [];
        // Get hero matching current theme
        const isDark = theme === "dark";
        const themeHero = heroes.find((h) => {
          const haystack = [h.key, h.title, h.image, h.url].join(" ").toLowerCase();
          return isDark ? haystack.includes("dark") : !haystack.includes("dark");
        }) || heroes[0];

        if (themeHero) {
          setHeroData({
            image: themeHero.image,
            url: themeHero.url,
            previewUrl: themeHero.previewUrl,
            title: themeHero.title || `Hero 01 ${isDark ? "Dark" : "Light"}`
          });
        }
      } catch {
        // Silent fail
      }
    };
    loadHero();
  }, [theme]);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!heroData?.url) {
      console.error("No URL to copy");
      return;
    }
    try {
      await navigator.clipboard.writeText(heroData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback: try execCommand
      const textarea = document.createElement("textarea");
      textarea.value = heroData.url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 4000);
      } catch (e) {
        console.error("Fallback copy failed:", e);
      }
      document.body.removeChild(textarea);
    }
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!heroData?.previewUrl) return;
    try {
      const path = heroData.previewUrl.trim();
      let cleanPath = "";
      if (path.startsWith("/")) {
        cleanPath = path.replace("/preview/", "").replace(/\/$/, "");
      } else if (path.startsWith("http")) {
        const url = new URL(path);
        cleanPath = url.pathname.replace("/preview/", "").replace(/\/$/, "");
      }
      const viewerUrl = `/p/${cleanPath}`;
      window.open(viewerUrl, "_blank", "noopener,noreferrer");
    } catch {
      window.open(heroData.previewUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (!heroData) {
    return (
      <div className={`card ${theme === "dark" ? "card-dark" : "card-light"}`}>
        <div className="skeleton-card-image" style={{ height: 180 }} />
        <div className="skeleton-card-info" />
      </div>
    );
  }

  return (
    <div className={`card quick-start-hero-card ${theme === "dark" ? "card-dark" : "card-light"}`}>
      <div className="cardImage quick-start-hero-media">
        <img
          src={heroData.image}
          alt={heroData.title}
          loading="lazy"
          className="quick-start-hero-image"
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/320x180?text=Hero+01";
          }}
        />
      </div>
      <div className="cardInfo">
        <h3>{heroData.title}</h3>
        <div className="card-actions">
          {heroData.previewUrl && (
            <div
              className="iconButton"
              onClick={handlePreview}
              onMouseEnter={() => setHoveredPreview(true)}
              onMouseLeave={() => setHoveredPreview(false)}
            >
              <Eye size={18} />
              {hoveredPreview && <div className="tooltip">Preview</div>}
            </div>
          )}
          <div
            className={`iconButton ${copied ? "copied" : ""}`}
            onClick={handleCopy}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {copied ? (
              <CircleCheck size={20} color="#22c55e" strokeWidth={2.5} />
            ) : (
              <Copy size={18} />
            )}
            {(copied || hovered) && (
              <div className="tooltip">{copied ? "Copied" : "Copy"}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
