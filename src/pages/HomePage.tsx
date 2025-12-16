// src/pages/HomePage.tsx
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import ComponentRunner from "../components/ComponentRunner";
import RandomSectionCards from "../components/RandomSectionCards";
import RandomComponentCards from "../components/RandomComponentCards";
import "./framerkit.css";
import "./gettingstarted.css";
import styles from "./HomePage.module.css";
import SimpleAvatarGroup from "../components/SimpleAvatarGroup";
import { motion } from "framer-motion";
import { CircleCheck } from "lucide-react";
import {
  RocketLaunch,
  ClipboardText,
  Sliders,
  CloudArrowUp
} from "phosphor-react";

type HomePageProps = {
  onSectionChange: (sectionId: string) => void;
};

export default function HomePage({ onSectionChange }: HomePageProps) {
  const location = useLocation();

  const sections = [
    "overview",
    "getting-started",
    "layout-sections",
    "ui-components",
    "get-framerkit",
    "faq-contact",
  ];

  const onSectionChangeRef = useRef(onSectionChange);
  onSectionChangeRef.current = onSectionChange;

  // === Надёжный скролл с MutationObserver ===
  useEffect(() => {
    const { pathname, state } = location;
    const explicitScrollTo = state?.scrollTo;
    const fromLogo = state?.fromLogo === true;

    let target: string | null = null;

    // При обновлении страницы (state отсутствует) → overview
    if (pathname === "/" && !state) {
      target = "overview";
    }
    // При явном запросе (scrollTo)
    else if (explicitScrollTo) {
      target = explicitScrollTo;
    }
    // При клике по логотипу
    else if (pathname === "/" && fromLogo) {
      target = "overview";
    }

    if (!target) return;

    // Уже есть элемент? → скроллим сразу
    const el = document.getElementById(target);
    if (el) {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      el.scrollIntoView({ behavior: "auto", block: "start" });
      return;
    }

    // Иначе — ждём появления через MutationObserver
    const observer = new MutationObserver(() => {
      const el = document.getElementById(target!);
      if (el) {
        observer.disconnect();
        if ("scrollRestoration" in window.history) {
          window.history.scrollRestoration = "manual";
        }
        el.scrollIntoView({ behavior: "auto", block: "start" });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Защита от утечки
    const timeout = setTimeout(() => {
      observer.disconnect();
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [location.pathname, location.state?.scrollTo]);

  // === Отслеживание активной секции ===
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((e) => e.isIntersecting);
        if (visibleEntry) {
          onSectionChangeRef.current(visibleEntry.target.id);
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

  return (
    <div>

      {/* OVERVIEW — с полосами света */}
      <section id="overview" className={styles.heroSection}>
        <div className={styles.lightTop}></div>
        <div className={styles.lightMid}></div>

        <div className={styles.container}>
          {/* Строки заголовка */}
          {(() => {
            const firstLine = "Build Websites Faster";
            const secondLine = "with FramerKit";

            // Задержки
            const logoAndFirstLineDelay = 0;
            const secondLineDelay = logoAndFirstLineDelay + firstLine.length * 0.03 + 0.2;
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
                  transition={{ duration: 0.6, ease: "easeOut", delay: logoAndFirstLineDelay }}
                >
                  <div className={styles["logo-item"]} style={{ transform: "rotate(-10deg)" }}>
                    <img src="/Framer.png" alt="Framer" />
                  </div>
                  <div className={styles["logo-item"]} style={{ transform: "rotate(10deg)" }}>
                    <img src="/framerkit.png" alt="FramerKit" />
                  </div>
                </motion.div>

                {/* 2-3. Заголовок по строкам и символам */}
                <motion.h1 className={styles.title}>
                  {[firstLine, secondLine].map((line, lineIndex) => {
                    const baseDelay = lineIndex === 0 ? logoAndFirstLineDelay : secondLineDelay;
                    return (
                      <motion.div className={styles.titleLine} key={`line-${lineIndex}`}>
                        {Array.from(line).map((char, i) => (
                          <motion.span
                            key={`line${lineIndex}-${i}`}
                            className={styles.animatedChar}
                            initial={{ opacity: 0, x: -20, filter: "blur(6px)" }}
                            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                            transition={{
                              duration: 0.6,
                              ease: "easeOut",
                              delay: baseDelay + i * 0.03,
                            }}
                          >
                            {char === " " ? "\u00A0" : char}
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
                  A complete library of ready-to-use sections, components, styles, and templates — fully optimized for Framer
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
                  {/* Скролл к секции прайса */}
                  <button
                    className="authButton"
                    onClick={() => {
                      const el = document.getElementById("get-framerkit");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    Get Full Version
                  </button>

                  {/* Внешняя ссылка */}
                  <a
                    href="https://www.framer.com/marketplace/plugins/framerkit"
                    target="_blank"
                    rel="noopener noreferrer"
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
                  <p className={styles.statsText}>1,200+ designers already use FramerKit</p>
                  <p className={styles.statsNote}>(and the number grows every day)</p>
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
          <p className="fk-gs-text">Choose your plan and unlock the power of FramerKit</p>

          <div className="pricing-grid">
            {/* --- PLAN STARTER --- */}
            <div className="pricing-card">
              <h3 className="plan-title">Starter</h3>
              <p className="plan-desc">Lifetime access</p>
              <div className="price">
                <span className="price-amount">$59</span>
                <span className="price-note">one-time</span>
              </div>
              <div className="features">
                <div className="feature-item"><CircleCheck className="feature-icon" /> Single user license</div>
                <div className="feature-item"><CircleCheck className="feature-icon" /> Full Components Library</div>
                <div className="feature-item"><CircleCheck className="feature-icon" /> Lifetime Updates</div>
                <div className="feature-item"><CircleCheck className="feature-icon" /> Commercial Use</div>
              </div>
              <a
                href="https://buy.polar.sh/polar_cl_LJnSRqf2juaDuIvTQwDGGrBDgWkm6mG4ka8t60bnY5K"
                target="_blank"
                rel="noopener noreferrer"
                className="pricing-btn secondary"
              >
                Get Starter
              </a>
            </div>

            {/* --- PLAN PRO --- */}
            <div className="pricing-card featured">
              <div className="badge">Most Popular</div>
              <h3 className="plan-title">Pro</h3>
              <p className="plan-desc">Lifetime access</p>
              <div className="price">
                <span className="price-amount">$79</span>
                <span className="price-note">one-time</span>
              </div>
              <div className="features">
                <div className="feature-item"><CircleCheck className="feature-icon" /> Single user license</div>
                <div className="feature-item"><CircleCheck className="feature-icon" /> Full Components Library</div>
                <div className="feature-item"><CircleCheck className="feature-icon" /> Lifetime Updates</div>
                <div className="feature-item"><CircleCheck className="feature-icon" /> Commercial Use</div>
                <div className="feature-item"><CircleCheck className="feature-icon" /> Plugin for Framer</div>
              </div>
              <a
                href="https://buy.polar.sh/polar_cl_lbbqLYLaayU8OwD7xLYNCiFvxQcw0LpKSm6kl4MLuVh"
                target="_blank"
                rel="noopener noreferrer"
                className="pricing-btn"
              >
                Get Pro
              </a>
            </div>

            {/* --- PLAN ULTIMATE --- */}
            <div className="pricing-card">
              <h3 className="plan-title">Ultimate</h3>
              <p className="plan-desc">Lifetime access</p>
              <div className="price">
                <span className="price-amount">$199</span>
                <span className="price-note">one-time</span>
              </div>
              <div className="features">
                <div className="feature-item"><CircleCheck className="feature-icon" /> 5 user license</div>
                <div className="feature-item"><CircleCheck className="feature-icon" /> Full Components Library</div>
                <div className="feature-item"><CircleCheck className="feature-icon" /> Lifetime Updates</div>
                <div className="feature-item"><CircleCheck className="feature-icon" /> Commercial Use</div>
                <div className="feature-item"><CircleCheck className="feature-icon" /> Plugin for Framer</div>
              </div>
              <a
                href="https://buy.polar.sh/polar_cl_UDp7hLEWPWpbHEEKOFxqME3ytaysBd6cXUONc3fQ8NM"
                target="_blank"
                rel="noopener noreferrer"
                className="pricing-btn secondary"
              >
                Get Ultimate
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ + CONTACT */}
      <section id="faq-contact" className="faq-section">
        <div className="faq-container">
          <h2 className="fk-gs-title">Frequently Asked Questions</h2>
          <p className="fk-gs-text">Answers to common questions about FramerKit</p>

          <div className="faq-grid">
            <div className="faq-item">
              <h3 className="faq-question">Can I use components commercially?</h3>
              <p className="faq-answer">
                Yes — all paid plans include full commercial licensing with no limitations
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Do I get lifetime updates?</h3>
              <p className="faq-answer">
                Yes — all plans include lifetime updates as the library grows
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Do you add new components regularly?</h3>
              <p className="faq-answer">
                Yes! New layouts, UI components, and animations are announced weekly on X
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Does it work with any project?</h3>
              <p className="faq-answer">
                FramerKit components adapt to any style — just change fonts, colors, and spacing.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Can I try before buying?</h3>
              <p className="faq-answer">
                Yes — in the demo version, 1 section from each category is free to explore
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Do you support team collaboration?</h3>
              <p className="faq-answer">
                Yes — Team plans allow multiple users with shared libraries and permissions
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}