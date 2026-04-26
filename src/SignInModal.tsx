import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import "./SignInModal.css";
import {
  CATALOG_ADMIN_ENDPOINT,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
} from "./lib/env";
import { buildAdminHeaders } from "./lib/adminApi";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
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
      mouseDownInside.current = true;
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

    const cleanEmail = email.trim();
    const cleanKey = key.trim();

    try {
      const isAdminAttempt = !cleanEmail.includes("@");
      const tryAdminAuth = async (): Promise<"ok" | "invalid" | "error" | "disabled"> => {
        if (!CATALOG_ADMIN_ENDPOINT) return "disabled";
        try {
          const credentials = btoa(`${cleanEmail}:${cleanKey}`);
          const response = await fetch(CATALOG_ADMIN_ENDPOINT, {
            method: "POST",
            headers: buildAdminHeaders(credentials),
            body: JSON.stringify({ action: "auth" }),
          });

          if (response.status === 401) return "invalid";
          if (!response.ok) return "error";
          const payload = (await response.json()) as { ok?: boolean };
          return payload.ok === true ? "ok" : "invalid";
        } catch {
          return "error";
        }
      };

      const adminAuthStatus = await tryAdminAuth();
      const isAdmin = adminAuthStatus === "ok";
      if (isAdmin) {
        const adminAuthToken = btoa(`${cleanEmail}:${cleanKey}`);
        localStorage.setItem("rememberedEmail", cleanEmail);
        localStorage.setItem("rememberedKey", "__admin__");
        localStorage.setItem("framerkitAdmin", "true");
        localStorage.setItem("framerkitAdminAuth", adminAuthToken);
        onLogin();
        onClose();
        return;
      }

      if (isAdminAttempt) {
        if (adminAuthStatus === "disabled") {
          setErrorMessage("Admin endpoint is not configured.");
        } else if (adminAuthStatus === "invalid") {
          setErrorMessage("Invalid admin login or password.");
        } else {
          setErrorMessage("Admin auth is unavailable now. Please try again.");
        }
        return;
      }

      const { data: users, error } = await supabase
        .from("framer_kit")
        .select("*")
        .eq("email", cleanEmail)
        .eq("key", cleanKey);

      if (error) {
        setErrorMessage("Database error. Please try again.");
      } else if (!users || users.length === 0) {
        setErrorMessage("Invalid Email or License Key");
      } else {
        // ✅ Автоматически активируем текущее устройство (перехват лицензии)
        const { error: updateError } = await supabase
          .from("framer_kit")
          .update({ site_status: "active" })
          .eq("email", cleanEmail)
          .eq("key", cleanKey);

        if (updateError) {
          setErrorMessage("Failed to activate license. Please try again.");
        } else {
          localStorage.setItem("rememberedEmail", cleanEmail);
          localStorage.setItem("rememberedKey", cleanKey);
          localStorage.removeItem("framerkitAdmin");
          localStorage.removeItem("framerkitAdminAuth");

          onLogin();
          onClose();
        }
      }
    } catch {
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // 🔑 Переход к секции покупки
  const goToPricing = () => {
    const el = document.getElementById("get-framerkit");
    if (el) {
      el.scrollIntoView({ behavior: "auto", block: "start" });
      onClose();
      return;
    }

    navigate("/#get-framerkit");
    onClose();
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
          <label className="auth-label">Email or Admin Login</label>
          <input
            className="auth-input"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email or admin login"
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
            className={`authButton auth-button ${loading ? "loading" : ""}`}
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
