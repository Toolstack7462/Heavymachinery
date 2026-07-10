import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/config/site";
import { site } from "@/config/site";
import { locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/blocks/PageHero";
import { Section } from "@/components/Section";
import { CtaBand } from "@/components/blocks/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { insights, getInsightBySlug } from "@/content/insights";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    insights.map((i) => ({ locale, slug: i.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getInsightBySlug(slug);
  if (!article) return {};
  return buildMetadata({
    locale,
    title: article.title,
    description: article.excerpt,
    path: `/insights/${slug}`,
  });
}

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const dict = getDictionary(locale);
  const article = getInsightBySlug(slug);
  if (!article) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    dateModified: article.date,
    author: { "@type": "Organization", name: site.fullName },
    publisher: { "@id": `${site.url}/#organization` },
    articleSection: article.category,
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <PageHero
        locale={locale}
        homeLabel={dict.breadcrumb.home}
        crumbs={[
          { label: dict.nav.insights, href: "/insights" },
          { label: article.title },
        ]}
        title={article.title}
        lead={article.excerpt}
      />
      <Section>
        <article className="mx-auto max-w-3xl">
          <p className="text-sm text-muted-foreground">
            {article.readMinutes} min read
          </p>
          <div className="prose-article mt-6">
            {article.body.map((block, i) => {
              if (block.type === "h2") return <h2 key={i}>{block.text}</h2>;
              if (block.type === "ul")
                return (
                  <ul key={i}>
                    {block.items.map((it, j) => (
                      <li key={j}>{it}</li>
                    ))}
                  </ul>
                );
              return <p key={i}>{block.text}</p>;
            })}
          </div>
        </article>
      </Section>
      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
