import type { z } from "zod";
import type { industriesHeroDataSchema } from "@/schemas/sections";

type IndustriesHeroContent = z.infer<typeof industriesHeroDataSchema>;

const DEFAULT_CONTENT: IndustriesHeroContent = {
  badge: "GLOBAL INVESTMENT EXCELLENCE",
  title: ["Industries We", "Invest In"],
  description:
    "One World Capital Club provides strategic investment and advisory services across multiple global industries, supporting innovative enterprises and sustainable economic development.",
  primaryAction: { label: "Get Started", href: "/contact" },
  secondaryAction: { label: "Investment Philosophy", href: "/about" },
};

export default function IndustriesHeroSection({
  content,
}: {
  content: Partial<IndustriesHeroContent>;
}) {
  const safeContent: IndustriesHeroContent = {
    badge: content.badge || DEFAULT_CONTENT.badge,
    title:
      Array.isArray(content.title) && content.title.length > 0
        ? content.title
        : DEFAULT_CONTENT.title,
    description: content.description || DEFAULT_CONTENT.description,
    primaryAction: {
      label: content.primaryAction?.label || DEFAULT_CONTENT.primaryAction.label,
      href: content.primaryAction?.href || DEFAULT_CONTENT.primaryAction.href,
    },
    secondaryAction: {
      label: content.secondaryAction?.label || DEFAULT_CONTENT.secondaryAction.label,
      href: content.secondaryAction?.href || DEFAULT_CONTENT.secondaryAction.href,
    },
  };

  return (
    <section className="industries-hero">
      <div className="industries-hero__gradient" aria-hidden="true" />
      <div className="industries-hero__content section-shell">
        <div className="industries-hero__copy">
          <p className="industries-hero__badge">{safeContent.badge}</p>
          <h1 className="industries-hero__title">
            {safeContent.title.map((line, index) => (
              <span
                key={`${line}-${index}`}
                className={index === safeContent.title.length - 1 ? "industries-hero__title-accent" : undefined}
              >
                {line}
              </span>
            ))}
          </h1>
          <p className="industries-hero__description">{safeContent.description}</p>
          <div className="industries-hero__actions">
            <a className="button button--gold" href={safeContent.primaryAction.href}>
              {safeContent.primaryAction.label}
            </a>
            <a className="button industries-hero__button-secondary" href={safeContent.secondaryAction.href}>
              {safeContent.secondaryAction.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
