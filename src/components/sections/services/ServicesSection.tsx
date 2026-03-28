import type { z } from "zod";
import type { servicesDataSchema } from "@/schemas/sections";
import * as Icons from 'lucide-react'
import React from "react";


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
          {content.cards.map((card) => {
            const Icon=Icons[card.icon as keyof typeof Icon] as React.ElementType
            return(
            <article key={card.title} className="service-card">
              <div className="service-card__icon">
                {Icon ? <Icon size={32}/> : null}
              </div>
              <h3 className="service-card__title">{card.title}</h3>
              <p className="service-card__text">{card.description}</p>
            </article>
          )
          })}
        </div>
      </div>
    </section>
  );
}
