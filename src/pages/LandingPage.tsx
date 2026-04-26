import { useState, useEffect, useLayoutEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; 
import { motion } from "framer-motion";
import SimpleAvatarGroup from "../components/SimpleAvatarGroup";
import ComponentRunner from "../components/ComponentRunner";
import RandomSectionCards from "../components/RandomSectionCards";
import RandomSectionCardsDark from "../components/RandomSectionCardsDark";
import RandomComponentCards from "../components/RandomComponentCards";
import RandomComponentCardsDark from "../components/RandomComponentCardsDark";
import HeroGridSnake from "../components/HeroGridSnake";
import "./framerkit.css";
import "./gettingstarted.css";
import styles from "./HomePage.module.css";
import { CircleCheck, Paintbrush, Sparkles, SquareDashed } from "lucide-react";
import { trackGtagEvent } from "../utils/gtag";
import SEO from "../components/SEO";
import {
  RocketLaunch,
  ClipboardText,
  Sliders,
  CloudArrowUp,
} from "phosphor-react";


type LandingPageProps = {
  theme?: "light" | "dark";
};

type FaqItem = {
  question: string;
  answer: React.ReactNode;
};

export default function LandingPage({ theme = "light" }: LandingPageProps) {

  const navigate = useNavigate(); // 🔥 Хук для навигации
  const location = useLocation();

  const [isWireframeMode, setIsWireframeMode] = useState(() => {
    try {
      const saved = localStorage.getItem("wireframeMode");
      return saved === null ? true : saved === "true";
    } catch (error) {
      console.warn("Failed to load wireframeMode from localStorage", error);
      return true;
    }
  });

  const faqItems: FaqItem[] = [
    {
      question: "What is FramerKit?",
      answer:
        "FramerKit is a library of ready-to-use Framer sections, components, and templates designed to help you build polished websites faster.",
    },
    {
      question: "How does the workflow work?",
      answer:
        "Browse sections on the site or in the plugin, copy or insert what you need, then customize layout, content, and styling directly inside Framer.",
    },
    {
      question: "What is Wireframe & Design mode?",
      answer:
        "Wireframe mode helps you work on structure and flow first. Design mode gives you the polished visual version when you're ready to refine the page.",
    },
    {
      question: "Can I use FramerKit for client work?",
      answer:
        "Yes. Pro plans include commercial use, so you can use FramerKit components in unlimited client projects.",
    },
    {
      question: "Is everything responsive?",
      answer:
        "Yes. The library is built to work across desktop, tablet, and mobile, so you start from a responsive base instead of fixing layouts later.",
    },
    {
      question: "Are tutorials and updates included?",
      answer: (
        <>
          Yes. New sections are added over time, and you can follow updates on{" "}
          <span className="tooltip-wrapper">
            <a
              href="https://x.com/framer_kit"
              target="_blank"
              rel="noopener noreferrer"
              className="faq-link"
            >
              X
            </a>
            <div className="tooltip">
              Follow on X
              <div className="tooltip-arrow" />
            </div>
          </span>{" "}
          and watch tutorials on{" "}
          <span className="tooltip-wrapper" style={{ display: "inline-flex" }}>
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
          .
        </>
      ),
    },
  ];

  // Сохраняем wireframeMode при изменении
  useEffect(() => {
    try {
      localStorage.setItem("wireframeMode", isWireframeMode.toString());
    } catch (e) {
      console.warn("Failed to save wireframeMode to localStorage", e);
    }
  }, [isWireframeMode]);

  // Сбрасываем URL на / при монтировании лендинга,
  // но сохраняем pricing hash, чтобы прямой переход к прайсу работал.
  useEffect(() => {
    if (
      window.location.pathname !== "/" ||
      (window.location.hash && window.location.hash !== "#get-framerkit")
    ) {
      window.history.replaceState(null, "", "/");
    }
  }, []);

  useLayoutEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    const targetId = state?.scrollTo;

    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "auto", block: "start" });
    }

    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  useLayoutEffect(() => {
    if (location.hash !== "#get-framerkit") return;
    const target = document.getElementById("get-framerkit");
    if (target) {
      target.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, [location.hash]);

  return (
    <div className="landing-page">
      <SEO
        title="FramerKit — UI Components & Templates"
        description="FramerKit library of ready-made Framer sections, components, and templates to build websites faster."
        keywords="framerkit, framer ui kit, framer components, framer templates"
        canonical="https://www.framerkit.site/"
      />
      {/* HERO SECTION */}
      <section id="overview" className={styles.heroSection}>
        <div className={styles.lightTop}></div>
        <div className={styles.lightMid}></div>
        <div className={styles.gridPattern}></div>
        <HeroGridSnake theme={theme} />

        <div className={styles.container}>
          {(() => {
            const firstLine = "Build Websites Faster";
            const secondLine = "with FramerKit";

            // Задержки
            const logoAndFirstLineDelay = 0;
            const secondLineDelay =
              logoAndFirstLineDelay + firstLine.length * 0.03 + 0.2;
            const eyebrowDelay = logoAndFirstLineDelay;
            const subtitleDelay = secondLineDelay + secondLine.length * 0.03 + 0.2;
            const buttonsDelay = subtitleDelay + 0.6;
            const testimonialsDelay = buttonsDelay + 0.2;

            return (
              <>
                {/* 1. Badge */}
                <motion.div
                  className={styles.eyebrow}
                  initial={{ opacity: 0, x: -20, filter: "blur(6px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                    delay: eyebrowDelay,
                  }}
                >
                  <Sparkles size={14} strokeWidth={2.25} />
                  <span>New components added daily</span>
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
                 Browse polished blocks, learn the workflow, drop sections into Framer, and build pages faster without repeating the same design work from scratch.
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
                trackGtagEvent("click_explore_components", { location: "landing_hero" });
                
                // 🔥 Правильный переход через React Router
                navigate("/#overview");
              }}
            >
              Quick Start
            </button>
            <button
              className="logoutButton"
              onClick={() => {
                trackGtagEvent("click_see_pricing", { location: "landing_hero" });
                document
                  .getElementById("get-framerkit")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              See Pricing
            </button>
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
                  <SimpleAvatarGroup size={40} overlap={6} theme={theme} />
                  <p className={styles.statsText}>
                    1,400+ designers already use FramerKit
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

     {/* TESTIMONIALS SECTION */}
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
        
        {/* 1. Заголовок */}
        <h2 className="fk-gs-title">Layout Sections</h2>
        
        {/* 2. Подзаголовок */}
        <p className="fk-gs-text">
          Pre-built page sections like Navigation Bars, Hero Sections, Testimonials, FAQs, and more — fully responsive and ready to drop into your Framer project
        </p>
        
        {/* 3. Переключатель (по центру или справа) */}
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
        
        {/* 4. Карточки */}
        <div className="gallery2">
          {theme === "dark" ? (
            <RandomSectionCardsDark wireframeMode={isWireframeMode} />
          ) : (
            <RandomSectionCards wireframeMode={isWireframeMode} theme={theme} />
          )}
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
                {theme === "dark" ? (
                  <RandomComponentCardsDark />
                ) : (
                  <RandomComponentCards theme={theme} />
                )}
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
      Pick the plan that matches your workflow now. You can start monthly, save with yearly, or unlock everything forever.
    </p>

    <div className="pricing-grid">
      <div className="pricing-card">
        <div className="badge-light">Monthly</div>
        <div className="price">
          <span className="price-amount">$15</span>
        </div>
        <p className="plan-meta-inline">
          <span className="plan-meta-chip">per month</span>
        </p>

        <div className="features">
          <div className="feature-item"><CircleCheck className="feature-icon" /> Full FramerKit library</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> Framer plugin access</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> 1000+ premium sections</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> Wireframe &amp; Design modes</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> Fully responsive blocks</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> Free lessons included</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> All updates while subscribed</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> Cancel anytime</div>
        </div>

        <a
          href="https://buy.polar.sh/polar_cl_ksuL1cw1GuaLpoC3Dg5vsv4qSlLRSaX45c3JQ1HIx65"
          target="_blank"
          rel="noopener noreferrer"
          className="pricing-btn secondary"
          onClick={() =>
            trackGtagEvent("select_plan", {
              plan: "monthly",
              price: 15,
              currency: "USD",
              interval: "month",
            })
          }
        >
          Subscribe Now
        </a>
      </div>

      <div className="pricing-card">
        <div className="badge-light">Yearly</div>
        <div className="price">
          <span className="price-amount">$72</span>
          <span className="price-inline-note">$6/mo</span>
        </div>
        <p className="plan-meta-inline">
          <span className="plan-meta-chip">Paid yearly</span>
          <span className="plan-meta-chip plan-meta-chip-accent">Save 60%</span>
        </p>

        <div className="features">
          <div className="feature-item"><CircleCheck className="feature-icon" /> Full FramerKit library</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> Framer plugin access</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> 1000+ premium sections</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> Wireframe &amp; Design modes</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> Fully responsive blocks</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> Free lessons included</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> All updates while subscribed</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> 1 year access</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> Cancel anytime</div>
        </div>

        <a
          href="https://buy.polar.sh/polar_cl_0YFpBGmtf8un1uJgdyvJ3q5gsz3vQxQOjhwPv0HcV4h"
          target="_blank"
          rel="noopener noreferrer"
          className="pricing-btn secondary"
          onClick={() =>
            trackGtagEvent("select_plan", {
              plan: "yearly",
              price: 72,
              currency: "USD",
              interval: "year",
            })
          }
        >
          Get Yearly
        </a>
      </div>

      <div className="pricing-card featured">
        <div className="badge">Most Popular</div>
        <div className="price">
          <span className="price-amount">$89</span>
          <span className="price-strike">$250</span>
        </div>
        <p className="plan-meta-inline">
          <span className="plan-meta-chip">Lifetime</span>
          <span className="plan-meta-chip plan-meta-chip-accent">Limited time offer</span>
        </p>

        <div className="features">
          <div className="feature-item"><CircleCheck className="feature-icon" /> Full FramerKit library</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> Framer plugin access</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> 1000+ premium sections</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> Wireframe &amp; Design modes</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> Fully responsive blocks</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> Free lessons included</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> Lifetime access</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> Lifetime updates</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> Commercial use</div>
          <div className="feature-item"><CircleCheck className="feature-icon" /> Priority support</div>
        </div>

        <a
          href="https://buy.polar.sh/polar_cl_lbbqLYLaayU8OwD7xLYNCiFvxQcw0LpKSm6kl4MLuVh"
          target="_blank"
          rel="noopener noreferrer"
          className="pricing-btn"
          onClick={() =>
            trackGtagEvent("select_plan", {
              plan: "lifetime",
              price: 89,
              currency: "USD",
              featured: true,
            })
          }
        >
          Get Lifetime Access
        </a>
      </div>
    </div>

    <div className="pricing-polar-inline" aria-label="Payment details">
      <span className="pricing-meta-brand">
        <span>Secure checkout by</span>
        <img
          src={theme === "dark" ? "/polar-logotype-white.svg" : "/polar-logotype-black.svg"}
          alt="Polar"
          className="polar-logotype"
        />
      </span>
    </div>

  </div>
</section>


   {/* FAQ SECTION */}
<section id="faq-contact" className="faq-section">
  <div className="faq-container">
    <h2 className="fk-gs-title">Frequently Asked Questions</h2>
    <p className="fk-gs-text">The practical questions most people ask before they start using FramerKit.</p>

    <div className="faq-grid">
      {faqItems.map((item) => (
        <div className="faq-item" key={item.question}>
          <h3 className="faq-question">{item.question}</h3>
          <p className="faq-answer">{item.answer}</p>
        </div>
      ))}

    </div>
  </div>
</section>

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <Link to="/" className="landing-footer-logo">
              <img src="/Logo.png" alt="FramerKit" className="landing-footer-logo-icon" />
              <span className="landing-footer-logo-text">FramerKit</span>
            </Link>
            <p className="landing-footer-description">
              Professionally crafted Framer components for building beautiful products
              or starting your own design system.
            </p>
          </div>

          <div className="landing-footer-links">
            <div className="landing-footer-col">
              <h4>Documentation</h4>
              <a href="/#overview">Overview</a>
              <a href="/#getting-started">Getting Started</a>
              <a href="/#layout-sections">Layout Sections</a>
              <a href="/#ui-components">UI Components</a>
            </div>

            <div className="landing-footer-col">
              <h4>Product</h4>
              <a href="/#get-framerkit">Pricing</a>
              <a href="/#faq-contact">FAQ</a>
              <Link to="/templates">Templates</Link>
              <a
                href="https://www.framer.com/marketplace/plugins/framerkit"
                target="_blank"
                rel="noopener noreferrer"
              >
                Framer Plugin
              </a>
            </div>

            <div className="landing-footer-col">
              <h4>Resources</h4>
              <Link to="/resources">Resources</Link>
              <Link to="/layout">Layouts</Link>
              <Link to="/components">Components</Link>
            </div>

            <div className="landing-footer-col">
              <h4>Social</h4>
              <a href="https://x.com/framer_kit" target="_blank" rel="noopener noreferrer">X (Twitter)</a>
              <a href="https://www.youtube.com/@framerkit_plugin" target="_blank" rel="noopener noreferrer">YouTube</a>
              <a href="https://www.framer.com/marketplace/plugins/framerkit" target="_blank" rel="noopener noreferrer">Framer Marketplace</a>
            </div>
          </div>
        </div>

        <div className="landing-footer-bottom">
          <a href="mailto:support@framerkit.site">Contact us</a>
          <span>·</span>
          <span>© FramerKit 2026</span>
        </div>
      </footer>
    </div>
  );
}
