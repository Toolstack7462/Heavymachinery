"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/config/site";
import { site, mailtoLink } from "@/config/site";
import { services } from "@/content/services";
import { equipment, equipmentCategories } from "@/content/equipment";
import { Icon } from "@/components/Icon";
import { cn } from "@/lib/utils";

type Variant = "request" | "contact";
type Status = "idle" | "sending" | "success" | "error";

/**
 * Accessible enquiry form.
 *  - visible labels, required markers, inline validation tied to inputs with
 *    aria-invalid/aria-describedby, and a live-region result
 *  - honeypot field + time-trap for spam, with no third-party script
 *  - semantic input types so mobile keyboards are right first time
 *  - phone is optional, since the company publishes no number of its own
 *
 * Posts to /api/quote or /api/contact. A 200 from those handlers means the
 * enquiry reached the sales inbox — they return 502/503 rather than a fake
 * success if delivery fails — so the success screen can honestly say the
 * request was sent. See src/lib/enquiry.ts for the contract.
 */
export function EnquiryForm({
  locale,
  dict,
  variant = "request",
  defaultEquipment,
}: {
  locale: Locale;
  dict: Dictionary;
  variant?: Variant;
  defaultEquipment?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reference, setReference] = useState<string | null>(null);
  /** Server-supplied error text, when it is more useful than the generic one. */
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isRequest = variant === "request";
  const formRef = useRef<HTMLFormElement>(null);
  const draftNoticeRef = useRef<HTMLParagraphElement>(null);
  const draftKey = `jowain:enquiry:${variant}`;

  /**
   * Time-trap reference: recorded after mount rather than rendered into a
   * hidden field, so the markup stays pure and identical on server and client.
   */
  const mountedAt = useRef(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  /**
   * Restore an interrupted draft. This form is filled on site, one-handed,
   * between other jobs; losing six fields to a phone call or a tab switch is
   * how an enquiry silently becomes a non-enquiry.
   *
   * The whole restore path is deliberately imperative: values go straight into
   * the DOM and the notice is unhidden by ref. Routing it through state would
   * mean either a setState inside an effect or reading sessionStorage during
   * render, and the latter hydrates differently on server and client.
   */
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    let saved: Record<string, string> | null = null;
    try {
      saved = JSON.parse(sessionStorage.getItem(draftKey) ?? "null");
    } catch {
      saved = null;
    }
    if (!saved) return;
    let restoredAny = false;
    for (const [key, value] of Object.entries(saved)) {
      const field = form.elements.namedItem(key);
      if (field instanceof HTMLInputElement && field.type === "hidden") continue;
      if (
        (field instanceof HTMLInputElement ||
          field instanceof HTMLTextAreaElement ||
          field instanceof HTMLSelectElement) &&
        value
      ) {
        field.value = value;
        restoredAny = true;
      }
    }
    if (restoredAny && draftNoticeRef.current) {
      draftNoticeRef.current.hidden = false;
    }
  }, [draftKey]);

  /** Persist on every edit; skip the honeypot and machinery fields. */
  function saveDraft() {
    const form = formRef.current;
    if (!form) return;
    const entries = Object.fromEntries(
      Array.from(new FormData(form).entries())
        .filter(
          ([key, value]) =>
            typeof value === "string" &&
            value !== "" &&
            !["company_url", "_ts", "locale"].includes(key),
        )
        .map(([key, value]) => [key, String(value)]),
    );
    try {
      sessionStorage.setItem(draftKey, JSON.stringify(entries));
    } catch {
      // Private mode or a full quota: the draft is a convenience, not a
      // requirement. Never let it break submission.
    }
  }

  /** One field's rule, shared by blur-time and submit-time validation. */
  function fieldError(name: string, value: string): string | undefined {
    const trimmed = value.trim();
    if (name === "name" && !trimmed) return dict.form.invalidName;
    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed))
      return dict.form.invalidEmail;
    if (name === "message" && !trimmed) return dict.form.invalidMessage;
    return undefined;
  }

  /**
   * Validate on blur, not on keystroke: flagging an email as invalid while it
   * is still being typed is noise. Once a field has an error it clears as soon
   * as the value becomes valid.
   */
  function handleBlur(event: React.FocusEvent<HTMLFormElement>) {
    const target = event.target;
    if (
      !(target instanceof HTMLInputElement) &&
      !(target instanceof HTMLTextAreaElement)
    )
      return;
    const { name, value } = target;
    if (!["name", "email", "message"].includes(name)) return;
    if (!value.trim() && !errors[name]) return; // don't scold an untouched field
    const message = fieldError(name, value);
    setErrors((current) => {
      const next = { ...current };
      if (message) next[name] = message;
      else delete next[name];
      return next;
    });
  }

  const defaultSelection = defaultEquipment
    ? equipment.find((item) => item.slug === defaultEquipment)?.name[locale]
    : undefined;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const next: Record<string, string> = {};
    for (const field of ["name", "email", "message"]) {
      const message = fieldError(field, String(data.get(field) ?? ""));
      if (message) next[field] = message;
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      form
        .querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)
        ?.focus();
      return;
    }

    setStatus("sending");
    setErrorMessage(null);
    try {
      const response = await fetch(
        `/api/${isRequest ? "quote" : "contact"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...Object.fromEntries(data.entries()),
            _ts: mountedAt.current,
          }),
        },
      );
      /*
       * The endpoint distinguishes its failures, so the UI does too:
       *   422 — the visitor can fix it, so show the field message
       *   429 — rate limited, so tell them to wait rather than retry-spam
       *   5xx — delivery genuinely failed; offer the email fallback
       * A non-ok response is never treated as success. That is the whole
       * point of the enquiry rewrite.
       */
      if (!response.ok) {
        const detail = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        if (response.status === 429) {
          setErrorMessage(dict.form.errorTooMany);
        } else if (response.status === 422 && detail.error) {
          setErrorMessage(detail.error);
        } else {
          setErrorMessage(null);
        }
        setStatus("error");
        return;
      }
      const result = (await response.json().catch(() => ({}))) as {
        reference?: string;
      };
      setReference(result.reference ?? null);
      setStatus("success");
      form.reset();
      try {
        sessionStorage.removeItem(draftKey);
      } catch {
        // Nothing to clean up if storage was unavailable in the first place.
      }
    } catch {
      // Network-level failure (offline, DNS, TLS). Generic copy plus the
      // email fallback is the honest response.
      setErrorMessage(null);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-accent-200 bg-accent-50 p-8 text-center"
      >
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-accent-600 ring-1 ring-accent-200">
          <Icon name="check" size={30} />
        </span>
        <h3 className="mt-4 text-xl font-bold text-ink-900">
          {dict.form.successTitle}
        </h3>
        <p className="mt-2 text-muted-foreground">{dict.form.successBody}</p>
        {reference && (
          /*
           * A reference the sender can quote. The company publishes no phone
           * number, so email is the only follow-up channel; handing over
           * something concrete to quote is the difference between "did that
           * send?" and a traceable enquiry.
           */
          <div className="mt-6 rounded-xl border border-ink-150 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {dict.form.successReference}
            </p>
            <p
              dir="ltr"
              className="mt-1 font-heading text-2xl font-extrabold tracking-tight text-ink-900 tabular-nums"
            >
              {reference}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              {dict.form.successFollowUp}{" "}
              <a
                href={mailtoLink(`${site.positioning} — ${reference}`)}
                className="font-semibold text-brand-700 underline underline-offset-2"
              >
                {site.contact.email}
              </a>
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onBlur={handleBlur}
      onInput={saveDraft}
      onChange={saveDraft}
      noValidate
      className="space-y-6"
    >
      {/* Honeypot — off-screen for users, irresistible to bots. */}
      <div className="absolute -start-[9999px] top-0" aria-hidden="true">
        <label htmlFor="company_url">{dict.form.honeypot}</label>
        <input
          id="company_url"
          name="company_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input type="hidden" name="locale" value={locale} />

      <p
        ref={draftNoticeRef}
        hidden
        role="status"
        className="rounded-lg border border-ink-150 bg-surface-muted px-4 py-3 text-sm text-ink-700"
      >
        {dict.form.draftRestored}
      </p>

      <fieldset className="space-y-5">
        <legend className="font-heading text-sm font-semibold uppercase tracking-wider text-ink-600">
          {dict.form.legendContact}
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={dict.form.name}
            name="name"
            required
            error={errors.name}
            autoComplete="name"
          />
          <Field
            label={dict.form.company}
            name="company"
            optionalLabel={dict.form.optional}
            autoComplete="organization"
          />
          <Field
            label={dict.form.email}
            name="email"
            type="email"
            required
            error={errors.email}
            autoComplete="email"
            inputMode="email"
          />
          <Field
            label={dict.form.phone}
            name="phone"
            type="tel"
            optionalLabel={dict.form.optional}
            autoComplete="tel"
            inputMode="tel"
          />
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="font-heading text-sm font-semibold uppercase tracking-wider text-ink-600">
          {dict.form.legendRequirement}
        </legend>

        {isRequest && (
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel
                htmlFor="requirement"
                optionalLabel={dict.form.optional}
              >
                {dict.form.equipment}
              </FieldLabel>
              <select
                id="requirement"
                name="requirement"
                defaultValue={defaultSelection ?? ""}
                className="mt-1.5 w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-ink-900 transition-colors focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/25"
              >
                <option value="">{dict.form.equipmentPlaceholder}</option>
                <optgroup label={dict.nav.services}>
                  {services.map((service) => (
                    <option key={service.slug} value={service.title[locale]}>
                      {service.title[locale]}
                    </option>
                  ))}
                </optgroup>
                {equipmentCategories.map((category) => (
                  <optgroup
                    key={category.key}
                    label={category.title[locale]}
                  >
                    {equipment
                      .filter((item) => item.category === category.key)
                      .map((item) => (
                        <option key={item.slug} value={item.name[locale]}>
                          {item.name[locale]}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <Field
              label={dict.form.location}
              name="location"
              optionalLabel={dict.form.optional}
            />
            <Field
              label={dict.form.duration}
              name="duration"
              optionalLabel={dict.form.optional}
              placeholder={dict.form.durationPlaceholder}
            />
          </div>
        )}

        <div>
          <FieldLabel htmlFor="message" required>
            {dict.form.message}
          </FieldLabel>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            aria-invalid={errors.message ? "true" : undefined}
            aria-describedby={errors.message ? "message-error" : undefined}
            placeholder={dict.form.messagePlaceholder}
            className={cn(
              "mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-ink-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-600/25",
              errors.message
                ? "border-danger"
                : "border-ink-200 focus:border-brand-600",
            )}
          />
          {errors.message && (
            <p
              id="message-error"
              role="alert"
              className="mt-1.5 text-sm text-danger"
            >
              {errors.message}
            </p>
          )}
        </div>
      </fieldset>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {dict.form.consent}
      </p>

      {status === "error" && (
        <div
          role="alert"
          className="rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm"
        >
          <p className="font-semibold text-danger">{dict.form.errorTitle}</p>
          <p className="mt-1 text-ink-700">
            {errorMessage ?? dict.form.errorBody}
          </p>
          <a
            href={mailtoLink(site.positioning)}
            className="mt-2 inline-block font-semibold text-brand-700 underline"
          >
            {site.contact.email}
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="group/btn inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3.5 font-heading font-semibold text-white transition-[background-color,opacity,transform] duration-150 hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 active:scale-[0.985] disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? (
          <>
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
              aria-hidden="true"
            />
            {dict.actions.sending}
          </>
        ) : (
          <>
            {isRequest ? dict.actions.submit : dict.actions.send}
            <Icon
              name="arrowRight"
              size={18}
              className="transition-transform duration-200 group-hover/btn:translate-x-0.5 rtl:rotate-180 rtl:group-hover/btn:-translate-x-0.5"
            />
          </>
        )}
      </button>
    </form>
  );
}

function FieldLabel({
  htmlFor,
  required,
  optionalLabel,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  optionalLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-ink-800">
      {children}
      {required ? (
        <span className="text-danger"> *</span>
      ) : optionalLabel ? (
        <span className="font-normal text-muted-foreground">
          {" "}
          · {optionalLabel}
        </span>
      ) : null}
    </label>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  optionalLabel,
  error,
  autoComplete,
  inputMode,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  optionalLabel?: string;
  error?: string;
  autoComplete?: string;
  inputMode?: "email" | "tel" | "text";
  placeholder?: string;
}) {
  return (
    <div>
      <FieldLabel htmlFor={name} required={required} optionalLabel={optionalLabel}>
        {label}
      </FieldLabel>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(
          "mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-ink-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-600/25",
          error ? "border-danger" : "border-ink-200 focus:border-brand-600",
        )}
      />
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
