import type { z } from "zod";
import type { industriesCtaDataSchema } from "@/schemas/sections";

type IndustriesCtaContent = z.infer<typeof industriesCtaDataSchema>;

const DEFAULT_CONTENT: IndustriesCtaContent = {
  title: ["Explore Investment Opportunities", "Across Global Industries"],
  description:
    "Partner with a leading global investment firm to drive sustainable growth. Our experts are ready to provide the strategic capital your enterprise needs.",
  primaryAction: { label: "View Our Services", href: "/services" },
  secondaryAction: { label: "Contact An Advisor", href: "/contact" },
};

export default function IndustriesCta({
  content,
}: {
  content: Partial<IndustriesCtaContent>;
}) {
  const safeContent: IndustriesCtaContent = {
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
    <section className="industries-cta">
      <div className="section-shell">
        <div className="industries-cta__content">
          <h2 className="industries-cta__title">
            {safeContent.title.map((line, index) => (
              <span key={`${line}-${index}`}>{line}</span>
            ))}
          </h2>
          <p className="industries-cta__description">{safeContent.description}</p>
          <div className="industries-cta__actions">
            <a className="button button--gold industries-cta__button" href={safeContent.primaryAction.href}>
              {safeContent.primaryAction.label}
            </a>
            <a className="button industries-cta__button industries-cta__button-secondary" href={safeContent.secondaryAction.href}>
              {safeContent.secondaryAction.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
