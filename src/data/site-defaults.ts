/** Shared defaults for seed + UI fallback when DB is empty. */
export const defaultNavItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const defaultFooterColumns = [
  {
    title: "Quick Links",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Services", href: "/services" },
      { label: "Investment Portfolio", href: "/about" },
      { label: "Latest Insights", href: "/contact" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "UAE Company Setup", href: "/services" },
      { label: "Global Trade Compliance", href: "/services" },
      { label: "Fintech Advisory", href: "/services" },
      { label: "Security Consulting", href: "/services" },
    ],
  },
  {
    title: "Contact Information",
    contact: [
      { type: "location" as const, value: "Level 42, Emirates Towers, Sheikh Zayed Rd, Dubai, UAE" },
      { type: "phone" as const, value: "+971 4 000 0000" },
      { type: "mail" as const, value: "info@owtc-fze.com" },
    ],
  },
];

export const defaultFooterMeta = {
  brand: "OWTC FZE",
  description:
    "Leading provider of strategic corporate services and investment management within the UAE free zone ecosystem.",
  social: ["in", "x", "yt"],
  copyright: "© 2024 One World Trade Centre FZE. All Rights Reserved.",
  legal: ["Privacy Policy", "Terms of Service"],
};
