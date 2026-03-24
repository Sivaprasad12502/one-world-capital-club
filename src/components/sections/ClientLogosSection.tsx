import type { z } from "zod";
import type { clientLogosDataSchema } from "@/schemas/sections";

type LogosContent = z.infer<typeof clientLogosDataSchema>;

export default function ClientLogosSection({ content }: { content: LogosContent }) {
  const heading = content.heading ?? "Trusted partners";
  return (
    <section className="logos-section">
      <div className="section-shell">
        <p className="logos-section__heading">{heading}</p>
        <div className="logos-section__rail">
          {content.logos.map((logo) => (
            <span key={logo} className="logos-section__item">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
