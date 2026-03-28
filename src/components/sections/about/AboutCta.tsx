import type { aboutCtaDataSchema } from "@/schemas/sections";
import type { z } from "zod";

type AboutCtaContent = z.infer<typeof aboutCtaDataSchema>;

const AboutCta = ({ content }: { content: AboutCtaContent }) => {
  return (
    <section className="about-cta">
      <div className="section-shell">
        <div className="about-cta__card">
          <h2 className="about-cta__title">
            {/* {content.title.map((line) => (
              <span key={line}>{line}</span>
            ))} */}
            {<span>{content.title}</span>}
          </h2>
          <p className="about-cta__description">{content.description}</p>
          <div className="about-cta__actions">
            <a
              className="button about-cta__button about-cta__button-primary"
              href={content.primaryAction.href}
            >
              {content.primaryAction.label}
            </a>
            <a
              className="button about-cta__button about-cta__button-secondary"
              href={content.secondaryAction.href}
            >
              {content.secondaryAction.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCta;
