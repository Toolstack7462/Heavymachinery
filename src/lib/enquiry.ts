import { NextResponse } from "next/server";
import {
  LIMITS,
  RateLimiter,
  clientKey,
  deliver,
  readMailConfig,
  validate,
  type EnquiryKind,
  type EnquiryPayload,
} from "./enquiry-core";

/**
 * ============================================================================
 *  ENQUIRY ENDPOINT — the site's only lead channel
 * ============================================================================
 *  Thin Next.js adapter. All logic lives in `enquiry-core.ts`, which imports
 *  nothing from Next and is unit-tested directly (see tests/enquiry.test.ts).
 *
 *  THE CONTRACT, and the reason this file exists:
 *
 *    A 200 from this endpoint means the enquiry reached the sales inbox.
 *
 *  It previously meant "we wrote it to stdout", which on shared hosting is
 *  indistinguishable from losing it. The company publishes no telephone
 *  number, so email is the ONLY channel a customer has — a silently dropped
 *  enquiry is a permanently lost customer, and a fake success is worse than
 *  an honest error because the customer never learns to try again.
 *
 *  Spam handling is deliberately asymmetric:
 *    - honeypot / time-trap hits get 200 OK, so a bot learns nothing
 *    - genuine validation failures get 422, so a real person can correct it
 *    - a delivery failure gets 502, so the UI can offer the email fallback
 * ============================================================================
 */

/**
 * Five submissions per IP per ten minutes.
 *
 * Module scope, so the map lives as long as the server process — correct on
 * Passenger, PM2, systemd and Docker, which are the deployment targets that
 * apply here. On a serverless platform the counter is per instance; that
 * limitation is documented in `enquiry-core.ts` and in docs/SECURITY.md
 * rather than papered over.
 */
const limiter = new RateLimiter(5, 10 * 60 * 1000);

/** Log without the message body, and without PII outside development. */
function logEnquiry(
  kind: EnquiryKind,
  payload: EnquiryPayload,
  outcome: string,
  diagnostic?: string,
) {
  const base = `[enquiry:${kind}] ${payload.reference} ${outcome}`;
  if (process.env.NODE_ENV === "production") {
    // Reference plus outcome is enough to trace a specific enquiry through
    // the provider's dashboard. Name, email, phone and the message body are
    // deliberately absent: shared-host logs are readable and retained.
    console.info(diagnostic ? `${base} — ${diagnostic}` : base);
  } else {
    console.info(base, diagnostic ?? "", JSON.stringify(payload));
  }
}

export async function handleEnquiry(request: Request, kind: EnquiryKind) {
  // Reject anything that is not a JSON POST from our own form. Cheap, and it
  // removes the simplest cross-origin form-post shape.
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json(
      { ok: false, error: "Unsupported content type" },
      { status: 415 },
    );
  }

  // Cap the body before parsing it. `Content-Length` is advisory, so the read
  // itself is bounded too.
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declared) && declared > LIMITS.body) {
    return NextResponse.json(
      { ok: false, error: "Payload too large" },
      { status: 413 },
    );
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid payload" },
      { status: 400 },
    );
  }
  if (raw.length > LIMITS.body) {
    return NextResponse.json(
      { ok: false, error: "Payload too large" },
      { status: 413 },
    );
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      throw new Error("not an object");
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid payload" },
      { status: 400 },
    );
  }

  // Rate limit before doing any work that costs money.
  const rate = limiter.check(clientKey(request.headers));
  if (!rate.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } },
    );
  }

  const result = validate(body, kind);

  // Spam: answer exactly like success so a bot cannot tell it was filtered.
  if (result.status === "spam") {
    console.info(`[enquiry:${kind}] filtered (${result.reason})`);
    return NextResponse.json({ ok: true });
  }

  if (result.status === "invalid") {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: 422 },
    );
  }

  const payload = result.payload;
  const config = readMailConfig();

  // Not configured is a failure, not a pass. Returning success here is the
  // exact defect this rewrite removes.
  if (!config) {
    logEnquiry(kind, payload, "undelivered", "mail transport not configured");
    return NextResponse.json(
      { ok: false, error: "Delivery unavailable" },
      { status: 503 },
    );
  }

  const delivery = await deliver(payload, config);
  if (!delivery.delivered) {
    logEnquiry(kind, payload, "failed", delivery.diagnostic);
    return NextResponse.json(
      { ok: false, error: "Delivery failed" },
      { status: 502 },
    );
  }

  logEnquiry(kind, payload, "delivered", delivery.id);
  return NextResponse.json({ ok: true, reference: payload.reference });
}

export type { EnquiryPayload };
