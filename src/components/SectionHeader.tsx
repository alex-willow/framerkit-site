import { Sun, Moon } from "lucide-react";

type SectionHeaderProps = {
  title: string;
  count: number;
  filter?: "light" | "dark";
  onFilterChange?: (filter: "light" | "dark") => void;
  loading: boolean;
  hideThemeSwitcher?: boolean;
  templateLabel?: string;
};

export default function SectionHeader({
  title,
  count,
  filter = "light",
  onFilterChange,
  loading,
  hideThemeSwitcher = false,
  templateLabel = "layouts",
}: SectionHeaderProps) {
  return (
    <div className="section-header-sticky">
      <div className="section-header-row">
        {/* LEFT */}
        <div className="section-header-left">
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">
            {loading ? "Loading..." : `${count} ${templateLabel}`}
            {!hideThemeSwitcher && onFilterChange && (
              <> · {filter === "light" ? "Light" : "Dark"} theme</>
            )}
          </p>
        </div>

        {/* RIGHT */}
        {!hideThemeSwitcher && onFilterChange && (
          <div className="section-header-right">
            <span className="mode-label">Mode</span>
            <button
          className="theme-toggle iconButton"
          onClick={() =>
            onFilterChange(filter === "light" ? "dark" : "light")
          }
        >
          {filter === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

          </div>
        )}
      </div>

      <div className="section-header-divider" />
    </div>
  );
}
