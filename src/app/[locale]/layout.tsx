import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Lexend, Source_Sans_3 } from "next/font/google";
import "../globals.css";
import { site, type Locale } from "@/config/site";
import { isLocale, dir, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPrimaryNav } from "@/config/nav";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingCTA } from "@/components/layout/FloatingCTA";
import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-lexend",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-source-sans",
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
  const nav = getPrimaryNav(dict);

  return (
    <html
      lang={typedLocale}
      dir={dir(typedLocale)}
      className={`${lexend.variable} ${sourceSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {/* Arabic translation-under-review notice (editable placeholder policy) */}
        {typedLocale === "ar" && dict.meta.translationPending && (
          <div className="bg-brand-50 text-brand-900 text-center text-xs py-1.5 px-4 border-b border-brand-100">
            {dict.meta.translationPending}
          </div>
        )}
        <Header locale={typedLocale} dict={dict} nav={nav} />
        <main id="main">{children}</main>
        <Footer locale={typedLocale} dict={dict} />
        <FloatingCTA dict={dict} />
      </body>
    </html>
  );
}

export const metadata = {
  metadataBase: new URL(site.url),
};
