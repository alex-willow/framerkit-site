import { Sun, Moon, Paintbrush, SquareDashed } from "lucide-react";
import { useState, useEffect } from "react";

type SectionHeaderProps = {
  title: string;
  count: number;
  filter?: "light" | "dark";
  onFilterChange?: (filter: "light" | "dark") => void;
  loading: boolean;
  hideThemeSwitcher?: boolean;
  templateLabel?: string;
  isWireframeMode?: boolean;
  onWireframeModeChange?: (mode: boolean) => void;
  hideWireframeToggle?: boolean;
  renderMetaBelow?: boolean;
};

type ModeToggleProps = {
  isActive: boolean;
  onToggle: () => void;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
  activeLabel: string;
  inactiveLabel: string;
};

function ModeToggle({
  isActive,
  onToggle,
  activeIcon,
  inactiveIcon,
  activeLabel,
  inactiveLabel,
}: ModeToggleProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) setShowTooltip(false);
    };
    const handleBlur = () => setShowTooltip(false);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        className={`theme-toggle-btn ${isActive ? "active" : ""}`}
        onClick={() => {
          setShowTooltip(false);
          onToggle();
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label={isActive ? activeLabel : inactiveLabel}
        title=""
      >
        {isActive ? activeIcon : inactiveIcon}
        {showTooltip && (
          <div className="toggle-tooltip theme-toggle-tooltip">
            {isActive ? activeLabel : inactiveLabel}
          </div>
        )}
      </button>
    </>
  );
}

// 🔥 Новый компонент: сегментированные кнопки Wireframe/Design
function WireframeToggle({
  isWireframeMode,
  onWireframeModeChange,
}: {
  isWireframeMode: boolean;
  onWireframeModeChange: (mode: boolean) => void;
}) {
  return (
    <div className="mode-toggle-wrapper">
      <div className="mode-toggle-group">
        <button
          className={`mode-toggle-btn ${isWireframeMode ? 'active' : ''}`}
          onClick={() => onWireframeModeChange(true)}
          type="button"
          aria-label="Wireframe mode"
        >
          <SquareDashed size={16} strokeWidth={2} />
          <span>Wireframe</span>
        </button>
        <button
          className={`mode-toggle-btn ${!isWireframeMode ? 'active' : ''}`}
          onClick={() => onWireframeModeChange(false)}
          type="button"
          aria-label="Design mode"
        >
          <Paintbrush size={16} strokeWidth={2} />
          <span>Design</span>
        </button>
      </div>
    </div>
  );
}

export default function SectionHeader({
  title,
  count,
  filter = "light",
  onFilterChange,
  loading,
  hideThemeSwitcher = false,
  templateLabel = "layouts",
  isWireframeMode = false,
  onWireframeModeChange,
  hideWireframeToggle = false,
  renderMetaBelow = false,
}: SectionHeaderProps) {
  const metaText = loading ? "Loading..." : `${count} ${templateLabel}`;

  const wireframeControl =
    !hideWireframeToggle && onWireframeModeChange ? (
      <WireframeToggle
        isWireframeMode={isWireframeMode}
        onWireframeModeChange={onWireframeModeChange}
      />
    ) : null;

  const themeControl =
    !hideThemeSwitcher && onFilterChange ? (
      <ModeToggle
        isActive={filter === "dark"}
        onToggle={() => {
          const nextTheme = filter === "light" ? "dark" : "light";
          onFilterChange(nextTheme);
          // Save to localStorage like landing page
          localStorage.setItem("theme", nextTheme);
          // Dispatch global event for other components
          window.dispatchEvent(
            new CustomEvent("themeChange", { detail: { theme: nextTheme } })
          );
          window.dispatchEvent(
            new CustomEvent("framerkit-theme-change", { detail: nextTheme })
          );
        }}
        activeIcon={<Moon size={20} color="#4c1d95" strokeWidth={2} />}
        inactiveIcon={<Sun size={20} color="#374151" strokeWidth={2} />}
        activeLabel="Dark theme"
        inactiveLabel="Light theme"
      />
    ) : null;

  return (
    <>
      <div className="section-header-sticky">
        <div className="section-header-row">
          {renderMetaBelow ? (
            <>
              <div className="section-header-controls-left">{wireframeControl}</div>
              <div className="section-header-controls-right">{themeControl}</div>
            </>
          ) : (
            <>
              <div className="section-header-left">
                <h2 className="section-title">{title}</h2>
                <p className="section-subtitle">{metaText}</p>
              </div>
              <div className="section-header-right">
                {wireframeControl}
                {themeControl}
              </div>
            </>
          )}
        </div>
        <div className="section-header-divider" />
      </div>
    </>
  );
}