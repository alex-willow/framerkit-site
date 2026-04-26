import { useRef, useState, type FormEvent } from "react";
import { Pencil, X } from "lucide-react";
import { CATALOG_ADMIN_ENDPOINT } from "../lib/env";
import { buildAdminHeaders } from "../lib/adminApi";
import type { CatalogGroup, CatalogSection } from "../shared/catalogManifest";
import { CATALOG_ICON_KEY_OPTIONS } from "../shared/catalogIconKeys";

type AdminEditSectionButtonProps = {
  group: CatalogGroup;
  section: CatalogSection;
};

export default function AdminEditSectionButton({
  group,
  section,
}: AdminEditSectionButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [label, setLabel] = useState(section.label);
  const [description, setDescription] = useState(section.description || "");
  const [iconKey, setIconKey] = useState(section.iconKey || "");
  const [countLabel, setCountLabel] = useState(section.countLabel || "");
  const shouldCloseOnOverlayClickRef = useRef(false);

  const openModal = () => {
    setLabel(section.label);
    setDescription(section.description || "");
    setIconKey(section.iconKey || "");
    setCountLabel(section.countLabel || "");
    setError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSubmitting(false);
    setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!CATALOG_ADMIN_ENDPOINT) {
      setError("VITE_CATALOG_ADMIN_ENDPOINT is not configured.");
      return;
    }

    const adminAuthToken = localStorage.getItem("framerkitAdminAuth") || "";
    const adminFlag = localStorage.getItem("framerkitAdmin") === "true";
    if (!adminAuthToken || !adminFlag) {
      setError("Admin session not found. Sign in as admin first.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(CATALOG_ADMIN_ENDPOINT, {
        method: "POST",
        headers: buildAdminHeaders(adminAuthToken),
        body: JSON.stringify({
          action: "update_section",
          group,
          id: section.id,
          jsonKey: section.jsonKey,
          label,
          description: description || undefined,
          iconKey: iconKey || undefined,
          countLabel: countLabel || undefined,
        }),
      });

      const responseText = await response.text();
      let responseJson: { error?: string } | null = null;
      if (responseText) {
        try {
          responseJson = JSON.parse(responseText) as { error?: string };
        } catch {
          responseJson = null;
        }
      }

      if (!response.ok) {
        setError(responseJson?.error || responseText || "Failed to update section.");
        return;
      }

      window.dispatchEvent(new Event("framerkit-manifest-refresh"));
      closeModal();
    } catch (submitError) {
      console.error(submitError);
      setError("Failed to update section. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="card-section-edit"
        onMouseDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          openModal();
        }}
        aria-label="Edit section"
        title="Edit section"
      >
        <Pencil size={14} />
      </button>

      {showModal && (
        <div
          className="admin-create-modal-overlay"
          onMouseDown={(event) => {
            shouldCloseOnOverlayClickRef.current =
              event.target === event.currentTarget;
          }}
          onClick={(event) => {
            const isDirectOverlayClick = event.target === event.currentTarget;
            if (isDirectOverlayClick && shouldCloseOnOverlayClickRef.current) {
              closeModal();
            }
            shouldCloseOnOverlayClickRef.current = false;
          }}
        >
          <div
            className="admin-create-modal"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-create-modal-header">
              <h3>Edit Section</h3>
              <button
                type="button"
                className="admin-create-close"
                onClick={closeModal}
              >
                <X size={18} />
              </button>
            </div>

            <form className="admin-create-form" onSubmit={handleSubmit}>
              <label>
                Section name
                <input
                  required
                  value={label}
                  onChange={(event) => setLabel(event.target.value)}
                  placeholder="Hero"
                />
              </label>

              <label>
                Subtitle
                <input
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Short description for this section page"
                />
              </label>

              <label>
                Count label
                <input
                  value={countLabel}
                  onChange={(event) => setCountLabel(event.target.value)}
                  placeholder="Hero (24)"
                />
              </label>

              <label>
                Icon key
                <select
                  value={iconKey}
                  onChange={(event) => setIconKey(event.target.value)}
                >
                  <option value="">Auto / none</option>
                  {CATALOG_ICON_KEY_OPTIONS.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </label>

              {error ? <p className="admin-create-error">{error}</p> : null}

              <button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save Section"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
