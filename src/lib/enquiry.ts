import { NextResponse } from "next/server";

/**
 * Shared enquiry handler for /api/quote and /api/contact.
 *
 * SPAM PROTECTION (no third-party dependency, no cookies):
 *  - Honeypot: `company_url` must be empty (bots fill every field).
 *  - Time-trap: submissions faster than 2s after form render are dropped.
 *  - Field validation on name, email and message.
 * Both spam paths return `ok` so a bot cannot tell it was filtered.
 *
 * DELIVERY: intentionally provider-agnostic so the repository holds no
 * secrets and the site builds and deploys without any key. The enquiry is
 * validated and logged server-side; to deliver it by email, set ONE of the
 * environment variables below in the hosting platform (never in the repo) and
 * fill in the matching branch:
 *
 *   RESEND_API_KEY        → https://resend.com
 *   SENDGRID_API_KEY      → https://sendgrid.com
 *   ENQUIRY_WEBHOOK_URL   → any CRM/Zapier/Make endpoint
 *
 * The client UI is written to match this reality: it confirms the request was
 * *recorded*, and never claims an email was delivered.
 */

export interface EnquiryPayload {
  kind: "quote" | "contact";
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

export async function handleEnquiry(
  request: Request,
  kind: "quote" | "contact",
) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid payload" },
      { status: 400 },
    );
  }

  // Honeypot
  if (typeof body.company_url === "string" && body.company_url.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // Time-trap
  const timestamp = Number(body._ts);
  if (Number.isFinite(timestamp) && Date.now() - timestamp < 2000) {
    return NextResponse.json({ ok: true });
  }

  const text = (value: unknown) => String(value ?? "").trim();
  const name = text(body.name);
  const email = text(body.email);
  const message = text(body.message);

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Missing or invalid fields" },
      { status: 422 },
    );
  }

  const payload: EnquiryPayload = {
    kind,
    name,
    email,
    company: text(body.company) || undefined,
    phone: text(body.phone) || undefined,
    requirement: text(body.requirement) || undefined,
    location: text(body.location) || undefined,
    duration: text(body.duration) || undefined,
    message,
    locale: text(body.locale) || undefined,
    receivedAt: new Date().toISOString(),
  };

  const webhook = process.env.ENQUIRY_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      // Never lose the enquiry to a downstream outage.
      console.error(`[enquiry:${kind}] webhook failed`, error);
    }
  }

  console.info(`[enquiry:${kind}]`, JSON.stringify(payload));

  return NextResponse.json({ ok: true });
}
