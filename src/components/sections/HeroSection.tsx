import type { z } from "zod";
import type { heroDataSchema } from "@/schemas/sections";
import SimpleIcon from "./SimpleIcon";

type HeroContent = z.infer<typeof heroDataSchema>;

export default function HeroSection({
  content,
  anchorId,
}: {
  content: HeroContent;
  anchorId?: string;
}) {
  return (
    <section className="hero-section" id={anchorId ?? undefined}>
      <div className="hero-section__background" aria-hidden="true">
        <img
          className="hero-section__background-image"
          src={content.backgroundImage}
          alt=""
          width={1600}
          height={900}
          decoding="async"
          fetchPriority="high"
        />
      </div>
      <div className="hero-section__gradient" aria-hidden="true" />
      <div className="hero-section__overlay"></div>
      <div className="hero-section__content section-shell">
        <div className="hero-section__copy">
          {/* <div className="hero-section__badge">
            <SimpleIcon name="spark" className="hero-section__badge-icon" />
            <span>{content.badge}</span>
          </div> */}
          <h1 className="hero-section__title">
            {content.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className="hero-section__description">{content.description}</p>
          <div className="hero-section__actions">
            <a className="button button--gold" href={content.primaryAction.href}>
              {content.primaryAction.label}
            </a>
            <a className="button button--ghost" href={content.secondaryAction.href}>
              {content.secondaryAction.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
