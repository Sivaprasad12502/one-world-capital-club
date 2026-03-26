import Link from "next/link";
import { Globe, Landmark, Mail, Phone } from "lucide-react";

type FooterLink = { label: string; href: string };
type ContactRow = { type: "location" | "phone" | "mail"; value: string };

type FooterColumn =
  | { title: string; links: FooterLink[] }
  | { title: string; contact: ContactRow[] };

type FooterMetaLink = { label: string; href: string; icon?: string };

function normalizeMetaLinks(
  links: Array<string | FooterMetaLink>,
  defaultHref: string,
): FooterMetaLink[] {
  return links
    .map((item) => {
      if (typeof item === "string") {
        return { label: item, href: defaultHref };
      }
      return {
        label: item.label,
        href: item.href || defaultHref,
        icon: item.icon,
      };
    })
    .filter((item) => item.label);
}

function SocialIcon({ token }: { token?: string }) {
  const key = (token ?? "").trim().toLowerCase();
  if (key.includes("mail") || key.includes("email")) {
    return <Mail aria-hidden="true" />;
  }
  if (key.includes("phone") || key.includes("call") || key.includes("whatsapp")) {
    return <Phone aria-hidden="true" />;
  }
  return <Globe aria-hidden="true" />;
}

export default function SiteFooter({
  columns,
  meta,
}: {
  columns: FooterColumn[];
  meta: {
    brand: string;
    description: string;
    social: Array<string | FooterMetaLink>;
    copyright: string;
    legal: Array<string | FooterMetaLink>;
  };
}) {
  const socialLinks = normalizeMetaLinks(meta.social ?? [], "/contact");
  const legalLinks = normalizeMetaLinks(meta.legal ?? [], "/contact");

  return (
    <footer className="site-footer">
      <div className="section-shell">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <div className="site-footer__brand-line">
              <span className="site-footer__brand-mark" aria-hidden="true">
                <Landmark />
              </span>
              <span>{meta.brand}</span>
            </div>
            <p className="site-footer__brand-copy">{meta.description}</p>
            <div className="site-footer__social">
              {socialLinks.map((network) => (
                <Link key={`${network.label}-${network.href}`} href={network.href} className="site-footer__social-link">
                  <SocialIcon token={network.icon ?? network.label} />
                  <span className="visually-hidden">{network.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title} className="site-footer__column">
              <h3 className="site-footer__heading">{column.title}</h3>
              {"links" in column ? (
                <ul className="site-footer__list">
                  {column.links.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="site-footer__list site-footer__list--contact">
                  {column.contact.map((item) => (
                    <li key={item.value} className="site-footer__contact-item">
                      <span>{item.value}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="site-footer__meta">
          <p>{meta.copyright}</p>
          <div className="site-footer__legal">
            {legalLinks.map((item) => (
              <Link key={`${item.label}-${item.href}`} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
