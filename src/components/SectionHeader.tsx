import { Sun, Moon, Paintbrush, SquareDashed } from "lucide-react";
import { useState } from "react"; // ← добавили useState

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
};

type ModeToggleProps = {
  label: string;
  isActive: boolean;
  onToggle: () => void;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
  activeLabel: string;
  inactiveLabel: string;
};

function ModeToggle({
  label,
  isActive,
  onToggle,
  activeIcon,
  inactiveIcon,
  activeLabel,
  inactiveLabel,
}: ModeToggleProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      <span className="mode-label">{label}</span>
      <button
        type="button"
        className={`iconButton ${isActive ? "active" : ""}`}
        onClick={onToggle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        aria-label={isActive ? activeLabel : inactiveLabel}
        title=""
      >
        {isActive ? activeIcon : inactiveIcon}
        
        {/* Отдельный класс toggle-tooltip — стили выше */}
        {showTooltip && (
          <div className="toggle-tooltip">
            {isActive ? activeLabel : inactiveLabel}
            {/* Стрелка через ::after в CSS */}
          </div>
        )}
      </button>
    </>
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
}: SectionHeaderProps) {
  return (
    <div className="section-header-sticky">
      <div className="section-header-row">
        <div className="section-header-left">
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">
            {loading ? "Loading..." : `${count} ${templateLabel}`}
            {!hideThemeSwitcher && onFilterChange && (
              <> · {filter === "light" ? "Light" : "Dark"} theme</>
            )}
            {!hideWireframeToggle && onWireframeModeChange && (
              <> · {isWireframeMode ? "Wireframe" : "Design"} view</>
            )}
          </p>
        </div>

        <div className="section-header-right">
          {!hideWireframeToggle && onWireframeModeChange && (
            <ModeToggle
              label="View"
              isActive={isWireframeMode}
              onToggle={() => onWireframeModeChange(!isWireframeMode)}
              activeIcon={<SquareDashed size={18} strokeWidth={2} />}
              inactiveIcon={<Paintbrush size={18} strokeWidth={2} />}
              activeLabel="Design view"
              inactiveLabel="Wireframe view"
            />
          )}

          {!hideThemeSwitcher && onFilterChange && (
            <ModeToggle
              label="Theme"
              isActive={filter === "dark"}
              onToggle={() => onFilterChange(filter === "light" ? "dark" : "light")}
              activeIcon={<Moon size={18} />}
              inactiveIcon={<Sun size={18} />}
              activeLabel="Dark theme"
              inactiveLabel="Light theme"
            />
          )}
        </div>
      </div>

      <div className="section-header-divider" />
    </div>
  );
}