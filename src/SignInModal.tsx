import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { createPortal } from "react-dom";
import "./SignInModal.css";

const supabase = createClient(
  "https://ibxakfxqoqiypfhgkpds.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlieGFrZnhxb3FpeXBmaGdrcGRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MTQxMDcsImV4cCI6MjA1NjM5MDEwN30.tWculxF6xgGw4NQEWPBp7uH_gsl5HobP9wQn3Tf9yyw"
);

type SignInModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  theme?: "light" | "dark";
};

export default function SignInModal({
  isOpen,
  onClose,
  onLogin,
  theme = "light",
}: SignInModalProps) {
  const [email, setEmail] = useState("");
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.setAttribute("data-framer-theme", theme);
    return () => document.body.removeAttribute("data-framer-theme");
  }, [theme]);

  // Закрытие по клику вне модалки
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const { data: users, error } = await supabase
        .from("framer_kit")
        .select("*")
        .eq("email", email.trim())
        .eq("key", key.trim());

      if (error) {
        setErrorMessage("Database error. Please try again.");
      } else if (!users || users.length === 0) {
        setErrorMessage("Invalid Email or License Key");
      } else {
        const user = users[0];
        if (user.site_status === "active") {
          setErrorMessage("This account is already active on another device.");
          return;
        }

        await supabase
        .from("framer_kit")
        .update({ site_status: "active" })
        .eq("email", email.trim());

        localStorage.setItem("rememberedEmail", email.trim());
        localStorage.setItem("rememberedKey", key.trim());

        onLogin();
        onClose();
      }
    } catch {
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="modalOverlay" onClick={handleOverlayClick}>
      <div className="auth-card" ref={modalRef}>
        <img className="auth-logo" src="/Logo.png" alt="Logo" />
        <h2 className="auth-title">Sign in to FramerKit</h2>
        <p className="auth-description">
          Enter your email and license key to access your components.
        </p>
        <form className="auth-form" onSubmit={handleLogin}>
          <label className="auth-label">Email</label>
          <input
            className="auth-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
          <label className="auth-label">License Key</label>
          <input
            className="auth-input"
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
            placeholder="Enter your license key"
          />
          {errorMessage && <p className="auth-error">{errorMessage}</p>}
          <button
            type="submit"
            className={`auth-button ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="auth-footer">
          No license key?{" "}
          <a
            className="auth-link"
            href="https://gum.co/framerkit"
            target="_blank"
          >
            Get one here
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}
