import { useState, useEffect } from "react";
import { Paintbrush, SquareDashed } from "lucide-react";
import RandomSectionCards from "../components/RandomSectionCards";
import RandomSectionCardsDark from "../components/RandomSectionCardsDark";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";

type LayoutPageProps = {
  theme: "light" | "dark";
  onThemeToggle: () => void;
};

export default function LayoutPage({ theme, onThemeToggle }: LayoutPageProps) {
  const [isWireframeMode, setIsWireframeMode] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 767);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="home-docs-layout">
      <TopBar theme={theme} onThemeToggle={onThemeToggle} />
      
      <div className="app-layout">
        <Sidebar
          activeSection="layout"
          onSectionChange={() => {}}
          isMobile={isMobile}
          isMenuOpen={isMenuOpen}
          onMenuClose={() => setIsMenuOpen(false)}
        />
        
        <main className="content">
          <section className="ls-section">
            <div className="ls-wrapper">
              <div className="ls-container">
                <div className="ls-block">
                  
                  {/* 1.  */}
                  <h2 className="fk-gs-title">Layout Sections</h2>
                  
                  {/* 2.  */}
                  <p className="fk-gs-text">
                    Pre-built page sections like Navigation Bars, Hero Sections, Testimonials, FAQs, and more  fully responsive and ready to drop into your Framer project
                  </p>
                  
                  {/* 3.  */}
                  <div className="mode-toggle-wrapper">
                    <div className="mode-toggle-group">
                      <button
                        className={`mode-toggle-btn ${isWireframeMode ? 'active' : ''}`}
                        onClick={() => setIsWireframeMode(true)}
                        type="button"
                        aria-label="Wireframe mode"
                      >
                        <SquareDashed size={16} strokeWidth={2} />
                        <span>Wireframe</span>
                      </button>
                      <button
                        className={`mode-toggle-btn ${!isWireframeMode ? 'active' : ''}`}
                        onClick={() => setIsWireframeMode(false)}
                        type="button"
                        aria-label="Design mode"
                      >
                        <Paintbrush size={16} strokeWidth={2} />
                        <span>Design</span>
                      </button>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </section>
          
          <div className="gallery-scroll-area">
            <div className="gallery">
              {theme === "dark" ? (
                <RandomSectionCardsDark wireframeMode={isWireframeMode} />
              ) : (
                <RandomSectionCards wireframeMode={isWireframeMode} theme={theme} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}