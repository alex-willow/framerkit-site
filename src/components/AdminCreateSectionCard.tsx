import { useRef, useState, type FormEvent } from "react";
import { Plus, X } from "lucide-react";
import { CATALOG_ADMIN_ENDPOINT } from "../lib/env";
import { buildAdminHeaders } from "../lib/adminApi";
import type { CatalogGroup } from "../shared/catalogManifest";
import { CATALOG_ICON_KEY_OPTIONS } from "../shared/catalogIconKeys";

type AdminCreateSectionCardProps = {
  group: CatalogGroup;
  theme: "light" | "dark";
  isAdmin: boolean;
};

const normalizeSectionId = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-_]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export default function AdminCreateSectionCard({
  group,
  theme,
  isAdmin,
}: AdminCreateSectionCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [iconKey, setIconKey] = useState("");
  const shouldCloseOnOverlayClickRef = useRef(false);

  if (!isAdmin) return null;

  const closeModal = () => {
    setShowModal(false);
    setSubmitting(false);
    setError(null);
    setLabel("");
    setDescription("");
    setIconKey("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!CATALOG_ADMIN_ENDPOINT) {
      setError("VITE_CATALOG_ADMIN_ENDPOINT is not configured.");
      return;
    }

    const adminAuthToken = localStorage.getItem("framerkitAdminAuth") || "";
    const isAdmin = localStorage.getItem("framerkitAdmin") === "true";
    if (!adminAuthToken || !isAdmin) {
      setError("Admin session not found. Sign in as admin first.");
      return;
    }

    const nextLabel = label.trim();
    const nextId = normalizeSectionId(nextLabel);
    if (!nextLabel || !nextId) {
      setError("Section name is required.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(CATALOG_ADMIN_ENDPOINT, {
        method: "POST",
        headers: buildAdminHeaders(adminAuthToken),
        body: JSON.stringify({
          action: "create_section",
          group,
          id: nextId,
          label: nextLabel,
          description: description || undefined,
          jsonKey: nextId,
          iconKey: iconKey || undefined,
        }),
      });

      const responseJson = (await response.json().catch(() => null)) as
        | { error?: string; section?: Partial<{ id: string; label: string; jsonKey: string; description: string; iconKey: string; countLabel: string }> }
        | null;

      if (!response.ok) {
        setError(responseJson?.error || "Failed to create section.");
        return;
      }

      const optimisticSection = {
        id: nextId,
        label: nextLabel,
        jsonKey: nextId,
        description: description || undefined,
        iconKey: iconKey || undefined,
      };

      window.dispatchEvent(
        new CustomEvent("framerkit-manifest-append-section", {
          detail: {
            group,
            section: responseJson?.section || optimisticSection,
          },
        })
      );
      window.dispatchEvent(new Event("framerkit-manifest-refresh"));
      closeModal();
    } catch (submitError) {
      console.error(submitError);
      setError("Failed to create section. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={`card card-admin-create ${theme === "dark" ? "card-dark" : "card-light"}`}
        onClick={() => setShowModal(true)}
      >
        <div className="cardImage card-admin-create-image">
          <Plus size={30} />
        </div>
        <div className="cardInfo">
          <h3>Create New Section</h3>
        </div>
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
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-create-modal-header">
              <h3>Create Section</h3>
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
                  placeholder="Views"
                />
              </label>

              <label>
                Subtitle (for opened page)
                <input
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Short description for this section page"
                />
              </label>

              <label>
                Icon key (for plugin)
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
                {submitting ? "Creating..." : "Create Section"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
