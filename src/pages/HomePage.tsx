import { useState, useEffect, useRef } from "react";
import ComponentRunner from "../components/ComponentRunner";
import RandomSectionCards from "../components/RandomSectionCards";
import RandomComponentCards from "../components/RandomComponentCards";
import "./framerkit.css";
import "./gettingstarted.css";
import styles from "./HomePage.module.css";
import SimpleAvatarGroup from "../components/SimpleAvatarGroup";
import { motion } from "framer-motion";
import { Copy, CircleCheck } from "lucide-react";
import {
  RocketLaunch,
  ClipboardText,
  Sliders,
  CloudArrowUp,
} from "phosphor-react";

type HomePageProps = {
  onSectionChange: (sectionId: string) => void;
};

export default function HomePage({ onSectionChange }: HomePageProps) {
  const sections = [
    "overview",
    "getting-started",
    "layout-sections",
    "ui-components",
    "get-framerkit",
    "faq-contact",
  ];

  const trackEvent = (event: string, params?: Record<string, any>) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", event, params);
    }
  };

  const onSectionChangeRef = useRef(onSectionChange);
  onSectionChangeRef.current = onSectionChange;


  const [copiedEmail, setCopiedEmail] = useState(false); // для FAQ email
  const [hoveredEmail, setHoveredEmail] = useState(false); // для FAQ email


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
    <div>
      {/* OVERVIEW — с полосами света */}
      <section id="overview" className={styles.heroSection}>
        <div className={styles.lightTop}></div>
        <div className={styles.lightMid}></div>

        <div className={styles.container}>
          {(() => {
            const firstLine = "Build Websites Faster";
            const secondLine = "with FramerKit";

            // Задержки
            const logoAndFirstLineDelay = 0;
            const secondLineDelay =
              logoAndFirstLineDelay + firstLine.length * 0.03 + 0.2;
            const subtitleDelay = secondLineDelay + secondLine.length * 0.03 + 0.2;
            const buttonsDelay = subtitleDelay + 0.6;
            const testimonialsDelay = buttonsDelay + 0.2;

            return (
              <>
                {/* 1. Логотипы */}
                <motion.div
                  className={styles.logos}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                    delay: logoAndFirstLineDelay,
                  }}
                >
                  <div
                    className={styles["logo-item"]}
                    style={{ transform: "rotate(-10deg)" }}
                  >
                    <img src="/Framer.png" alt="Framer" />
                  </div>
                  <div
                    className={styles["logo-item"]}
                    style={{ transform: "rotate(10deg)" }}
                  >
                    <img src="/framerkit.png" alt="FramerKit" />
                  </div>
                </motion.div>

                {/* 2-3. Заголовок — гибридная анимация */}
                <motion.h1 className={styles.title}>
  {[firstLine, secondLine].map((line, lineIndex) => {
    const baseDelay =
      lineIndex === 0 ? logoAndFirstLineDelay : secondLineDelay;

    return (
                  <motion.div className={styles.titleLine} key={`line-${lineIndex}`}>
                    {Array.from(line).map((char, i) => (
                      <motion.span
                        key={`char-${lineIndex}-${i}`}
                        className={styles.animatedChar}
                        initial={{
                          opacity: 0,
                          x: -20,
                          filter: "blur(6px)",
                        }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        transition={{
                          duration: 0.6,
                          ease: "easeOut",
                          delay: baseDelay + i * 0.03,
                        }}
                        style={{ whiteSpace: char === " " ? "pre" : "normal" }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </motion.div>
                );
              })}
            </motion.h1>


                {/* 4. Подзаголовок */}
                <motion.p
                  className={styles.subtitle}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                    delay: subtitleDelay,
                  }}
                >
                 Everything you need to design, build, and launch beautiful websites faster and smarter

                </motion.p>

                {/* 5. Кнопки */}
                <motion.div
                  className={styles.buttons}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                    delay: buttonsDelay,
                  }}
                >
                  <button
                    className="authButton"
                    onClick={() => {
                      trackEvent("click_get_full_version", {
                        location: "hero",
                      });

                      const el = document.getElementById("get-framerkit");
                      if (el) {
                        el.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }}
                  >
                    Get Full Version
                  </button>

                  <a
                    href="https://www.framer.com/marketplace/plugins/framerkit"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackEvent("click_try_free_on_framer", {
                        location: "hero",
                        outbound: true,
                      })
                    }
                  >
                    <button className="logoutButton">Try Free on Framer</button>
                  </a>
                </motion.div>

                {/* 6. Аватарки и статистика */}
                <motion.div
                  className={styles.testimonials}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                    delay: testimonialsDelay,
                  }}
                >
                  <SimpleAvatarGroup size={40} overlap={6} />
                  <p className={styles.statsText}>
                    1,200+ designers already use FramerKit
                  </p>
                  <p className={styles.statsNote}>
                    (and the number grows every day)
                  </p>
                </motion.div>
              </>
            );
          })()}
        </div>
      </section>
      <ComponentRunner />

      <section id="getting-started">
        <div className="fk-gs-wrapper">
          <div className="fk-gs-container">
            <h2 className="fk-gs-title">Getting Started</h2>
            <p className="fk-gs-text">
              Learn how to start using FramerKit in just a few minutes.
              Choose components on the site or through the plugin, insert them into Framer,
              and customize them however you need.
            </p>

            <div className="fk-gs-grid">
              <div className="fk-gs-card">
                <div className="custom-section-icon"><RocketLaunch weight="duotone" size={28} /></div>
                <div className="fk-gs-card-content">
                  <h3>Choose a Section</h3>
                  <p>Browse sections, components, or templates on the FramerKit website. Each block is fully responsive and ready to use</p>
                </div>
              </div>
              <div className="fk-gs-card">
                <div className="custom-section-icon"><ClipboardText weight="duotone" /></div>
                <div className="fk-gs-card-content">
                  <h3>Copy or Use Plugin</h3>
                  <p>Click “Copy” on the site — or open the FramerKit plugin and drop blocks directly onto your canvas</p>
                </div>
              </div>
              <div className="fk-gs-card">
                <div className="custom-section-icon"><Sliders weight="duotone" /></div>
                <div className="fk-gs-card-content">
                  <h3>Customize Everything</h3>
                  <p>Change colors, fonts, spacing, animations, layout options — every block adapts instantly to your design system</p>
                </div>
              </div>
              <div className="fk-gs-card">
                <div className="custom-section-icon"><CloudArrowUp weight="duotone" /></div>
                <div className="fk-gs-card-content">
                  <h3>Publish Your Page</h3>
                  <p>Combine as many blocks as you need to build full pages, then publish. All components are optimized for speed and mobile devices</p>
                </div>
              </div>
            </div>
          </div>

          <div className="fk-gs-video-block">
            <div className="fk-gs-video-wrapper">
              <iframe
                className="fk-gs-video-iframe"
                src="https://www.youtube.com/embed/videoseries?list=PLMWSF_elzJIMIJsZaIK6Y_NztCiYd-Sx4&index=1&autoplay=1&mute=1&rel=0&modestbranding=1"
                title="YouTube playlist"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <section id="explore-sections" className="explore-sections-section">
        <div className="fk-explore-wrapper">
          <div className="fk-container"></div>
        </div>
      </section>

      {/* LAYOUT SECTIONS */}
      <section id="layout-sections" className="ls-section">
        <div className="ls-wrapper">
          <div className="ls-container">
            <div className="ls-block">
              <h2 className="fk-gs-title">Layout Sections</h2>
              <p className="fk-gs-text">
                Pre-built page sections like Navigation Bars, Hero Sections, Testimonials, FAQs, and more — fully responsive and ready to drop into your Framer project
              </p>
              <div className="gallery2">
                <RandomSectionCards />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UI COMPONENTS */}
      <section id="ui-components" className="ui-section">
        <div className="ui-wrapper">
          <div className="ui-container">
            <div className="ui-block">
              <h2 className="fk-gs-title">UI Components</h2>
              <p className="fk-gs-text">
                Reusable interface elements like Buttons, Cards, Avatars, Forms, and Pricing Blocks — designed to be mixed, matched, and fully customized to your brand.
              </p>
              <div className="gallery2">
                <RandomComponentCards />
              </div>
            </div>
          </div>
        </div>
      </section>

    {/* GET FRAMERKIT – PRICING SECTION */}
<section id="get-framerkit" className="pricing-section">
  <div className="pricing-container">
    <h2 className="fk-gs-title">Get FramerKit</h2>
    <p className="fk-gs-text">
      Choose your plan: subscribe monthly or get lifetime access with all future updates
    </p>

    <div className="pricing-grid">
      {/* --- MONTHLY SUBSCRIPTION --- */}
      <div className="pricing-card">
      <div className="badge-light">Flexible</div>
  
        <div className="price">
          <span className="price-amount">$15</span>
          <span className="price-note">per month</span>
        </div>

        <div className="features">
          <div className="feature-item"><CircleCheck className="feature-icon" /> Full FramerKit library</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> Framer plugin access</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> 1000+ Premium sections</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> Wireframe & Design modes</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> Fully Responsive blocks</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> All updates while subscribed</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> Cancel anytime</div>
        </div>

        <a
          href="https://buy.polar.sh/polar_cl_ksuL1cw1GuaLpoC3Dg5vsv4qSlLRSaX45c3JQ1HIx65"
          target="_blank"
          rel="noopener noreferrer"
          className="pricing-btn secondary"
          onClick={() =>
            trackEvent("select_plan", {
              plan: "monthly",
              price: 12,
              currency: "USD",
              interval: "month",
            })
          }
        >
          Subscribe Now
        </a>
      </div>


      {/* --- PLAN PLUGIN (Lifetime) - MOST POPULAR --- */}
      <div className="pricing-card featured">
        <div className="badge">Most Popular</div>
        
        <div className="price">
          <span className="price-amount">$89</span>
          <span className="price-note">Lifetime</span>
        </div>

        <div className="features">
          <div className="feature-item"><CircleCheck className="feature-icon" /> Full FramerKit library</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> Framer plugin access</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> 1000+ Premium sections</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> Wireframe & Design modes</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> Fully responsive blocks</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> Lifetime updates</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> Commercial use</div>
        </div>

        <a
          href="https://buy.polar.sh/polar_cl_lbbqLYLaayU8OwD7xLYNCiFvxQcw0LpKSm6kl4MLuVh"
          target="_blank"
          rel="noopener noreferrer"
          className="pricing-btn"
          onClick={() =>
            trackEvent("select_plan", {
              plan: "plugin",
              price: 79,
              currency: "USD",
              featured: true,
            })
          }
        >
          Get Lifetime Access
        </a>
      </div>
    </div>
  </div>
</section>


   {/* FAQ SECTION */}
<section id="faq-contact" className="faq-section">
  <div className="faq-container">
    <h2 className="fk-gs-title">Frequently Asked Questions</h2>
    <p className="fk-gs-text">Everything you need to know about FramerKit</p>

    <div className="faq-grid">
      
      {/* 1. Что такое Фреймер */}
      <div className="faq-item">
        <h3 className="faq-question">What is Framer?</h3>
        <p className="faq-answer">
          Framer is the world's most powerful tool for building professional websites with a "no-code" approach. It allows you to design and publish high-end sites instantly, and FramerKit is built to make this process 10x faster
        </p>
      </div>

{/* 2. Ссылка для новых пользователей + Бонус */}
<div className="faq-item">
  <h3 className="faq-question">Any discount for new Framer users?</h3>
  <p className="faq-answer">
    Yes! If you are new to the <strong>Framer platform</strong>, you can sign up through my{' '}
    
    <span className="tooltip-wrapper">
      <a 
        href="https://framer.link/framerkit" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="faq-link"
      >
          creator referral link
        </a>
        <div className="tooltip">
          Get 3 months free
          <div className="tooltip-arrow" />
        </div>
      </span>
    
    .{' '}
    New users get <strong>3 months of Framer Pro for free</strong> on any annual plan. This is a great way to save on your Framer subscription while supporting my work on the plugin!
  </p>
</div>

      {/* 3. Про Wireframe Mode */}
      <div className="faq-item">
        <h3 className="faq-question">What is Wireframe & Design mode?</h3>
        <p className="faq-answer">
          It’s our signature feature. Use Wireframe mode to build the structure and UX of your site, then switch to Design mode to apply polished, high-fidelity styles with a single toggle
        </p>
      </div>

{/* 4. Обновления в X */}
<div className="faq-item">
  <h3 className="faq-question">How often are new sections added?</h3>
  <p className="faq-answer">
    The library is constantly growing. I announce all new layouts and fresh releases on our{' '}
    
    <span className="tooltip-wrapper">
      <a 
        href="https://x.com/framer_kit" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="faq-link"
      >
        X (Twitter)
      </a>
      <div className="tooltip">
        Follow on X
        <div className="tooltip-arrow" />
      </div>
    </span>
    
    . Follow us to stay updated on the latest components!
  </p>
</div>

      {/* 5. Про кастомизацию */}
      <div className="faq-item">
        <h3 className="faq-question">Can I customize the components?</h3>
        <p className="faq-answer">
          Absolutely. Every section is 100% editable. You can change colors, fonts, and layouts to match your brand identity without writing any code
        </p>
      </div>


{/* 6. YouTube уроки */}
<div className="faq-item">
  <h3 className="faq-question">Are there any tutorials?</h3>
  <p className="faq-answer">
    Yes! I record deep-dive guides on how to build sites from scratch. You can watch all my tutorials on{' '}
    
    <span className="tooltip-wrapper" style={{ display: 'inline-flex' }}>
      <a 
        href="https://www.youtube.com/@framerkit_plugin" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="faq-link"
      >
        YouTube
      </a>
      <div className="tooltip">
        Watch tutorials
        <div className="tooltip-arrow" />
      </div>
    </span>
  </p>
</div>

      {/* 7. Коммерческая лицензия */}
      <div className="faq-item">
        <h3 className="faq-question">Can I use it for client projects?</h3>
        <p className="faq-answer">
          Yes. All Pro plans include a full commercial license. You can build and sell unlimited websites for your clients using FramerKit components
        </p>
      </div>

      {/* 8. Адаптивность */}
      <div className="faq-item">
        <h3 className="faq-question">Is it mobile-friendly?</h3>
        <p className="faq-answer">
          Every component is hand-crafted to be fully responsive. Your site will look perfect on Desktop, Tablet, and Mobile devices right out of the box
        </p>
      </div>

     {/* 9. Поддержка и почта */}
<div className="faq-item">
  <h3 className="faq-question">What if I need help?</h3>
  <p className="faq-answer">
    If you have any questions, feel free to reach out via email at{' '}
    <span className="email-wrapper" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <a href="mailto:support@framerkit.site" className="faq-link">
        support@framerkit.site
      </a>
      
      {/* Кнопка копирования — точная копия паттерна из AccordionPage */}
      <div
        className={`iconButton ${copiedEmail ? 'copied' : ''}`}
        onClick={async () => {
          await navigator.clipboard.writeText('support@framerkit.site');
          setCopiedEmail(true);
          setTimeout(() => setCopiedEmail(false), 4000);
        }}
        onMouseEnter={() => !copiedEmail && setHoveredEmail(true)}
        onMouseLeave={() => setHoveredEmail(false)}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        {copiedEmail ? (
          <CircleCheck size={16} color="#22c55e" strokeWidth={2.5} />
        ) : (
          <Copy size={14} />
        )}

        {/* Tooltip — точная копия вашей структуры */}
        {(copiedEmail || hoveredEmail) && (
          <div className="tooltip">
            {copiedEmail ? 'Copied' : 'Copy'}
          </div>
        )}
      </div>
    </span>
    <br />
    I'm always here to help you.
  </p>
</div>

    </div>
  </div>
</section>

    </div>
  );
}