// src/pages/HomePage.tsx
import { useEffect, useRef, useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import RandomSectionCards from "../components/RandomSectionCards";
import RandomComponentCards from "../components/RandomComponentCards";
import "./framerkit.css";
import "./gettingstarted.css";
import styles from "./HomePage.module.css";
import SimpleAvatarGroup from "../components/SimpleAvatarGroup";
import { motion } from "framer-motion";
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
  const [ready, setReady] = useState(false);

  const sections = [
    "overview",
    "getting-started",
    "layout-sections",
    "ui-components",
    "get-framerkit",
    "faq-contact",
  ];

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // === собираем рефы секций после рендера ===
  useLayoutEffect(() => {
    sections.forEach((id) => {
      sectionRefs.current[id] = document.getElementById(id);
    });
  }, []);

  // === ждём, пока обе галереи реально появятся в DOM ===
  useEffect(() => {
    const checkLoaded = () => {
      const layoutGallery = document.querySelector("#layout-sections .gallery2");
      const uiGallery = document.querySelector("#ui-components .gallery2");
      return layoutGallery?.children.length && uiGallery?.children.length;
    };

    if (checkLoaded()) {
      setReady(true);
      return;
    }

    const observer = new MutationObserver(() => {
      if (checkLoaded()) {
        setReady(true);
        observer.disconnect();
      }
    });

    const layoutGallery = document.querySelector("#layout-sections .gallery2");
    const uiGallery = document.querySelector("#ui-components .gallery2");

    if (layoutGallery) observer.observe(layoutGallery, { childList: true });
    if (uiGallery) observer.observe(uiGallery, { childList: true });

    return () => observer.disconnect();
  }, []);

  // === Скролл к целевой секции после полной отрисовки ===
  useEffect(() => {
    if (!ready) return;
    const target = location.state?.scrollTo;
    if (!target) return;

    let attempts = 0;
    const tryScroll = () => {
      attempts++;
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
        const top = el.getBoundingClientRect().top;
        if (top > -2 && top < 2) return; // успешно прокрутили
      }
      if (attempts < 10) setTimeout(tryScroll, 35);
    };

    setTimeout(tryScroll, 0);
  }, [ready, location.key]);

  // === Отслеживание активной секции ===
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((e) => e.isIntersecting);
        if (visibleEntry) {
          onSectionChange(visibleEntry.target.id);
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
    <div style={{ opacity: ready ? 1 : 0, transition: "opacity 0.3s ease" }}>
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
      const logoAndFirstLineDelay = 0; // Лого + первая строка
      const secondLineDelay = logoAndFirstLineDelay + firstLine.length * 0.03 + 0.2; // после первой строки
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
              <a
                href="https://gum.co/framerkit"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="authButton">Get Full Version</button>
              </a>

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



     {/* GETTING STARTED */}
     <section id="getting-started">
     <div className="fk-gs-wrapper"> {/* ← новый контейнер */}
    
    {/* Контейнер карточек */}
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
            <p>Browse sections, components, or templates on the FramerKit website. Each block is fully responsive and ready to use.</p>
          </div>
        </div>

        <div className="fk-gs-card">
          <div className="custom-section-icon"><ClipboardText weight="duotone"/></div>
          <div className="fk-gs-card-content">
            <h3>Copy or Use Plugin</h3>
            <p>Click “Copy to Framer” on the site — or open the FramerKit plugin and drop blocks directly onto your canvas.</p>
          </div>
        </div>

        <div className="fk-gs-card">
          <div className="custom-section-icon"><Sliders weight="duotone" /></div>
          <div className="fk-gs-card-content">
            <h3>Customize Everything</h3>
            <p>Change colors, fonts, spacing, animations, layout options — every block adapts instantly to your design system.</p>
          </div>
        </div>

        <div className="fk-gs-card">
          <div className="custom-section-icon"><CloudArrowUp weight="duotone" /></div>
          <div className="fk-gs-card-content">
            <h3>Publish Your Page</h3>
            <p>Combine as many blocks as you need to build full pages, then publish. All components are optimized for speed and mobile devices.</p>
          </div>
        </div>
      </div>
    </div>

    {/* Видео блок */}
    <div className="fk-gs-video-block">
      <div className="fk-gs-video-wrapper">
        <div className="fk-gs-video-placeholder"><span>Video Coming Soon</span></div>
      </div>
    </div>

  </div>
</section>


<section id="explore-sections" className="explore-sections-section">
  <div className="fk-explore-wrapper">
    <div className="fk-container">

     

    </div>
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
      One-time purchase. Lifetime access. Free updates forever.
    </p>

    <div className="pricing-grid">

      {/* --- PLAN FREE --- */}
      <div className="pricing-card">
        <h3 className="plan-title">Starter</h3>
        <p className="plan-desc">Perfect to explore components</p>

        <div className="price">
          <span className="price-amount">$0</span>
        </div>

        <ul className="features">
          <li>Basic UI Components</li>
          <li>Limited Layout Sections</li>
          <li>Email Support</li>
        </ul>

        <button className="pricing-btn secondary">Get Started</button>
      </div>

      {/* --- PLAN PRO --- */}
      <div className="pricing-card featured">
        <div className="badge">Most Popular</div>

        <h3 className="plan-title">Pro</h3>
        <p className="plan-desc">Full access to everything</p>

        <div className="price">
          <span className="price-amount">$49</span>
          <span className="price-note">one-time</span>
        </div>

        <ul className="features">
          <li>All Layout Sections</li>
          <li>All UI Components</li>
          <li>Commercial License</li>
          <li>Lifetime Updates</li>
          <li>Priority Support</li>
        </ul>

        <button className="pricing-btn">Get Pro</button>
      </div>

      {/* --- PLAN TEAM --- */}
      <div className="pricing-card">
        <h3 className="plan-title">Team</h3>
        <p className="plan-desc">For agencies & companies</p>

        <div className="price">
          <span className="price-amount">$129</span>
          <span className="price-note">one-time</span>
        </div>

        <ul className="features">
          <li>Unlimited Team Seats</li>
          <li>Full Component Library</li>
          <li>Commercial License</li>
          <li>Priority Support</li>
          <li>Custom Requests</li>
        </ul>

        <button className="pricing-btn secondary">Contact Us</button>
      </div>
    </div>
  </div>
</section>


{/* FAQ + CONTACT */}
<section id="faq-contact" className="faq-section">

  <div className="faq-container">

    {/* TITLE */}
    <h2 className="fk-gs-title">Frequently Asked Questions</h2>
    <p className="fk-gs-text">Answers to common questions about FramerKit</p>

    {/* FAQ GRID */}
    <div className="faq-grid">

      <div className="faq-item">
        <h3 className="faq-question">Can I use components commercially?</h3>
        <p className="faq-answer">
          Yes — all paid plans include full commercial licensing with no limitations.
        </p>
      </div>

      <div className="faq-item">
        <h3 className="faq-question">Do I get lifetime updates?</h3>
        <p className="faq-answer">
          Pro & Team plans include free lifetime updates as the library grows.
        </p>
      </div>

      <div className="faq-item">
        <h3 className="faq-question">Do you add new components?</h3>
        <p className="faq-answer">
          Yes! New layout blocks, UI components and animations are added monthly.
        </p>
      </div>

      <div className="faq-item">
        <h3 className="faq-question">Does it work with any project?</h3>
        <p className="faq-answer">
          FramerKit components adapt to any style — just change fonts, colors, spacing.
        </p>
      </div>

      <div className="faq-item">
        <h3 className="faq-question">Does it work with any project?</h3>
        <p className="faq-answer">
          FramerKit components adapt to any style — just change fonts, colors, spacing.
        </p>
      </div>

      <div className="faq-item">
        <h3 className="faq-question">Does it work with any project?</h3>
        <p className="faq-answer">
          FramerKit components adapt to any style — just change fonts, colors, spacing.
        </p>
      </div>

      <div className="faq-item">
        <h3 className="faq-question">Does it work with any project?</h3>
        <p className="faq-answer">
          FramerKit components adapt to any style — just change fonts, colors, spacing.
        </p>
      </div>

      <div className="faq-item">
        <h3 className="faq-question">Does it work with any project?</h3>
        <p className="faq-answer">
          FramerKit components adapt to any style — just change fonts, colors, spacing.
        </p>
      </div>
    </div>
  </div>

</section>

</div>
  );
}