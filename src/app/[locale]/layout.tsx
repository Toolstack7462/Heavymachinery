import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Archivo, Source_Sans_3, Noto_Sans_Arabic } from "next/font/google";
import "../globals.css";
import { site, type Locale } from "@/config/site";
import { isLocale, dir, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPrimaryNav } from "@/config/nav";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/JsonLd";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

/**
 * Typography: two faces on a real contrast axis.
 *
 * Archivo, a tight industrial grotesque, carries headings and UI: engineered
 * rather than friendly, and it holds up at the display sizes the hero needs.
 * Source Sans 3 carries body copy; it is humanist, with open apertures, and
 * designed for long-form UI reading. Pairing a grotesque with a humanist gives
 * the page a genuine textural difference. Two grotesques (the obvious Archivo
 * plus Inter default) would have read as one slightly inconsistent family.
 *
 * Noto Sans Arabic carries the Arabic locale, where neither Latin face has
 * coverage. Only the weights actually used are requested.
 */
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const dict = getDictionary(typedLocale);
  const nav = getPrimaryNav(dict, typedLocale);
  const isArabic = typedLocale === "ar";

  return (
    <html
      lang={typedLocale}
      dir={dir(typedLocale)}
      className={`${archivo.variable} ${sourceSans.variable} ${notoArabic.variable}`}
      // Arabic swaps both font stacks to the Arabic face at the root, so no
      // component needs to know which locale it is rendering in.
      style={
        isArabic
          ? {
              ["--font-body" as string]: "var(--font-arabic)",
              ["--font-display" as string]: "var(--font-arabic)",
            }
          : undefined
      }
      suppressHydrationWarning
    >
      <body>
        {/*
          Flags that scripting is available, before the first paint, so the
          reveal CSS can hide sections it is about to animate. Without this
          (no JS, or a crawler that does not run it) every section renders
          visible. The animation is an enhancement, never a gate.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <a href="#main" className="skip-link">
          {dict.nav.skipToContent}
        </a>
        <Header locale={typedLocale} dict={dict} nav={nav} />
        <main id="main">{children}</main>
        <Footer locale={typedLocale} dict={dict} />
        <RevealObserver />
      </body>
    </html>
  );
}

export const metadata = {
  metadataBase: new URL(site.url),
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  colorScheme: "light" as const,
};
