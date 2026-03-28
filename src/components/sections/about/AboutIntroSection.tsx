import type { z } from "zod";
import type { aboutIntroDataSchema } from "@/schemas/sections";

type AboutIntroContent = z.infer<typeof aboutIntroDataSchema>;

const AboutIntroSection = ({ content }: { content: AboutIntroContent }) => {
  return (
    <section className="about-intro">
      <div className="section-shell about-intro__content">
        <div className="about-intro__copy">
          <p className="section-label about-intro__eyebrow">{content.badge}</p>
          <h2 className="about-intro__title">
            {content.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
           
          </h2>
          <div className="about-intro__body">
            {content.description.map((paragraph) => (
              <p key={paragraph} className="about-intro__paragraph">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="about-intro__media">
          <div className="about-intro__image-card">
            <div className="about-intro__image-frame">
              <img
                src={content.image}
                alt={content.imageAlt ?? ""}
                width={760}
                height={760}
                decoding="async"
                className="about-intro__image"
              />
            </div>
            <div className="about-intro__quote-card">
              <p className="about-intro__quote">{content.imageCaption}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutIntroSection;
