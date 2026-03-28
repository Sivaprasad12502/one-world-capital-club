// components/IconPicker.tsx
"use client";

import { icons, type LucideIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  value: unknown;
  onChange: (val: string) => void;
};

export default function IconPicker({ value, onChange }: Props) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const selectedValue = typeof value === "string" ? value : "";
  const SelectedIcon = selectedValue
    ? (icons[selectedValue as keyof typeof icons] as LucideIcon | undefined)
    : undefined;

  const iconEntries = Object.entries(icons)
    .filter(([name]) => name.toLowerCase().includes(search.toLowerCase()))
    .map(([name, Icon]) => [name, Icon] as const);

  return (
    <div className="admin-icon-picker">
      <button
        type="button"
        className="admin-icon-picker__trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Choose icon"
      >
        <span className="admin-icon-picker__trigger-content">
          {SelectedIcon ? <SelectedIcon size={16} /> : null}
          {selectedValue || "Select icon"}
        </span>
        <span className="admin-icon-picker__caret" aria-hidden="true">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div className="admin-icon-picker__panel">
          <input
            placeholder="Search icon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-icon-picker__search"
          />

          <div className="admin-icon-picker__grid">
            {iconEntries.slice(0, 100).map(([name, Icon]) => (
              <button
                key={name}
                type="button"
                className={`admin-icon-picker__item ${selectedValue === name ? "is-selected" : ""}`}
                title={name}
                aria-label={name}
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                }}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
