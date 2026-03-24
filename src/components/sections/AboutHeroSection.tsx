import type { z } from "zod";
import type { aboutHeroDataSchema } from "@/schemas/sections";

type AboutHeroContent = z.infer<typeof aboutHeroDataSchema>;

export default function AboutHeroSection({ content }: { content: AboutHeroContent }) {
  return (
    <section className="about-hero">
      <div className="about-hero__background" aria-hidden="true">
        <img
          className="about-hero__background-image"
          src={content.backgroundImage}
          alt=""
          width={1600}
          height={900}
          decoding="async"
        />
      </div>
      <div className="about-hero__gradient" aria-hidden="true" />
      <div className="about-hero__content section-shell">
        <div className="about-hero__copy">
          <h1 className="about-hero__title">{content.title}</h1>
          <p className="about-hero__description">{content.description}</p>
        </div>
      </div>
    </section>
  );
}
