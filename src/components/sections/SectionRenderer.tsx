import type { PageSection } from "@/types/section";
import HeroSection from "./HeroSection";
import IntroSection from "./IntroSection";
import ServicesSection from "./ServicesSection";
import WhyChooseSection from "./WhyChooseSection";
import InvestmentSection from "./InvestmentSection";
import ClientLogosSection from "./ClientLogosSection";
import CtaSection from "./CtaSection";
import ContactBlockSection from "./ContactBlockSection";
import AboutHeroSection from "./AboutHeroSection";
import AboutVisionMissionSection from "./AboutVisionMissionSection";
import AboutAdvantageSection from "./AboutAdvantageSection";
import AboutValuesSection from "./AboutValuesSection";
import ContactHeroSection from "./ContactHeroSection";
import ContactInquirySection from "./ContactInquirySection";

export default function SectionRenderer({
  pageSlug,
  section,
  featureFlags,
}: {
  pageSlug: string;
  section: PageSection;
  featureFlags?: Record<string, boolean>;
}) {
  if (section.type === "clientLogos" && featureFlags?.clientLogos === false) {
    return null;
  }

  switch (section.type) {
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
    case "aboutHero":
      return <AboutHeroSection content={section.data as never} />;
    case "aboutVisionMission":
      return <AboutVisionMissionSection content={section.data as never} />;
    case "aboutAdvantage":
      return <AboutAdvantageSection content={section.data as never} />;
    case "aboutValues":
      return <AboutValuesSection content={section.data as never} />;
    default:
      return null;
  }
}
