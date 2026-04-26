import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Moon, Sun, X } from "lucide-react";
import SEO from "../components/SEO";
import ProductDropdown from "../components/ProductDropdown";

const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL ?? "support@framerkit.site";
const FEEDBACK_FORM_ENDPOINT = import.meta.env.VITE_FEEDBACK_FORM_ENDPOINT as string | undefined;

export default function FeedbackPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorText, setErrorText] = useState("");
  const [themeFilter, setThemeFilter] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" ? "dark" : "light";
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    area: "website",
    type: "feature",
    message: "",
    company: "",
  });

  const canSubmit = useMemo(
    () => Boolean(form.name.trim() && form.email.trim() && form.message.trim()) && status !== "sending",
    [form, status]
  );

  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      const detail = (event as CustomEvent<{ theme?: "light" | "dark" } | "light" | "dark">).detail;
      const nextTheme = typeof detail === "string" ? detail : detail?.theme;
      if (nextTheme === "light" || nextTheme === "dark") {
        setThemeFilter(nextTheme);
      }
    };

    window.addEventListener("themeChange", handleThemeChange as EventListener);
    window.addEventListener("framerkit-theme-change", handleThemeChange as EventListener);
    return () => {
      window.removeEventListener("themeChange", handleThemeChange as EventListener);
      window.removeEventListener("framerkit-theme-change", handleThemeChange as EventListener);
    };
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    if (form.company) return;

    setStatus("sending");
    setErrorText("");
    try {
      if (FEEDBACK_FORM_ENDPOINT) {
        const payload = new FormData();
        payload.append("channel", "feedback");
        payload.append("name", form.name);
        payload.append("email", form.email);
        payload.append("area", form.area);
        payload.append("type", form.type);
        payload.append("message", form.message);
        payload.append("sentAt", new Date().toISOString());
        attachments.forEach((file) => payload.append("attachments", file));

        const response = await fetch(FEEDBACK_FORM_ENDPOINT, {
          method: "POST",
          body: payload,
        });

        if (!response.ok) {
          throw new Error("Feedback form endpoint failed");
        }
      } else {
        if (attachments.length > 0) {
          throw new Error("Attachments require endpoint");
        }
        const subject = encodeURIComponent(`[FramerKit Feedback] ${form.area} / ${form.type}`);
        const body = encodeURIComponent(
          `Name: ${form.name}\nEmail: ${form.email}\nArea: ${form.area}\nType: ${form.type}\n\n${form.message}`
        );
        window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
      }

      setStatus("success");
      setForm({
        name: "",
        email: "",
        area: "website",
        type: "feature",
        message: "",
        company: "",
      });
      setAttachments([]);
    } catch {
      if (attachments.length > 0 && !FEEDBACK_FORM_ENDPOINT) {
        setErrorText("Attachments need a connected form endpoint. Add VITE_FEEDBACK_FORM_ENDPOINT to enable uploads.");
      }
      setStatus("error");
    }
  };

  const toggleTheme = () => {
    const nextTheme = themeFilter === "light" ? "dark" : "light";
    setThemeFilter(nextTheme);
    localStorage.setItem("theme", nextTheme);
    window.dispatchEvent(new CustomEvent("themeChange", { detail: { theme: nextTheme } }));
    window.dispatchEvent(new CustomEvent("framerkit-theme-change", { detail: nextTheme }));
  };

  return (
    <div className="layout-catalog-page">
      <SEO
        title="Feedback"
        description="Share feature requests and improvement ideas for FramerKit."
        keywords="framerkit feedback, feature request, product ideas"
        canonical="https://www.framerkit.site/feedback"
      />

      <div className="component-page-header">
        <nav className="component-breadcrumb">
          <span className="breadcrumb-current">Feedback</span>
        </nav>
        <h2 className="component-page-title">Feedback</h2>
        <p className="component-page-description">
          Have an idea for website or plugin improvements? Share it here and we will review it for upcoming
          updates.
        </p>
      </div>

      <div className="section-header-sticky">
        <div className="section-header-row">
          <div className="section-header-controls-left">
            <p className="updates-toolbar-note">Share requests for Website and Plugin</p>
          </div>
          <div className="section-header-controls-right">
            <button
              type="button"
              className={`theme-toggle-btn ${themeFilter === "dark" ? "active" : ""}`}
              onClick={toggleTheme}
              aria-label={themeFilter === "dark" ? "Dark theme" : "Light theme"}
              title=""
            >
              {themeFilter === "dark" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
        <div className="section-header-divider" />
      </div>

      <div className="layout-catalog-scroll-area">
        <div className="product-page-grid">
          <aside className="product-info-stack">
            <article className="updates-card">
              <h3 className="updates-title">Best format</h3>
              <p className="updates-details">
                Describe the problem first, then your solution idea and where it should appear.
              </p>
            </article>
            <article className="updates-card">
              <h3 className="updates-title">Fallback email</h3>
              <p className="updates-details">
                <a href={`mailto:${SUPPORT_EMAIL}?subject=FramerKit%20Feedback`} className="updates-link">
                  {SUPPORT_EMAIL}
                </a>
              </p>
            </article>
          </aside>

          <section className="product-form-card">
            <h3 className="updates-title">Send feedback</h3>
            <p className="updates-details">Feature ideas, UX suggestions, or missing blocks are welcome.</p>

            <form className="product-form" onSubmit={onSubmit}>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
                autoComplete="off"
                tabIndex={-1}
                className="product-honeypot"
              />

              <label className="product-field">
                <span>Name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Your name"
                  required
                />
              </label>

              <label className="product-field">
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="you@company.com"
                  required
                />
              </label>

              <div className="product-field-row">
                <label className="product-field">
                  <span>Area</span>
                  <ProductDropdown
                    ariaLabel="Feedback area"
                    value={form.area}
                    onChange={(nextValue) => setForm((prev) => ({ ...prev, area: nextValue }))}
                    options={[
                      { value: "website", label: "Website" },
                      { value: "plugin", label: "Plugin" },
                      { value: "both", label: "Both" },
                    ]}
                  />
                </label>

                <label className="product-field">
                  <span>Type</span>
                  <ProductDropdown
                    ariaLabel="Feedback type"
                    value={form.type}
                    onChange={(nextValue) => setForm((prev) => ({ ...prev, type: nextValue }))}
                    options={[
                      { value: "feature", label: "Feature request" },
                      { value: "ux", label: "UX improvement" },
                      { value: "content", label: "Content request" },
                      { value: "other", label: "Other" },
                    ]}
                  />
                </label>
              </div>

              <label className="product-field">
                <span>Feedback</span>
                <textarea
                  value={form.message}
                  onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                  placeholder="What is missing, why it matters, and what result you expect..."
                  rows={6}
                  required
                />
              </label>

              <label className="product-field">
                <span>Attachments (optional)</span>
                <input
                  type="file"
                  multiple
                  onChange={(event) => {
                    const nextFiles = Array.from(event.target.files ?? []);
                    setAttachments((prev) => {
                      const merged = [...prev];
                      nextFiles.forEach((file) => {
                        const exists = merged.some(
                          (item) =>
                            item.name === file.name &&
                            item.size === file.size &&
                            item.lastModified === file.lastModified
                        );
                        if (!exists) merged.push(file);
                      });
                      return merged;
                    });
                    event.currentTarget.value = "";
                  }}
                />
              </label>
              {attachments.length > 0 && (
                <ul className="product-attachments-list">
                  {attachments.map((file, index) => (
                    <li key={`${file.name}-${index}`} className="product-attachments-item">
                      <span className="product-attachments-name">{file.name}</span>
                      <button
                        type="button"
                        className="product-attachments-remove"
                        aria-label={`Remove ${file.name}`}
                        onClick={() => {
                          setAttachments((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
                        }}
                      >
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <button type="submit" className="product-submit-btn" disabled={!canSubmit}>
                {status === "sending" ? "Sending..." : "Send feedback"}
              </button>

              {status === "success" && (
                <p className="product-form-status success">Feedback sent. Thank you.</p>
              )}
              {status === "error" && (
                <p className="product-form-status error">
                  {errorText || `Could not send right now. Please email us directly at ${SUPPORT_EMAIL}.`}
                </p>
              )}
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
