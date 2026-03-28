import type { PageSection } from "@/types/section";
import HeroSection from "./home/HeroSection";
import IntroSection from "./home/IntroSection";
import ServicesSection from "./services/ServicesSection";
import ServicesGridSection from "./services/ServicesGridSection";
import WhyChooseSection from "./home/WhyChooseSection";
import InvestmentSection from "./home/InvestmentSection";
import ClientLogosSection from "./home/ClientLogosSection";
import CtaSection from "./home/CtaSection";
import ContactBlockSection from "./contact/ContactBlockSection";
import AboutHeroSection from "./about/AboutHeroSection";
import AboutVisionMissionSection from "./about/AboutVisionMissionSection";
import AboutAdvantageSection from "./about/AboutAdvantageSection";
import AboutValuesSection from "./about/AboutValuesSection";
import ContactHeroSection from "./contact/ContactHeroSection";
import ContactInquirySection from "./contact/ContactInquirySection";
import IndustriesHeroSection from "./industries/IndustriesHeroSection";
import IndustriesGridSection from "./industries/IndustriesGridSection";
import IndustriesCta from "./industries/IndustriesCta";
import AboutIntroSection from "./about/AboutIntroSection";
import AboutCta from "./about/AboutCta";
import ServicesSectionCta from "./services/ServicesSectionCta";

export default function SectionRenderer({
  pageSlug,
  section,
  featureFlags,
}: {
  pageSlug: string;
  section: PageSection;
  featureFlags?: Record<string, boolean>;
}) {
  const normalizedType =
    (section.type as string) === "industrieshero"
      ? "industriesHero"
      : (section.type as string) === "industriesgrid"
        ? "industriesGrid"
        : (section.type as string) === "industriescta"
          ? "industriesCta"
          : (section.type as string) === "servicesgrid"
            ? "servicesGrid"
            : (section.type as string) === "servicescta"
              ? "servicesCTA"
            : section.type;

  if (normalizedType === "clientLogos" && featureFlags?.clientLogos === false) {
    return null;
  }

  switch (normalizedType) {
    case "hero":
      return (
        <HeroSection
          content={section.data as never}
          anchorId={pageSlug === "home" ? "home" : undefined}
        />
      );
    case "intro":
      return (
        <IntroSection
          content={section.data as never}
          anchorId={pageSlug === "home" ? "services" : undefined}
        />
      );
    case "services":
      return <ServicesSection content={section.data as never} />;

    case "whyChoose":
      return <WhyChooseSection content={section.data as never} />;
    case "investment":
      return <InvestmentSection content={section.data as never} />;
    case "clientLogos":
      return <ClientLogosSection content={section.data as never} />;
    // case "cta":
    //   return (
    //     <CtaSection
    //       content={section.data as never}
    //       anchorId={pageSlug === "contact" ? undefined : "contact"}
    //     />
    //   );
    case "contact":
      return <ContactBlockSection content={section.data as never} />;
    case "contactHero":
      return <ContactHeroSection content={section.data as never} />;
    case "contactInquiry":
      return <ContactInquirySection content={section.data as never} />;
    case "servicesHero":
      return <ContactHeroSection content={section.data as never} />;
    case "servicesGrid":
      return <ServicesGridSection content={section.data as never} />;
    case "servicesCTA":
      return <ServicesSectionCta content={section.data as never}/>;
    case "aboutHero":
      return <AboutHeroSection content={section.data as never} />;
    case "aboutIntro":
      return <AboutIntroSection content={section.data as never} />;
    case "aboutVisionMission":
      return <AboutVisionMissionSection content={section.data as never} />;

    case "aboutValues":
      return <AboutValuesSection content={section.data as never} />;
    case "aboutCTA":
      return <AboutCta content={section.data as never} />;
    case "industriesHero":
      return <IndustriesHeroSection content={section.data as never} />;
    case "industriesGrid":
      return <IndustriesGridSection content={section.data as never} />;
    case "industriesCta":
      return <IndustriesCta content={section.data as never} />;
    default:
      return null;
  }
}
