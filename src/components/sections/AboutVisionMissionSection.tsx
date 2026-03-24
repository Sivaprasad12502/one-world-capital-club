import type { z } from "zod";
import type { aboutVisionMissionDataSchema } from "@/schemas/sections";
import type { CSSProperties } from "react";
import SimpleIcon from "./SimpleIcon";

type AboutVisionMissionContent = z.infer<typeof aboutVisionMissionDataSchema>;

export default function AboutVisionMissionSection({
  content,
}: {
  content: AboutVisionMissionContent;
}) {
  return (
    <section className="about-panels">
      <div className="section-shell about-panels__grid">
        {content.cards.map((card) => (
          <article
            key={`${card.title}-${card.description}`}
            className="about-panel"
            style={{ "--about-panel-accent": card.accentColor } as CSSProperties}
          >
            <div className="about-panel__icon" aria-hidden="true">
              {card.iconImage ? (
                <img
                  src={card.iconImage}
                  alt=""
                  width={32}
                  height={32}
                  decoding="async"
                  className="about-panel__icon-image"
                />
              ) : (
                <SimpleIcon name={card.icon ?? ""} className="about-panel__icon-svg" />
              )}
            </div>
            <h2 className="about-panel__title">{card.title}</h2>
            <p className="about-panel__description">{card.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
