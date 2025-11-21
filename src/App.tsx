import { useState, useEffect, useRef } from "react"; 
import "./App.css"; 
import { Sun, Moon } from 'lucide-react';
import { List, Triangle, ArrowDown, Envelope, Play, Question, Star, Image, Diamond, CurrencyDollar, Users } from "phosphor-react";

type ComponentItem = {
  key: string;
  title: string;
  image: string;
  url: string;
  type: "free" | "paid";
  section: string;
};


const STATIC_SECTIONS = [
  "navbar", "hero", "logo", "feature", "gallery",
  "testimonial", "contact", "pricing", "faq", "cta", "footer"
];

const PLACEHOLDER = "https://via.placeholder.com/280x160?text=No+Image";


const getIconForSection = (section: string) => {
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
  }
};


export default function FramerKitGallery() {
  const contentRef = useRef<HTMLDivElement>(null); 
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [activeSection, setActiveSection] = useState("navbar");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 767);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
          items.forEach((item: any) => all.push({ ...item, section: sec }));
        }
        if (!cancelled) setComponents(all);
      } catch {
        if (!cancelled) setError("Не удалось загрузить компоненты");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

// Скролл наверх при смене секции
useEffect(() => {
  if (contentRef.current) {
    contentRef.current.scrollTo({ top: 0, });
  }
}, [activeSection]);

  const displaySections = components.length > 0
    ? Array.from(new Set(components.map(c => c.section)))
    : STATIC_SECTIONS;

  const sectionCounts: Record<string, number> = {};
  displaySections.forEach(s => {
    sectionCounts[s] = components.filter(c => c.section === s).length;
  });

  const filtered = components.filter(
    item =>
      item.section === activeSection &&
      (theme === "dark" ? item.key.includes("dark") : !item.key.includes("dark"))
  );

  let galleryContent;
  if (loading) {
    galleryContent = Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="skeleton" aria-hidden />
    ));
  } else if (filtered.length === 0) {
    galleryContent = (
      <div style={{ gridColumn: "1 / -1", color: "var(--framer-color-text-secondary)" }}>
        Пусто — в этой секции нет компонентов для выбранной темы.
      </div>
    );
  } else {
    galleryContent = filtered.map(item => (
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
        </div>
      </article>
    ));
  }

  return (
    <div className="container" data-theme={theme}>
      {/* HEADER — фиксированный */}
      <header className="header">
        <div className="headerLeft">
          <img src="/Logo.png" alt="FramerKit" className="logo" />
          <h1>FramerKit</h1>
        </div>
        <div className="headerActions">
          <button
            className="authButton"
            onClick={() => window.open("https://framer.com/marketplace", "_blank")}
            aria-label="Get Full Access"
          >
            Get Full Access
          </button>
          <button
            className="themeToggle"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </header>
  
      {/* ОСНОВНАЯ ОБЁРТКА — без padding-top на body */}
      <div className="app-layout">
        {/* SIDEBAR — фиксированный */}
        {!isMobile && (
          <nav className="sidebar" aria-label="Секции">
            <div className="sidebar-header">Layout Section</div>
            {displaySections.map((sec) => {
              const icon = getIconForSection(sec);
              return (
                <button
                  key={sec}
                  onClick={() => setActiveSection(sec)}
                  className={`sidebar-item ${activeSection === sec ? "active" : ""}`}
                  aria-current={activeSection === sec ? "true" : undefined}
                >
                  <span className="sidebar-icon">{icon}</span>
                  <span className="sidebar-text">{sec.charAt(0).toUpperCase() + sec.slice(1)}</span>
                </button>
              );
            })}
          </nav>
        )}
  
        {/* CONTENT — скроллится внутри себя */}
        <section className="content" ref={contentRef} aria-labelledby="gallery-title">
          {isMobile && (
            <select
              className="mobileSelect"
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value)}
              aria-label="Section selection"
            >
              {displaySections.map(s => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)} ({sectionCounts[s] ?? 0})
                </option>
              ))}
            </select>
          )}
  
          <h2 id="gallery-title" className="title">
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Section
          </h2>
  
          <p className="subtitle">
            {loading ? "Loading..." : `${filtered.length} layouts`} in the "{theme === "light" ? "Light" : "Dark"}" theme
          </p>
  
          {error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            <div className="gallery" role="list">
              {galleryContent}
            </div>
          )}
        </section>
      </div>


      {/* FOOTER */}
      <footer className="footer">
        © {new Date().getFullYear()} FramerKit · Crafted with ❤️ for Designers
      </footer>
    </div>
  );
}