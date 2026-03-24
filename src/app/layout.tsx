import type { Metadata } from "next";
import "../styles.css";

export const metadata: Metadata = {
  title: {
    default: "One World Trade Centre FZE",
    template: "%s | OWTC FZE",
  },
  description:
    "One World Trade Centre FZE — trading, investment, and corporate solutions within the UAE free zone ecosystem.",
  metadataBase: new URL(process.env.AUTH_URL ?? "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  /* suppressHydrationWarning on html/body: browser extensions often inject attrs (e.g. cz-shortcut-listen). */
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
