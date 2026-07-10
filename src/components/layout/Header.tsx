"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/config/nav";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/config/site";
import { site, telLink } from "@/config/site";
import { localeHref, cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/Button";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";

export function Header({
  locale,
  dict,
  nav,
}: {
  locale: Locale;
  dict: Dictionary;
  nav: NavLink[];
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change.
  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  // Lock scroll when mobile menu open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Escape closes any open menu (keyboard accessibility).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) => {
    const full = localeHref(locale, href);
    if (href === "/") return pathname === full;
    return pathname.startsWith(full);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur border-b border-ink-100 shadow-[0_2px_16px_-12px_rgba(16,17,20,0.4)]"
          : "bg-white border-b border-transparent",
      )}
    >
      <div className="container-page flex items-center justify-between h-[72px] gap-4">
        <Logo locale={locale} />

        {/* Desktop nav */}
        <nav
          className="hidden lg:flex items-center gap-1"
          aria-label="Primary"
        >
          {nav.map((item) => {
            const active = isActive(item.href);
            if (!item.children) {
              return (
                <Link
                  key={item.href}
                  href={localeHref(locale, item.href)}
                  className={cn(
                    "px-3 py-2 rounded-md text-[0.95rem] font-medium transition-colors",
                    active
                      ? "text-brand-700"
                      : "text-ink-700 hover:text-ink-900 hover:bg-ink-50",
                  )}
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.href)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  className={cn(
                    "px-3 py-2 rounded-md text-[0.95rem] font-medium transition-colors inline-flex items-center gap-1",
                    active
                      ? "text-brand-700"
                      : "text-ink-700 hover:text-ink-900 hover:bg-ink-50",
                  )}
                  aria-expanded={openMenu === item.href}
                  aria-haspopup="true"
                  onClick={() =>
                    setOpenMenu(openMenu === item.href ? null : item.href)
                  }
                >
                  {item.label}
                  <Icon
                    name="chevronRight"
                    size={15}
                    className={cn(
                      "rotate-90 transition-transform opacity-60",
                      openMenu === item.href && "-rotate-90",
                    )}
                  />
                </button>
                {openMenu === item.href && (
                  <div className="absolute top-full start-0 pt-2">
                    <div className="w-[320px] rounded-xl border border-ink-100 bg-white p-2 shadow-[var(--shadow-elevated)]">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={localeHref(locale, child.href)}
                          className="block rounded-lg px-3 py-2.5 hover:bg-ink-50 transition-colors group"
                        >
                          <span className="block text-sm font-semibold text-ink-900 group-hover:text-brand-700">
                            {child.label}
                          </span>
                          {child.description && (
                            <span className="block text-xs text-muted-foreground mt-0.5">
                              {child.description}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-2">
          <LocaleSwitcher locale={locale} />
          <a
            href={telLink()}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-800 hover:text-brand-700 px-2"
          >
            <Icon name="phone" size={16} />
            <span className="tabular-nums">{site.contact.phonePrimary}</span>
          </a>
          <Button href={localeHref(locale, "/request-a-quote")} size="sm" iconEnd="arrowRight">
            {dict.actions.requestQuote}
          </Button>
        </div>

        {/* Mobile trigger */}
        <button
          className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-ink-900 hover:bg-ink-50"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Icon name="menu" size={24} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-ink-900/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 end-0 w-[86%] max-w-sm bg-white shadow-2xl flex flex-col animate-rise">
            <div className="flex items-center justify-between h-[72px] px-5 border-b border-ink-100">
              <Logo locale={locale} />
              <button
                className="inline-flex items-center justify-center w-11 h-11 rounded-lg hover:bg-ink-50"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <Icon name="close" size={24} />
              </button>
            </div>
            <nav
              className="flex-1 overflow-y-auto px-4 py-4"
              aria-label="Mobile"
            >
              {nav.map((item) => (
                <MobileNavItem
                  key={item.href}
                  item={item}
                  locale={locale}
                  isActive={isActive}
                />
              ))}
            </nav>
            <div className="p-4 border-t border-ink-100 space-y-3">
              <div className="flex items-center justify-between">
                <LocaleSwitcher locale={locale} />
                <a
                  href={telLink()}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-800"
                >
                  <Icon name="phone" size={16} />
                  {site.contact.phonePrimary}
                </a>
              </div>
              <Button
                href={localeHref(locale, "/request-a-quote")}
                className="w-full"
                iconEnd="arrowRight"
              >
                {dict.actions.requestQuote}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileNavItem({
  item,
  locale,
  isActive,
}: {
  item: NavLink;
  locale: Locale;
  isActive: (href: string) => boolean;
}) {
  const [open, setOpen] = useState(false);
  if (!item.children) {
    return (
      <Link
        href={localeHref(locale, item.href)}
        className={cn(
          "block px-3 py-3 rounded-lg font-medium",
          isActive(item.href)
            ? "text-brand-700 bg-brand-50"
            : "text-ink-800 hover:bg-ink-50",
        )}
      >
        {item.label}
      </Link>
    );
  }
  return (
    <div>
      <button
        className="w-full flex items-center justify-between px-3 py-3 rounded-lg font-medium text-ink-800 hover:bg-ink-50"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {item.label}
        <Icon
          name="chevronRight"
          size={18}
          className={cn("rotate-90 transition-transform", open && "-rotate-90")}
        />
      </button>
      {open && (
        <div className="ps-4 pb-2">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={localeHref(locale, child.href)}
              className="block px-3 py-2.5 rounded-lg text-sm text-ink-600 hover:bg-ink-50 hover:text-ink-900"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
