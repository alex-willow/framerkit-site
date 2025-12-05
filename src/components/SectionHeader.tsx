import { Sun, Moon } from "lucide-react";

type SectionHeaderProps = {
  title: string;
  count: number;
  filter: "light" | "dark";
  onFilterChange: (filter: "light" | "dark") => void;
  loading: boolean;
};

export default function SectionHeader({
  title,
  count,
  filter,
  onFilterChange,
  loading
}: SectionHeaderProps) {
  return (
    <div className="section-header-sticky">
      <h2 className="title">{title}</h2>
      <div className="subtitleRow">
        <p className="subtitle">
          {loading ? "Loading..." : `${count} layouts`} in the "{filter === "light" ? "Light" : "Dark"}" theme
        </p>
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
      </div>
      <div className="title-divider" />
    </div>
  );
}
