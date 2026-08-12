"use client";

import { useSyncExternalStore } from "react";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localeHref } from "@/lib/utils";
import { LogoMark } from "@/components/Logo";
import { Button } from "@/components/ui/Button";

/**
 * `not-found.tsx` cannot receive route params, and reading the locale from a
 * server API here (headers/cookies) would mark EVERY route that can render this
 * boundary as dynamic — the whole site would stop being prerendered for the
 * sake of a 404.
 *
 * So the locale comes from `<html lang>`, which the locale layout already sets
 * correctly, read on the client. The first paint uses the default locale and
 * corrects itself immediately; the 404 status code and the layout chrome are
 * server-rendered either way.
 */
/** `<html lang>` never changes after load, so the subscribe callback is a no-op. */
const subscribe = () => () => {};
const getClientLang = () => document.documentElement.lang;
const getServerLang = () => defaultLocale;

export default function NotFound() {
  const lang = useSyncExternalStore(subscribe, getClientLang, getServerLang);
  const locale = isLocale(lang) ? lang : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-20">
      <div className="max-w-md text-center">
        <LogoMark size={64} className="mx-auto" />
        <p
          dir="ltr"
          className="mt-8 font-heading text-6xl font-extrabold text-brand-600"
        >
          404
        </p>
        <h1 className="mt-4 text-2xl">{dict.notFound.title}</h1>
        <p className="mt-3 text-muted-foreground">{dict.notFound.body}</p>
        <Button
          href={localeHref(locale, "/")}
          variant="secondary"
          className="mt-8"
          iconEnd="arrowRight"
        >
          {dict.actions.backHome}
        </Button>
      </div>
    </div>
  );
}
