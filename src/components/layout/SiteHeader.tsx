"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export type NavItem = { label: string; href: string; active?: boolean };

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader({
  navItems,
  logoSrc,
}: {
  navItems: NavItem[];
  logoSrc: string;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  console.log('NavItems:', navItems)
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" href="/" aria-label="One World Trade Centre FZE home">
          <span className="brand__logo-frame">
            <img
              className="brand__logo"
              src={logoSrc}
              alt="One World capital club"
              width={30}
              height={30}
              decoding="async"
            />
          </span>
          <span className="brand__wordmark">
            <span className="brand__title">
              {/* One World Trade Centre <span className="brand__title-accent">FZE</span> */}
              ONE WORLD CAPITAL CLUB
            </span>
            <span>
              L.L.C FZE
            </span>
          </span>
        </Link>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="site-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="menu-toggle__line"></span>
          <span className="menu-toggle__line"></span>
          <span className="menu-toggle__line"></span>
          <span className="visually-hidden">Toggle navigation</span>
        </button>

        <nav
          className={`site-nav${isMenuOpen ? " is-open" : ""}`}
          id="site-navigation"
          aria-label="Primary"
        >
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.label}
                className={`site-nav__link${active ? " site-nav__link--active" : ""}`}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
                {active &&(<span className="underline"></span>)}
              </Link>
            );
          })}
        </nav>
        <button className="header-button">
          Join Club
        </button>
      </div>
    </header>
  );
}
