// components/IconPicker.tsx
"use client";

import { icons } from "lucide-react";
import { useState } from "react";

type Props = {
  value: unknown;
  onChange: (val: string) => void;
};

export default function IconPicker({ value, onChange }: Props) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const selectedValue = typeof value === "string" ? value : "";

  const iconEntries = Object.entries(icons)
    .filter(([name]) => name.toLowerCase().includes(search.toLowerCase()))
    .map(([name, Icon]) => [name, Icon] as const);

  return (
    <div style={{ position: "relative" }}>
      {/* Trigger */}
      <button type="button" onClick={() => setOpen(!open)}>
        {selectedValue || "Select Icon"}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            background: "#fff",
            border: "1px solid #ccc",
            padding: 10,
            width: 250,
            maxHeight: 300,
            overflow: "auto",
          }}
        >
          {/* Search */}
          <input
            placeholder="Search icon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", marginBottom: 8 }}
          />

          {/* Icons */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
            {iconEntries.slice(0, 100).map(([name, Icon]) => (
              <button
                key={name}
                type="button"
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