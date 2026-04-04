"use client";
import type { z } from "zod";
import * as Icons from "lucide-react";
import {useState} from 'react'
import type { ElementType } from "react";
import type { servicesGridDataSchema } from "@/schemas/sections";

type ServicesGridContent = z.infer<typeof servicesGridDataSchema>;

const ServicesGridSection = ({ content }: { content: ServicesGridContent }) => {
  const filters = content.filters.length > 0 ? content.filters : ["All Services"];
  const [activeButton, setActiveButton]=useState(0)
  return (
    <section className="services-grid-section">
      <div className="section-shell">
        <div className="services-grid-section__header">
          <div className="services-grid-section__copy">
            <h2 className="services-grid-section__title">{content.title}</h2>
            <p className="services-grid-section__description">{content.description}</p>
          </div>
          <div className="services-grid-section__filters" role="tablist" aria-label="Service filters">
            {filters.map((filter, index) => (
              <button
                key={`${filter}-${index}`}
                type="button"
                role="tab"
                aria-selected={index === 0}
                className={`services-grid-section__filter ${index === activeButton ? "is-active" : ""}`}
                onClick={()=>setActiveButton(index)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="services-grid-section__cards">
          {content.cards.map((card, index) => {
            const Icon = Icons[card.icon as keyof typeof Icons] as ElementType | undefined;
            return (
              <article className="services-grid-card" key={`${card.title}-${index}`}>
                <p className="services-grid-card__category">{card.category}</p>
                <div className="services-grid-card__icon" aria-hidden="true">
                  {Icon ? <Icon size={30} /> : null}
                </div>
                <h3 className="services-grid-card__title">{card.title}</h3>
                <p className="services-grid-card__description">{card.description}</p>
                <ul className="services-grid-card__features">
                  {card.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <button type="button" className="services-grid-card__cta">
                  {card.cta}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesGridSection;
