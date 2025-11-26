// src/App.tsx
import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { Sun, Moon, Copy, Lock, LogOut } from "lucide-react";
import MainLayout from "./layouts/MainLayout";
import OverviewPage from "./pages/Overview";
import GettingStartedPage from "./pages/GettingStartedPage";
import LayoutSectionPage from "./pages/LayoutSectionPage";
import ComponentsPage from "./pages/ComponentsPage";
import InstallationPage from "./pages/Installation";
import HowItWorksPage from "./pages/HowItWorks";
import FAQPage from "./pages/FAQ";
import NavbarPage from "./pages/Layout/Navbar";
import HeroPage from "./pages/Layout/Hero";
import LogoPage from "./pages/Layout/Logo";
import FeaturePage from "./pages/Layout/Feature";
import GalleryPage from "./pages/Layout/Gallery";
import TestimonialPage from "./pages/Layout/Testimonial";
import ContactPage from "./pages/Layout/Contact";
import PricingPage from "./pages/Layout/Pricing";
import FaqLayoutPage from "./pages/Layout/Faq";
import CtaPage from "./pages/Layout/Cta";
import FooterPage from "./pages/Layout/Footer";
import AccordionPage from "./pages/Components/Accordion";
import AvatarPage from "./pages/Components/Avatar";
import BadgePage from "./pages/Components/Badge";
import ButtonPage from "./pages/Components/Button";
import CardPage from "./pages/Components/Card";
import IconPage from "./pages/Components/Icon";
import InputPage from "./pages/Components/Input";
import FormPage from "./pages/Components/Form";
import PricingCardPage from "./pages/Components/Pricingcard"; // ✅ исправлено
import RatingPage from "./pages/Components/Rating";
import TestimonialCardPage from "./pages/Components/Testimonialcard"; // ✅ исправлено
import AccordionGroupPage from "./pages/Components/Accordiongroup";
import AvatarGroupPage from "./pages/Components/Avatargroup"; // ✅ исправлено
import SignInModal from "./SignInModal";
import {
  List,
  Triangle,
  ArrowDown,
  Envelope,
  Play,
  Question,
  Star,
  Image,
  Diamond,
  CurrencyDollar,
  Users,
  InstagramLogo,
  YoutubeLogo,
  TiktokLogo,
} from "phosphor-react";

/* --------------------------------------------- */
/* =============== SUPABASE ==================== */
/* --------------------------------------------- */

const supabase = createClient(
  "https://ibxakfxqoqiypfhgkpds.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlieGFrZnhxb3FpeXBmaGdrcGRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MTQxMDcsImV4cCI6MjA1NjM5MDEwN30.tWculxF6xgGw4NQEWPBp7uH_gsl5HobP9wQn3Tf9yyw"
);

/* --------------------------------------------- */
/* =============== SECTIONS ==================== */
/* --------------------------------------------- */

const STATIC_SECTIONS = [
  "navbar", "hero", "logo", "feature", "gallery",
  "testimonial", "contact", "pricing", "faq", "cta", "footer"
];

const COMPONENT_SECTIONS = [
  "accordion", "avatar", "badge", "button", "card",
  "icon", "input", "form", "pricingcard", "rating", "testimonialcard",
  "accordiongroup", "avatargroup" // ✅ без дефиса
];

const TEMPLATES = ["templates/framerkitdaily"];

const PLACEHOLDER = "https://via.placeholder.com/280x160?text=No+Image";

/* --------------------------------------------- */
/* =============== ICONS ======================= */
/* --------------------------------------------- */

const getIconForSection = (section: string) => {
  if (section.startsWith("components/")) return <Diamond weight="bold" />;
  if (section.startsWith("templates/")) return <Play weight="bold" />;
  if (section.startsWith("getting-started")) return <Star weight="bold" />;
  if (section.startsWith("styles")) return <Star weight="bold" />;

  switch (section) {
    case "navbar": return <List weight="bold" />;
    case "hero": return <Triangle weight="bold" />;
    case "footer": return <ArrowDown weight="bold" />;
    case "contact": return <Envelope weight="bold" />;
    case "cta": return <Play weight="bold" />;
    case "faq": return <Question weight="bold" />;
    case "feature": return <Star weight="bold" />;
    case "gallery": return <Image weight="bold" />;
    case "logo": return <Diamond weight="bold" />;
    case "pricing": return <CurrencyDollar weight="bold" />;
    case "testimonial": return <Users weight="bold" />;
    default: return <Diamond weight="bold" />;
  }
};

/* ------------------------------------------------ */
/* =============== DROPDOWN ======================= */
/* ------------------------------------------------ */

type ComponentDropdownProps = {
  options: string[];
  value: string;
  onChange: (val: string) => void;
};

function ComponentDropdown({ options, value, onChange }: ComponentDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="component-dropdown-container" ref={ref}>
      <button
        className={`component-dropdown-toggle ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{value}</span>

        <svg
          className={`component-dropdown-arrow ${open ? "rotated" : ""}`}
          width="12"
          height="6"
          viewBox="0 0 12 6"
          fill="none"
        >
          <path d="M1 1L6 5L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="component-dropdown-list">
          {options.map((option) => (
            <div
              key={option}
              className={`component-dropdown-option ${value === option ? "active" : ""}`}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------ */
/* =============== MAIN APP ====================== */
/* ------------------------------------------------ */

function AppContent() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // ✅ Проверяем авторизацию при загрузке
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedKey = localStorage.getItem("rememberedKey");

    if (savedEmail && savedKey) {
      return true; // ← если есть данные — сразу авторизован
    }
    return false;
  });
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSectionFromUrl] = useState<string>("Overview");
  const galleryScrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Sync activeSection with URL
  useEffect(() => {
    if (location.pathname === "/") setActiveSectionFromUrl("Overview");
    else if (location.pathname === "/overview") setActiveSectionFromUrl("Overview");
    else if (location.pathname === "/getting-started") setActiveSectionFromUrl("Getting Started");
    else if (location.pathname === "/layout") setActiveSectionFromUrl("Layout Section");
    else if (location.pathname === "/components") setActiveSectionFromUrl("Components");
    else if (location.pathname === "/installation") setActiveSectionFromUrl("Installation");
    else if (location.pathname === "/how-it-works") setActiveSectionFromUrl("How It Works");
    else if (location.pathname === "/faq") setActiveSectionFromUrl("FAQ");
    // Layout Sections
    else if (location.pathname === "/layout/navbar") setActiveSectionFromUrl("navbar");
    else if (location.pathname === "/layout/hero") setActiveSectionFromUrl("hero");
    else if (location.pathname === "/layout/logo") setActiveSectionFromUrl("logo");
    else if (location.pathname === "/layout/feature") setActiveSectionFromUrl("feature");
    else if (location.pathname === "/layout/gallery") setActiveSectionFromUrl("gallery");
    else if (location.pathname === "/layout/testimonial") setActiveSectionFromUrl("testimonial");
    else if (location.pathname === "/layout/contact") setActiveSectionFromUrl("contact");
    else if (location.pathname === "/layout/pricing") setActiveSectionFromUrl("pricing");
    else if (location.pathname === "/layout/faq") setActiveSectionFromUrl("faq");
    else if (location.pathname === "/layout/cta") setActiveSectionFromUrl("cta");
    else if (location.pathname === "/layout/footer") setActiveSectionFromUrl("footer");
    // Component Sections (включая новые)
    else if (location.pathname === "/components/accordion") setActiveSectionFromUrl("components/accordion");
    else if (location.pathname === "/components/avatar") setActiveSectionFromUrl("components/avatar");
    else if (location.pathname === "/components/badge") setActiveSectionFromUrl("components/badge");
    else if (location.pathname === "/components/button") setActiveSectionFromUrl("components/button");
    else if (location.pathname === "/components/card") setActiveSectionFromUrl("components/card");
    else if (location.pathname === "/components/icon") setActiveSectionFromUrl("components/icon");
    else if (location.pathname === "/components/input") setActiveSectionFromUrl("components/input");
    else if (location.pathname === "/components/form") setActiveSectionFromUrl("components/form");
    else if (location.pathname === "/components/pricingcard") setActiveSectionFromUrl("components/pricingcard"); // ✅ без дефиса
    else if (location.pathname === "/components/rating") setActiveSectionFromUrl("components/rating");
    else if (location.pathname === "/components/testimonialcard") setActiveSectionFromUrl("components/testimonialcard"); // ✅ без дефиса
    else if (location.pathname === "/components/accordiongroup") setActiveSectionFromUrl("components/accordiongroup"); // ✅ без дефиса
    else if (location.pathname === "/components/avatargroup") setActiveSectionFromUrl("components/avatargroup"); // ✅ без дефиса
  }, [location.pathname]);

  // Mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 767);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Load all data
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const all: ComponentItem[] = [];

        // Load layout sections
        for (const sec of STATIC_SECTIONS) {
          try {
            const res = await fetch(
              `https://raw.githubusercontent.com/alex-willow/framerkit-data/main/${sec}.json`
            );
            if (!res.ok) continue;
            const json = await res.json();
            (json[sec] || []).forEach((item: any) => all.push({ ...item, section: sec }));
          } catch (e) {
            console.warn(`Failed to load ${sec}`, e);
          }
        }

        // Load component sections
        for (const sec of COMPONENT_SECTIONS) {
          try {
            const res = await fetch(
              `https://raw.githubusercontent.com/alex-willow/framerkit-data/components/${sec}.json` // ✅ без дефиса
            );
            if (!res.ok) continue;
            const json = await res.json();
            (json[sec] || []).forEach((item: any) =>
              all.push({ ...item, section: `components/${sec}` })
            );
          } catch (e) {
            console.warn(`Failed to load components/${sec}`, e);
          }
        }

        // Load templates
        for (const tpl of TEMPLATES) {
          try {
            const parts = tpl.split("/");
            const name = parts[1];
            const res = await fetch(
              `https://raw.githubusercontent.com/alex-willow/framerkit-data/main/templates/${name}.json`
            );
            if (!res.ok) continue;
            const json = await res.json();
            (json[name] || []).forEach((item: any) => all.push({ ...item, section: tpl }));
          } catch (e) {
            console.warn(`Failed to load template ${tpl}`, e);
          }
        }

        if (!cancelled) setComponents(all);
      } catch (err) {
        if (!cancelled) console.error("Failed to load", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Scroll to top when section changes
  useEffect(() => {
    galleryScrollRef.current?.scrollTo({ top: 0 });
  }, [activeSection]);

  const setActiveSection = (section: string) => {
    setActiveSectionFromUrl(section);
    setIsMenuOpen(false);
    if (section === "Overview") navigate("/overview");
    else if (STATIC_SECTIONS.includes(section)) navigate(`/layout/${section}`);
    else if (COMPONENT_SECTIONS.includes(section)) navigate(`/components/${section}`); // ✅ без дефиса
    else navigate(`/${section.toLowerCase().replace(/\s+/g, "-").replace(" ", "-")}`);
  };

  // Logout
  const handleLogout = async () => {
    const email = localStorage.getItem("rememberedEmail");

    if (email) {
      await supabase.from("framer_kit").update({ site_status: "inactive" }).eq("email", email);
    }

    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("rememberedKey");

    setIsAuthenticated(false);
  };

  // Filter components
  const filtered = components.filter(
    item =>
      item.section === activeSection &&
      (theme === "dark" ? item.key.includes("dark") : !item.key.includes("dark"))
  );

  // Gallery content
  const galleryContent = loading
    ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton" />)
    : filtered.length === 0
    ? <div className="empty-message">Пусто — в этой секции нет компонентов для выбранной темы.</div>
    : filtered.map(item => (
        <article
          key={item.key}
          className="card"
          role="listitem"
          aria-labelledby={`title-${item.key}`}
        >
          <div className="cardImage">
            <img src={item.image || PLACEHOLDER} alt={item.title} loading="lazy" />
          </div>
          <div className="cardInfo">
            <h3 id={`title-${item.key}`}>{item.title}</h3>
            {isAuthenticated || item.type === "free" ? (
              <div
                className="iconButton"
                onClick={() => navigator.clipboard.writeText(item.url)}
              >
                <Copy size={16} />
              </div>
            ) : (
              <div
                className="iconButton lock"
                onClick={() => setIsSignInOpen(true)}
              >
                <Lock size={16} />
              </div>
            )}
          </div>
        </article>
      ));

  return (
    <>
      <MainLayout
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        theme={theme}
        onThemeToggle={() => setTheme(theme === "light" ? "dark" : "light")}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onSignInOpen={() => setIsSignInOpen(true)}
        isMobile={isMobile}
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        galleryScrollRef={galleryScrollRef}
        components={components}
        loading={loading}
        galleryContent={galleryContent}
        filtered={filtered}
      >
        {location.pathname === "/" || location.pathname === "/overview" ? (
          <OverviewPage />
        ) : location.pathname === "/getting-started" ? (
          <GettingStartedPage />
        ) : location.pathname === "/layout" ? (
          <LayoutSectionPage
            components={components}
            theme={theme}
            setTheme={setTheme}
            isAuthenticated={isAuthenticated}
            setIsSignInOpen={setIsSignInOpen}
            galleryRef={galleryScrollRef}
          />
        ) : location.pathname === "/components" ? (
          <ComponentsPage
            components={components}
            theme={theme}
            setTheme={setTheme}
            isAuthenticated={isAuthenticated}
            setIsSignInOpen={setIsSignInOpen}
            galleryRef={galleryScrollRef}
          />
        ) : location.pathname === "/installation" ? (
          <InstallationPage />
        ) : location.pathname === "/how-it-works" ? (
          <HowItWorksPage />
        ) : location.pathname === "/faq" ? (
          <FAQPage />
        ) : location.pathname === "/layout/navbar" ? (
          <NavbarPage
            components={components}
            theme={theme}
            setTheme={setTheme}
            isAuthenticated={isAuthenticated}
            setIsSignInOpen={setIsSignInOpen}
            galleryRef={galleryScrollRef}
          />
        ) : location.pathname === "/layout/hero" ? (
          <HeroPage
            components={components}
            theme={theme}
            setTheme={setTheme}
            isAuthenticated={isAuthenticated}
            setIsSignInOpen={setIsSignInOpen}
            galleryRef={galleryScrollRef}
          />
        ) : location.pathname === "/layout/logo" ? (
          <LogoPage
            components={components}
            theme={theme}
            setTheme={setTheme}
            isAuthenticated={isAuthenticated}
            setIsSignInOpen={setIsSignInOpen}
            galleryRef={galleryScrollRef}
          />
        ) : location.pathname === "/layout/feature" ? (
          <FeaturePage
            components={components}
            theme={theme}
            setTheme={setTheme}
            isAuthenticated={isAuthenticated}
            setIsSignInOpen={setIsSignInOpen}
            galleryRef={galleryScrollRef}
          />
        ) : location.pathname === "/layout/gallery" ? (
          <GalleryPage
            components={components}
            theme={theme}
            setTheme={setTheme}
            isAuthenticated={isAuthenticated}
            setIsSignInOpen={setIsSignInOpen}
            galleryRef={galleryScrollRef}
          />
        ) : location.pathname === "/layout/testimonial" ? (
          <TestimonialPage
            components={components}
            theme={theme}
            setTheme={setTheme}
            isAuthenticated={isAuthenticated}
            setIsSignInOpen={setIsSignInOpen}
            galleryRef={galleryScrollRef}
          />
        ) : location.pathname === "/layout/contact" ? (
          <ContactPage
            components={components}
            theme={theme}
            setTheme={setTheme}
            isAuthenticated={isAuthenticated}
            setIsSignInOpen={setIsSignInOpen}
            galleryRef={galleryScrollRef}
          />
        ) : location.pathname === "/layout/pricing" ? (
          <PricingPage
            components={components}
            theme={theme}
            setTheme={setTheme}
            isAuthenticated={isAuthenticated}
            setIsSignInOpen={setIsSignInOpen}
            galleryRef={galleryScrollRef}
          />
        ) : location.pathname === "/layout/faq" ? (
          <FaqLayoutPage
            components={components}
            theme={theme}
            setTheme={setTheme}
            isAuthenticated={isAuthenticated}
            setIsSignInOpen={setIsSignInOpen}
            galleryRef={galleryScrollRef}
          />
        ) : location.pathname === "/layout/cta" ? (
          <CtaPage
            components={components}
            theme={theme}
            setTheme={setTheme}
            isAuthenticated={isAuthenticated}
            setIsSignInOpen={setIsSignInOpen}
            galleryRef={galleryScrollRef}
          />
        ) : location.pathname === "/layout/footer" ? (
          <FooterPage
            components={components}
            theme={theme}
            setTheme={setTheme}
            isAuthenticated={isAuthenticated}
            setIsSignInOpen={setIsSignInOpen}
            galleryRef={galleryScrollRef}
          />
        ) : location.pathname === "/components/accordion" ? (
          <AccordionPage
            components={components}
            theme={theme}
            setTheme={setTheme}
            isAuthenticated={isAuthenticated}
            setIsSignInOpen={setIsSignInOpen}
            galleryRef={galleryScrollRef}
          />
        ) : location.pathname === "/components/avatar" ? (
          <AvatarPage
            components={components}
            theme={theme}
            setTheme={setTheme}
            isAuthenticated={isAuthenticated}
            setIsSignInOpen={setIsSignInOpen}
            galleryRef={galleryScrollRef}
          />
        ) : location.pathname === "/components/badge" ? (
          <BadgePage
            components={components}
            theme={theme}
            setTheme={setTheme}
            isAuthenticated={isAuthenticated}
            setIsSignInOpen={setIsSignInOpen}
            galleryRef={galleryScrollRef}
          />
        ) : location.pathname === "/components/button" ? (
          <ButtonPage
            components={components}
            theme={theme}
            setTheme={setTheme}
            isAuthenticated={isAuthenticated}
            setIsSignInOpen={setIsSignInOpen}
            galleryRef={galleryScrollRef}
          />
        ) : location.pathname === "/components/card" ? (
          <CardPage
            components={components}
            theme={theme}
            setTheme={setTheme}
            isAuthenticated={isAuthenticated}
            setIsSignInOpen={setIsSignInOpen}
            galleryRef={galleryScrollRef}
          />
        ) : location.pathname === "/components/icon" ? (
          <IconPage
            components={components}
            theme={theme}
            setTheme={setTheme}
            isAuthenticated={isAuthenticated}
            setIsSignInOpen={setIsSignInOpen}
            galleryRef={galleryScrollRef}
          />
        ) : location.pathname === "/components/input" ? (
          <InputPage
            components={components}
            theme={theme}
            setTheme={setTheme}
            isAuthenticated={isAuthenticated}
            setIsSignInOpen={setIsSignInOpen}
            galleryRef={galleryScrollRef}
          />
        ) : location.pathname === "/components/form" ? (
          <FormPage
            components={components}
            theme={theme}
            setTheme={setTheme}
            isAuthenticated={isAuthenticated}
            setIsSignInOpen={setIsSignInOpen}
            galleryRef={galleryScrollRef}
          />
        ) : location.pathname === "/components/pricingcard" ? (
          <PricingCardPage
            components={components}
            theme={theme}
            setTheme={setTheme}
            isAuthenticated={isAuthenticated}
            setIsSignInOpen={setIsSignInOpen}
            galleryRef={galleryScrollRef}
          />
        ) : location.pathname === "/components/rating" ? (
          <RatingPage
            components={components}
            theme={theme}
            setTheme={setTheme}
            isAuthenticated={isAuthenticated}
            setIsSignInOpen={setIsSignInOpen}
            galleryRef={galleryScrollRef}
          />
        ) : location.pathname === "/components/testimonialcard" ? (
          <TestimonialCardPage
            components={components}
            theme={theme}
            setTheme={setTheme}
            isAuthenticated={isAuthenticated}
            setIsSignInOpen={setIsSignInOpen}
            galleryRef={galleryScrollRef}
          />
        ) : location.pathname === "/components/accordiongroup" ? (
          <AccordionGroupPage
            components={components}
            theme={theme}
            setTheme={setTheme}
            isAuthenticated={isAuthenticated}
            setIsSignInOpen={setIsSignInOpen}
            galleryRef={galleryScrollRef}
          />
        ) : location.pathname === "/components/avatargroup" ? (
          <AvatarGroupPage
            components={components}
            theme={theme}
            setTheme={setTheme}
            isAuthenticated={isAuthenticated}
            setIsSignInOpen={setIsSignInOpen}
            galleryRef={galleryScrollRef}
          />
        ) : (
          <OverviewPage />
        )}
      </MainLayout>

      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onLogin={() => setIsAuthenticated(true)}
      />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}