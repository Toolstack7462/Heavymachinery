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
 * Posts to /api/quote or /api/contact. Those handlers validate and record the
 * enquiry; email delivery is wired by setting a provider key (see
 * src/lib/enquiry.ts). The success screen states that the request was
 * *recorded* rather than claiming an email has been delivered.
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
  const isRequest = variant === "request";

  /**
   * Time-trap reference: recorded after mount rather than rendered into a
   * hidden field, so the markup stays pure and identical on server and client.
   */
  const mountedAt = useRef(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const defaultSelection = defaultEquipment
    ? equipment.find((item) => item.slug === defaultEquipment)?.name[locale]
    : undefined;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const next: Record<string, string> = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name) next.name = dict.form.invalidName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = dict.form.invalidEmail;
    if (!message) next.message = dict.form.invalidMessage;
    setErrors(next);
    if (Object.keys(next).length > 0) {
      form
        .querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)
        ?.focus();
      return;
    }

    setStatus("sending");
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
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
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
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
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
          <p className="mt-1 text-ink-700">{dict.form.errorBody}</p>
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
        className="group/btn inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3.5 font-heading font-semibold text-white transition-all duration-150 hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 active:scale-[0.985] disabled:opacity-60 sm:w-auto"
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
