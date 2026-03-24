import type { z } from "zod";
import type { aboutAdvantageDataSchema } from "@/schemas/sections";
import SimpleIcon from "./SimpleIcon";

type AboutAdvantageContent = z.infer<typeof aboutAdvantageDataSchema>;

export default function AboutAdvantageSection({ content }: { content: AboutAdvantageContent }) {
  return (
    <section className="about-advantage">
      <div className="section-shell about-advantage__content">
        <div className="about-advantage__copy">
          <p className="section-label about-advantage__eyebrow">{content.eyebrow}</p>
          <h2 className="about-advantage__title">
            {content.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p className="about-advantage__description">{content.description}</p>
          <ul className="about-advantage__list">
            {content.points.map((point) => (
              <li key={point} className="about-advantage__item">
                <span className="about-advantage__item-icon">
                  <SimpleIcon name="check" className="about-advantage__check" />
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="about-advantage__media">
          <img
            src={content.image}
            alt="One World Trade Centre FZE city skyline"
            width={1200}
            height={800}
            decoding="async"
            className="about-advantage__image"
          />
        </div>
      </div>
    </section>
  );
}
