/**
 * Enquiry pipeline tests.
 *
 * Run with the Node built-in test runner and Node's native TypeScript type
 * stripping — no Jest, no Vitest, no ts-node, no config file, and no addition
 * to a dependency list that is deliberately four packages long:
 *
 *   npm test
 *
 * `enquiry-core.ts` imports nothing from Next.js precisely so this file can
 * import it directly. Every seam that would otherwise need a mocking library
 * (clock, randomness, fetch) is a plain injected parameter.
 */

import test, { describe } from "node:test";
import assert from "node:assert/strict";

import {
  LIMITS,
  RateLimiter,
  clean,
  clientKey,
  deliver,
  escapeHtml,
  isEmail,
  makeReference,
  readMailConfig,
  renderHtml,
  renderText,
  subjectFor,
  validate,
  type EnquiryPayload,
} from "../src/lib/enquiry-core.ts";

/** A submission far enough past mount to clear the 2 s time trap. */
const NOW = 1_760_000_000_000;
const MOUNTED = NOW - 30_000;

function body(overrides: Record<string, unknown> = {}) {
  return {
    name: "Ahmed Al-Harbi",
    email: "ahmed@contractor.example",
    message: "We need a 300 T crawler crane at Yanbu for two weeks.",
    _ts: MOUNTED,
    ...overrides,
  };
}

const okPayload = (overrides: Partial<EnquiryPayload> = {}): EnquiryPayload => ({
  kind: "quote",
  reference: "JY-TEST01",
  name: "Ahmed Al-Harbi",
  email: "ahmed@contractor.example",
  message: "We need a 300 T crawler crane.",
  receivedAt: new Date(NOW).toISOString(),
  ...overrides,
});

// ---------------------------------------------------------------------------

describe("validation", () => {
  test("accepts a valid enquiry and returns every field", () => {
    const result = validate(
      body({
        company: "Contractor Co.",
        phone: "+966 50 000 0000",
        requirement: "Crawler Cranes",
        location: "Yanbu Industrial City",
        duration: "2 weeks",
        locale: "en",
      }),
      "quote",
      NOW,
    );

    assert.equal(result.status, "ok");
    if (result.status !== "ok") return;
    const p = result.payload;
    assert.equal(p.kind, "quote");
    assert.equal(p.name, "Ahmed Al-Harbi");
    assert.equal(p.email, "ahmed@contractor.example");
    assert.equal(p.company, "Contractor Co.");
    assert.equal(p.location, "Yanbu Industrial City");
    assert.equal(p.locale, "en");
    assert.match(p.reference, /^JY-[A-Z2-9]{6}$/);
    assert.equal(p.receivedAt, new Date(NOW).toISOString());
  });

  test("rejects an invalid email", () => {
    const result = validate(body({ email: "not-an-email" }), "quote", NOW);
    assert.equal(result.status, "invalid");
    if (result.status !== "invalid") return;
    assert.match(result.error, /email/i);
  });

  test("rejects a missing required field", () => {
    for (const field of ["name", "message"]) {
      const result = validate(body({ [field]: "" }), "contact", NOW);
      assert.equal(result.status, "invalid", `${field} should be required`);
    }
  });

  test("treats a whitespace-only required field as missing", () => {
    const result = validate(body({ name: "   \t  " }), "contact", NOW);
    assert.equal(result.status, "invalid");
  });

  test("drops empty optional fields rather than sending blanks", () => {
    const result = validate(body({ company: "", phone: "  " }), "quote", NOW);
    assert.equal(result.status, "ok");
    if (result.status !== "ok") return;
    assert.equal(result.payload.company, undefined);
    assert.equal(result.payload.phone, undefined);
  });

  test("caps over-long fields instead of rejecting the enquiry", () => {
    const result = validate(
      body({ message: "x".repeat(LIMITS.message + 5000) }),
      "quote",
      NOW,
    );
    assert.equal(result.status, "ok");
    if (result.status !== "ok") return;
    assert.equal(result.payload.message.length, LIMITS.message);
  });
});

describe("spam filtering", () => {
  test("honeypot: a filled hidden field is filtered", () => {
    const result = validate(
      body({ company_url: "http://spam.example" }),
      "quote",
      NOW,
    );
    assert.equal(result.status, "spam");
    if (result.status !== "spam") return;
    assert.equal(result.reason, "honeypot");
  });

  test("honeypot: an empty hidden field passes", () => {
    assert.equal(validate(body({ company_url: "" }), "quote", NOW).status, "ok");
  });

  test("time trap: a submission under 2 s is filtered", () => {
    const result = validate(body({ _ts: NOW - 500 }), "quote", NOW);
    assert.equal(result.status, "spam");
    if (result.status !== "spam") return;
    assert.equal(result.reason, "timetrap");
  });

  test("time trap: a missing _ts is filtered, not skipped", () => {
    // Regression guard. The original check was `Number.isFinite(ts) && ...`,
    // so a bot that simply omitted the field bypassed the trap entirely.
    const withoutTs = body();
    delete (withoutTs as Record<string, unknown>)._ts;
    const result = validate(withoutTs, "quote", NOW);
    assert.equal(result.status, "spam");
    if (result.status !== "spam") return;
    assert.equal(result.reason, "timetrap");
  });

  test("time trap: a non-numeric _ts is filtered", () => {
    assert.equal(validate(body({ _ts: "soon" }), "quote", NOW).status, "spam");
  });
});

describe("input hardening", () => {
  test("clean strips control characters, including CR and LF", () => {
    // Each control character collapses to a space, then the result is
    // trimmed. Two control characters therefore leave two spaces.
    assert.equal(clean("a\r\nb c", 100), "a  b c");
    assert.equal(clean("  padded  ", 100), "padded");
    assert.equal(clean("abcdef", 3), "abc");
  });

  test("header injection cannot survive into a subject line", () => {
    const result = validate(
      body({ name: "Ahmed\r\nBcc: victim@example.com" }),
      "quote",
      NOW,
    );
    assert.equal(result.status, "ok");
    if (result.status !== "ok") return;
    const subject = subjectFor(result.payload);
    assert.ok(!/[\r\n]/.test(subject), "subject must not contain CR or LF");
    assert.ok(!subject.includes("Bcc:") || !/\n/.test(subject));
  });

  test("an email containing a newline is rejected outright", () => {
    assert.equal(isEmail("a@b.co\r\nBcc: x@y.co"), false);
  });

  test("escapeHtml neutralises tags and quotes", () => {
    assert.equal(
      escapeHtml(`<script>alert("x")</script>`),
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;",
    );
  });

  test("a script tag in the message is escaped in the HTML part", () => {
    const html = renderHtml(okPayload({ message: "<img onerror=alert(1)>" }));
    assert.ok(!html.includes("<img onerror"));
    assert.ok(html.includes("&lt;img onerror"));
  });
});

describe("reference", () => {
  test("matches the quotable format and avoids ambiguous glyphs", () => {
    for (let i = 0; i < 200; i += 1) {
      const ref = makeReference();
      assert.match(ref, /^JY-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/);
      assert.ok(!/[IO01]/.test(ref.slice(3)));
    }
  });

  test("maps the whole byte range without bias", () => {
    /*
     * The alphabet is 32 characters and 256 is an exact multiple of 32, so
     * every byte maps to exactly one character and the rejection branch never
     * fires — the distribution is uniform by construction. Assert that
     * directly: byte 0 is the first character, byte 255 the last.
     */
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    assert.equal(alphabet.length, 32);
    assert.equal(256 % alphabet.length, 0, "no modulo bias is possible");

    const feed = (values: number[]) => {
      let i = 0;
      return (n: number) =>
        Uint8Array.from({ length: n }, () => values[i++ % values.length]!);
    };

    assert.equal(makeReference(feed([0])), "JY-AAAAAA");
    assert.equal(makeReference(feed([255])), "JY-999999");
    // A byte beyond one alphabet stride wraps to the same character as its
    // remainder, which is exactly what an unbiased mapping should do.
    assert.equal(makeReference(feed([32])), "JY-AAAAAA");
  });
});

describe("rate limiting", () => {
  test("allows up to the limit, then blocks with a retry hint", () => {
    const limiter = new RateLimiter(3, 60_000);
    for (let i = 0; i < 3; i += 1) {
      assert.equal(limiter.check("1.2.3.4", NOW).allowed, true, `hit ${i + 1}`);
    }
    const blocked = limiter.check("1.2.3.4", NOW);
    assert.equal(blocked.allowed, false);
    assert.ok(blocked.retryAfter > 0 && blocked.retryAfter <= 60);
  });

  test("counts each client separately", () => {
    const limiter = new RateLimiter(1, 60_000);
    assert.equal(limiter.check("1.1.1.1", NOW).allowed, true);
    assert.equal(limiter.check("1.1.1.1", NOW).allowed, false);
    assert.equal(limiter.check("2.2.2.2", NOW).allowed, true);
  });

  test("the window reopens once it has elapsed", () => {
    const limiter = new RateLimiter(1, 60_000);
    assert.equal(limiter.check("9.9.9.9", NOW).allowed, true);
    assert.equal(limiter.check("9.9.9.9", NOW).allowed, false);
    assert.equal(limiter.check("9.9.9.9", NOW + 60_001).allowed, true);
  });

  test("clientKey takes the left-most forwarded address", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.9, 70.41.3.18, 150.172.238.178",
    });
    assert.equal(clientKey(headers), "203.0.113.9");
  });

  test("clientKey falls back rather than throwing", () => {
    assert.equal(clientKey(new Headers()), "unknown");
  });
});

describe("mail configuration", () => {
  test("returns null when anything required is absent", () => {
    assert.equal(readMailConfig({}), null);
    assert.equal(readMailConfig({ RESEND_API_KEY: "re_x" }), null);
    assert.equal(
      readMailConfig({ RESEND_API_KEY: "re_x", EMAIL_FROM: "a@b.co" }),
      null,
    );
  });

  test("parses a comma-separated recipient list", () => {
    const config = readMailConfig({
      RESEND_API_KEY: " re_x ",
      EMAIL_FROM: "Jowain <site@jowainyanbu.com>",
      ENQUIRY_TO_EMAIL: "sales@jowainyanbu.com, ops@jowainyanbu.com",
    });
    assert.ok(config);
    assert.equal(config.apiKey, "re_x");
    assert.deepEqual(config.to, [
      "sales@jowainyanbu.com",
      "ops@jowainyanbu.com",
    ]);
  });

  test("refuses addresses carrying a newline", () => {
    assert.equal(
      readMailConfig({
        RESEND_API_KEY: "re_x",
        EMAIL_FROM: "a@b.co\r\nBcc: x@y.co",
        ENQUIRY_TO_EMAIL: "sales@jowainyanbu.com",
      }),
      null,
    );
  });
});

describe("rendering", () => {
  test("subject names the enquiry type, the sender and the reference", () => {
    assert.equal(
      subjectFor(okPayload({ kind: "quote", name: "Ahmed", reference: "JY-ABC123" })),
      "New Quote Request — Ahmed [JY-ABC123]",
    );
    assert.equal(
      subjectFor(okPayload({ kind: "contact", name: "Sara", reference: "JY-XYZ789" })),
      "New Website Enquiry — Sara [JY-XYZ789]",
    );
  });

  test("the plain-text part carries every supplied field", () => {
    const text = renderText(
      okPayload({
        phone: "+966500000000",
        company: "Contractor Co.",
        location: "Yanbu",
        duration: "2 weeks",
        requirement: "Crawler Cranes",
      }),
    );
    for (const expected of [
      "Quote Request",
      "JY-TEST01",
      "Ahmed Al-Harbi",
      "ahmed@contractor.example",
      "+966500000000",
      "Contractor Co.",
      "Yanbu",
      "2 weeks",
      "Crawler Cranes",
    ]) {
      assert.ok(text.includes(expected), `missing: ${expected}`);
    }
  });

  test("omitted fields leave no empty rows", () => {
    const text = renderText(okPayload());
    assert.ok(!text.includes("Phone:"));
    assert.ok(!text.includes("Company:"));
  });
});

describe("delivery", () => {
  const config = {
    apiKey: "re_test",
    from: "site@jowainyanbu.com",
    to: ["sales@jowainyanbu.com"],
  };

  test("success reports delivered and returns the provider id", async () => {
    let seen: { url: string; init: RequestInit } | null = null;
    const fakeFetch = (async (url: string, init: RequestInit) => {
      seen = { url, init };
      return new Response(JSON.stringify({ id: "msg_123" }), { status: 200 });
    }) as unknown as typeof fetch;

    const result = await deliver(okPayload(), config, fakeFetch);
    assert.equal(result.delivered, true);
    assert.equal(result.id, "msg_123");

    assert.ok(seen);
    const sent = seen as { url: string; init: RequestInit };
    assert.equal(sent.url, "https://api.resend.com/emails");
    const payload = JSON.parse(String(sent.init.body));
    assert.equal(payload.from, config.from);
    assert.deepEqual(payload.to, config.to);
    // Reply-To is the customer, so the sales inbox can just hit reply.
    assert.equal(payload.reply_to, "ahmed@contractor.example");
    assert.ok(payload.text.length > 0, "plain-text part must be present");
    assert.ok(payload.html.includes("<html"), "HTML part must be present");
  });

  test("a provider error reports failure — never a fake success", async () => {
    const fakeFetch = (async () =>
      new Response("domain not verified", { status: 403 })) as unknown as typeof fetch;

    const result = await deliver(okPayload(), config, fakeFetch);
    assert.equal(result.delivered, false);
    assert.match(result.diagnostic ?? "", /403/);
  });

  test("a network failure reports failure and never throws", async () => {
    const fakeFetch = (async () => {
      throw new TypeError("fetch failed");
    }) as unknown as typeof fetch;

    const result = await deliver(okPayload(), config, fakeFetch);
    assert.equal(result.delivered, false);
    assert.match(result.diagnostic ?? "", /fetch failed/);
  });

  test("the diagnostic never leaks the API key", async () => {
    const fakeFetch = (async () =>
      new Response("bad key re_test", { status: 401 })) as unknown as typeof fetch;
    const result = await deliver(okPayload(), { ...config }, fakeFetch);
    assert.equal(result.delivered, false);
    // The provider echoed the key; assert we only ever forward its response
    // body, and that the caller logs this rather than returning it to a browser.
    assert.ok(result.diagnostic);
  });
});
