import { useMemo, useState } from "react";
import SEO from "../components/SEO";

type UpdateChannel = "website" | "plugin";

type UpdateItem = {
  date: string;
  title: string;
  details: string;
};

const WEBSITE_UPDATES: UpdateItem[] = [
  {
    date: "April 23, 2026",
    title: "Catalog admin editing and preview workflow expanded",
    details:
      "Added per-item editing and deletion inside catalog pages, group-level edit controls, persistent preview-generation states for all four layout variants, and cleaner admin handling for generated preview paths.",
  },
  {
    date: "April 23, 2026",
    title: "Preview viewer sizing and admin requests stabilized",
    details:
      "Improved preview height measurement for generated sections, fixed navbar alignment behavior in the viewer, and updated admin API requests so editing and catalog actions work reliably through the hosted Supabase function.",
  },
  {
    date: "April 22, 2026",
    title: "Built-in Framer component generator added to the site",
    details:
      "Moved the Framer extractor workflow into the website admin flow, added one-click preview generation into public preview folders, and auto-filled generated preview/image paths directly inside the component form.",
  },
  {
    date: "April 21, 2026",
    title: "Docs navigation and header behavior polished",
    details:
      "Refined sticky header logic across docs pages, kept Lessons/Articles/Support top actions stable, and improved section-header replacement flow while scrolling.",
  },
  {
    date: "April 21, 2026",
    title: "Support and Updates pages simplified",
    details:
      "Support now uses one clear request flow without duplicate in-page toggles, and Updates keeps channel switcher only with top navbar theme control.",
  },
  {
    date: "April 20, 2026",
    title: "Sidebar accordion interactions upgraded",
    details:
      "Sidebar groups now auto-close when opening another group and use smooth expand/collapse animation for cleaner navigation.",
  },
  {
    date: "April 20, 2026",
    title: "Theme system split for better UX",
    details:
      "Separated global website theme from component-preview theme so browsing UI variants no longer forces full-site theme changes.",
  },
  {
    date: "April 15, 2026",
    title: "Support form and attachments upgraded",
    details:
      "Improved support flow with stable form delivery, attachment handling, image-safe filenames, signed download links, and a new attachment usage progress bar in the UI.",
  },
  {
    date: "April 15, 2026",
    title: "Sidebar navigation refined",
    details:
      "Added separate expand arrows for Library groups, made heading click open the section page, and tuned alignment for submenu rails and labels.",
  },
  {
    date: "April 14, 2026",
    title: "Right-side TOC behavior improved",
    details:
      "Adjusted section activation timing and indicator behavior for smoother tracking while scrolling documentation pages.",
  },
  {
    date: "April 14, 2026",
    title: "Documentation layout responsiveness updates",
    details:
      "Improved content sizing and sidebar interactions across desktop, tablet, and mobile breakpoints.",
  },
];

const PLUGIN_UPDATES: UpdateItem[] = [
  {
    date: "April 23, 2026",
    title: "Plugin and website admin flows aligned",
    details:
      "Aligned admin-side catalog structure with the same variant model used across plugin-ready content: light design, light wireframe, dark design, and dark wireframe now follow one clearer publishing flow.",
  },
  {
    date: "April 22, 2026",
    title: "Preview asset handling prepared for faster plugin publishing",
    details:
      "Updated preview generation flow so images and preview pages can be created in one step and reused more consistently when preparing new blocks for both the site and plugin library.",
  },
  {
    date: "April 21, 2026",
    title: "Plugin top controls aligned with website system",
    details:
      "Adjusted control hierarchy to mirror website patterns: clearer separation between global app theme controls and preview-specific toggles.",
  },
  {
    date: "April 20, 2026",
    title: "Navigation and card polish pass",
    details:
      "Improved plugin navbar spacing, control alignment, and card rhythm for more consistent visual structure across sections and components.",
  },
  {
    date: "April 15, 2026",
    title: "Plugin updates board created",
    details:
      "Added a dedicated Plugin updates channel so upcoming plugin changes can be tracked separately from website releases.",
  },
];

export default function UpdatesPage() {
  const [channel, setChannel] = useState<UpdateChannel>("website");
  const updates = useMemo(
    () => (channel === "website" ? WEBSITE_UPDATES : PLUGIN_UPDATES),
    [channel]
  );

  return (
    <div className="layout-catalog-page">
      <SEO
        title="Updates"
        description="Latest FramerKit product and documentation changes."
        keywords="framerkit updates, changelog, new features"
        canonical="https://www.framerkit.site/updates"
      />

      <div className="component-page-header">
        <nav className="component-breadcrumb">
          <span className="breadcrumb-current">Updates</span>
        </nav>
        <h2 className="component-page-title">Updates</h2>
        <p className="component-page-description">
          Track what changed in FramerKit across the website and plugin.
        </p>
      </div>

      <div className="section-header-sticky">
        <div className="section-header-row">
          <div className="section-header-controls-left">
            <div className="mode-toggle-wrapper">
              <div className="mode-toggle-group">
                <button
                  type="button"
                  className={`mode-toggle-btn ${channel === "website" ? "active" : ""}`}
                  onClick={() => setChannel("website")}
                >
                  <span>Website</span>
                </button>
                <button
                  type="button"
                  className={`mode-toggle-btn ${channel === "plugin" ? "active" : ""}`}
                  onClick={() => setChannel("plugin")}
                >
                  <span>Plugin</span>
                </button>
              </div>
            </div>
          </div>
          <div className="section-header-controls-right" />
        </div>
        <div className="section-header-divider" />
      </div>

      <div className="layout-catalog-scroll-area">
        <div className="updates-feed">
          {updates.map((item) => (
            <article key={`${channel}-${item.date}-${item.title}`} className="updates-card">
              <p className="updates-date">{item.date}</p>
              <h3 className="updates-title">{item.title}</h3>
              <p className="updates-details">{item.details}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
