import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { X } from "lucide-react";
import SEO from "../components/SEO";
import ProductDropdown from "../components/ProductDropdown";

const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL ?? "support@framerkit.site";
const SUPPORT_FORM_ENDPOINT = import.meta.env.VITE_SUPPORT_FORM_ENDPOINT as string | undefined;
const MIN_SENDING_VISIBLE_MS = 650;
const MAX_FILE_COUNT = 8;
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_ATTACHMENT_TOTAL_MB = 20;
const MAX_ATTACHMENT_TOTAL_BYTES = MAX_ATTACHMENT_TOTAL_MB * 1024 * 1024;

export default function SupportPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorText, setErrorText] = useState("");
  const [deliveryId, setDeliveryId] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "website",
    requestType: "bug",
    pageUrl: "",
    message: "",
  });
  const attachmentBytes = attachments.reduce((sum, file) => sum + file.size, 0);
  const attachmentUsedMB = attachmentBytes / (1024 * 1024);
  const attachmentProgress = Math.min(100, Math.round((attachmentBytes / MAX_ATTACHMENT_TOTAL_BYTES) * 100));
  const isAttachmentCountExceeded = attachments.length > MAX_FILE_COUNT;
  const oversizeAttachment = attachments.find((file) => file.size > MAX_FILE_SIZE_BYTES);
  const isAttachmentTotalExceeded = attachmentBytes > MAX_ATTACHMENT_TOTAL_BYTES;
  const hasAttachmentValidationError =
    isAttachmentCountExceeded || Boolean(oversizeAttachment) || isAttachmentTotalExceeded;
  const isAttachmentLimitErrorText =
    errorText.includes("You can attach up to") ||
    errorText.includes("is larger than") ||
    errorText.includes("Total attachment size exceeds");

  useEffect(() => {
    if (status !== "error" || !isAttachmentLimitErrorText) return;
    if (attachments.length <= MAX_FILE_COUNT && !hasAttachmentValidationError) {
      setStatus("idle");
      setErrorText("");
    }
  }, [attachments.length, hasAttachmentValidationError, isAttachmentLimitErrorText, status]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nativeFormData = new FormData(event.currentTarget);
    const name = String(nativeFormData.get("name") ?? form.name).trim();
    const email = String(nativeFormData.get("email") ?? form.email).trim();
    const pageUrl = String(nativeFormData.get("pageUrl") ?? form.pageUrl).trim();
    const message = String(nativeFormData.get("message") ?? form.message).trim();

    setForm((prev) => ({
      ...prev,
      name,
      email,
      pageUrl,
      message,
    }));

    if (!name || !email || !message) {
      setStatus("error");
      setErrorText("Please fill in Name, Email, and Message before sending.");
      return;
    }
    if (hasAttachmentValidationError) {
      setStatus("error");
      setErrorText(
        isAttachmentCountExceeded
          ? `You can attach up to ${MAX_FILE_COUNT} files. Remove ${attachments.length - MAX_FILE_COUNT} file(s) to continue.`
          : oversizeAttachment
            ? `${oversizeAttachment.name} is larger than ${MAX_FILE_SIZE_MB} MB.`
            : `Total attachment size exceeds ${MAX_ATTACHMENT_TOTAL_MB} MB.`
      );
      return;
    }
    const startedAt = Date.now();
    setStatus("sending");
    setErrorText("");
    setDeliveryId("");
    try {
      if (SUPPORT_FORM_ENDPOINT) {
        const payload = new FormData();
        payload.append("channel", "support");
        payload.append("name", name);
        payload.append("email", email);
        payload.append("topic", form.topic);
        payload.append("requestType", form.requestType);
        payload.append("pageUrl", pageUrl);
        payload.append("message", message);
        payload.append("sentAt", new Date().toISOString());
        attachments.forEach((file) => payload.append("attachments", file));

        const response = await fetch(SUPPORT_FORM_ENDPOINT, {
          method: "POST",
          body: payload,
        });

        if (!response.ok) {
          const raw = await response.text();
          throw new Error(raw || "Support form endpoint failed");
        }

        const raw = await response.text();
        try {
          const result = (raw ? JSON.parse(raw) : {}) as { emailId?: string; id?: string };
          setDeliveryId(result.emailId || result.id || "Accepted by server");
        } catch {
          setDeliveryId("Accepted by server");
        }
      } else {
        throw new Error(
          "Form endpoint is not configured. Add VITE_SUPPORT_FORM_ENDPOINT and restart the app."
        );
      }

      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_SENDING_VISIBLE_MS) {
        await new Promise((resolve) => setTimeout(resolve, MIN_SENDING_VISIBLE_MS - elapsed));
      }

      setStatus("success");
      setForm({
        name: "",
        email: "",
        topic: "website",
        requestType: "bug",
        pageUrl: "",
        message: "",
      });
      setAttachments([]);
    } catch (error) {
      if (attachments.length > 0 && !SUPPORT_FORM_ENDPOINT) {
        setErrorText("Attachments need a connected form endpoint. Add VITE_SUPPORT_FORM_ENDPOINT to enable uploads.");
      } else if (error instanceof Error && error.message) {
        setErrorText(error.message);
      }
      setStatus("error");
    }
  };

  return (
    <div className="layout-catalog-page">
      <SEO
        title="Support"
        description="Get support for FramerKit website and plugin."
        keywords="framerkit support, help, contact"
        canonical="https://www.framerkit.site/support"
      />

      <div className="component-page-header support-page-header">
        <nav className="component-breadcrumb">
          <span className="breadcrumb-current">Support</span>
        </nav>
        <h2 className="component-page-title">Support</h2>
        <p className="component-page-description">
          Need help with setup, access, or broken behavior? Send a quick message and include your page URL
          or screenshot so we can resolve it faster.
        </p>
      </div>

      <div className="layout-catalog-scroll-area">
        <div className="product-page-grid">
          <aside className="product-info-stack">
            <article className="updates-card">
              <h3 className="updates-title">How support works</h3>
              <p className="updates-details">
                Send one request per issue so I can track and resolve it faster.
              </p>
            </article>
            <article className="updates-card">
              <h3 className="updates-title">Include these details</h3>
              <p className="updates-details">
                Steps to reproduce, expected result, actual result, and page URL. Attach screenshots if possible.
              </p>
            </article>
          </aside>

          <section className="product-form-card">
            <h3 className="updates-title">Send support request</h3>
            <p className="updates-details">
              I usually reply within 1-2 business days.
            </p>

            <form className="product-form" onSubmit={onSubmit} noValidate>
              <label className="product-field">
                <span>Name</span>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Your name"
                />
              </label>

              <label className="product-field">
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="you@company.com"
                />
              </label>

              <label className="product-field">
                <span>Topic</span>
                <ProductDropdown
                  ariaLabel="Support topic"
                  value={form.topic}
                  onChange={(nextValue) =>
                    setForm((prev) => ({ ...prev, topic: nextValue }))
                  }
                  options={[
                    { value: "website", label: "Website" },
                    { value: "plugin", label: "Plugin" },
                    { value: "billing", label: "Billing" },
                    { value: "other", label: "Other" },
                  ]}
                />
              </label>

              <label className="product-field">
                <span>Type</span>
                <ProductDropdown
                  ariaLabel="Support request type"
                  value={form.requestType}
                  onChange={(nextValue) =>
                    setForm((prev) => ({ ...prev, requestType: nextValue }))
                  }
                  options={[
                    { value: "bug", label: "Bug" },
                    { value: "question", label: "Question" },
                    { value: "feature-request", label: "Feature request" },
                  ]}
                />
              </label>

              <label className="product-field">
                <span>Page URL (optional)</span>
                <input
                  name="pageUrl"
                  type="url"
                  value={form.pageUrl}
                  onChange={(event) => setForm((prev) => ({ ...prev, pageUrl: event.target.value }))}
                  placeholder="https://..."
                />
              </label>

              <label className="product-field">
                <span>Message</span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                  placeholder="Describe the issue and expected result..."
                  rows={5}
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
                <div className="product-attachments-usage" aria-live="polite">
                  <div className="product-attachments-usage-row">
                    <span>Attachment usage</span>
                    <span>
                      {attachmentUsedMB.toFixed(1)} / {MAX_ATTACHMENT_TOTAL_MB} MB
                    </span>
                  </div>
                  <div
                    className={`product-attachments-bar ${hasAttachmentValidationError ? "error" : ""}`}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={attachmentProgress}
                  >
                    <span style={{ width: `${attachmentProgress}%` }} />
                  </div>
                  <small className={`product-attachments-note ${hasAttachmentValidationError ? "error" : ""}`}>
                    {isAttachmentCountExceeded
                      ? `You can attach up to ${MAX_FILE_COUNT} files. Remove ${attachments.length - MAX_FILE_COUNT} file(s) to continue.`
                      : oversizeAttachment
                      ? `"${oversizeAttachment.name}" is larger than ${MAX_FILE_SIZE_MB} MB.`
                      : isAttachmentTotalExceeded
                        ? `Total attachment size exceeds ${MAX_ATTACHMENT_TOTAL_MB} MB.`
                        : `Up to ${MAX_FILE_COUNT} files, ${MAX_FILE_SIZE_MB} MB per file.`}
                  </small>
                </div>
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

              <button
                type="submit"
                className="product-submit-btn"
                disabled={status === "sending" || hasAttachmentValidationError}
              >
                {status === "sending"
                  ? "Sending..."
                  : status === "success"
                    ? "Sent"
                    : "Send request"}
              </button>

              {status === "success" && (
                <p className="product-form-status success">
                  Thanks, your support request is in. I usually reply within 1-2 business days.
                  {deliveryId ? ` Ref: ${deliveryId}` : ""}
                </p>
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
