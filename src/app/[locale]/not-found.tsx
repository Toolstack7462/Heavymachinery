import Link from "next/link";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localeHref } from "@/lib/utils";
import { LogoMark } from "@/components/Logo";

export default function NotFound() {
  const dict = getDictionary(defaultLocale);
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-20">
      <div className="text-center max-w-md">
        <LogoMark size={56} className="mx-auto" />
        <p className="mt-8 text-7xl font-heading font-extrabold text-brand-500">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold text-ink-900">
          {dict.notFound.title}
        </h1>
        <p className="mt-3 text-muted-foreground">{dict.notFound.body}</p>
        <Link
          href={localeHref(defaultLocale, "/")}
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-ink-900 px-6 py-3 text-white font-semibold hover:bg-ink-800 transition-colors"
        >
          {dict.notFound.cta}
        </Link>
      </div>
    </div>
  );
}
