"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/config/nav";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/config/site";
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
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /**
   * Close every menu when the route changes — including on browser back and
   * forward. Done as a render-phase state adjustment (React's documented
   * "adjusting state when a prop changes" pattern) rather than in an effect,
   * which would render the stale open menu for one frame first.
   */
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMobileOpen(false);
    setOpenMenu(null);
  }

  // Lock scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Escape closes any open menu; outside clicks close the dropdown.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  const isActive = (href: string) => {
    const base = href.split("?")[0];
    const full = localeHref(locale, base);
    if (base === "/") return pathname === full;
    return pathname === full || pathname.startsWith(`${full}/`);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-[var(--z-sticky)] w-full bg-white transition-shadow duration-300",
        scrolled
          ? "border-b border-ink-150 shadow-[0_1px_16px_-10px_rgba(11,20,40,0.45)]"
          : "border-b border-ink-100",
      )}
    >
      <div className="container-page flex h-[76px] items-center justify-between gap-4">
        <Logo locale={locale} priority />

        {/* Desktop navigation */}
        <div ref={navRef} className="hidden items-center gap-0.5 lg:flex">
          <nav
            className="flex items-center gap-0.5"
            aria-label={dict.nav.primaryLabel}
          >
            {nav.map((item) => {
              const active = isActive(item.href);
              if (!item.children) {
                return (
                  <Link
                    key={item.href}
                    href={localeHref(locale, item.href)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-md px-2.5 py-2 text-[0.9375rem] font-medium transition-colors",
                      active
                        ? "text-brand-700"
                        : "text-ink-700 hover:bg-ink-50 hover:text-ink-900",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              }
              const open = openMenu === item.href;
              return (
                <div
                  key={item.href}
                  className="relative"
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") setOpenMenu(item.href);
                  }}
                  onPointerLeave={(event) => {
                    if (event.pointerType === "mouse") setOpenMenu(null);
                  }}
                >
                  <button
                    type="button"
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-2.5 py-2 text-[0.9375rem] font-medium transition-colors",
                      active
                        ? "text-brand-700"
                        : "text-ink-700 hover:bg-ink-50 hover:text-ink-900",
                    )}
                    aria-expanded={open}
                    aria-controls={`menu-${item.href.replace(/\W/g, "")}`}
                    onClick={() => setOpenMenu(open ? null : item.href)}
                  >
                    {item.label}
                    <Icon
                      name="chevronRight"
                      size={14}
                      className={cn(
                        "rotate-90 opacity-60 transition-transform duration-200",
                        open && "-rotate-90",
                      )}
                    />
                  </button>
                  {open && (
                    <div
                      id={`menu-${item.href.replace(/\W/g, "")}`}
                      className="absolute top-full start-0 pt-2"
                    >
                      <div className="animate-rise w-[22rem] rounded-xl border border-ink-150 bg-white p-2 shadow-[var(--shadow-elevated)]">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={localeHref(locale, child.href)}
                            className="group block rounded-lg px-3 py-2.5 transition-colors hover:bg-ink-50"
                          >
                            <span className="block text-sm font-semibold text-ink-900 group-hover:text-brand-700">
                              {child.label}
                            </span>
                            {child.description && (
                              <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
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

          <span className="mx-2 h-6 w-px bg-ink-150" aria-hidden="true" />
          <LocaleSwitcher locale={locale} dict={dict} />
          <Button
            href={localeHref(locale, "/request-a-quote")}
            size="sm"
            iconEnd="arrowRight"
            className="ms-2"
          >
            {dict.actions.requestShort}
          </Button>
        </div>

        {/* Mobile trigger */}
        <div className="flex items-center gap-1 lg:hidden">
          <LocaleSwitcher locale={locale} dict={dict} />
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink-900 transition-colors hover:bg-ink-50 active:bg-ink-100"
            onClick={() => setMobileOpen(true)}
            aria-label={dict.nav.openMenu}
            aria-expanded={mobileOpen}
          >
            <Icon name="menu" size={24} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[var(--z-drawer)] lg:hidden">
          <div
            className="absolute inset-0 bg-ink-950/60"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="animate-rise absolute inset-y-0 end-0 flex w-[88%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex h-[76px] items-center justify-between border-b border-ink-150 px-5">
              <Logo locale={locale} size={38} />
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-ink-50"
                onClick={() => setMobileOpen(false)}
                aria-label={dict.nav.closeMenu}
              >
                <Icon name="close" size={24} />
              </button>
            </div>
            <nav
              className="flex-1 overflow-y-auto px-4 py-4"
              aria-label={dict.nav.mobileLabel}
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
            <div className="border-t border-ink-150 p-4">
              <Button
                href={localeHref(locale, "/request-a-quote")}
                className="w-full"
                iconEnd="arrowRight"
              >
                {dict.actions.request}
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
          "block rounded-lg px-3 py-3 font-medium",
          isActive(item.href)
            ? "bg-brand-50 text-brand-700"
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
        type="button"
        className="flex w-full items-center justify-between rounded-lg px-3 py-3 font-medium text-ink-800 hover:bg-ink-50"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {item.label}
        <Icon
          name="chevronRight"
          size={18}
          className={cn(
            "rotate-90 transition-transform duration-200",
            open && "-rotate-90",
          )}
        />
      </button>
      {open && (
        <div className="pb-2 ps-4">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={localeHref(locale, child.href)}
              className="block rounded-lg px-3 py-2.5 text-sm text-ink-600 hover:bg-ink-50 hover:text-ink-900"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
