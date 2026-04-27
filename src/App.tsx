import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import ReactGA from "react-ga4";
import { Analytics } from "@vercel/analytics/react";
import { GA_ID, SUPABASE_ANON_KEY, SUPABASE_URL } from "./lib/env";

// Lazy create Supabase client only when config is available
const getSupabaseClient = () => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null;
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
};

import MainLayout from "./layouts/MainLayout";
import LandingNavbar from './components/LandingNavbar';
import Sidebar from './components/Sidebar';
import NoticeBar from './components/NoticeBar';

// Pages
import LandingPage from './pages/LandingPage'; 
import HomePage from "./pages/HomePage";
import LayoutPage from './pages/LayoutPage';
import ComponentPage from './pages/ComponentPage';
import TemplatesPage from './pages/TemplatesPage';
import CatalogSectionPage from "./pages/CatalogSectionPage";

// Templates
import FramerKitDaily from "./pages/Templates/FramerKitDaily";
import SignInModal from "./SignInModal";

import ResourcesPage from "./pages/ResourcesPage";
import ResourceArticlePage from "./pages/ResourceArticlePage";
import UpdatesPage from "./pages/UpdatesPage";
import SupportPage from "./pages/SupportPage";

// ================================
// 🔑 GA4 ID
// ================================

// ================================
// 🔥 Основной компонент
// ================================
function AppContent() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    () =>
      Boolean(
        localStorage.getItem("rememberedEmail") &&
          localStorage.getItem("rememberedKey")
      )
  );
  const [isAdmin, setIsAdmin] = useState(
    () => localStorage.getItem("framerkitAdmin") === "true"
  );
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark" ? "dark" : "light";
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Unified theme toggle function that saves to localStorage
  const handleThemeToggle = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    window.dispatchEvent(
      new CustomEvent("themeChange", { detail: { theme: nextTheme } })
    );
  };
  

  // 🔥 ОПРЕДЕЛЯЕМ: это лендинг или документация с хэшем?
  // Разрешаем pricing hash как часть лендинга, чтобы переход был прямым и без визуального "доскролла".
  const isLandingHash = location.hash === "#get-framerkit";
  const isLandingPage = location.pathname === "/" && (!location.hash || isLandingHash);

  const currentActiveSection = isLandingPage ? "overview" : activeSection;

  // ================================
  // 🔥 GA4 INIT (ONCE)
  // ================================
  useEffect(() => {
    ReactGA.initialize(GA_ID);
  }, []);

  // ================================
  // 📄 GA4 PAGEVIEWS (SPA + HASH)
  // ================================
  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search + location.hash,
    });
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    document.documentElement.setAttribute("data-framer-theme", theme);
    document.body.setAttribute("data-framer-theme", theme);
    window.dispatchEvent(new CustomEvent("framerkit-theme-change", { detail: theme }));
  }, [theme]);

  useEffect(() => {
    const handleGlobalThemeChange = (event: Event) => {
      const nextTheme = (event as CustomEvent<"light" | "dark">).detail;
      if (nextTheme === "light" || nextTheme === "dark") {
        setTheme(nextTheme);
      }
    };

    window.addEventListener("framerkit-theme-change", handleGlobalThemeChange as EventListener);
    return () => {
      window.removeEventListener("framerkit-theme-change", handleGlobalThemeChange as EventListener);
    };
  }, []);

  // ================================
  // 📱 MOBILE CHECK
  // ================================
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 767);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);



  // ================================
  // 🔐 LOGOUT
  // ================================
  const handleLogout = async () => {
    const email = localStorage.getItem("rememberedEmail");
    if (email) {
      const supabase = getSupabaseClient();
      if (supabase) {
        await supabase
          .from("framer_kit")
          .update({ site_status: "inactive" })
          .eq("email", email);
      }
    }
    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("rememberedKey");
    localStorage.removeItem("framerkitAdmin");
    localStorage.removeItem("framerkitAdminAuth");
    setIsAuthenticated(false);
    setIsAdmin(false);

    ReactGA.event({
      category: "Auth",
      action: "logout",
    });
  };

  // ================================
  // 🧭 SECTION CHANGE HANDLER
  // ================================
  const handleSetActiveSection = (section: string) => {
    ReactGA.event({
      category: "Navigation",
      action: "section_click",
      label: section,
    });

    setActiveSection(section);
    setIsMenuOpen(false);

    const homeSections = [
      "overview",
      "getting-started",
      "layout-sections",
      "ui-components",
      "get-framerkit",
      "faq-contact",
    ];

    if (homeSections.includes(section)) {
      // Навигация через хэш на главной странице
      navigate(`/#${section}`);
      return;
    }

    const layoutSections = [
      "navbar",
      "hero",
      "logo",
      "feature",
      "gallery",
      "testimonial",
      "contact",
      "pricing",
      "faq",
      "cta",
      "footer",
    ];

    if (layoutSections.includes(section)) {
      navigate(`/layout/${section}`);
      return;
    }

    const componentsSections = [
      "Accordion",
      "AccordionGroup",
      "Avatar",
      "AvatarGroup",
      "Badge",
      "Button",
      "Card",
      "Icon",
      "Input",
      "Form",
      "PricingCard",
      "Rating",
      "TestimonialCard",
    ];

    if (componentsSections.includes(section)) {
      navigate(
        `/components/${section.charAt(0).toLowerCase()}${section.slice(1)}`
      );
    }
  };

  return (
    <div data-framer-theme={theme}>
      <NoticeBar />
      
      {/* 🔥 УСЛОВНЫЙ РЕНДЕР: Лендинг ИЛИ Документация */}
      
      {isLandingPage ? (
  // === 🏠 ЛЕНДИНГ ===
  <>
    {/* 🔥 Отдельный навбар для лендинга */}
    <LandingNavbar
      isMobile={isMobile}
      isMenuOpen={isMenuOpen}
      onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
      theme={theme}
      onThemeToggle={handleThemeToggle}
      isAuthenticated={isAuthenticated}
      onLogout={handleLogout}
      onSignInOpen={() => {
        ReactGA.event({ category: "Auth", action: "open_sign_in" });
        setIsSignInOpen(true);
      }}
      onGetAccess={() => {
        ReactGA.event({
          category: "CTA",
          action: "get_full_access",
          label: "landing_navbar"
        });
        const el = document.getElementById("get-framerkit");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    />
    <LandingPage theme={theme} />  
  </>
) : (
  // === 📚 ДОКУМЕНТАЦИЯ ===
  <MainLayout
    activeSection={currentActiveSection}
    onSectionChange={handleSetActiveSection}
    theme={theme}
    onThemeToggle={handleThemeToggle}
    isAuthenticated={isAuthenticated}
    onLogout={handleLogout}
    onSignInOpen={() => setIsSignInOpen(true)}
    isMobile={isMobile}
    isMenuOpen={isMenuOpen}
    onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
  >
    {/* 🔥 Твой существующий Sidebar для документации */}
    <Sidebar
      activeSection={currentActiveSection}
      onSectionChange={handleSetActiveSection}
      isMobile={isMobile}
      isMenuOpen={isMenuOpen}
      onMenuClose={() => setIsMenuOpen(false)}
      isAuthenticated={isAuthenticated}
      onLogout={handleLogout}
      onSignInOpen={() => setIsSignInOpen(true)}
    />
          <Routes>
            {/* 🔥 HomePage обрабатывает все хэш-секции: /#overview, /#getting-started и т.д. */}
            <Route path="/" element={
                <HomePage
                  onSectionChange={handleSetActiveSection}
                  theme={theme}
                  onThemeToggle={handleThemeToggle}
                  isAuthenticated={isAuthenticated}
                  onLogout={handleLogout}
                  onSignInOpen={() => setIsSignInOpen(true)}
                  onGetAccess={() => {
                    const target = document.getElementById("get-framerkit");
                    if (target) {
                      target.scrollIntoView({ behavior: "smooth", block: "start" });
                      window.history.replaceState(null, "", "/#get-framerkit");
                    } else {
                      navigate("/#get-framerkit");
                    }
                  }}
                />
              }
            />
            
            {/* === Layout Sections === */}
            <Route path="/layout" element={<LayoutPage isAdmin={isAdmin} />} />
            <Route
              path="/layout/:sectionId"
              element={
                <CatalogSectionPage
                  group="layout"
                  isAuthenticated={isAuthenticated}
                  isAdmin={isAdmin}
                  setIsSignInOpen={setIsSignInOpen}
                />
              }
            />

            {/* === Components === */}
            <Route path="/components" element={<ComponentPage theme={theme} isAdmin={isAdmin} />} />
            <Route
              path="/components/:sectionId"
              element={
                <CatalogSectionPage
                  group="components"
                  isAuthenticated={isAuthenticated}
                  isAdmin={isAdmin}
                  setIsSignInOpen={setIsSignInOpen}
                />
              }
            />

            {/* === Templates === */}
            <Route path="/templates" element={<TemplatesPage theme={theme} isAdmin={isAdmin} />} />
            <Route path="/templates/framerkitdaily" element={<FramerKitDaily isAuthenticated={isAuthenticated} setIsSignInOpen={setIsSignInOpen} />} />
            <Route
              path="/templates/:sectionId"
              element={
                <CatalogSectionPage
                  group="templates"
                  isAuthenticated={isAuthenticated}
                  isAdmin={isAdmin}
                  setIsSignInOpen={setIsSignInOpen}
                />
              }
            />

            {/* === Resources (Learn + Blog) === */}
        {/* === LEARN === */}
            <Route path="/learn/lessons" element={<ResourcesPage type="lessons" />} />
            <Route path="/learn/articles" element={<ResourcesPage type="articles" />} />

            <Route path="/learn/lessons/:slug" element={<ResourceArticlePage />} />
            <Route path="/learn/articles/:slug" element={<ResourceArticlePage />} />
            <Route path="/updates" element={<UpdatesPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/feedback" element={<Navigate to="/support" replace />} />
     
          </Routes>
        </MainLayout>
      )}

      {/* 🔐 Sign In Modal (глобальный, поверх всего) */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onLogin={() => {
          ReactGA.event({
            category: "Auth",
            action: "login_success",
          });
          setIsAuthenticated(true);
          setIsAdmin(localStorage.getItem("framerkitAdmin") === "true");
        }}
      />
    </div>
  );
}

// ================================
// 🔥 Экспорт с Router
// ================================
export default function App() {
  return (
    <Router>
      <AppContent />
      <Analytics />
    </Router>
  );
}
