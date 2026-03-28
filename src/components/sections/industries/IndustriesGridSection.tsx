import type { z } from "zod";
import type { industriesGridDataSchema } from "@/schemas/sections";
import {
  Bolt,
  BriefcaseBusiness,
  Cross,
  GraduationCap,
  Leaf,
  PlusCircle,
  SearchCode,
  SquareCode,
} from "lucide-react";
import * as Icons from 'lucide-react';
import React from "react";

type IndustriesGridContent = z.infer<typeof industriesGridDataSchema>;

const DEFAULT_CONTENT: IndustriesGridContent = {
  title: "Our Strategic Focus",
  description:
    "Our diversified portfolio reflects our commitment to stability, innovation, and long-term value creation across key sectors of the global economy.",
  items: [
    {
      icon: "SquareCode",
      title: "Technology",
      description: "Driving innovation through digital transformation and venture capital.",
    },
    {
      icon: "Bolt",
      title: "Energy",
      description: "Investing in sustainable and renewable energy solutions for the future.",
    },
    {
      icon: "Cross",
      title: "Healthcare",
      description: "Advancing medical technologies and global health infrastructure.",
    },
    {
      icon: "GraduationCap",
      title: "Education",
      description: "Supporting educational institutions and EdTech development.",
    },
    {
      icon: "SearchCode",
      title: "Tourism & Hospitality",
      description: "Elevating luxury travel and sustainable tourism experiences.",
    },
    {
      icon: "BriefcaseBusiness",
      title: "Commercial Enterprises",
      description: "Empowering global trade and sophisticated business operations.",
    },
    {
      icon: "Leaf",
      title: "Agriculture",
      description: "Modernizing food systems through sustainable agritech investments.",
    },
  ],
  partnerCard: {
    title: "Partner With Us",
    description: "Explore customized investment strategies for your industry.",
    href: "/contact",
  },
};

function iconFromToken(token: string) {
  switch (token) {
    case "SquareCode":
      return <SquareCode aria-hidden="true" />;
    case "Bolt":
      return <Bolt aria-hidden="true" />;
    case "Cross":
      return <Cross aria-hidden="true" />;
    case "GraduationCap":
      return <GraduationCap aria-hidden="true" />;
    case "SearchCode":
      return <SearchCode aria-hidden="true" />;
    case "BriefcaseBusiness":
      return <BriefcaseBusiness aria-hidden="true" />;
    case "Leaf":
      return <Leaf aria-hidden="true" />;
    default:
      return <SquareCode aria-hidden="true" />;
  }
}

export default function IndustriesGridSection({
  content,
}: {
  content: Partial<IndustriesGridContent>;
}) {
  const safeContent: IndustriesGridContent = {
    title: content.title || DEFAULT_CONTENT.title,
    description: content.description || DEFAULT_CONTENT.description,
    items:
      Array.isArray(content.items) && content.items.length > 0
        ? content.items
            .map((item) => ({
              icon: item.icon || "SquareCode",
              title: item.title || "",
              description: item.description || "",
            }))
            .filter((item) => item.title.trim().length > 0)
        : DEFAULT_CONTENT.items,
    partnerCard: {
      title: content.partnerCard?.title || DEFAULT_CONTENT.partnerCard.title,
      description:
        content.partnerCard?.description || DEFAULT_CONTENT.partnerCard.description,
      href: content.partnerCard?.href || DEFAULT_CONTENT.partnerCard.href,
    },
  };

  return (
    <section className="industries-grid">
      <div className="section-shell">
        <div className="industries-grid__heading">
          <h2 className="industries-grid__title">{safeContent.title}</h2>
          <p className="industries-grid__description">{safeContent.description}</p>
        </div>

        <div className="industries-grid__cards">
          {safeContent.items.map((item, index) => {
            const Icon=Icons[item.icon as keyof typeof Icons] as React.ElementType
            return(
            <article key={`${item.title}-${index}`} className="industries-grid__card">
              <span className="industries-grid__card-icon">{Icon && <Icon />}</span>
              <h3 className="industries-grid__card-title">{item.title}</h3>
              <p className="industries-grid__card-description">{item.description}</p>
            </article>
          )
          })}

          <a className="industries-grid__partner-card" href={safeContent.partnerCard.href}>
            <span className="industries-grid__partner-icon" aria-hidden="true">
              <PlusCircle />
            </span>
            <h3 className="industries-grid__partner-title">{safeContent.partnerCard.title}</h3>
            <p className="industries-grid__partner-description">
              {safeContent.partnerCard.description}
            </p>
          </a>
        </div>
      </div>
    </section>
  );
}
