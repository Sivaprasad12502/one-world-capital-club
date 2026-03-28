import type { z } from "zod";
import type { aboutVisionMissionDataSchema } from "@/schemas/sections";
import type { CSSProperties } from "react";
import * as Icons from 'lucide-react';
import React from "react";

type AboutVisionMissionContent = z.infer<typeof aboutVisionMissionDataSchema>;

export default function AboutVisionMissionSection({
  content,
}: {
  content: AboutVisionMissionContent;
}) {
  return (
    <section className="about-panels">
      <div className="section-shell about-panels__grid">
        {content?.items.map((item) => {
          const Icon=Icons[item.icon as keyof typeof Icons] as React.ElementType
          return (
          <article
            key={`${item.title}-${item.description}`}
            className="about-panel"
            // style={{ "--about-panel-accent": item.accentColor } as CSSProperties}
          >
            <div className="about-panel__icon" aria-hidden="true">
              {Icon ? <Icon size={28}/>: null}
            </div>
            <h2 className="about-panel__title">{item.title}</h2>
            <p className="about-panel__description">{item.description}</p>
          </article>
        )
        })}
      </div>
    </section>
  );
}
