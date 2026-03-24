import type { z } from "zod";
import type { investmentDataSchema } from "@/schemas/sections";

type InvestmentContent = z.infer<typeof investmentDataSchema>;

export default function InvestmentSection({ content }: { content: InvestmentContent }) {
  const sectionId = content.id ?? "investment";
  return (
    <section className="investment-section" id={sectionId}>
      <div className="section-shell investment-section__content">
        <div className="investment-section__copy">
          <h2 className="section-title section-title--light">{content.title}</h2>
          <p className="investment-section__description">{content.description}</p>
          <div className="investment-section__stats">
            {content.stats.map((stat) => (
              <div key={stat.label} className="investment-stat">
                <div className="investment-stat__value">{stat.value}</div>
                <div className="investment-stat__label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="investment-chart">
          <div className="investment-chart__header">
            <span>{content.chart.title}</span>
            <span className="investment-chart__delta">{content.chart.delta}</span>
          </div>
          <div className="investment-chart__bars">
            {content.chart.values.map((value, index) => (
              <div key={content.chart.labels[index]} className="investment-chart__bar-group">
                <div className="investment-chart__track">
                  <div
                    className={`investment-chart__bar${
                      index === 3 ? " investment-chart__bar--featured" : ""
                    }`}
                    style={{ height: `${value}%` }}
                  ></div>
                </div>
                <span className="investment-chart__label">{content.chart.labels[index]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
