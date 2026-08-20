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
  /** Focus management for the mobile drawer (see the effect below). */
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  /** Sentinel at the top of the document; see the scroll effect below. */
  const sentinelRef = useRef<HTMLDivElement>(null);

  /**
   * Raise the header shadow once the page has scrolled off the top.
   *
   * Driven by an IntersectionObserver on an 8px sentinel sitting at the top of
   * the document, not by a scroll listener. A `scroll` handler runs on every
   * scroll frame for the entire life of the page on every route; this fires
   * exactly twice, when the sentinel crosses the viewport edge in either
   * direction. The sentinel is 8px tall with a matching negative margin, so it
   * reproduces the previous `scrollY > 8` threshold at zero layout cost.
   */
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    // Without IntersectionObserver the header simply keeps its resting
    // border, which is the `scrolled === false` default. Nothing to set.
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry!.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
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

  /**
   * Focus containment for the mobile drawer.
   *
   * The drawer is a modal overlay: it covers the page and the backdrop is
   * inert. Without this, Tab walked straight out of the open drawer and into
   * the page behind it — a keyboard or screen-reader user ended up on the hero
   * buttons they could not see, with no way to tell they had left the menu.
   *
   * On open, focus moves into the drawer; Tab and Shift+Tab cycle within it;
   * on close, focus returns to the button that opened it, which is where a
   * keyboard user expects to land.
   */
  useEffect(() => {
    if (!mobileOpen) return;
    const panel = drawerRef.current;
    if (!panel) return;
    // Captured now so the cleanup does not read a ref that may have changed.
    const trigger = menuButtonRef.current;

    const focusable = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0);

    focusable()[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !panel!.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      /*
       * Return focus to the button that opened the drawer.
       *
       * By cleanup time React may already have detached the panel, which
       * leaves `document.activeElement` as <body> rather than a node inside
       * it — so testing `panel.contains(...)` alone silently skipped the
       * restore and dropped keyboard users at the top of the document. Treat
       * "focus is nowhere" as "focus was in the drawer", and leave it alone
       * only when something else has legitimately taken it.
       */
      const active = document.activeElement;
      const focusLost = !active || active === document.body;
      if (focusLost || panel.contains(active)) trigger?.focus();
    };
  }, [mobileOpen]);

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
    <>
      {/*
        Scroll sentinel. In normal flow at the very top of the document, 8px
        tall with a matching negative margin so it occupies no space. The
        header itself is sticky and never leaves the viewport, so it cannot
        observe its own position.
      */}
      <div ref={sentinelRef} aria-hidden="true" className="h-2 -mb-2" />
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
            ref={menuButtonRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink-900 transition-colors hover:bg-ink-50 active:bg-ink-100"
            onClick={() => setMobileOpen(true)}
            aria-label={dict.nav.openMenu}
            aria-expanded={mobileOpen}
            aria-haspopup="dialog"
            aria-controls="mobile-drawer"
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
          <div
            id="mobile-drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label={dict.nav.mobileLabel}
            className="animate-rise absolute inset-y-0 end-0 flex w-[88%] max-w-sm flex-col bg-white shadow-2xl"
          >
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
    </>
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
