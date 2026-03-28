/**
 * Static page content when Mongo has no row yet (before `pnpm seed`)
 * or when a slug is missing. Keeps the marketing site usable on first run.
 */
import type { PublicPageView } from "@/lib/content/pages";
import type { PageSection } from "@/types/section";

function sid(slug: string, type: string, order: number): string {
  return `fb-${slug}-${type}-${order}`;
}

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

const servicesGridData = {
  title: "Strategic Solutions",
  description:
    "Explore our diverse portfolio of 90+ specialized services categorized by industry and expertise.",
  filters: ["All Services", "Investment", "Financial", "Technology"],
  cards: [
    {
      category: "Investment",
      title: "Investment Services",
      icon: "DollarSign",
      description:
        "Global asset management, private equity investments, and portfolio diversification strategies tailored for institutional and private investors.",
      features: ["Private Equity", "Asset Management", "Wealth Preservation"],
      cta: "Learn More",
    },
    {
      category: "Finance",
      title: "Financial Advisory",
      icon: "BarChart",
      description:
        "Strategic financial planning, capital restructuring, and risk assessment to ensure long-term fiscal health and regulatory compliance.",
      features: ["Capital Structuring", "Risk Management", "Mergers & Acquisitions"],
      cta: "Learn More",
    },
    {
      category: "Consultancy",
      title: "Business Management",
      icon: "Briefcase",
      description:
        "Operational intelligence, market entry strategies, and organizational restructuring for modern enterprises in a globalized economy.",
      features: ["Market Entry", "Operational Efficiency", "Corporate Governance"],
      cta: "Learn More",
    },
    {
      category: "Development",
      title: "Project Development",
      icon: "Building",
      description:
        "End-to-end management of infrastructure and real estate projects, from feasibility studies to execution planning and delivery.",
      features: ["Real Estate", "Infrastructure Planning", "Feasibility Studies"],
      cta: "Learn More",
    },
    {
      category: "Technology",
      title: "Technology & Innovation",
      icon: "Monitor",
      description:
        "Driving digital transformation through fintech solutions, blockchain integration, and advanced technology consulting.",
      features: ["Fintech Solutions", "Blockchain Consulting", "Digital Strategy"],
      cta: "Learn More",
    },
    {
      category: "Specialized",
      title: "Specialized Consulting",
      icon: "FlaskConical",
      description:
        "Niche expertise in emerging markets, sustainability-focused investments, and unique cross-border trade facilitation.",
      features: ["ESG Consulting", "Emerging Markets", "Trade Facilitation"],
      cta: "Learn More",
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
  id: "investment",
  heading: ["Why Partners Choose", "One World Capital"],
  items: [
    {
      icon: "✓",
      title: "Global Expertise",
      description:
        "Navigating international markets with deep-rooted regulatory and cultural knowledge.",
    },
    {
      icon: "✓",
      title: "Strategic Advisory",
      description:
        "Outcome-focused guidance that prioritizes sustainable growth and long-term value.",
    },
    {
      icon: "✓",
      title: "Risk Management",
      description:
        "Rigorous due diligence and proprietary risk assessment frameworks for every venture.",
    },
  ],
  quoteText:
    '"One World Capital provides the vision and the vehicle for international expansion that few others can match."',
  quoteAuthor: "Strategic Portfolio Insight",
  quoteRole: "Global Division",
};

const clientLogosData = {
  title: "Ready to scale your vision?",
  subtitle: "Connect with our strategic advisors for a confidential consultation.",
  action: {
    label: "PARTNER WITH US",
    href: "/contact",
  },
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

const aboutIntroData = {
  eyebrow: "OUR PRESENCE",
  title: ["A Strategic Hub in Dubai,", "A Global Reach."],
  paragraphs: [
    "One World Capital Club L.L.C FZE is strategically headquartered in the United Arab Emirates, serving as a pivotal gateway between the East and the West.",
    "Our firm specializes in high-level financial advisory, cross-border investment strategies, and exclusive networking for elite investors. We leverage Dubai's unique position as a global financial hub to provide our clients with unparalleled access to emerging opportunities and established markets alike.",
    "With a robust network spanning major financial capitals, we facilitate seamless capital flow and strategic partnerships that transcend geographical boundaries.",
  ],
  quote: '"Connecting sophisticated capital with global opportunity."',
  image: "/about/about-intro-globe.png",
  imageAlt: "Connected globe illustration highlighting global investment reach",
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
  title: ["Ready to Explore Global Opportunities?"],
  description:
    "Connect with our advisory team in Dubai and tap into our worldwide network of investment professionals.",
  primaryAction: { label: "Join the Club", href: "/contact" },
  secondaryAction: { label: "Request a Briefing", href: "/contact" },
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

function sections(slug: string, list: { type: PageSection["type"]; order: number; data: Record<string, unknown> }[]): PageSection[] {
  return list.map((s) => ({
    id: sid(slug, s.type, s.order),
    type: s.type,
    order: s.order,
    data: s.data,
  }));
}

const FALLBACK_BY_SLUG: Record<string, PublicPageView> = {
  home: {
    slug: "home",
    title: "Home",
    status: "published",
    seoTitle: "One World Trade Centre FZE",
    seoDescription:
      "One World Trade Centre FZE — trading, investment, and corporate solutions within the UAE free zone ecosystem.",
    effectiveSections: sections("home", [
      { type: "hero", order: 0, data: heroData },
      { type: "intro", order: 1, data: introData },
      { type: "services", order: 2, data: servicesData },
      { type: "whyChoose", order: 3, data: whyChooseData },
      { type: "investment", order: 4, data: investmentData },
      { type: "clientLogos", order: 5, data: clientLogosData },
      { type: "cta", order: 6, data: ctaData },
    ]),
    isPreview: false,
  },
  about: {
    slug: "about",
    title: "About Us",
    status: "published",
    seoTitle: "About Us | OWTC FZE",
    seoDescription:
      "Learn about One World Trade Centre FZE strategic operations and investment focus.",
    effectiveSections: sections("about", [
      { type: "aboutHero", order: 0, data: aboutHeroData },
      { type: "aboutIntro", order: 1, data: aboutIntroData },
      { type: "aboutVisionMission", order: 2, data: aboutVisionMissionData },
      { type: "aboutAdvantage", order: 3, data: aboutAdvantageData },
      { type: "aboutValues", order: 4, data: aboutValuesData },
      { type: "aboutCTA", order: 5, data: aboutCtaData },
    ]),
    isPreview: false,
  },
  services: {
    slug: "services",
    title: "Services",
    status: "published",
    seoTitle: "Services | OWTC FZE",
    seoDescription: "Core competencies: trading, security, fintech, corporate services, and more.",
    effectiveSections: sections("services", [
      { type: "servicesGrid", order: 0, data: servicesGridData },
      { type: "cta", order: 1, data: ctaData },
    ]),
    isPreview: false,
  },
  contact: {
    slug: "contact",
    title: "Contact",
    status: "published",
    seoTitle: "Contact | OWTC FZE",
    seoDescription: "Reach our advisors for UAE free zone and global trade solutions.",
    effectiveSections: sections("contact", [
      { type: "contactHero", order: 0, data: contactHeroData },
      { type: "contactInquiry", order: 1, data: contactInquiryData },
    ]),
    isPreview: false,
  },
};

export function getFallbackPageView(slug: string): PublicPageView | null {
  return FALLBACK_BY_SLUG[slug] ?? null;
}
