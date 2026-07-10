import { NextResponse } from "next/server";

/**
 * Shared enquiry handler for /api/quote and /api/contact.
 *
 * SPAM PROTECTION (no external dependency):
 *  - Honeypot: `company_url` must be empty (bots fill every field).
 *  - Time-trap: submissions faster than 2s since form render are rejected.
 *  - Basic field validation.
 *
 * DELIVERY: This is intentionally a validated STUB. It does NOT send email so
 * that no secrets are required to build/deploy. To actually deliver enquiries,
 * plug in a provider below (e.g. Resend, SendGrid, a CRM webhook) using an
 * environment variable — never hard-code keys. Example:
 *
 *   if (process.env.RESEND_API_KEY) { await sendViaResend(payload) }
 */
export async function handleEnquiry(request: Request, kind: "quote" | "contact") {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  // Honeypot
  if (typeof body.company_url === "string" && body.company_url.trim() !== "") {
    // Pretend success to avoid tipping off bots.
    return NextResponse.json({ ok: true });
  }

  // Time-trap
  const ts = Number(body._ts);
  if (Number.isFinite(ts) && Date.now() - ts < 2000) {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Missing or invalid fields" },
      { status: 422 },
    );
  }

  const payload = {
    kind,
    name,
    email,
    company: String(body.company ?? "").trim() || undefined,
    phone: String(body.phone ?? "").trim() || undefined,
    service: String(body.service ?? "").trim() || undefined,
    location: String(body.location ?? "").trim() || undefined,
    message,
    receivedAt: new Date().toISOString(),
  };

  // --- DELIVERY HOOK (wire a provider here) ---
  // For now we log server-side so nothing is lost during development.
  console.info(`[enquiry:${kind}]`, JSON.stringify(payload));

  return NextResponse.json({ ok: true });
}
