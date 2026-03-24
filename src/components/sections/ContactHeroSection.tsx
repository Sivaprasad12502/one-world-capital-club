import type { z } from "zod";
import type { contactHeroDataSchema } from "@/schemas/sections";
import SimpleIcon from "./SimpleIcon";

type ContactHeroContent = z.infer<typeof contactHeroDataSchema>;

export default function ContactHeroSection({ content }: { content: ContactHeroContent }) {
  return (
    <section className="contact-hero">
      <div className="contact-hero__background" aria-hidden="true">
        <img
          className="contact-hero__background-image"
          src={content.backgroundImage}
          alt=""
          width={1600}
          height={900}
          decoding="async"
        />
      </div>
      <div className="contact-hero__gradient" aria-hidden="true" />
      <div className="contact-hero__content section-shell">
        <div className="contact-hero__copy">
          <h1 className="contact-hero__title">
            {content.title.map((line, index) => (
              <span
                key={`${line}-${index}`}
                className={index === content.title.length - 1 ? "contact-hero__title-accent" : undefined}
              >
                {line}
              </span>
            ))}
          </h1>
          <p className="contact-hero__description">{content.description}</p>
          <div className="contact-hero__meta">
            <SimpleIcon name="spark" className="contact-hero__meta-icon" />
            <span>{content.stat}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
