/** Shared defaults for seed + UI fallback when DB is empty. */
export const defaultNavItems = [
  { label: "Home", href: "/" },
  { label: "Industries", href: "/industries" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const defaultFooterColumns = [
  {
    title: "Navigation",
    links: [
      { label: "Our Investment Philosophy", href: "/about" },
      { label: "Strategic Partnership", href: "/services" },
      { label: "Sustainability Report", href: "/about" },
      { label: "Global Presence", href: "/contact" },
    ],
  },
  {
    title: "Offices",
    contact: [
      { type: "location" as const, value: "Dubai, United Arab Emirates" },
      { type: "location" as const, value: "London, United Kingdom" },
      { type: "location" as const, value: "Singapore" },
      { type: "location" as const, value: "New York, USA" },
    ],
  },
];

export const defaultFooterMeta = {
  brand: "ONE WORLD CAPITAL CLUB",
  description:
    "Premium investment and advisory firm dedicated to global development and innovative excellence.",
  social: [
    { icon: "globe", label: "Global", href: "/contact" },
    { icon: "mail", label: "Email", href: "/contact" },
    { icon: "phone", label: "Phone", href: "/contact" },
  ],
  copyright: "© 2024 ONE WORLD CAPITAL CLUB L.L.C FZE. ALL RIGHTS RESERVED.",
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};
