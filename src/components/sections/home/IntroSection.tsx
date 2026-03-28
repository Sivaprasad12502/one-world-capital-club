import type { z } from "zod";
import type { introDataSchema } from "@/schemas/sections";
import * as Icons from 'lucide-react'
import SimpleIcon from "../SimpleIcon";

type IntroContent = z.infer<typeof introDataSchema>;

export default function IntroSection({
  content,
  anchorId,
}: {
  content: IntroContent;
  anchorId?: string;
}) {
  console.log("IntroSection content:", content)
  const IconComponent= content.icon ? (Icons[content.icon as keyof typeof Icons ]) as React.ElementType : null;

  return (
    <section className="intro-section section-shell" id={anchorId ?? undefined}>
      <div className="intro-section__content">
        <div className="intro-section__copy">
          <div className="section-accent"></div>
          <p className="section-label">{content.eyebrow}</p>
          <h2 className="section-title">
            {content.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p className="intro-section__description">{content.description}</p>
          <ul className="intro-section__list">
            {content.highlights.map((item) => (
              <li key={item} className="intro-section__item">
                <span className="intro-section__item-icon">
                  <SimpleIcon name="check" className="intro-section__check" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="intro-section__more">
            <span>{content.more}</span>
            {IconComponent && <IconComponent className="intro-section__check"/>}
            
          </div>
        </div>
        <div className="intro-section__media">
          <div className="intro-section__media-shadow"></div>
          <img
            src={content.image}
            alt="Modern One World Trade Centre FZE headquarters interior"
            width={1200}
            height={800}
            decoding="async"
            className="intro-section__image"
          />
          <div className="intro-section__stats">
            <span className="count">{content.expcount}+</span>
            <span className="year">YEARS OF INSIGHT</span>
          </div>
        </div>
      </div>
    </section>
  );
}
