import Link from "next/link";
import SimpleIcon from "@/components/sections/SimpleIcon";

type FooterLink = { label: string; href: string };
type ContactRow = { type: "location" | "phone" | "mail"; value: string };

type FooterColumn =
  | { title: string; links: FooterLink[] }
  | { title: string; contact: ContactRow[] };

export default function SiteFooter({
  columns,
  meta,
}: {
  columns: FooterColumn[];
  meta: {
    brand: string;
    description: string;
    social: string[];
    copyright: string;
    legal: string[];
  };
}) {
  return (
    <footer className="site-footer">
      <div className="section-shell">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <div className="site-footer__brand-line">
              <span className="site-footer__brand-mark"></span>
              <span>{meta.brand}</span>
            </div>
            <p className="site-footer__brand-copy">{meta.description}</p>
            <div className="site-footer__social">
              {meta.social.map((network) => (
                <Link key={network} href="/contact" className="site-footer__social-link">
                  {network}
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
                      <SimpleIcon name={item.type} className="site-footer__contact-icon" />
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
            {meta.legal.map((item) => (
              <Link key={item} href="/contact">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
