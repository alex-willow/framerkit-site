import {
  Sun,
  Moon,
  Paintbrush,
  SquareDashed,
  ArrowUpDown,
  Gift,
  Lock,
  Search,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  hideTitle?: boolean;
  availabilityFilter?: "paid" | "free";
  onAvailabilityFilterChange?: (filter: "paid" | "free") => void;
  sortDirection?: "asc" | "desc";
  onSortDirectionChange?: (direction: "asc" | "desc") => void;
  controlsAlign?: "distributed" | "left";
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  searchPlaceholder?: string;
};

type ModeToggleProps = {
  isActive: boolean;
  onToggle: () => void;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
  activeLabel: string;
  inactiveLabel: string;
};

const resetControlInteraction = (target?: EventTarget | null) => {
  if (target instanceof HTMLElement) {
    target.blur();
    return;
  }
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
};

function ModeToggle({
  isActive,
  onToggle,
  activeIcon,
  inactiveIcon,
  activeLabel,
  inactiveLabel,
}: ModeToggleProps) {
  return (
    <>
      <button
        type="button"
        className={`component-theme-toggle-btn ${isActive ? "active" : ""}`}
        onClick={() => {
          onToggle();
        }}
        onMouseUp={(event) => resetControlInteraction(event.currentTarget)}
        aria-label={isActive ? activeLabel : inactiveLabel}
      >
        {isActive ? activeIcon : inactiveIcon}
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
          onMouseUp={(event) => resetControlInteraction(event.currentTarget)}
          type="button"
          aria-label="Wireframe mode"
        >
          <SquareDashed size={16} strokeWidth={2} />
          <span>Wireframe</span>
        </button>
        <button
          className={`mode-toggle-btn ${!isWireframeMode ? 'active' : ''}`}
          onClick={() => onWireframeModeChange(false)}
          onMouseUp={(event) => resetControlInteraction(event.currentTarget)}
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

function AvailabilityToggle({
  value,
  onChange,
}: {
  value: "paid" | "free";
  onChange: (next: "paid" | "free") => void;
}) {
  return (
    <div className="availability-toggle-wrapper">
      <div className="availability-toggle-group">
        <button
          className={`availability-toggle-btn ${value === "free" ? "active" : ""}`}
          onClick={() => onChange("free")}
          onMouseUp={(event) => resetControlInteraction(event.currentTarget)}
          type="button"
          aria-label="Show free only"
        >
          <Gift size={14} strokeWidth={2} />
          Free
        </button>
        <button
          className={`availability-toggle-btn ${value === "paid" ? "active" : ""}`}
          onClick={() => onChange("paid")}
          onMouseUp={(event) => resetControlInteraction(event.currentTarget)}
          type="button"
          aria-label="Show all"
        >
          <Lock size={14} strokeWidth={2} />
          All
        </button>
      </div>
    </div>
  );
}

function SortToggle({
  direction,
  onChange,
}: {
  direction: "asc" | "desc";
  onChange: (next: "asc" | "desc") => void;
}) {
  const isDesc = direction === "desc";
  return (
    <button
      type="button"
      className={`section-sort-toggle-btn ${isDesc ? "active" : ""}`}
      onClick={() => onChange(isDesc ? "asc" : "desc")}
      onMouseUp={(event) => resetControlInteraction(event.currentTarget)}
      aria-label={isDesc ? "Descending order" : "Ascending order"}
    >
      <ArrowUpDown size={16} strokeWidth={2} />
    </button>
  );
}

function InlineSearch({
  value,
  onChange,
  placeholder = "Search...",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(Boolean(value));
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (value && !isExpanded) {
      setIsExpanded(true);
    }
  }, [isExpanded, value]);

  useEffect(() => {
    if (!isExpanded) return;
    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, [isExpanded]);

  const collapseIfEmpty = () => {
    if (!value.trim()) {
      setIsExpanded(false);
    }
  };

  return (
    <div
      className={`section-inline-search-shell ${
        isExpanded ? "is-expanded" : "is-collapsed"
      }`}
    >
      <button
        type="button"
        className={`section-inline-search-collapsed ${
          isExpanded ? "is-hidden" : "is-active"
        }`}
        onClick={() => setIsExpanded(true)}
        onMouseUp={(event) => resetControlInteraction(event.currentTarget)}
        aria-label="Open search"
        aria-hidden={isExpanded}
        tabIndex={isExpanded ? -1 : 0}
      >
        <Search className="section-inline-search-icon" size={15} strokeWidth={2} />
      </button>
      <div
        className={`section-inline-search-expanded ${
          isExpanded ? "is-active" : "is-hidden"
        }`}
        aria-hidden={!isExpanded}
      >
        <div className="section-inline-search-expanded-icon">
          <Search className="section-inline-search-icon" size={15} strokeWidth={2} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={collapseIfEmpty}
          placeholder={placeholder}
          aria-label={placeholder}
          autoComplete="off"
          tabIndex={isExpanded ? 0 : -1}
        />
        {value ? (
          <button
            type="button"
            className="section-inline-search-clear"
            onClick={() => onChange("")}
            onMouseUp={(event) => resetControlInteraction(event.currentTarget)}
            aria-label="Clear search"
            tabIndex={isExpanded ? 0 : -1}
          >
            <X size={14} strokeWidth={2} />
          </button>
        ) : null}
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
  hideTitle = false,
  availabilityFilter,
  onAvailabilityFilterChange,
  sortDirection,
  onSortDirectionChange,
  controlsAlign = "distributed",
  searchValue,
  onSearchValueChange,
  searchPlaceholder,
}: SectionHeaderProps) {
  useEffect(() => {
    const clearInteraction = () => resetControlInteraction();
    const handleVisibilityChange = () => {
      if (document.hidden) clearInteraction();
    };

    window.addEventListener("blur", clearInteraction);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("blur", clearInteraction);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

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
          window.dispatchEvent(
            new CustomEvent("framerkit-component-theme-change", {
              detail: { theme: nextTheme },
            })
          );
        }}
        activeIcon={<Moon size={20} strokeWidth={2} />}
        inactiveIcon={<Sun size={20} strokeWidth={2} />}
        activeLabel="Dark theme"
        inactiveLabel="Light theme"
      />
    ) : null;

  const availabilityControl =
    availabilityFilter && onAvailabilityFilterChange ? (
      <AvailabilityToggle
        value={availabilityFilter}
        onChange={onAvailabilityFilterChange}
      />
    ) : null;

  const sortControl =
    sortDirection && onSortDirectionChange ? (
      <SortToggle direction={sortDirection} onChange={onSortDirectionChange} />
    ) : null;

  const searchControl =
    typeof searchValue === "string" && onSearchValueChange ? (
      <InlineSearch
        value={searchValue}
        onChange={onSearchValueChange}
        placeholder={searchPlaceholder}
      />
    ) : null;

  return (
    <>
      <div className={`section-header-sticky ${searchControl ? "section-header-sticky--with-search" : ""}`}>
        <div
          className={`section-header-row ${
            renderMetaBelow ? "section-header-row--controls" : ""
          } ${searchControl ? "section-header-row--with-search" : ""}`}
        >
          {renderMetaBelow ? (
            <>
              {controlsAlign === "left" ? (
                <>
                  <div className="section-header-controls-left section-header-inline-controls">
                    {searchControl}
                    {availabilityControl}
                    {wireframeControl}
                    {sortControl}
                    {themeControl}
                  </div>
                  <div className="section-header-controls-right" />
                </>
              ) : (
                <>
                  <div className="section-header-controls-left section-header-inline-controls">
                    {wireframeControl}
                    {themeControl}
                  </div>
                  <div className="section-header-controls-center section-header-inline-controls" />
                  <div className="section-header-controls-right section-header-inline-controls">
                    {searchControl}
                    {availabilityControl}
                    {sortControl}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {!hideTitle && (
                <div className="section-header-left">
                  <h2 className="section-title">{title}</h2>
                  <p className="section-subtitle">{metaText}</p>
                </div>
              )}
              <div className="section-header-right" style={hideTitle ? { marginLeft: 'auto' } : undefined}>
                {searchControl}
                {availabilityControl}
                {wireframeControl}
                {sortControl}
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
