import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Link } from "react-router-dom"; 
import {
  ArrowsClockwise,
  CalendarBlank,
  CheckCircle,
  Clock,
  DeviceMobile,
  Eye,
  GearSix,
  GlobeHemisphereWest,
  Info,
  Lightning,
  LinkSimple,
  PaintBrush,
  PuzzlePiece,
  Question,
  MagnifyingGlass,
  RocketLaunch,
  Sparkle,
  Target,
  VideoCamera,
  CopySimple,
} from "phosphor-react";
import { Moon, Sun } from "lucide-react";
import "./framerkit.css";
import "./gettingstarted.css";



type HomePageProps = {
  onSectionChange: (sectionId: string) => void;
  theme: "light" | "dark";
  onThemeToggle: () => void;
};

export default function HomePage({ onSectionChange, theme, onThemeToggle }: HomePageProps) {
  const isDarkTheme = theme === "dark";
  const [showTooltip, setShowTooltip] = useState(false);

  const sections = [
    "overview",
    "what-is-framer",
    "how-it-works",
    "quick-start",
    "video",
  ];

  const trackEvent = (event: string, params?: Record<string, any>) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", event, params);
    }
  };

  const onSectionChangeRef = useRef(onSectionChange);
  onSectionChangeRef.current = onSectionChange;
  const suppressSidebarUntilRef = useRef(0);

  const handlePathCardClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
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

    sections.forEach((id) => {
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

          trackEvent("view_pricing", {
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
      <div className="home-overview-topbar">
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
    OVERVIEW SECTION - PROFESSIONAL DOCUMENTATION
============================================= */}
<section id="overview" className="docs-overview">
  
  {/* 🔥 1. Welcome Header */}
  <div className="docs-welcome">
    <h1 className="docs-welcome-title">Welcome to FramerKit</h1>
    <p className="docs-welcome-text">
      Your complete guide to building faster with Framer. 
      Explore our components, learn the basics, and start shipping projects today.
    </p>
  </div>

  {/* 🔥 2. Getting Started Path (Links to next sections) */}
  <div className="docs-content-block">
    <h2 className="docs-section-title">Getting Started</h2>
    <p className="docs-section-description">
      New to FramerKit? Start here to understand the basics.
    </p>
    
    <div className="docs-path-grid">
      <Link to="/#what-is-framer" className="path-card" onClick={(e) => handlePathCardClick(e, "what-is-framer")}>
        <div className="path-card-icon"><Question size={18} weight="duotone" /></div>
        <div className="path-card-content">
          <h3 className="path-card-title">What is Framer?</h3>
          <p className="path-card-description">
            Understand the platform and why FramerKit is built for it.
          </p>
        </div>
        <span className="path-card-arrow">→</span>
      </Link>

      <Link to="/#how-it-works" className="path-card" onClick={(e) => handlePathCardClick(e, "how-it-works")}>
        <div className="path-card-icon"><GearSix size={18} weight="duotone" /></div>
        <div className="path-card-content">
          <h3 className="path-card-title">How it Works</h3>
          <p className="path-card-description">
            Learn the workflow: Browse, Copy, Customize in 3 simple steps.
          </p>
        </div>
        <span className="path-card-arrow">→</span>
      </Link>

      <Link to="/#quick-start" className="path-card" onClick={(e) => handlePathCardClick(e, "quick-start")}>
        <div className="path-card-icon"><RocketLaunch size={18} weight="duotone" /></div>
        <div className="path-card-content">
          <h3 className="path-card-title">Quick Start</h3>
          <p className="path-card-description">
            Step-by-step guide to your first component in 60 seconds.
          </p>
        </div>
        <span className="path-card-arrow">→</span>
      </Link>

      <Link to="/#video" className="path-card" onClick={(e) => handlePathCardClick(e, "video")}>
        <div className="path-card-icon"><VideoCamera size={18} weight="duotone" /></div>
        <div className="path-card-content">
          <h3 className="path-card-title">Video Tutorial</h3>
          <p className="path-card-description">
            Watch a 3-minute walkthrough of the entire process.
          </p>
        </div>
        <span className="path-card-arrow">→</span>
      </Link>
    </div>
  </div>

</section>

 {/* ============================================
    WHAT IS FRAMER? SECTION
============================================= */}
<section id="what-is-framer" className="docs-section">
  <div className="fk-gs-wrapper">
    <div className="fk-gs-container">
      
      {/* 🔥 1. Заголовок и описание */}

      <h1 className="docs-title">What is Framer?</h1>
      <p className="fk-gs-text">
        Framer is a professional website builder that combines the freedom of design tools 
        (like Figma) with the power of a fully functional CMS and hosting platform.
      </p>
      <p className="fk-gs-text">
        Unlike traditional website builders, Framer gives you <strong>complete creative control</strong> — 
        you can design anything you imagine, and it publishes as a real, production-ready website instantly.
      </p>
      
      {/* 🔥 2. Highlight Box */}
      <div className="docs-highlight-box">
        <p className="highlight-text">
          <Info size={16} weight="duotone" style={{ marginRight: 6, verticalAlign: "text-bottom" }} />
          <strong>Think of it this way:</strong> If Figma is for designing interfaces, 
          Framer is for designing <em>and publishing</em> them — without writing code.
        </p>
      </div>

      {/* 🔥 3. Key Features */}
      <h3 className="docs-subsection-title">Why Designers Love Framer</h3>
      
      <div className="fk-gs-grid">
        <div className="fk-gs-card">
          <div className="feature-icon"><PaintBrush size={18} weight="duotone" /></div>
          <div className="fk-gs-card-content">
            <h3>Design Freedom</h3>
            <p>Complete canvas control. No templates, no restrictions. Design pixel-perfect layouts exactly how you envision them.</p>
          </div>
        </div>
        
        <div className="fk-gs-card">
          <div className="feature-icon"><Lightning size={18} weight="duotone" /></div>
          <div className="fk-gs-card-content">
            <h3>Instant Publishing</h3>
            <p>One click to publish. Framer handles hosting, SSL, CDN, and performance optimization automatically.</p>
          </div>
        </div>
        
        <div className="fk-gs-card">
          <div className="feature-icon"><DeviceMobile size={18} weight="duotone" /></div>
          <div className="fk-gs-card-content">
            <h3>Responsive by Default</h3>
            <p>Built-in responsive tools. Design once, and your site adapts beautifully to desktop, tablet, and mobile.</p>
          </div>
        </div>
        
        <div className="fk-gs-card">
          <div className="feature-icon"><ArrowsClockwise size={18} weight="duotone" /></div>
          <div className="fk-gs-card-content">
            <h3>Figma Import</h3>
            <p>Copy-paste directly from Figma. Your designs transfer with layers, styles, and constraints intact.</p>
          </div>
        </div>
      </div>

      {/* 🔥 4. Comparison Table */}
      <h3 className="docs-subsection-title">Framer vs Traditional Builders</h3>
      
      <div className="docs-table-wrapper">
        <table className="docs-comparison-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Framer</th>
              <th>WordPress</th>
              <th>Webflow</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Learning Curve</strong></td>
              <td className="highlight-good">Easy (2-3 days)</td>
              <td>Medium</td>
              <td>Steep (2-3 weeks)</td>
            </tr>
            <tr>
              <td><strong>Design Freedom</strong></td>
              <td className="highlight-good">Complete</td>
              <td>Limited by themes</td>
              <td>Complete</td>
            </tr>
            <tr>
              <td><strong>Setup Time</strong></td>
              <td className="highlight-good">Instant</td>
              <td>Hours</td>
              <td>Medium</td>
            </tr>
            <tr>
              <td><strong>FramerKit Compatible</strong></td>
              <td className="highlight-good"><CheckCircle size={16} weight="duotone" style={{ marginRight: 6, verticalAlign: "text-bottom" }} />Yes</td>
              <td>❌ No</td>
              <td>❌ No</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 🔥 5. CTA Box */}
      <div className="docs-cta-box">
        <h3 className="cta-box-title">Ready to Try Framer?</h3>
        <p className="cta-box-text">
          Sign up through my referral link and get <strong>3 months of Framer Pro for free</strong> on any annual plan.
        </p>
        <a 
          href="https://framer.link/framerkit" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Get Started with Framer
        </a>
      </div>

    </div>
  </div>
</section>


{/* ============================================
    HOW IT WORKS SECTION
============================================= */}
<section id="how-it-works" className="docs-section">
  
  {/* 🔥 1. Header */}
  <div className="docs-header">

    <h1 className="docs-title">How it Works</h1>
    <p className="docs-subtitle">
      A simple 3-step flow: find a block, copy it, and customize it in Framer.
    </p>
  </div>

  {/* 🔥 2. The 3-Step Workflow (Visual) */}
  <div className="workflow-diagram">
    
    {/* Step 1 */}
    <div className="workflow-step">
      <div className="step-visual">
        <span className="step-icon-large"><MagnifyingGlass size={18} weight="duotone" /></span>
        <div className="step-screenshot-placeholder">
          <span>Find a section</span>
        </div>
      </div>
      <div className="step-content">
        <h3 className="step-title">1. Browse</h3>
        <p className="step-description">
          Open the library and pick the section or component you need. Use categories to find the right block quickly.
        </p>
      </div>
    </div>

    {/* Arrow Connector */}
    <div className="workflow-arrow">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </div>

    {/* Step 2 */}
    <div className="workflow-step">
      <div className="step-visual">
        <span className="step-icon-large"><CopySimple size={18} weight="duotone" /></span>
        <div className="step-screenshot-placeholder">
          <span>Copy to clipboard</span>
        </div>
      </div>
      <div className="step-content">
        <h3 className="step-title">2. Copy</h3>
        <p className="step-description">
          Click the Copy button. The block is instantly copied and ready to paste into your Framer project.
        </p>
      </div>
    </div>

    {/* Arrow Connector */}
    <div className="workflow-arrow">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </div>

    {/* Step 3 */}
    <div className="workflow-step">
      <div className="step-visual">
        <span className="step-icon-large"><PaintBrush size={28} weight="duotone" /></span>
        <div className="step-screenshot-placeholder">
          <span>Paste and edit</span>
        </div>
      </div>
      <div className="step-content">
        <h3 className="step-title">3. Customize</h3>
        <p className="step-description">
          Paste in Framer (Ctrl/Cmd + V), then adjust text, spacing, colors, and styles to match your project.
        </p>
      </div>
    </div>

  </div>

  {/* 🔥 3. Visual Example: Copy-Paste Demo */}
  <div className="docs-content-block">
    <h2 className="docs-subsection-title">See it in Action</h2>
    <p className="docs-text">
      Quick preview of the copy-paste workflow:
    </p>
    
    <div className="copy-paste-demo">
      <div className="demo-column">
        <div className="demo-header">
          <span className="demo-badge">FramerKit</span>
          <span className="demo-action">Copy block</span>
        </div>
        <div className="demo-preview">
          <div className="demo-component-placeholder">
            <span><PuzzlePiece size={14} weight="duotone" style={{ marginRight: 6, verticalAlign: "text-bottom" }} />Button Component</span>
          </div>
          <button className="demo-copy-btn"><CopySimple size={14} weight="duotone" style={{ marginRight: 6, verticalAlign: "text-bottom" }} />Copy</button>
        </div>
      </div>
      
      <div className="demo-arrow">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
      
      <div className="demo-column">
        <div className="demo-header">
          <span className="demo-badge">Framer</span>
          <span className="demo-action">Paste and edit</span>
        </div>
        <div className="demo-preview">
          <div className="demo-canvas-placeholder">
            <span><Sparkle size={14} weight="duotone" style={{ marginRight: 6, verticalAlign: "text-bottom" }} />Component appears on canvas</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* 🔥 4. Pro Tips */}
  <div className="docs-content-block">
    <h2 className="docs-subsection-title">Pro Tips</h2>
    
    <div className="docs-tips-grid">
      <div className="tip-card">
        <div className="tip-icon"><Lightning size={18} weight="duotone" /></div>
        <h3 className="tip-title">Use Keyboard Shortcuts</h3>
        <p className="tip-description">
          Press <kbd>Ctrl+K</kbd> (or <kbd>Cmd+K</kbd>) to search components instantly. Save time browsing.
        </p>
      </div>
      
      <div className="tip-card">
        <div className="tip-icon"><Target size={18} weight="duotone" /></div>
        <h3 className="tip-title">Start with Wireframe Mode</h3>
        <p className="tip-description">
          Build the structure first in Wireframe mode, then switch to Design mode for polished styles.
        </p>
      </div>
      
      <div className="tip-card">
        <div className="tip-icon"><LinkSimple size={18} weight="duotone" /></div>
        <h3 className="tip-title">Copy Section Links</h3>
        <p className="tip-description">
          Share specific components with your team by copying the URL. Perfect for collaboration.
        </p>
      </div>
      
      <div className="tip-card">
        <div className="tip-icon"><ArrowsClockwise size={18} weight="duotone" /></div>
        <h3 className="tip-title">Mix and Match</h3>
        <p className="tip-description">
          Don't be afraid to combine components from different sections. That's where the magic happens.
        </p>
      </div>
    </div>
  </div>

</section>

 {/* ============================================
    QUICK START SECTION
============================================= */}
<section id="quick-start" className="docs-section">
  
  {/* 🔥 1. Header */}
  <div className="docs-header">
    
    <h1 className="docs-title">Quick Start</h1>
    <p className="docs-subtitle">
      Get your first FramerKit component in 60 seconds. No setup, no accounts — just copy, paste, and go.
    </p>
  </div>

  {/* 🔥 2. Prerequisites Check */}
  <div className="docs-content-block">
    <h2 className="docs-subsection-title">Before You Start</h2>
    <p className="docs-text">
      Make sure you have these ready:
    </p>
    
    <div className="prerequisites-grid">
      <div className="prerequisite-item">
        <span className="prerequisite-icon"><CheckCircle size={18} weight="duotone" /></span>
        <div>
          <h4 className="prerequisite-title">Framer Account</h4>
          <p className="prerequisite-description">
            Free account is enough to get started. <a href="https://framer.com" target="_blank" rel="noopener" className="inline-link">Sign up here</a>.
          </p>
        </div>
      </div>
      
      <div className="prerequisite-item">
        <span className="prerequisite-icon"><CheckCircle size={18} weight="duotone" /></span>
        <div>
          <h4 className="prerequisite-title">Framer App</h4>
          <p className="prerequisite-description">
            Download the desktop app for the best experience, or use the web version.
          </p>
        </div>
      </div>
      
      <div className="prerequisite-item">
        <span className="prerequisite-icon"><CheckCircle size={18} weight="duotone" /></span>
        <div>
          <h4 className="prerequisite-title">FramerKit Access</h4>
          <p className="prerequisite-description">
            Browse free components, or <Link to="/#get-framerkit" className="inline-link">get full access</Link> for 1000+ premium items.
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* 🔥 3. Step-by-Step Guide */}
  <div className="docs-content-block">
    <h2 className="docs-subsection-title">Step-by-Step Guide</h2>
    <p className="docs-text">
      Follow these 5 steps to add your first component:
    </p>
    
    <div className="steps-vertical">
      {/* Step 1 */}
      <div className="step-vertical-item">
        <div className="step-number-badge">1</div>
        <div className="step-vertical-content">
          <h3 className="step-vertical-title">Open FramerKit</h3>
          <p className="step-vertical-description">
            Go to <strong>framerkit.site</strong> and browse the library. Use the sidebar or search to find what you need.
          </p>
          <div className="step-visual-mini">
            <span className="visual-placeholder-text"><GlobeHemisphereWest size={16} weight="duotone" /> framerkit.site</span>
          </div>
        </div>
      </div>
      
      {/* Step 2 */}
      <div className="step-vertical-item">
        <div className="step-number-badge">2</div>
        <div className="step-vertical-content">
          <h3 className="step-vertical-title">Preview the Component</h3>
          <p className="step-vertical-description">
            Click any component to see it in detail. Toggle between <strong>Wireframe</strong> and <strong>Design</strong> modes to see different styles.
          </p>
          <div className="step-visual-mini">
            <span className="visual-placeholder-text"><Eye size={16} weight="duotone" /> Preview Mode</span>
          </div>
        </div>
      </div>
      
      {/* Step 3 */}
      <div className="step-vertical-item">
        <div className="step-number-badge">3</div>
        <div className="step-vertical-content">
          <h3 className="step-vertical-title">Click "Copy"</h3>
          <p className="step-vertical-description">
            Hit the <strong>Copy</strong> button. The component is instantly copied to your clipboard — no login required for free items.
          </p>
          <div className="step-visual-mini">
            <span className="visual-placeholder-text">📋 Copied!</span>
          </div>
        </div>
      </div>
      
      {/* Step 4 */}
      <div className="step-vertical-item">
        <div className="step-number-badge">4</div>
        <div className="step-vertical-content">
          <h3 className="step-vertical-title">Open Framer</h3>
          <p className="step-vertical-description">
            Launch Framer and open your project. Create a new frame or select an existing one where you want to paste the component.
          </p>
          <div className="step-visual-mini">
            <span className="visual-placeholder-text"><PaintBrush size={16} weight="duotone" /> Framer Canvas</span>
          </div>
        </div>
      </div>
      
      {/* Step 5 */}
      <div className="step-vertical-item">
        <div className="step-number-badge">5</div>
        <div className="step-vertical-content">
          <h3 className="step-vertical-title">Paste & Customize</h3>
          <p className="step-vertical-description">
            Press <kbd>Ctrl+V</kbd> (or <kbd>Cmd+V</kbd>). The component appears on your canvas. Change colors, fonts, text — make it yours!
          </p>
          <div className="step-visual-mini">
            <span className="visual-placeholder-text"><Sparkle size={16} weight="duotone" /> Ready to edit</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* 🔥 4. Interactive Demo Placeholder */}
  <div className="docs-content-block">
    <h2 className="docs-subsection-title">Try It Yourself</h2>
    <p className="docs-text">
      Practice with this example component:
    </p>
    
    <div className="interactive-demo">
      <div className="demo-panel">
        <div className="demo-panel-header">
          <span className="demo-panel-title">FramerKit Preview</span>
          <span className="demo-panel-badge">Free</span>
        </div>
        <div className="demo-panel-content">
          <div className="demo-component-preview">
            <button className="demo-button-primary">Get Started</button>
          </div>
        </div>
        <div className="demo-panel-footer">
          <button className="demo-copy-button">📋 Copy Component</button>
        </div>
      </div>
      
      <div className="demo-instructions">
        <p><strong>1.</strong> Click "Copy Component" above</p>
        <p><strong>2.</strong> Open Framer and create a new frame</p>
        <p><strong>3.</strong> Press Ctrl+V to paste</p>
        <p><strong>4.</strong> Customize colors, text, and styles</p>
      </div>
    </div>
  </div>

  {/* 🔥 5. Troubleshooting */}
  <div className="docs-content-block">
    <h2 className="docs-subsection-title">Troubleshooting</h2>
    
    <div className="troubleshooting-grid">
      <div className="troubleshooting-item">
        <h4 className="troubleshooting-question">Component not pasting?</h4>
        <p className="troubleshooting-answer">
          Make sure you're pasting into a <strong>Frame</strong> in Framer, not directly onto the canvas. Create a new frame first if needed.
        </p>
      </div>
      
      <div className="troubleshooting-item">
        <h4 className="troubleshooting-question">Styles look different?</h4>
        <p className="troubleshooting-answer">
          Components adapt to your Framer project's theme. You can override any style in the Design panel after pasting.
        </p>
      </div>
      
      <div className="troubleshooting-item">
        <h4 className="troubleshooting-question">Can't find the Copy button?</h4>
        <p className="troubleshooting-answer">
          Some premium components require authentication. <Link to="/#get-framerkit" className="inline-link">Get full access</Link> to unlock all features.
        </p>
      </div>
      
      <div className="troubleshooting-item">
        <h4 className="troubleshooting-question">Need more help?</h4>
        <p className="troubleshooting-answer">
          Check our <Link to="/#faq-contact" className="inline-link">FAQ</Link> or <a href="mailto:support@framerkit.site" className="inline-link">email support</a>.
        </p>
      </div>
    </div>
  </div>


</section>

  {/* ============================================
    video-tutorial
============================================= */}

<section id="video" className="docs-section">
  
  
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