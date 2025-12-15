import { Menu } from "lucide-react";

type HeaderProps = {
  isMobile: boolean;
  onMenuToggle: () => void;
};

export default function Header({ isMobile, onMenuToggle }: HeaderProps) {
  if (!isMobile) return null; // Отображаем только на мобильных

  return (
    <header className="header">
      <div
        className="headerLeft"
        onClick={() => (window.location.href = "/")}
        style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
      >
        <img src="/Logo.png" alt="FramerKit" className="logo" style={{ height: "32px" }} />
        <h1 style={{ fontSize: "20px", margin: 0 }}>FramerKit</h1>
      </div>

      <button
        className="hamburgerButton"
        onClick={onMenuToggle}
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        <Menu size={24} />
      </button>
    </header>
  );
}
