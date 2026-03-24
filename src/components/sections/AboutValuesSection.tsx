import type { z } from "zod";
import type { aboutValuesDataSchema } from "@/schemas/sections";
import SimpleIcon from "./SimpleIcon";

type AboutValuesContent = z.infer<typeof aboutValuesDataSchema>;

export default function AboutValuesSection({ content }: { content: AboutValuesContent }) {
  return (
    <section className="about-values">
      <div className="section-shell">
        <div className="section-heading about-values__heading">
          <h2 className="section-heading__title about-values__title">{content.title}</h2>
          <div className="section-accent about-values__accent"></div>
        </div>
        <div className="about-values__grid">
          {content.items.map((item) => (
            <article key={`${item.title}-${item.description}`} className="about-value-card">
              <div className="about-value-card__icon" aria-hidden="true">
                {item.iconImage ? (
                  <img
                    src={item.iconImage}
                    alt=""
                    width={28}
                    height={28}
                    decoding="async"
                    className="about-value-card__icon-image"
                  />
                ) : (
                  <SimpleIcon name={item.icon ?? ""} className="about-value-card__icon-svg" />
                )}
              </div>
              <h3 className="about-value-card__title">{item.title}</h3>
              <p className="about-value-card__description">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
