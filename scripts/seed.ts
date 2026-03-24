/**
 * Seed MongoDB with SiteGlobal, Pages, and an admin user.
 * Run: pnpm seed
 * Requires MONGODB_URI in .env or .env.local
 */
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { nanoid } from "nanoid";

import User from "../src/models/User";
import SiteGlobal from "../src/models/SiteGlobal";
import Page from "../src/models/Page";
import {
  defaultFooterColumns,
  defaultFooterMeta,
  defaultNavItems,
} from "../src/data/site-defaults";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Missing MONGODB_URI");
  process.exit(1);
}

function section(type: string, order: number, data: Record<string, unknown>) {
  return { id: nanoid(), type, order, data };
}

const navItems = defaultNavItems;
const footerColumns = defaultFooterColumns;
const footerMeta = defaultFooterMeta;

const heroData = {
  badge: "Premier UAE Free Zone Operations",
  title: ["Comprehensive", "Trading,", "Investment, and", "Corporate Solutions"],
  description:
    "Empowering global commerce through premium strategic consulting and operational excellence within the UAE's elite economic zones.",
  primaryAction: { label: "Request Consultation", href: "/contact" },
  secondaryAction: { label: "Explore Services", href: "/services" },
  backgroundImage: "/home/hero-bg.jpg",
};

const introData = {
  eyebrow: "About Us",
  title: ["Diverse UAE Free Zone", "Strategic Operations"],
  description:
    "One World Trade Centre FZE operates at the intersection of global trade and innovation. We provide seamless corporate solutions from our professional headquarters, leveraging the unique economic advantages of the UAE to scale international businesses.",
  highlights: [
    "Expertise in multi-jurisdictional licensing",
    "Direct access to global trade corridors",
    "High-tier corporate governance and advisory",
  ],
  image: "/home/headquarters.png",
};

const servicesData = {
  title: "Our Core Competencies",
  description: "Specialized services designed for the demands of the modern global economy.",
  cards: [
    {
      title: "Global Trading",
      description:
        "Facilitating seamless commodity exchange and high-volume trade across international borders with optimized logistics.",
      icon: "trading",
    },
    {
      title: "Security Equipment",
      description:
        "Supplying state-of-the-art surveillance and protection systems for government and private sector infrastructure.",
      icon: "security",
    },
    {
      title: "Fintech & Digital Wallets",
      description:
        "Developing secure, scalable digital payment infrastructures for next-generation financial ecosystems.",
      icon: "fintech",
    },
    {
      title: "Online Services",
      description:
        "Strategic digital transformation and e-commerce solutions tailored for global scalability.",
      icon: "online",
    },
    {
      title: "Investment Management",
      description:
        "Data-driven asset allocation and wealth management strategies aimed at long-term capital preservation.",
      icon: "investment",
    },
    {
      title: "Corporate Services",
      description:
        "Comprehensive business setup, PRO services, and regulatory compliance within UAE free zones.",
      icon: "corporate",
    },
  ],
};

const whyChooseData = {
  items: [
    {
      index: "01",
      title: "UAE Licensing",
      description: "Rapid business incorporation with full regulatory support in prime zones.",
    },
    {
      index: "02",
      title: "Global Network",
      description: "Connected to key financial hubs across Europe, Asia, and the Americas.",
    },
    {
      index: "03",
      title: "Investment Alpha",
      description: "Proprietary analysis driving high-yield opportunities in emerging markets.",
    },
    {
      index: "04",
      title: "Digital Focus",
      description: "Technology-first approach to all our corporate and trading operations.",
    },
  ],
};

const investmentData = {
  id: "about",
  title: "Focus on Tech, Agri, and Venture Capital",
  description:
    "We actively invest in the foundational industries of tomorrow. From sustainable agriculture technology to disruptive SaaS ventures, our capital is deployed where it can create maximum global impact.",
  stats: [
    { value: "$500M+", label: "Assets Under Advisory" },
    { value: "15+", label: "Global Markets" },
  ],
  chart: {
    title: "Portfolio Performance Index",
    delta: "+16.8%",
    labels: ["2020", "2021", "2022", "2023", "2024", "2025"],
    values: [42, 64, 84, 100, 74, 98],
  },
};

const clientLogosData = {
  heading: "Trusted by global alliances",
  logos: ["GLOBAL FIN", "TRADEX", "EMIRATES CORP", "CAPITAL X", "VERIFY"],
};

const ctaData = {
  title: "Partner with One World Trade Centre FZE for Global Trade and Investment Solutions",
  description:
    "Our advisors are ready to help you navigate the complexities of global commerce and UAE market opportunities.",
  action: { label: "Request a Strategic Consultation", href: "/contact" },
};

const aboutHeroData = {
  title: "Redefining Excellence",
  description:
    "One World Trade Centre FZE serves as the strategic bridge for global enterprises entering the dynamic UAE marketplace.",
  backgroundImage: "https://www.figma.com/api/mcp/asset/c4d803f5-67dd-4a5e-8068-fec955887a41",
};

const aboutVisionMissionData = {
  cards: [
    {
      title: "Our Vision",
      description:
        "To be the global benchmark for corporate excellence and strategic consulting in the UAE free zone landscape, empowering businesses to achieve sustainable growth in a borderless economy.",
      icon: "vision",
      accentColor: "#0b3d91",
    },
    {
      title: "Our Mission",
      description:
        "To deliver integrity-driven solutions, innovative strategies, and unparalleled compliance expertise, ensuring our clients' success within the UAE's premier free zone ecosystem.",
      icon: "mission",
      accentColor: "#c8a96a",
    },
  ],
};

const aboutAdvantageData = {
  eyebrow: "The UAE Advantage",
  title: ["Strategically Positioned in the", "Free Zone Ecosystem"],
  description:
    "One World Trade Centre FZE operates at the heart of the UAE's strategic economic infrastructure. We provide specialized consulting that leverages the unique legal, financial, and operational frameworks of the free zone environment.",
  points: [
    "100% Ownership Support",
    "Tax Optimization",
    "Global Connectivity",
    "Regulatory Compliance",
  ],
  image: "https://www.figma.com/api/mcp/asset/7c13b2a1-812c-497c-aa9c-cfa824418b1d",
};

const aboutValuesData = {
  title: "Our Core Values",
  items: [
    {
      title: "Professionalism",
      description: "Exhibiting the highest standards of conduct in every interaction.",
      icon: "professionalism",
    },
    {
      title: "Integrity",
      description: "Upholding honesty and ethical transparency in all services.",
      icon: "integrity",
    },
    {
      title: "Innovation",
      description: "Pioneering creative strategies for complex corporate challenges.",
      icon: "innovation",
    },
    {
      title: "Client Focus",
      description: "Placing our partners' needs at the core of our operations.",
      icon: "clientFocus",
    },
    {
      title: "Compliance",
      description: "Strict adherence to regional and international legal norms.",
      icon: "compliance",
    },
  ],
};

const aboutCtaData = {
  title: "Ready to expand your global footprint?",
  description:
    "Our consultants are ready to guide you through the intricacies of the UAE corporate landscape.",
  action: { label: "Schedule a Consultation", href: "/contact" },
};

const contactHeroData = {
  title: ["Connect With Global", "Excellence"],
  description:
    "Professional corporate solutions for global connectivity. Our team is ready to facilitate your international business expansion.",
  stat: "Serving clients across 60+ countries",
  backgroundImage: "https://www.figma.com/api/mcp/asset/2f1e71da-1c2d-4350-ac36-c5e8bfe8168f",
};

const contactInquiryData = {
  formTitle: "Send an Inquiry",
  formDescription: "Complete the form below and our consultants will reach out within 24 hours.",
  submitLabel: "Submit Request",
  inquiryOptions: [
    "Business Consulting",
    "Company Formation",
    "Trade Licensing",
    "Tax Consultancy",
    "Visa Services",
  ],
  officeHeading: "Contact Information",
  officeItems: [
    {
      title: "Regional Headquarters",
      lines: [
        "Sharjah Publishing City Free Zone (SPCFZ),",
        "Office 204, Building A1,",
        "Sharjah, United Arab Emirates",
      ],
      icon: "location",
    },
    {
      title: "Phone & WhatsApp",
      lines: ["+971 6 500 0000", "+971 50 123 4567"],
      icon: "phone",
    },
    {
      title: "Email Support",
      lines: ["contact@oneworldfze.ae", "consultancy@oneworldfze.ae"],
      icon: "mail",
    },
  ],
  mapImage: "https://www.figma.com/api/mcp/asset/a074e368-5cf1-401a-97eb-9bcbce33e4c2",
  mapLabelTitle: "SPCFZ, Sharjah",
  mapLabelSubtitle: "United Arab Emirates",
};

const homeSections = [
  section("hero", 0, heroData),
  section("intro", 1, introData),
  section("services", 2, servicesData),
  section("whyChoose", 3, whyChooseData),
  section("investment", 4, investmentData),
  section("clientLogos", 5, clientLogosData),
  section("cta", 6, ctaData),
];

const aboutSections = [
  section("aboutHero", 0, aboutHeroData),
  section("aboutVisionMission", 1, aboutVisionMissionData),
  section("aboutAdvantage", 2, aboutAdvantageData),
  section("aboutValues", 3, aboutValuesData),
  section("cta", 4, aboutCtaData),
];

const servicesPageSections = [section("services", 0, servicesData), section("cta", 1, ctaData)];

const contactPageSections = [
  section("contactHero", 0, contactHeroData),
  section("contactInquiry", 1, contactInquiryData),
];

async function main() {
  if (!uri) {
    throw new Error("Missing MONGODB_URI");
  }
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD ?? "AdminChangeMe!", 12);
  await User.findOneAndUpdate(
    { email: "admin@owtc-fze.com" },
    { $set: { email: "admin@owtc-fze.com", passwordHash } },
    { upsert: true },
  );
  console.log("Admin user: admin@owtc-fze.com /", process.env.ADMIN_PASSWORD ?? "AdminChangeMe!");

  await SiteGlobal.findOneAndUpdate(
    { key: "default" },
    {
      $set: {
        key: "default",
        navItems,
        footerColumns,
        footerMeta,
        logoSrc: "/home/logo.png",
        featureFlags: { clientLogos: true },
        seoDefaults: {
          defaultTitle: "One World Trade Centre FZE",
          defaultDescription:
            "One World Trade Centre FZE — trading, investment, and corporate solutions within the UAE free zone ecosystem.",
        },
      },
    },
    { upsert: true },
  );
  console.log("SiteGlobal seeded");

  const pages = [
    {
      slug: "home",
      title: "Home",
      sections: homeSections,
      seoTitle: "One World Trade Centre FZE",
      seoDescription:
        "One World Trade Centre FZE — trading, investment, and corporate solutions within the UAE free zone ecosystem.",
    },
    {
      slug: "about",
      title: "About Us",
      sections: aboutSections,
      seoTitle: "About Us | OWTC FZE",
      seoDescription: "Learn about One World Trade Centre FZE strategic operations and investment focus.",
    },
    {
      slug: "services",
      title: "Services",
      sections: servicesPageSections,
      seoTitle: "Services | OWTC FZE",
      seoDescription: "Core competencies: trading, security, fintech, corporate services, and more.",
    },
    {
      slug: "contact",
      title: "Contact",
      sections: contactPageSections,
      seoTitle: "Contact | OWTC FZE",
      seoDescription: "Reach our advisors for UAE free zone and global trade solutions.",
    },
  ];

  for (const p of pages) {
    const published = structuredClone(p.sections);
    await Page.findOneAndUpdate(
      { slug: p.slug },
      {
        $set: {
          slug: p.slug,
          title: p.title,
          status: "published",
          sections: p.sections,
          publishedSections: published,
          publishedAt: new Date(),
          seoTitle: p.seoTitle,
          seoDescription: p.seoDescription,
        },
      },
      { upsert: true },
    );
    console.log("Page seeded:", p.slug);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
