/**
 * ============================================================================
 *  ENQUIRY CORE — validation, spam filtering, rate limiting, email rendering
 * ============================================================================
 *  Deliberately free of any `next/*` import so it can be unit-tested with the
 *  Node built-in test runner and no test framework, no bundler and no mocks.
 *  The thin Next.js adapter lives in `enquiry.ts`.
 *
 *  Nothing here performs I/O except `deliver()`, which is a single `fetch` to
 *  the configured email provider. There is no SDK dependency: Resend's REST
 *  API is one POST, and adding a package to make one HTTP call would be a poor
 *  trade on a site whose whole runtime dependency list is four entries.
 * ============================================================================
 */

/** Field length caps. Generous for a human, hostile to a payload bomb. */
export const LIMITS = {
  name: 120,
  email: 254, // RFC 5321 maximum
  company: 160,
  phone: 40,
  requirement: 160,
  location: 160,
  duration: 80,
  message: 5000,
  locale: 8,
  /** Whole request body, bytes. */
  body: 64 * 1024,
} as const;

export type EnquiryKind = "quote" | "contact";

export interface EnquiryPayload {
  kind: EnquiryKind;
  reference: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  requirement?: string;
  location?: string;
  duration?: string;
  message: string;
  locale?: string;
  receivedAt: string;
}

/**
 * Outcome of validating a submission.
 *
 * `spam` is distinct from `invalid` because the two get opposite responses:
 * a spam hit is answered with 200 OK so the bot learns nothing, while a
 * genuine validation failure gets a 422 the real user can act on.
 */
export type ValidationResult =
  | { status: "ok"; payload: EnquiryPayload }
  | { status: "spam"; reason: "honeypot" | "timetrap" }
  | { status: "invalid"; error: string };

// ---------------------------------------------------------------------------
// Reference
// ---------------------------------------------------------------------------

/**
 * Human-quotable reference, e.g. "JY-8QK3R2" — short enough to read down a
 * phone line, unique enough to find in an inbox.
 *
 * Uses `crypto.getRandomValues` rather than `Math.random()`: with no datastore
 * to check collisions against, the reference has to be unguessable on its own.
 * Modulo bias across a 32-character alphabet drawn from a 256-value byte is
 * removed by rejecting the short tail.
 */
export function makeReference(
  randomBytes: (n: number) => Uint8Array = defaultRandomBytes,
): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/0/1
  const limit = 256 - (256 % alphabet.length); // 256 for a 32-char alphabet
  let out = "";
  while (out.length < 6) {
    for (const byte of randomBytes(8)) {
      if (out.length === 6) break;
      if (byte >= limit) continue; // reject, keeps the distribution flat
      out += alphabet[byte % alphabet.length];
    }
  }
  return `JY-${out}`;
}

function defaultRandomBytes(n: number): Uint8Array {
  const buf = new Uint8Array(n);
  crypto.getRandomValues(buf);
  return buf;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/**
 * Collapse anything to a trimmed string and cap it.
 *
 * Control characters are stripped rather than rejected. They have no business
 * in any of these fields, and CR/LF specifically are the payload of a header
 * injection attempt — removing them here means the email builder downstream
 * cannot be tricked into forging a header, no matter what it does with the value.
 */
export function clean(value: unknown, max: number): string {
  return String(value ?? "")
    .replace(/\p{Cc}/gu, " ")
    .trim()
    .slice(0, max);
}

/**
 * Email shape check.
 *
 * Intentionally the same permissive pattern the browser and the client-side
 * form already apply, plus a length cap and a rejection of the embedded
 * newlines that make header injection possible. Anything stricter starts
 * rejecting valid addresses, and the address is verified for real the moment
 * a reply bounces.
 */
export function isEmail(value: string): boolean {
  return (
    value.length <= LIMITS.email &&
    !/[\r\n]/.test(value) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}

/**
 * Validate a decoded JSON body into a deliverable payload.
 *
 * @param now  injected so the time-trap is testable without waiting.
 */
export function validate(
  body: Record<string, unknown>,
  kind: EnquiryKind,
  now: number = Date.now(),
  makeRef: () => string = () => makeReference(),
): ValidationResult {
  // Honeypot — a real browser never fills an off-screen field.
  if (typeof body.company_url === "string" && body.company_url.trim() !== "") {
    return { status: "spam", reason: "honeypot" };
  }

  /*
   * Time trap. The original only fired when `_ts` parsed to a finite number,
   * so a bot that simply omitted the field skipped the check entirely. A
   * missing or unparseable `_ts` is now itself a fail: the real form always
   * sends one, because it records the value on mount.
   */
  const timestamp = Number(body._ts);
  if (!Number.isFinite(timestamp) || now - timestamp < 2000) {
    return { status: "spam", reason: "timetrap" };
  }

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const message = clean(body.message, LIMITS.message);

  if (!name) return { status: "invalid", error: "A name is required." };
  if (!isEmail(email))
    return { status: "invalid", error: "A valid email address is required." };
  if (!message) return { status: "invalid", error: "A message is required." };

  const optional = (key: string, max: number) => {
    const value = clean(body[key], max);
    return value === "" ? undefined : value;
  };

  return {
    status: "ok",
    payload: {
      kind,
      reference: makeRef(),
      name,
      email,
      company: optional("company", LIMITS.company),
      phone: optional("phone", LIMITS.phone),
      requirement: optional("requirement", LIMITS.requirement),
      location: optional("location", LIMITS.location),
      duration: optional("duration", LIMITS.duration),
      message,
      locale: optional("locale", LIMITS.locale),
      receivedAt: new Date(now).toISOString(),
    },
  };
}

// ---------------------------------------------------------------------------
// Rate limiting
// ---------------------------------------------------------------------------

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the caller may try again. Only meaningful when blocked. */
  retryAfter: number;
}

/**
 * Fixed-window in-memory limiter.
 *
 * Correct for the deployment targets that actually apply here — a single
 * long-lived Node process behind Passenger, PM2 or systemd, which is what
 * Hostinger Business, a VPS and Docker all give us.
 *
 * KNOWN LIMITATION, stated rather than hidden: on a serverless platform each
 * instance keeps its own counter, so the effective limit is per instance, not
 * global. For this site that is an acceptable ceiling — the honeypot and time
 * trap do the heavy lifting and the endpoint sends mail rather than mutating
 * data. If it ever needs to be exact, back it with Upstash/Redis behind the
 * same interface; nothing else has to change.
 */
export class RateLimiter {
  private hits = new Map<string, { count: number; resetAt: number }>();
  private readonly max: number;
  private readonly windowMs: number;

  /*
   * Fields are declared and assigned explicitly rather than via TypeScript
   * parameter properties: parameter properties emit runtime code, so Node's
   * strip-only type removal rejects them, and the test suite runs this file
   * directly through `node --test` with no build step.
   */
  constructor(max = 5, windowMs = 10 * 60 * 1000) {
    this.max = max;
    this.windowMs = windowMs;
  }

  check(key: string, now: number = Date.now()): RateLimitResult {
    // Opportunistic sweep; the map only ever holds active windows.
    if (this.hits.size > 5000) {
      for (const [k, v] of this.hits) if (v.resetAt <= now) this.hits.delete(k);
    }

    const entry = this.hits.get(key);
    if (!entry || entry.resetAt <= now) {
      this.hits.set(key, { count: 1, resetAt: now + this.windowMs });
      return { allowed: true, retryAfter: 0 };
    }
    if (entry.count >= this.max) {
      return {
        allowed: false,
        retryAfter: Math.ceil((entry.resetAt - now) / 1000),
      };
    }
    entry.count += 1;
    return { allowed: true, retryAfter: 0 };
  }

  /** Test seam. */
  reset(): void {
    this.hits.clear();
  }
}

/**
 * Best-effort client identity for rate limiting.
 *
 * The left-most `x-forwarded-for` entry is the client as seen by the first
 * proxy. It is spoofable in principle, which is why this only ever gates a
 * contact form and never an authorisation decision.
 */
export function clientKey(headers: {
  get(name: string): string | null;
}): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? headers.get("cf-connecting-ip") ?? "unknown";
}

// ---------------------------------------------------------------------------
// Email rendering
// ---------------------------------------------------------------------------

const KIND_LABEL: Record<EnquiryKind, string> = {
  quote: "Quote Request",
  contact: "Website Enquiry",
};

/** Subject line, e.g. `New Quote Request — Ahmed Al-Harbi [JY-8QK3R2]`. */
export function subjectFor(payload: EnquiryPayload): string {
  return `New ${KIND_LABEL[payload.kind]} — ${payload.name} [${payload.reference}]`;
}

/** Ordered rows for the email body. Empty fields are dropped, not blanked. */
function rows(payload: EnquiryPayload): Array<[string, string]> {
  const all: Array<[string, string | undefined]> = [
    ["Enquiry type", KIND_LABEL[payload.kind]],
    ["Reference", payload.reference],
    ["Name", payload.name],
    ["Email", payload.email],
    ["Phone", payload.phone],
    ["Company", payload.company],
    ["Equipment / service", payload.requirement],
    ["Project location", payload.location],
    ["Duration", payload.duration],
    ["Language", payload.locale === "ar" ? "Arabic" : payload.locale === "en" ? "English" : payload.locale],
    ["Received", payload.receivedAt],
  ];
  return all.filter((row): row is [string, string] => Boolean(row[1]));
}

/** Escape for interpolation into HTML. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Plain-text part — the fallback every client can render. */
export function renderText(payload: EnquiryPayload): string {
  const lines = rows(payload).map(([label, value]) => `${label}: ${value}`);
  return [
    `New ${KIND_LABEL[payload.kind]} from the Jowain Yanbu Est. website`,
    "",
    ...lines,
    "",
    "Message:",
    payload.message,
    "",
    `Reply directly to this email to reach ${payload.name}.`,
  ].join("\n");
}

/**
 * HTML part. Table layout and inline styles on purpose — this has to survive
 * Outlook and the Gmail app, neither of which is a modern rendering engine.
 */
export function renderHtml(payload: EnquiryPayload): string {
  const cells = rows(payload)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 16px 8px 0;color:#4b5876;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>
          <td style="padding:8px 0;color:#14203a;font-size:14px;font-weight:600">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en"><body style="margin:0;background:#f5f7fb;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fb;padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border:1px solid #e4e9f2;border-radius:12px;overflow:hidden">
        <tr><td style="background:#14203a;padding:20px 24px">
          <div style="color:#ffffff;font-size:16px;font-weight:800;letter-spacing:.02em">JOWAIN YANBU EST.</div>
          <div style="color:#9bb2e9;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;margin-top:2px">${escapeHtml(KIND_LABEL[payload.kind])}</div>
        </td></tr>
        <tr><td style="padding:24px">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">${cells}</table>
          <div style="margin-top:20px;padding-top:20px;border-top:1px solid #e4e9f2">
            <div style="color:#4b5876;font-size:13px;margin-bottom:8px">Message</div>
            <div style="color:#14203a;font-size:14px;line-height:1.65;white-space:pre-wrap">${escapeHtml(payload.message)}</div>
          </div>
        </td></tr>
        <tr><td style="background:#f5f7fb;padding:16px 24px;border-top:1px solid #e4e9f2;color:#4b5876;font-size:12px">
          Reply directly to this email to reach ${escapeHtml(payload.name)}.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

// ---------------------------------------------------------------------------
// Delivery
// ---------------------------------------------------------------------------

export interface MailConfig {
  apiKey: string;
  from: string;
  to: string[];
}

/**
 * Read delivery configuration from the environment.
 *
 * Returns `null` when the site is not configured to send. The caller must
 * treat that as a hard failure rather than a silent success — an unconfigured
 * inbox is exactly the defect this module exists to remove.
 */
export function readMailConfig(
  env: Record<string, string | undefined> = process.env,
): MailConfig | null {
  const apiKey = env.RESEND_API_KEY?.trim();
  const from = env.EMAIL_FROM?.trim();
  const to = (env.ENQUIRY_TO_EMAIL ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

  if (!apiKey || !from || to.length === 0) return null;
  // A newline in either address would forge a header at the provider.
  if (/[\r\n]/.test(from) || to.some((address) => /[\r\n]/.test(address)))
    return null;
  return { apiKey, from, to };
}

export interface DeliveryResult {
  delivered: boolean;
  /** Provider-side id, useful when tracing a specific message. */
  id?: string;
  /** Safe diagnostic for the server log. Never returned to the browser. */
  diagnostic?: string;
}

/**
 * Send one enquiry through Resend.
 *
 * `Reply-To` is the customer's address, so the sales inbox can simply hit
 * reply. That is safe here only because `clean()` has already stripped CR/LF
 * from the value — otherwise a crafted address could inject headers.
 *
 * The `From` address must be on a domain verified with the provider; it is
 * never the customer's address, which would fail SPF/DKIM and land the mail
 * in spam.
 */
export async function deliver(
  payload: EnquiryPayload,
  config: MailConfig,
  fetchImpl: typeof fetch = fetch,
): Promise<DeliveryResult> {
  try {
    const response = await fetchImpl("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: config.to,
        reply_to: payload.email,
        subject: subjectFor(payload),
        text: renderText(payload),
        html: renderHtml(payload),
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      return {
        delivered: false,
        // Status plus a truncated provider message. No API key, no payload.
        diagnostic: `provider responded ${response.status}: ${detail.slice(0, 300)}`,
      };
    }

    const json = (await response.json().catch(() => ({}))) as { id?: string };
    return { delivered: true, id: json.id };
  } catch (error) {
    return {
      delivered: false,
      diagnostic:
        error instanceof Error ? `${error.name}: ${error.message}` : "unknown error",
    };
  }
}
