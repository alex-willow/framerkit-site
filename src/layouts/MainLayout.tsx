import { useRef, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import DocsRightToc from "../components/DocsRightToc";
import { LESSON_SECTIONS as BuildFirstLandingFastSections } from "../pages/Lessons/BuildFirstLandingFast";
import { LESSON_SECTIONS as FramerkitWorkflowPagesSections } from "../pages/Lessons/FramerkitWorkflowPages";
import { LESSON_SECTIONS as CombineSectionsBetterLayoutsSections } from "../pages/Lessons/CombineSectionsBetterLayouts";
import { LESSON_SECTIONS as ResponsiveLayoutFramerSections } from "../pages/Lessons/ResponsiveLayoutFramer";
import { LESSON_SECTIONS as NavbarToCtaFlowSections } from "../pages/Lessons/NavbarToCtaFlow";
import { LESSON_SECTIONS as ZeroToFirstClientSections } from "../pages/Lessons/ZeroToFirstClient";
import { LESSON_SECTIONS as WhatToDoNextSections } from "../pages/Lessons/WhatToDoNext";
import { LESSON_SECTIONS as BuildFasterWithTemplatesSections } from "../pages/Lessons/BuildFasterWithTemplates";
import { LESSON_SECTIONS as DeliverProjectsWithoutRevisionsSections } from "../pages/Lessons/DeliverProjectsWithoutRevisions";
import { LESSON_SECTIONS as HowToTalkToClientsSections } from "../pages/Lessons/HowToTalkToClients";
import { LESSON_SECTIONS as HowToPriceYourWorkSections } from "../pages/Lessons/HowToPriceYourWork";
import { LESSON_SECTIONS as HowToFindClientsSections } from "../pages/Lessons/HowToFindClients";
import { LESSON_SECTIONS as FramerkitForFreelanceSections } from "../pages/Lessons/FramerkitForFreelance";
import { LESSON_SECTIONS as SpeedTricksForFramerSections } from "../pages/Lessons/SpeedTricksForFramer";
import { LESSON_SECTIONS as BuildOnePageWebsiteSections } from "../pages/Lessons/BuildOnePageWebsite";
import { LESSON_SECTIONS as BuildAppLandingPageSections } from "../pages/Lessons/BuildAppLandingPage";
import { LESSON_SECTIONS as BuildAgencyWebsiteSections } from "../pages/Lessons/BuildAgencyWebsite";
import { LESSON_SECTIONS as BuildPortfolioWebsiteSections } from "../pages/Lessons/BuildPortfolioWebsite";
import { LESSON_SECTIONS as BuildSaaSLandingPageSections } from "../pages/Lessons/BuildSaaSLandingPage";
import { LESSON_SECTIONS as CommonMistakesFramerSections } from "../pages/Lessons/CommonMistakesFramer";
import { LESSON_SECTIONS as SpeedWorkflowBuildFastSections } from "../pages/Lessons/SpeedWorkflowBuildFast";
import { LESSON_SECTIONS as WireframeDesignDarkModesSections } from "../pages/Lessons/WireframeDesignDarkModes";
import { LESSON_SECTIONS as ImprovePageSmallChangesSections } from "../pages/Lessons/ImprovePageSmallChanges";
import { LESSON_SECTIONS as ContentAndCopySectionsSections } from "../pages/Lessons/ContentAndCopySections";
import { ARTICLE_SECTIONS as TemplatesVsSectionsSections } from "../pages/Articles/TemplatesVsSections";
import { ARTICLE_SECTIONS as ColorPaletteSections } from "../pages/Articles/ColorPalette";
import { ARTICLE_SECTIONS as TextStylesSections } from "../pages/Articles/TextStyles";
import { ARTICLE_SECTIONS as ColorSetsSections } from "../pages/Articles/ColorSets";

type WindowWithGtag = Window & {
  gtag?: (command: string, id: string, params?: Record<string, string>) => void;
};

type MainLayoutProps = {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  theme?: "light" | "dark";
  onThemeToggle?: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  onSignInOpen: () => void;
  isMobile: boolean;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  galleryScrollRef?: React.RefObject<HTMLDivElement>;
  isAdmin?: boolean;
};

export default function MainLayout({
  children,
  activeSection,
  onSectionChange,
  theme,
  onThemeToggle,
  isAuthenticated,
  onLogout,
  onSignInOpen,
  isMobile,
  isMenuOpen,
  onMenuToggle,
  galleryScrollRef,
  isAdmin = false,
}: MainLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const internalRef = useRef<HTMLDivElement>(null);
  const contentRef = galleryScrollRef || internalRef;
  const isCatalogPage =
    location.pathname === "/layout" ||
    location.pathname.startsWith("/layout/") ||
    location.pathname === "/components" ||
    location.pathname.startsWith("/components/") ||
    location.pathname === "/templates" ||
    location.pathname.startsWith("/templates/") ||
    location.pathname === "/learn/lessons" ||
    location.pathname.startsWith("/learn/lessons/") ||
    location.pathname === "/learn/articles" ||
    location.pathname.startsWith("/learn/articles/") ||
    location.pathname === "/resources" ||
    location.pathname.startsWith("/resources/") ||
    location.pathname === "/updates" ||
    location.pathname.startsWith("/updates/") ||
    location.pathname === "/support" ||
    location.pathname.startsWith("/support/");
  const isLearnTopStickyPage =
    location.pathname === "/learn/lessons" ||
    location.pathname.startsWith("/learn/lessons/") ||
    location.pathname === "/learn/articles" ||
    location.pathname.startsWith("/learn/articles/") ||
    location.pathname === "/support" ||
    location.pathname.startsWith("/support/");
  // Determine if current page should show right TOC
  const isPageWithToc = 
    location.pathname === "/" ||
    location.pathname === "/learn/lessons/build-first-landing-fast" ||
    location.pathname === "/learn/lessons/framerkit-workflow-pages" ||
    location.pathname === "/learn/lessons/combine-sections-better-layouts" ||
    location.pathname === "/learn/lessons/responsive-layout-framer" ||
    location.pathname === "/learn/lessons/navbar-to-cta-flow" ||
    location.pathname === "/learn/lessons/zero-to-first-client" ||
    location.pathname === "/learn/lessons/what-to-do-next" ||
    location.pathname === "/learn/lessons/build-faster-with-templates" ||
    location.pathname === "/learn/lessons/deliver-projects-without-revisions" ||
    location.pathname === "/learn/lessons/how-to-talk-to-clients" ||
    location.pathname === "/learn/lessons/how-to-price-your-work" ||
    location.pathname === "/learn/lessons/how-to-find-clients" ||
    location.pathname === "/learn/lessons/framerkit-for-freelance" ||
    location.pathname === "/learn/lessons/speed-tricks-for-framer" ||
    location.pathname === "/learn/lessons/build-one-page-website" ||
    location.pathname === "/learn/lessons/build-app-landing-page" ||
    location.pathname === "/learn/lessons/build-agency-website" ||
    location.pathname === "/learn/lessons/build-portfolio-website" ||
    location.pathname === "/learn/lessons/build-saas-landing-page" ||
    location.pathname === "/learn/lessons/common-mistakes-framer" ||
    location.pathname === "/learn/lessons/speed-workflow-build-fast" ||
    location.pathname === "/learn/lessons/wireframe-design-dark-modes" ||
    location.pathname === "/learn/lessons/improve-page-small-changes" ||
    location.pathname === "/learn/lessons/content-and-copy-sections" ||
    location.pathname === "/learn/articles/templates-vs-sections-framerkit" ||
    location.pathname === "/learn/articles/color-palette-in-framerkit" ||
    location.pathname === "/learn/articles/text-styles-in-framerkit" ||
    location.pathname === "/learn/articles/color-sets-in-framerkit";
  const showDocsRightToc = !isMobile && isPageWithToc;
  
  // Get TOC sections based on current page
  const docsTocSections = useMemo(() => {
    switch (location.pathname) {
      case "/":
        return [
          { id: "overview", label: "Overview" },
          { id: "how-it-works", label: "How it Works" },
          { id: "quick-start", label: "Quick Start" },
          { id: "using-the-plugin", label: "Using the Plugin" },
          { id: "video-tutorial", label: "Video Tutorial" },
        ];
      case "/learn/lessons/build-first-landing-fast":
        return BuildFirstLandingFastSections;
      case "/learn/lessons/framerkit-workflow-pages":
        return FramerkitWorkflowPagesSections;
      case "/learn/lessons/combine-sections-better-layouts":
        return CombineSectionsBetterLayoutsSections;
      case "/learn/lessons/responsive-layout-framer":
        return ResponsiveLayoutFramerSections;
      case "/learn/lessons/navbar-to-cta-flow":
        return NavbarToCtaFlowSections;
      case "/learn/lessons/zero-to-first-client":
        return ZeroToFirstClientSections;
      case "/learn/lessons/what-to-do-next":
        return WhatToDoNextSections;
      case "/learn/lessons/build-faster-with-templates":
        return BuildFasterWithTemplatesSections;
      case "/learn/lessons/deliver-projects-without-revisions":
        return DeliverProjectsWithoutRevisionsSections;
      case "/learn/lessons/how-to-talk-to-clients":
        return HowToTalkToClientsSections;
      case "/learn/lessons/how-to-price-your-work":
        return HowToPriceYourWorkSections;
      case "/learn/lessons/how-to-find-clients":
        return HowToFindClientsSections;
      case "/learn/lessons/framerkit-for-freelance":
        return FramerkitForFreelanceSections;
      case "/learn/lessons/speed-tricks-for-framer":
        return SpeedTricksForFramerSections;
      case "/learn/lessons/build-one-page-website":
        return BuildOnePageWebsiteSections;
      case "/learn/lessons/build-app-landing-page":
        return BuildAppLandingPageSections;
      case "/learn/lessons/build-agency-website":
        return BuildAgencyWebsiteSections;
      case "/learn/lessons/build-portfolio-website":
        return BuildPortfolioWebsiteSections;
      case "/learn/lessons/build-saas-landing-page":
        return BuildSaaSLandingPageSections;
      case "/learn/lessons/common-mistakes-framer":
        return CommonMistakesFramerSections;
      case "/learn/lessons/speed-workflow-build-fast":
        return SpeedWorkflowBuildFastSections;
      case "/learn/lessons/wireframe-design-dark-modes":
        return WireframeDesignDarkModesSections;
      case "/learn/lessons/improve-page-small-changes":
        return ImprovePageSmallChangesSections;
      case "/learn/lessons/content-and-copy-sections":
        return ContentAndCopySectionsSections;
      case "/learn/articles/templates-vs-sections-framerkit":
        return TemplatesVsSectionsSections;
      case "/learn/articles/color-palette-in-framerkit":
        return ColorPaletteSections;
      case "/learn/articles/text-styles-in-framerkit":
        return TextStylesSections;
      case "/learn/articles/color-sets-in-framerkit":
        return ColorSetsSections;
      default:
        return [];
    }
  }, [location.pathname]);

  const handlePricingClick = () => {
    navigate("/#get-framerkit");
  };

  // ===============================
  // GA: Инициализация
  // ===============================
  useEffect(() => {
    // добавляем скрипт GA один раз
    const scriptExists = document.querySelector(`script[src*="googletagmanager"]`);
    if (!scriptExists) {
      const script1 = document.createElement("script");
      script1.async = true;
      script1.src = "https://www.googletagmanager.com/gtag/js?id=G-GNZGR575KN";
      document.head.appendChild(script1);

      const script2 = document.createElement("script");
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-GNZGR575KN', { page_path: window.location.pathname });
      `;
      document.head.appendChild(script2);
    }
  }, []);

  // ===============================
  // GA: Отслеживание страниц
  // ===============================
  useEffect(() => {
    const windowWithGtag = window as WindowWithGtag;
    if (windowWithGtag.gtag) {
      windowWithGtag.gtag("config", "G-GNZGR575KN", {
        page_path: location.pathname + location.hash,
      });
    }
  }, [location.pathname, location.hash]);

  // ===============================
  // Скролл в начало при смене страницы
  // ===============================
  useEffect(() => {
    if (location.hash) return;

    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [location.pathname, location.hash, contentRef]);

  return (
    <div className="container" data-theme={theme} data-framer-theme={theme}>
      <Header
        isMobile={isMobile}
        onMenuToggle={onMenuToggle}
        theme={theme}
        onThemeToggle={onThemeToggle}
      />

      <div className="app-layout">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          isMobile={isMobile}
          isMenuOpen={isMenuOpen}
          onMenuClose={onMenuToggle}
          isAuthenticated={isAuthenticated}
          onLogout={onLogout}
          onSignInOpen={onSignInOpen}
          isAdmin={isAdmin}
        />

        <main className="content" ref={contentRef}>
          {!isMobile && isCatalogPage && (
            <div
              className={`desktop-header-actions ${
                isLearnTopStickyPage ? "desktop-header-actions-sticky" : ""
              }`}
            >
              {isAuthenticated ? (
                <button className="logoutButton" onClick={onLogout}>
                  Log out
                </button>
              ) : (
                <>
                  <button className="logoutButton" onClick={onSignInOpen}>
                    Log in
                  </button>
                  <button
                    className="authButton"
                    onClick={handlePricingClick}
                  >
                    Get Full Access
                  </button>
                </>
              )}
              {onThemeToggle && (
                <button
                  type="button"
                  className={`theme-toggle-btn ${theme === "dark" ? "active" : ""}`}
                  onClick={onThemeToggle}
                  aria-label={theme === "dark" ? "Dark theme" : "Light theme"}
                  title=""
                >
                  {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
                </button>
              )}
            </div>
          )}
          {children}
          {showDocsRightToc && <DocsRightToc sections={docsTocSections} />}
        </main>
      </div>
    </div>
  );
}
