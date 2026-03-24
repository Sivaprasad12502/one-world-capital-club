import type { z } from "zod";
import type { whyChooseDataSchema } from "@/schemas/sections";

type WhyContent = z.infer<typeof whyChooseDataSchema>;

export default function WhyChooseSection({ content }: { content: WhyContent }) {
  return (
    <section className="why-section section-shell">
      <div className="why-section__grid">
        {content.items.map((item) => (
          <article key={item.index} className="why-card">
            <p className="why-card__index">{item.index}</p>
            <h3 className="why-card__title">{item.title}</h3>
            <p className="why-card__text">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
