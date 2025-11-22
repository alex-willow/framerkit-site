import { useState, useEffect, useRef } from "react";
import "./App.css";
import { createClient } from "@supabase/supabase-js";
import { Sun, Moon, Copy, Lock, LogOut } from "lucide-react";
import SignInModal from "./SignInModal";
import { List, Triangle, ArrowDown, Envelope, Play, Question, Star, Image, Diamond, CurrencyDollar, Users } from "phosphor-react";

type ComponentItem = {
  key: string;
  title: string;
  image: string;
  url: string;
  type: "free" | "paid";
  section: string;
};

const supabase = createClient(
  "https://ibxakfxqoqiypfhgkpds.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlieGFrZnhxb3FpeXBmaGdrcGRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MTQxMDcsImV4cCI6MjA1NjM5MDEwN30.tWculxF6xgGw4NQEWPBp7uH_gsl5HobP9wQn3Tf9yyw"
);

const STATIC_SECTIONS = [
  "navbar","hero","logo","feature","gallery",
  "testimonial","contact","pricing","faq","cta","footer"
];

const PLACEHOLDER = "https://via.placeholder.com/280x160?text=No+Image";

const getIconForSection = (section: string) => {
  switch(section){
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


type ComponentDropdownProps = {
  options: string[];
  value: string;
  onChange: (val: string) => void;
};

function ComponentDropdown({ options, value, onChange }: ComponentDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Закрытие по клику вне
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


export default function FramerKitGallery() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [activeSection, setActiveSection] = useState("navbar");
  const [theme, setTheme] = useState<"light"|"dark">("light");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Авто-вход из localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedKey = localStorage.getItem("rememberedKey");
    if(savedEmail && savedKey){
      const checkLogin = async () => {
        const { data: users } = await supabase
          .from("framer_kit")
          .select("*")
          .eq("email", savedEmail)
          .eq("key", savedKey);
        if(users && users.length > 0) setIsAuthenticated(true);
      };
      checkLogin();
    }
  }, []);

  // Проверка ширины
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 767);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Загрузка компонентов
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try{
        const all: ComponentItem[] = [];
        for(const sec of STATIC_SECTIONS){
          const res = await fetch(`https://raw.githubusercontent.com/alex-willow/framerkit-data/main/${sec}.json`);
          if(!res.ok) continue;
          const json = await res.json();
          const items = json[sec] || [];
          items.forEach((item:any)=> all.push({...item, section: sec}));
        }
        if(!cancelled) setComponents(all);
      }catch{
        if(!cancelled) setError("Не удалось загрузить компоненты");
      }finally{
        if(!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled=true; };
  }, []);

  useEffect(() => {
    if(contentRef.current) contentRef.current.scrollTo({top:0});
  }, [activeSection]);

  const displaySections = components.length>0 ? Array.from(new Set(components.map(c=>c.section))) : STATIC_SECTIONS;
  const sectionCounts:Record<string,number> = {};
  displaySections.forEach(s=> sectionCounts[s] = components.filter(c=>c.section===s).length);

  const filtered = components.filter(item=> item.section===activeSection && (theme==="dark"?item.key.includes("dark"):!item.key.includes("dark")));

  const handleCopy = (url:string) => {
    navigator.clipboard.writeText(url);
    alert("Component URL copied!");
  };

  // ✅ Новый handleLogout
  const handleLogout = async () => {
    const email = localStorage.getItem("rememberedEmail");
  
    if (email) {
      const { error } = await supabase
        .from("framer_kit")
        .update({ site_status: "inactive" })
        .eq("email", email);
  
      if (error) {
        console.error("Supabase error:", error.message);
      } else {
        console.log("Site status set to inactive for:", email);
      }
    }
  
    localStorage.removeItem("rememberedEmail");
    localStorage.removeItem("rememberedKey");
    setIsAuthenticated(false);
  };
  

  let galleryContent;
  if(loading){
    galleryContent = Array.from({length:6}).map((_,i)=><div key={i} className="skeleton" aria-hidden />);
  }else if(filtered.length===0){
    galleryContent=<div style={{gridColumn:"1 / -1", color:"var(--framer-color-text-secondary)"}}>Пусто — в этой секции нет компонентов для выбранной темы.</div>;
  }else{
    galleryContent = filtered.map(item=>(
      <article key={item.key} className="card" role="listitem" aria-labelledby={`title-${item.key}`}>
            <div className="cardImage">
              <img src={item.image || PLACEHOLDER} alt={item.title} loading="lazy" />
            </div>

            <div className="cardInfo">
              <h3 id={`title-${item.key}`}>{item.title}</h3>

              {isAuthenticated || item.type === "free" ? (
                <div className="iconButton" onClick={() => handleCopy(item.url)}>
                  <Copy size={16} />
                </div>
              ) : (
                <div className="iconButton lock" onClick={() => setIsSignInOpen(true)}>
                  <Lock size={16} />
                </div>
              )}
            </div>
      </article>
    ));
  }

  return (
    <div className="container" data-theme={theme}>
      <header className="header">
        <div className="headerLeft">
          <img src="/Logo.png" alt="FramerKit" className="logo"/>
          <h1>FramerKit</h1>
        </div>
        <div className="headerActions">
          {isAuthenticated ? (
            <button className="logoutButton" onClick={handleLogout}>
            <LogOut size={16} />
            Log out
          </button>
          ):(
            <>
              <button className="loginButton" onClick={()=>setIsSignInOpen(true)}>Log in</button>
              <button className="authButton" onClick={()=>window.open("https://framer.com/marketplace","_blank")}>Get Full Access</button>
            </>
          )}
        </div>
      </header>

      <div className="app-layout">
        {!isMobile && (
          <nav className="sidebar" aria-label="Секции">
            <div className="sidebar-header">Layout Section</div>
            {displaySections.map(sec=>{
              const icon = getIconForSection(sec);
              return (
                <button key={sec} onClick={()=>setActiveSection(sec)} className={`sidebar-item ${activeSection===sec?"active":""}`} aria-current={activeSection===sec?"true":undefined}>
                  <span className="sidebar-icon">{icon}</span>
                  <span className="sidebar-text">{sec.charAt(0).toUpperCase()+sec.slice(1)}</span>
                </button>
              );
            })}
          </nav>
        )}

        <section className="content" ref={contentRef} aria-labelledby="gallery-title">
        {isMobile && (
              <ComponentDropdown
                options={displaySections}
                value={activeSection}
                onChange={setActiveSection}
              />
            )}

          <h2 id="gallery-title" className="title">{activeSection.charAt(0).toUpperCase()+activeSection.slice(1)} Section</h2>

          <div className="subtitleRow">
            <p className="subtitle">{loading?"Loading...":`${filtered.length} layouts`} in the "{theme==="light"?"Light":"Dark"}" theme</p>
            <div className="themeSwitcher">
              <span className="modeLabel">Mode:</span>
              <button className="themeToggle" onClick={()=>setTheme(theme==="light"?"dark":"light")} aria-label={theme==="light"?"Switch to dark theme":"Switch to light theme"}>
                {theme==="light"?<Moon size={18}/>:<Sun size={18}/>}
              </button>
            </div>
          </div>

          {error?<p style={{color:"red"}}>{error}</p>:<div className="gallery" role="list">{galleryContent}</div>}
        </section>
      </div>

      <footer className="footer">© {new Date().getFullYear()} FramerKit · Crafted with ❤️ for Designers</footer>

      <SignInModal
        isOpen={isSignInOpen}
        onClose={()=>setIsSignInOpen(false)}
        onLogin={()=>setIsAuthenticated(true)}
      />
    </div>
  );
}
