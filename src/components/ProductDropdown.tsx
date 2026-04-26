import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { ChevronDown } from "lucide-react";

export type ProductDropdownOption = {
  value: string;
  label: string;
};

type ProductDropdownProps = {
  value: string;
  options: ProductDropdownOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
};

export default function ProductDropdown({
  value,
  options,
  onChange,
  ariaLabel,
}: ProductDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(
    () => options.find((option) => option.value === value) ?? options[0],
    [options, value]
  );

  useEffect(() => {
    const selectedIndex = options.findIndex((option) => option.value === selected?.value);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [options, selected]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (containerRef.current.contains(event.target as Node)) return;
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const selectOption = (nextValue: string) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!options.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      setActiveIndex((prev) => (prev + 1) % options.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      setActiveIndex((prev) => (prev - 1 + options.length) % options.length);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      const option = options[activeIndex];
      if (option) selectOption(option.value);
      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="product-dropdown" ref={containerRef}>
      <button
        type="button"
        className={`product-dropdown-toggle ${isOpen ? "open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={onKeyDown}
      >
        <span className="product-dropdown-value">{selected?.label ?? ""}</span>
        <ChevronDown size={14} className="product-dropdown-icon" />
      </button>

      {isOpen && (
        <div
          className="product-dropdown-menu"
          role="listbox"
          aria-label={ariaLabel}
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
        >
          {options.map((option, index) => (
            <button
              type="button"
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={`product-dropdown-option ${option.value === value ? "selected" : ""} ${
                index === activeIndex ? "active" : ""
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                selectOption(option.value);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
