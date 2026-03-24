export const SECTION_TYPES = [
  "hero",
  "intro",
  "services",
  "whyChoose",
  "investment",
  "clientLogos",
  "cta",
  "contact",
  "aboutHero",
  "aboutVisionMission",
  "aboutAdvantage",
  "aboutValues",
  "contactHero",
  "contactInquiry",
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

export type PageSection = {
  id: string;
  type: SectionType;
  order: number;
  data: Record<string, unknown>;
};
