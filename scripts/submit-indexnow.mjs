#!/usr/bin/env node
/**
 * Submit every URL in the sitemap to IndexNow.
 *
 * IndexNow is the one search-submission path that needs no account and no
 * dashboard: Bing, Yandex, Seznam and Naver share the protocol, and a single
 * POST notifies all of them. Ownership is proved by hosting a key file at the
 * site root, which is why `public/<key>.txt` exists and must stay there.
 *
 * Google does NOT participate in IndexNow. Google discovery is the sitemap
 * plus Search Console, which needs a human to own the property once. See
 * docs/SEO.md.
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs                       # live site
 *   node scripts/submit-indexnow.mjs --dry                  # print, do not send
 *   INDEXNOW_KEY=<key> node scripts/submit-indexnow.mjs     # override the key
 */

import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = (process.env.SITE_URL || "https://jowainyanbu.com").replace(/\/$/, "");
const HOST = new URL(SITE).host;
const DRY = process.argv.includes("--dry");

/** The key is whatever `public/<32 hex>.txt` is named; one source of truth. */
async function resolveKey() {
  if (process.env.INDEXNOW_KEY) return process.env.INDEXNOW_KEY;
  const files = await readdir(path.join(root, "public"));
  const keyFile = files.find((f) => /^[0-9a-f]{8,128}\.txt$/i.test(f));
  if (!keyFile) {
    throw new Error(
      "No IndexNow key file found in public/. Create public/<key>.txt " +
        "containing the key, or set INDEXNOW_KEY.",
    );
  }
  return keyFile.replace(/\.txt$/i, "");
}

async function sitemapUrls() {
  const res = await fetch(`${SITE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function main() {
  const key = await resolveKey();
  const urlList = await sitemapUrls();
  console.log(`host     ${HOST}`);
  console.log(`key      ${key.slice(0, 6)}… (${key.length} chars)`);
  console.log(`urls     ${urlList.length}`);

  // Prove the key file is actually reachable before claiming ownership.
  const probe = await fetch(`${SITE}/${key}.txt`);
  const body = probe.ok ? (await probe.text()).trim() : "";
  if (!probe.ok || body !== key) {
    throw new Error(
      `Key file check failed: ${SITE}/${key}.txt returned ${probe.status}` +
        (probe.ok ? ` with body "${body.slice(0, 40)}"` : "") +
        ". IndexNow will reject the submission until this serves the key verbatim.",
    );
  }
  console.log(`keyfile  ok (${SITE}/${key}.txt)`);

  if (DRY) {
    console.log("\n--dry: not submitting. First five URLs:");
    urlList.slice(0, 5).forEach((u) => console.log("  " + u));
    return;
  }

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key,
      keyLocation: `${SITE}/${key}.txt`,
      urlList,
    }),
  });

  // 200 accepted, 202 accepted but key still validating. Both are success.
  const text = await res.text().catch(() => "");
  console.log(`\nIndexNow responded ${res.status} ${text.slice(0, 200)}`);
  if (res.status !== 200 && res.status !== 202) process.exitCode = 1;
}

main().catch((error) => {
  console.error(String(error.message ?? error));
  process.exitCode = 1;
});
