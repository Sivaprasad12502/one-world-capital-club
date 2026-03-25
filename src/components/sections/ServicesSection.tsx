import type { z } from "zod";
import type { servicesDataSchema } from "@/schemas/sections";
import SimpleIcon from "./SimpleIcon";

type ServicesContent = z.infer<typeof servicesDataSchema>;

export default function ServicesSection({ content }: { content: ServicesContent }) {
  return (
    <section className="services-section">
      <div className="section-shell">
        <div className="section-heading">
          <h2 className="section-heading__title">{content.title}</h2>
          <div className="section-accent"></div>
          <p className="section-heading__description">{content.description}</p>
        </div>
        <div className="services-grid">
          {content.cards.map((card) => (
            <article key={card.title} className="service-card">
              <div className="service-card__icon">
                {card.iconImage ? (
                  <img src={card.iconImage} alt="" className="service-card__icon-image" />
                ) : (
                  <SimpleIcon name={card.icon} className="service-card__glyph" />
                )}
              </div>
              <h3 className="service-card__title">{card.title}</h3>
              <p className="service-card__text">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
