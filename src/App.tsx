import { useState, useEffect, useRef } from "react";
import "./App.css";
import { createClient } from "@supabase/supabase-js";
import { Sun, Moon, Copy, Lock, LogOut } from "lucide-react";
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
/* =============== TYPES ======================= */
/* --------------------------------------------- */

type ComponentItem = {
  key: string;
  title: string;
  image: string;
  url: string;
  type: "free" | "paid";
  section: string;
};

/* --------------------------------------------- */
/* =============== SUPABASE ==================== */
/* --------------------------------------------- */

const supabase = createClient(
  "https://ibxakfxqoqiypfhgkpds.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlieGFrZnhxb3FpeXBmaGdrcGRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MTQxMDcsImV4cCI6MjA1NjM5MDEwN30.tWculxF6xgGw4NQEWPBp7uH_gsl5HobP9wQn3Tf9yyw"
);

const STATIC_SECTIONS = [
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
];

const PLACEHOLDER = "https://via.placeholder.com/280x160?text=No+Image";

/* --------------------------------------------- */
/* =============== ICONS ======================= */
/* --------------------------------------------- */

const getIconForSection = (section: string) => {
  switch (section) {
    case "navbar":
      return <List weight="bold" />;
    case "hero":
      return <Triangle weight="bold" />;
    case "footer":
      return <ArrowDown weight="bold" />;
    case "contact":
      return <Envelope weight="bold" />;
    case "cta":
      return <Play weight="bold" />;
    case "faq":
      return <Question weight="bold" />;
    case "feature":
      return <Star weight="bold" />;
    case "gallery":
      return <Image weight="bold" />;
    case "logo":
      return <Diamond weight="bold" />;
    case "pricing":
      return <CurrencyDollar weight="bold" />;
    case "testimonial":
      return <Users weight="bold" />;
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

  // Click outside closes dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="component-dropdown-container" ref={ref}>
      <button
        className={`component-dropdown-toggle ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span>{value}</span>

        <svg
          className={`component-dropdown-arrow ${open ? "rotated" : ""}`}
          width="12"
          height="6"
          viewBox="0 0 12 6"
          fill="none"
        >
          <path
            d="M1 1L6 5L11 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <div className="component-dropdown-list">
          {options.map((option) => (
            <div
              key={option}
              className={`component-dropdown-option ${
                value === option ? "active" : ""
              }`}
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

export default function FramerKitGallery() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [activeSection, setActiveSection] = useState("navbar");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const galleryScrollRef = useRef<HTMLDivElement>(null);


  /* Auto login */
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedKey = localStorage.getItem("rememberedKey");

    if (savedEmail && savedKey) {
      const check = async () => {
        const { data: users } = await supabase
          .from("framer_kit")
          .select("*")
          .eq("email", savedEmail)
          .eq("key", savedKey);

        if (users && users.length > 0) setIsAuthenticated(true);
      };
      check();
    }
  }, []);

  /* Mobile detection */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 767);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* Load components */
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const all: ComponentItem[] = [];

        for (const sec of STATIC_SECTIONS) {
          const res = await fetch(
            `https://raw.githubusercontent.com/alex-willow/framerkit-data/main/${sec}.json`
          );
          if (!res.ok) continue;

          const json = await res.json();
          const items = json[sec] || [];
          items.forEach((item: any) =>
            all.push({ ...item, section: sec })
          );
        }

     
        if (!cancelled) setComponents(all);
      } catch (err) {
        if (!cancelled) console.error("Не удалось загрузить компоненты", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  /* Scroll reset when section changes */
  useEffect(() => {
    if (galleryScrollRef.current) {
      galleryScrollRef.current.scrollTo({ top: 0 });
    }
  }, [activeSection]);

  /* Logout */
  const handleLogout = async () => {
    const email = localStorage.getItem("rememberedEmail");

    if (email) {
      await supabase
        .from("framer_kit")
        .update({ site_status: "inactive" })
        .eq("email", email);
    }

    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("rememberedKey");

    setIsAuthenticated(false);
  };

  /* Filter logic */
  const filtered = components.filter(
    (item) =>
      item.section === activeSection &&
      (theme === "dark"
        ? item.key.includes("dark")
        : !item.key.includes("dark"))
  );

  /* Gallery elements */
  const galleryContent =
    loading
      ? Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton" />
        ))
      : filtered.length === 0
      ? (
        <div className="empty-message">Нет компонентов для выбранной темы.</div>
      )
      : filtered.map((item) => (
          <article key={item.key} className="card">
            <div className="cardImage">
              <img
                src={item.image || PLACEHOLDER}
                alt={item.title}
                loading="lazy"
              />
            </div>

            <div className="cardInfo">
              <h3>{item.title}</h3>

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

  /* ------------------------------------------------ */
  /* ==================== JSX ======================= */
  /* ------------------------------------------------ */

  return (
    <div className="container" data-theme={theme}>
      {/* HEADER */}
      <header className="header">
        <div className="headerLeft">
          <img src="/Logo.png" alt="FramerKit" className="logo" />
          <h1>FramerKit</h1>
        </div>

        <div className="headerActions">
          {isAuthenticated ? (
            <button className="logoutButton" onClick={handleLogout}>
              <LogOut size={16} />
              Log out
            </button>
          ) : (
            <>
              <button
                className="loginButton"
                onClick={() => setIsSignInOpen(true)}
              >
                Log in
              </button>
              <button
                className="authButton"
                onClick={() =>
                  window.open("https://gum.co/framerkit", "_blank")
                }
              >
                Get Full Access
              </button>
            </>
          )}
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="app-layout">
        {/* SIDEBAR (Fixed) */}
        {!isMobile && (
          <nav className="sidebar">
            <div className="sidebar-header">Layout Section</div>

            {STATIC_SECTIONS.map((sec) => (
              <button
                key={sec}
                onClick={() => setActiveSection(sec)}
                className={`sidebar-item ${
                  activeSection === sec ? "active" : ""
                }`}
              >
                <span className="sidebar-icon">{getIconForSection(sec)}</span>
                <span className="sidebar-text">
                  {sec.charAt(0).toUpperCase() + sec.slice(1)}
                </span>
              </button>
            ))}
          </nav>
        )}

        {/* CONTENT = fixed header + scrollable gallery */}
        <section className="content">
       

          {/* Sticky section header */}
          <div className="section-header-sticky">
          {isMobile && (
              <div className="dropdown-wrapper">
                <ComponentDropdown
                  options={STATIC_SECTIONS}
                  value={activeSection}
                  onChange={setActiveSection}
                />
              </div>
            )}
            <h2 className="title">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h2>

            <div className="subtitleRow">
              <p className="subtitle">
                {loading
                  ? "Loading..."
                  : `${filtered.length} layouts in ${
                      theme === "light" ? "Light" : "Dark"
                    } theme`}
              </p>

              <div className="themeSwitcher">
                <span className="modeLabel">Mode:</span>
                <button
                  className="themeToggle"
                  onClick={() =>
                    setTheme(theme === "light" ? "dark" : "light")
                  }
                >
                  {theme === "light" ? (
                    <Moon size={18} />
                  ) : (
                    <Sun size={18} />
                  )}
                </button>
              </div>
            </div>
            <div className="title-divider"></div>
          </div>

          {/* SCROLLABLE GALLERY */}
          <div className="gallery-scroll-area" ref={galleryScrollRef}>
            <div className="gallery">{galleryContent}</div>

            {/* FOOTER (показывается только внизу) */}
            <footer className="footer">
            <div className="footer-content">
              <span className="footer-text">
                © {new Date().getFullYear()} FramerKit. All rights reserved
              </span>

              <div className="footer-socials">
                <a href="https://x.com/framer_kit" target="_blank" rel="noopener noreferrer">
                  <img src="/x-logo.svg" alt="X Logo" width={18} height={18} />
                </a>
                <a href="https://www.instagram.com/framer.kit/" target="_blank" rel="noopener noreferrer">
                  <InstagramLogo size={18} />
                </a>
                <a href="https://www.youtube.com/@framerkit_plugin" target="_blank" rel="noopener noreferrer">
                  <YoutubeLogo size={18} />
                </a>
                <a href="https://www.tiktok.com/@framer_plugin" target="_blank" rel="noopener noreferrer">
                  <TiktokLogo size={18} />
                </a>
              </div>
            </div>
          </footer>
          </div>
        </section>
      </div>

      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onLogin={() => setIsAuthenticated(true)}
      />
    </div>
  );
}
