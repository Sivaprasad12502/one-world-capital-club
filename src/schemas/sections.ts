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

const servicesGridCardSchema = z.object({
  category: z.string(),
  title: z.string(),
  icon: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  cta: z.string(),
});

export const servicesGridDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  filters: z.array(z.string()).min(1),
  cards: z.array(servicesGridCardSchema).min(1),
});

export const servicesCtaDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  primaryAction: z.object({ label: z.string(), href: z.string() }),
  secondaryAction: z.object({ label: z.string(), href: z.string() }),
});

export const whyChooseItemSchema = z.object({
  title:z.string(),
  // description: z.string().optional(),
  icon: z.string(),
});

export const whyChooseDataSchema = z.object({
  title:z.string(),
  subheading:z.string().optional(),
  items: z.array(whyChooseItemSchema),
});

export const investmentDataSchema = z.object({
  id: z.string().optional(),
  heading: z.array(z.string()).min(1),
  items: z
    .array(
      z.object({
        icon: z.string(),
        title: z.string(),
        description: z.string(),
      }),
    )
    .min(1),
  quoteText: z.string(),
  quoteAuthor: z.string(),
  quoteRole: z.string(),
});

export const clientLogosDataSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  action: z.object({ label: z.string(), href: z.string() }),
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

export const industriesHeroDataSchema = z.object({
  badge: z.string(),
  title: z.array(z.string()).min(1),
  description: z.string(),
  primaryAction: z.object({ label: z.string(), href: z.string() }),
  secondaryAction: z.object({ label: z.string(), href: z.string() }),
});

const industriesGridItemSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});

export const industriesGridDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  items: z.array(industriesGridItemSchema).min(1),
  partnerCard: z.object({
    title: z.string(),
    description: z.string(),
    href: z.string(),
  }),
});

export const industriesCtaDataSchema = z.object({
  title: z.array(z.string()).min(1),
  description: z.string(),
  primaryAction: z.object({ label: z.string(), href: z.string() }),
  secondaryAction: z.object({ label: z.string(), href: z.string() }),
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
export const serviceHeroDataSchema=z.object({
  title: z.array(z.string()).min(1),
  description: z.string(),
  backgroundImage:z.string()
})

export const aboutHeroDataSchema = z.object({
  title: z.array(z.string()),
  description: z.string(),
  backgroundImage: z.string(),
});

export const aboutIntroDataSchema = z.object({
  badge: z.string(),
  title: z.array(z.string()).min(1),
  description: z.array(z.string()).min(1),
  imageCaption: z.string(),
  image: z.string(),
  imageAlt: z.string().optional(),
});

const aboutContentCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  iconImage: z.string().optional(),
  accentColor: z.string(),
});

export const aboutVisionMissionDataSchema = z.object({
  items: z.array(aboutContentCardSchema).min(1),
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
export const aboutCtaDataSchema=z.object({
  title: z.array(z.string()).min(1),
  description: z.string(),
  primaryAction: z.object({ label: z.string(),href: z.string()}),
  secondaryAction: z.object({label:z.string(),href:z.string()})
})

const sectionDataValidators: Record<string, z.ZodType<unknown>> = {
  hero: heroDataSchema,
  intro: introDataSchema,
  services: servicesDataSchema,
  servicesGrid: servicesGridDataSchema,
  servicesCTA: servicesCtaDataSchema,
  whyChoose: whyChooseDataSchema,
  investment: investmentDataSchema,
  clientLogos: clientLogosDataSchema,
  cta: ctaDataSchema,
  contact: contactDataSchema,
  contactHero: contactHeroDataSchema,
  contactInquiry: contactInquiryDataSchema,
  servicesHero: serviceHeroDataSchema,
  industriesHero: industriesHeroDataSchema,
  industriesGrid: industriesGridDataSchema,
  industriesCta: industriesCtaDataSchema,
  aboutHero: aboutHeroDataSchema,
  aboutIntro: aboutIntroDataSchema,
  aboutVisionMission: aboutVisionMissionDataSchema,
  aboutAdvantage: aboutAdvantageDataSchema,
  aboutValues: aboutValuesDataSchema,
  aboutCTA: aboutCtaDataSchema,
};

export function parseSectionData(type: string, data: unknown): unknown {
  const normalizedType =
    type === "industrieshero"
      ? "industriesHero"
      : type === "industriesgrid"
        ? "industriesGrid"
        : type === "industriescta"
          ? "industriesCta"
        : type === "servicesgrid"
          ? "servicesGrid"
        : type === "servicescta"
          ? "servicesCTA"
        : type;
  if (!SECTION_TYPES.includes(normalizedType as SectionType)) {
    throw new Error(`Unknown section type: ${type}`);
  }
  const schema = sectionDataValidators[normalizedType];
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
    social: z.array(
      z.union([
        z.string(),
        z.object({ label: z.string(), href: z.string(), icon: z.string().optional() }),
      ]),
    ),
    copyright: z.string(),
    legal: z.array(
      z.union([z.string(), z.object({ label: z.string(), href: z.string() })]),
    ),
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
