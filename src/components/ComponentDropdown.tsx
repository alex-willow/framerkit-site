// src/components/ComponentDropdown.tsx
import { useState, useEffect, useRef } from "react";
import "../App.css";

type ComponentDropdownProps = {
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
};

export default function ComponentDropdown({ options, value, onChange }: ComponentDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="component-dropdown-container" ref={ref}>
      <button
        className={`component-dropdown-toggle ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{options.find(opt => opt.value === value)?.label || value}</span>

        <svg
          className={`component-dropdown-arrow ${open ? "rotated" : ""}`}
          width="12"
          height="6"
          viewBox="0 0 12 6"
          fill="none"
        >
          <path d="M1 1L6 5L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="component-dropdown-list">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`component-dropdown-option ${value === opt.value ? "active" : ""}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}