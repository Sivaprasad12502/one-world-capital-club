export const SECTION_TYPES = [
  "hero",
  "intro",
  "services",
  "servicesGrid",
  "servicesCTA",
  "whyChoose",
  "investment",
  "clientLogos",
  "cta",
  "contact",
  "aboutHero",
  "aboutIntro",
  "aboutCTA",
  "aboutVisionMission",
  "aboutAdvantage",
  "aboutValues",
  "contactHero",
  "contactInquiry",
  "servicesHero",
  "industriesHero",
  "industriesGrid",
  "industriesCta",
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

export type PageSection = {
  id: string;
  type: SectionType;
  order: number;
  data: Record<string, unknown>;
};
