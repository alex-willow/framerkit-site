import { useEffect, useRef, } from "react";
import "./framerkit.css";

type HomePageProps = {
  onSectionChange: (sectionId: string) => void;
};

export default function HomePage({ onSectionChange }: HomePageProps) {
  const sections = [
    "overview",
    "getting-started",
    "installation",
    "how-it-works",
    "get-framerkit",
  ];

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    sections.forEach((id) => {
      sectionRefs.current[id] = document.getElementById(id);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            onSectionChange(id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0.1,
      }
    );

    sections.forEach((id) => {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* OVERVIEW */}
      <section id="overview" className="fk-section">
        <div className="fk-container fade-in">
          <h1>FramerKit — Build Faster, Design Smarter</h1>
          <p className="fk-large-text">
            A complete collection of components, sections, and templates designed
            for Framer. Build high-quality pages faster and increase conversions
            with modern UI blocks.
          </p>

          <button
            className="fk-btn-primary"
            onClick={() =>
              document
                .getElementById("getting-started")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Get Started
          </button>
        </div>
      </section>

      {/* GETTING STARTED */}
      <section id="getting-started" className="fk-section bg-light">
        <div className="fk-container fade-in">
          <h2>Getting Started</h2>
          <p className="fk-large-text">
            Start by installing FramerKit and integrating it into your Framer
            project. You’ll instantly unlock a large library of ready-to-use
            blocks.
          </p>

          <div className="framerkit-card" style={{ marginTop: 32 }}>
            <h3>Basic steps:</h3>
            <ul className="fk-list">
              <li>Select components you need</li>
              <li>Drag them into your Framer project</li>
              <li>Customize colors, fonts, spacing</li>
              <li>Publish the final page</li>
            </ul>
          </div>
        </div>
      </section>

      {/* INSTALLATION */}
      <section id="installation" className="fk-section">
        <div className="fk-container fade-in">
          <h2>Installation</h2>
          <p className="fk-large-text">
            Installing FramerKit takes less than a minute — simply import the
            ready package into your project.
          </p>

          <pre className="framerkit-code">
{`1. Open Framer
2. Go to Assets → Import
3. Choose the FramerKit package
4. Done!`}
          </pre>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="fk-section bg-light">
        <div className="fk-container fade-in">
          <h2>How It Works</h2>
          <p className="fk-large-text">
            FramerKit offers flexible components and layout sections that adapt
            to any visual style. Adjust colors, spacing, typography, animations —
            everything is customizable.
          </p>

          <div className="fk-grid-3" style={{ marginTop: 32 }}>
            {[
              {
                title: "Flexible Layout Blocks",
                text: "Assemble pages using ready sections.",
              },
              {
                title: "UI Components",
                text: "Buttons, cards, forms — organized and scalable.",
              },
              {
                title: "Brand Adaptation",
                text: "Customize colors, fonts, spacing, shadow style.",
              },
            ].map((item) => (
              <div key={item.title} className="framerkit-card">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GET FRAMERKIT */}
      <section id="get-framerkit" className="fk-section">
        <div className="fk-container fade-in">
          <h2>Get FramerKit</h2>
          <p className="fk-large-text">
            Ready to build faster? Download FramerKit and speed up your workflow
            with premium components.
          </p>

          <button className="fk-btn-primary" style={{ marginTop: 32 }}>
            Download FramerKit
          </button>
        </div>
      </section>
    </>
  );
}
