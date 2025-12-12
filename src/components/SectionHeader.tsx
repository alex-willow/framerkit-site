import { Sun, Moon } from "lucide-react";

type SectionHeaderProps = {
  title: string;
  count: number;
  filter?: "light" | "dark";  // опционально
  onFilterChange?: (filter: "light" | "dark") => void;
  loading: boolean;
  hideThemeSwitcher?: boolean; // новый пропс для скрытия темы
  templateLabel?: string;      // можно писать "templates" вместо "layouts"
};

export default function SectionHeader({
  title,
  count,
  filter = "light",
  onFilterChange,
  loading,
  hideThemeSwitcher = false,
  templateLabel = "layouts"
}: SectionHeaderProps) {
  return (
    <div className="section-header-sticky">
      <h2 className="title">{title}</h2>
      <div className="subtitleRow">
        <p className="subtitle">
          {loading
            ? "Loading..."
            : `${count} ${templateLabel}`}{!hideThemeSwitcher && onFilterChange ? ` in the "${filter === "light" ? "Light" : "Dark"}" theme` : ""}
        </p>

        {!hideThemeSwitcher && onFilterChange && (
          <div className="themeSwitcher">
            <span className="modeLabel">Mode:</span>
            <button
              className="themeToggle"
              onClick={() => onFilterChange(filter === "light" ? "dark" : "light")}
              style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {filter === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        )}
      </div>
      <div className="title-divider" />
    </div>
  );
}
