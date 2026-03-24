import {
  defaultFooterColumns,
  defaultFooterMeta,
  defaultNavItems,
} from "@/data/site-defaults";
import { getSiteGlobalCached } from "@/lib/content/site-global";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

export const dynamic = "force-dynamic";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const global = await getSiteGlobalCached();

  const navItems =
    (global?.navItems as typeof defaultNavItems) ?? defaultNavItems;
  const footerColumns =
    (global?.footerColumns as typeof defaultFooterColumns) ??
    defaultFooterColumns;
  const footerMeta =
    (global?.footerMeta as typeof defaultFooterMeta) ?? defaultFooterMeta;
  const logoSrc = global?.logoSrc ?? "/home/logo.png";

  return (
    <div className="owtc-app">
      <SiteHeader navItems={navItems} logoSrc={logoSrc} />
      <main>{children}</main>
      <SiteFooter columns={footerColumns} meta={footerMeta} />
    </div>
  );
}
