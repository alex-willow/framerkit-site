// src/App.tsx
import { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import MainLayout from "./layouts/MainLayout";

// Pages
import HomePage from "./pages/HomePage";

// Layout Pages
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

// Components Pages
import AccordionPage from "./pages/Components/Accordion";
import AvatarPage from "./pages/Components/Avatar";
import BadgePage from "./pages/Components/Badge";
import ButtonPage from "./pages/Components/Button";
import CardPage from "./pages/Components/Card";
import IconPage from "./pages/Components/Icon";
import InputPage from "./pages/Components/Input";
import FormPage from "./pages/Components/Form";
import PricingCardPage from "./pages/Components/Pricingcard";
import RatingPage from "./pages/Components/Rating";
import TestimonialCardPage from "./pages/Components/Testimonialcard";
import AccordionGroupPage from "./pages/Components/Accordiongroup";
import AvatarGroupPage from "./pages/Components/Avatargroup";

// Templates Pages
import FramerKitDaily from "./pages/Templates/FramerKitDaily";

import SignInModal from "./SignInModal";

// Supabase client
const supabase = createClient(
  "https://ibxakfxqoqiypfhgkpds.supabase.co",
  "YOUR_SUPABASE_KEY"
);

function AppContent() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedKey = localStorage.getItem("rememberedKey");
    return Boolean(savedEmail && savedKey);
  });
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 767);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleLogout = async () => {
    const email = localStorage.getItem("rememberedEmail");
    if (email) {
      await supabase.from("framer_kit").update({ site_status: "inactive" }).eq("email", email);
    }
    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("rememberedKey");
    setIsAuthenticated(false);
  };

  const handleSetActiveSection = (section: string) => {
    setActiveSection(section);
    setIsMenuOpen(false);

    const homeSections = [
      "overview",
      "getting-started",
      "layout-sections",
      "ui-components",
      "get-framerkit",
      "faq-contact"
    ];
    if (homeSections.includes(section)) return;

    if (
      [
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
        "footer"
      ].includes(section)
    ) {
      navigate(`/layout/${section}`);
    } else {
      const path = section.charAt(0).toLowerCase() + section.slice(1);
      navigate(`/components/${path}`);
    }
  };

  return (
    <>
      <MainLayout
        activeSection={activeSection}
        onSectionChange={handleSetActiveSection}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onSignInOpen={() => setIsSignInOpen(true)}
        isMobile={isMobile}
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
      >
        <Routes>
          <Route path="/" element={<HomePage onSectionChange={handleSetActiveSection} />} />

          {/* Layout */}
          <Route path="/layout/navbar" element={<NavbarPage isAuthenticated={isAuthenticated} setIsSignInOpen={setIsSignInOpen} />} />
          <Route path="/layout/hero" element={<HeroPage isAuthenticated={isAuthenticated} setIsSignInOpen={setIsSignInOpen} />} />
          <Route path="/layout/logo" element={<LogoPage isAuthenticated={isAuthenticated} setIsSignInOpen={setIsSignInOpen} />} />
          <Route path="/layout/feature" element={<FeaturePage isAuthenticated={isAuthenticated} setIsSignInOpen={setIsSignInOpen} />} />
          <Route path="/layout/gallery" element={<GalleryPage isAuthenticated={isAuthenticated} setIsSignInOpen={setIsSignInOpen} />} />
          <Route path="/layout/testimonial" element={<TestimonialPage isAuthenticated={isAuthenticated} setIsSignInOpen={setIsSignInOpen} />} />
          <Route path="/layout/contact" element={<ContactPage isAuthenticated={isAuthenticated} setIsSignInOpen={setIsSignInOpen} />} />
          <Route path="/layout/pricing" element={<PricingPage isAuthenticated={isAuthenticated} setIsSignInOpen={setIsSignInOpen} />} />
          <Route path="/layout/faq" element={<FaqLayoutPage isAuthenticated={isAuthenticated} setIsSignInOpen={setIsSignInOpen} />} />
          <Route path="/layout/cta" element={<CtaPage isAuthenticated={isAuthenticated} setIsSignInOpen={setIsSignInOpen} />} />
          <Route path="/layout/footer" element={<FooterPage isAuthenticated={isAuthenticated} setIsSignInOpen={setIsSignInOpen} />} />

          {/* Components */}
          <Route path="/components/accordion" element={<AccordionPage isAuthenticated={isAuthenticated} setIsSignInOpen={setIsSignInOpen} />} />
          <Route path="/components/avatar" element={<AvatarPage isAuthenticated={isAuthenticated} setIsSignInOpen={setIsSignInOpen} />} />
          <Route path="/components/badge" element={<BadgePage isAuthenticated={isAuthenticated} setIsSignInOpen={setIsSignInOpen} />} />
          <Route path="/components/button" element={<ButtonPage isAuthenticated={isAuthenticated} setIsSignInOpen={setIsSignInOpen} />} />
          <Route path="/components/card" element={<CardPage isAuthenticated={isAuthenticated} setIsSignInOpen={setIsSignInOpen} />} />
          <Route path="/components/icon" element={<IconPage isAuthenticated={isAuthenticated} setIsSignInOpen={setIsSignInOpen} />} />
          <Route path="/components/input" element={<InputPage isAuthenticated={isAuthenticated} setIsSignInOpen={setIsSignInOpen} />} />
          <Route path="/components/form" element={<FormPage isAuthenticated={isAuthenticated} setIsSignInOpen={setIsSignInOpen} />} />
          <Route path="/components/pricingcard" element={<PricingCardPage isAuthenticated={isAuthenticated} setIsSignInOpen={setIsSignInOpen} />} />
          <Route path="/components/rating" element={<RatingPage isAuthenticated={isAuthenticated} setIsSignInOpen={setIsSignInOpen} />} />
          <Route path="/components/testimonialcard" element={<TestimonialCardPage isAuthenticated={isAuthenticated} setIsSignInOpen={setIsSignInOpen} />} />
          <Route path="/components/accordiongroup" element={<AccordionGroupPage isAuthenticated={isAuthenticated} setIsSignInOpen={setIsSignInOpen} />} />
          <Route path="/components/avatargroup" element={<AvatarGroupPage isAuthenticated={isAuthenticated} setIsSignInOpen={setIsSignInOpen} />} />

          {/* Templates */}
          <Route
            path="/templates/framerkitdaily"
            element={<FramerKitDaily isAuthenticated={isAuthenticated} setIsSignInOpen={setIsSignInOpen} />}
          />

          {/* fallback */}
          <Route path="*" element={<HomePage onSectionChange={handleSetActiveSection} />} />
        </Routes>
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
