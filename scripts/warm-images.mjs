#!/usr/bin/env node
/**
 * Pre-warm the Next image cache after a deploy.
 *
 * Next optimises each image the first time it is requested at a given width,
 * then caches the result. That one-time cost is small on a fast box and large
 * on CloudLinux shared hosting, where CPU is capped per account: measured on a
 * throttled mobile profile, the fleet page took 54s to settle its images cold
 * and 6.4s warm. Whoever arrives first after a deploy pays the difference, and
 * under CPU pressure some of those requests simply fail.
 *
 * So we pay it deliberately, from here, before anyone visits. This walks the
 * sitemap, collects every /_next/image URL the pages actually reference, and
 * requests each one.
 *
 * Usage:
 *   node scripts/warm-images.mjs                       # live site
 *   SITE_URL=http://127.0.0.1:3111 node scripts/warm-images.mjs
 */

const SITE = (process.env.SITE_URL || "https://jowainyanbu.com").replace(/\/$/, "");
const CONCURRENCY = Number(process.env.WARM_CONCURRENCY || 4);

async function sitemapPaths() {
  const res = await fetch(`${SITE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
}

/** Every distinct /_next/image URL referenced by a page. */
async function imageUrlsOn(path) {
  const res = await fetch(`${SITE}${path}`);
  if (!res.ok) return [];
  const html = await res.text();
  const found = new Set();
  for (const m of html.matchAll(/\/_next\/image\?url=[^"'\s\\]+/g)) {
    found.add(m[0].replace(/&amp;/g, "&"));
  }
  return [...found];
}

/** Run tasks with a small pool so a shared host is not hammered. */
async function pool(items, limit, worker) {
  let index = 0;
  const results = [];
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (index < items.length) {
        const i = index++;
        results[i] = await worker(items[i]).catch((e) => ({ error: String(e) }));
      }
    }),
  );
  return results;
}

async function main() {
  const paths = await sitemapPaths();
  console.log(`pages    ${paths.length}`);

  const perPage = await pool(paths, CONCURRENCY, imageUrlsOn);
  const urls = [...new Set(perPage.flat().filter(Boolean))];
  console.log(`images   ${urls.length} distinct optimised variants`);

  let ok = 0, failed = 0, bytes = 0;
  const started = Date.now();
  await pool(urls, CONCURRENCY, async (u) => {
    const res = await fetch(`${SITE}${u}`);
    if (res.ok) {
      const buf = await res.arrayBuffer();
      bytes += buf.byteLength;
      ok++;
    } else {
      failed++;
      console.error(`  ${res.status} ${u.slice(0, 90)}`);
    }
  });

  const secs = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`warmed   ${ok} ok, ${failed} failed, ${Math.round(bytes / 1024)}KB in ${secs}s`);
  if (failed) process.exitCode = 1;
}

main().catch((error) => {
  console.error(String(error.message ?? error));
  process.exitCode = 1;
});
