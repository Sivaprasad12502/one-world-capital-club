import { z } from "zod";
import { SECTION_TYPES, type SectionType } from "@/types/section";

const navItemSchema = z.object({
  label: z.string(),
  href: z.string(),
  active: z.boolean().optional(),
});

const footerLinkColumnSchema = z.object({
  title: z.string(),
  links: z.array(z.object({ label: z.string(), href: z.string() })),
});

const footerContactColumnSchema = z.object({
  title: z.string(),
  contact: z.array(
    z.object({
      type: z.enum(["location", "phone", "mail"]),
      value: z.string(),
    }),
  ),
});

export const heroDataSchema = z.object({
  badge: z.string(),
  title: z.array(z.string()),
  description: z.string(),
  primaryAction: z.object({ label: z.string(), href: z.string() }),
  secondaryAction: z.object({ label: z.string(), href: z.string() }),
  backgroundImage: z.string(),
});

export const introDataSchema = z.object({
  eyebrow: z.string(),
  title: z.array(z.string()),
  description: z.string(),
  highlights: z.array(z.string()),
  image: z.string(),
});

const serviceCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  iconImage: z.string().optional(),
});

export const servicesDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  cards: z.array(serviceCardSchema),
});

export const whyChooseItemSchema = z.object({
  index: z.string(),
  title: z.string(),
  description: z.string(),
});

export const whyChooseDataSchema = z.object({
  items: z.array(whyChooseItemSchema),
});

export const investmentDataSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  stats: z.array(z.object({ value: z.string(), label: z.string() })),
  chart: z.object({
    title: z.string(),
    delta: z.string(),
    labels: z.array(z.string()),
    values: z.array(z.number()),
  }),
});

export const clientLogosDataSchema = z.object({
  heading: z.string().optional(),
  logos: z.array(z.string()),
});

export const ctaDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  action: z.object({ label: z.string(), href: z.string() }),
});

export const contactDataSchema = z.object({
  headline: z.string(),
  subtext: z.string(),
});

export const contactHeroDataSchema = z.object({
  title: z.array(z.string()),
  description: z.string(),
  stat: z.string(),
  backgroundImage: z.string(),
});

const contactInfoItemSchema = z.object({
  title: z.string(),
  lines: z.array(z.string()),
  icon: z.string(),
});

export const contactInquiryDataSchema = z.object({
  formTitle: z.string(),
  formDescription: z.string(),
  submitLabel: z.string(),
  inquiryOptions: z.array(z.string()),
  officeHeading: z.string(),
  officeItems: z.array(contactInfoItemSchema),
  mapImage: z.string(),
  mapLabelTitle: z.string(),
  mapLabelSubtitle: z.string(),
});

export const aboutHeroDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  backgroundImage: z.string(),
});

const aboutContentCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  iconImage: z.string().optional(),
  accentColor: z.string(),
});

export const aboutVisionMissionDataSchema = z.object({
  cards: z.array(aboutContentCardSchema).min(1),
});

export const aboutAdvantageDataSchema = z.object({
  eyebrow: z.string(),
  title: z.array(z.string()),
  description: z.string(),
  points: z.array(z.string()),
  image: z.string(),
});

const aboutValueItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  iconImage: z.string().optional(),
});

export const aboutValuesDataSchema = z.object({
  title: z.string(),
  items: z.array(aboutValueItemSchema).min(1),
});

const sectionDataValidators: Record<string, z.ZodType<unknown>> = {
  hero: heroDataSchema,
  intro: introDataSchema,
  services: servicesDataSchema,
  whyChoose: whyChooseDataSchema,
  investment: investmentDataSchema,
  clientLogos: clientLogosDataSchema,
  cta: ctaDataSchema,
  contact: contactDataSchema,
  contactHero: contactHeroDataSchema,
  contactInquiry: contactInquiryDataSchema,
  aboutHero: aboutHeroDataSchema,
  aboutVisionMission: aboutVisionMissionDataSchema,
  aboutAdvantage: aboutAdvantageDataSchema,
  aboutValues: aboutValuesDataSchema,
};

export function parseSectionData(type: string, data: unknown): unknown {
  if (!SECTION_TYPES.includes(type as SectionType)) {
    throw new Error(`Unknown section type: ${type}`);
  }
  const schema = sectionDataValidators[type];
  if (!schema) {
    throw new Error(`Unknown section type: ${type}`);
  }
  return schema.parse(data);
}

export const siteGlobalPayloadSchema = z.object({
  navItems: z.array(navItemSchema),
  footerColumns: z.array(z.union([footerLinkColumnSchema, footerContactColumnSchema])),
  footerMeta: z.object({
    brand: z.string(),
    description: z.string(),
    social: z.array(z.string()),
    copyright: z.string(),
    legal: z.array(z.string()),
  }),
  logoSrc: z.string().optional(),
  featureFlags: z.record(z.string(), z.boolean()).optional(),
  seoDefaults: z
    .object({
      defaultTitle: z.string().optional(),
      defaultDescription: z.string().optional(),
    })
    .optional(),
});

export type SiteGlobalPayload = z.infer<typeof siteGlobalPayloadSchema>;
