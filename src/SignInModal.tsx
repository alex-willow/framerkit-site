import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom"; // 👈 добавили
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
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const modalRef = useRef<HTMLDivElement>(null);
  const mouseDownInside = useRef(false);

  useEffect(() => {
    if (isOpen) setShowModal(true);
    else setShowModal(false);
  }, [isOpen]);

  useEffect(() => {
    document.body.setAttribute("data-framer-theme", theme);
    return () => document.body.removeAttribute("data-framer-theme");
  }, [theme]);
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current?.contains(e.target as Node)) {
      mouseDownInside.current = true; // ✅ правильно
    } else {
      mouseDownInside.current = false;
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mouseDownInside.current) {
      mouseDownInside.current = false;
      return;
    }
    if (!modalRef.current?.contains(e.target as Node)) {
      onClose();
    }
  };

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
          setLoading(false);
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

// 🔑 НОВАЯ ФУНКЦИЯ: переход к секции "get-framerkit"
const goToPricing = () => {
  if (location.pathname === "/") {
    // Уже на главной → скроллим к секции
    const el = document.getElementById("get-framerkit");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // Закрываем модалку
    onClose();
  } else {
    // На другой странице → переходим на главную с хэшем
    navigate("/#get-framerkit");
    // Закрываем модалку
    onClose();
  }
};


  if (!isOpen) return null;

  return createPortal(
    <div
      className="modalOverlay"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className={`auth-card ${showModal ? "show" : ""}`} ref={modalRef}>
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
          <button
            type="button"
            className="auth-link"
            onClick={goToPricing}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              textDecoration: "underline",
              padding: 0,
              font: "inherit",
            }}
          >
            Get one here
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}