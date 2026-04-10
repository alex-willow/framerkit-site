import RandomComponentCards from "../components/RandomComponentCards";
import RandomComponentCardsDark from "../components/RandomComponentCardsDark";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";

type ComponentPageProps = {
  theme: "light" | "dark";
  onThemeToggle: () => void;
};

export default function ComponentPage({ theme, onThemeToggle }: ComponentPageProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [componentCount, setComponentCount] = useState(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 767);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const loadComponentCount = async () => {
      const COMPONENT_SECTIONS = [
        "accordion", "accordiongroup", "avatar", "avatargroup", "badge", 
        "button", "card", "icon", "input", "form", "pricingcard", 
        "rating", "testimonialcard"
      ];
      
      let totalCount = 0;
      
      for (const section of COMPONENT_SECTIONS) {
        try {
          const res = await fetch(
            `https://raw.githubusercontent.com/alex-willow/framerkit-data/components/${section}.json`,
            { cache: "force-cache" }
          );
          if (res.ok) {
            const data = await res.json();
            totalCount += (data[section] || []).length;
          }
        } catch (err) {
          console.error(`Failed to load ${section} data:`, err);
        }
      }
      
      setComponentCount(totalCount);
    };

    loadComponentCount();
  }, []);

  return (
    <div className="home-docs-layout">
      <TopBar theme={theme} onThemeToggle={onThemeToggle} />
      
      <div className="app-layout">
        <Sidebar
          activeSection="components"
          onSectionChange={() => {}}
          isMobile={isMobile}
          isMenuOpen={isMenuOpen}
          onMenuClose={() => setIsMenuOpen(false)}
        />
        
        <main className="content">
          <section id="ui-components" className="ui-section">
            <div className="ui-wrapper">
              <div className="ui-container">
                <div className="ui-block">
                  
                  {/* 1.  */}
                  <h2 className="fk-gs-title">UI Components {componentCount > 0 && `(${componentCount})`}</h2>
                  
                  {/* 2.  */}
                  <p className="fk-gs-text">
                    Reusable interface elements like Buttons, Cards, Avatars, Forms, and Pricing Blocks  designed to be mixed, matched, and fully customized to your brand.
                  </p>
                  
                </div>
              </div>
            </div>
          </section>
          
          {/* 3. Full-width gallery */}
          <div className="gallery-scroll-area">
            <div className="gallery">
              {theme === "dark" ? (
                <RandomComponentCardsDark />
              ) : (
                <RandomComponentCards theme={theme} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}