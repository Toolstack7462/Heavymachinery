"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { services } from "@/content/services";
import { equipment } from "@/content/equipment";
import { Icon } from "@/components/Icon";
import { cn } from "@/lib/utils";

type Variant = "quote" | "contact";
type Status = "idle" | "sending" | "success" | "error";

/**
 * Accessible enquiry form with:
 * - visible labels, required indicators, inline validation, aria-live status
 * - honeypot field ("company_url") + time-trap for basic spam protection
 * - semantic input types (email, tel) for correct mobile keyboards
 * Posts to /api/quote or /api/contact. Backend is a validated stub — wire an
 * email/CRM provider (see route handler) to actually deliver messages.
 */
export function EnquiryForm({
  dict,
  variant = "quote",
  defaultEquipment,
}: {
  dict: Dictionary;
  variant?: Variant;
  defaultEquipment?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isQuote = variant === "quote";

  const defaultService = defaultEquipment
    ? equipment.find((e) => e.slug === defaultEquipment)?.name
    : undefined;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Client validation
    const next: Record<string, string> = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name) next.name = dict.form.invalidName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = dict.form.invalidEmail;
    if (!message) next.message = dict.form.invalidMessage;
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`);
      first?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(`/api/${variant}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });
      if (!res.ok) throw new Error("Request failed");
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
        className="rounded-2xl border border-success/30 bg-success/5 p-8 text-center"
      >
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
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
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Honeypot — hidden from users, catches bots */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="company_url">Do not fill this field</label>
        <input
          id="company_url"
          name="company_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input type="hidden" name="_ts" value={Date.now()} />

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
          optional
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
          optional
          optionalLabel={dict.form.optional}
          autoComplete="tel"
          inputMode="tel"
        />
      </div>

      {isQuote && (
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="service" required={false} optionalLabel={dict.form.optional}>
              {dict.form.service}
            </FieldLabel>
            <select
              id="service"
              name="service"
              defaultValue={defaultService ?? ""}
              className="mt-1.5 w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            >
              <option value="">{dict.form.servicePlaceholder}</option>
              {services.map((s) => (
                <option key={s.slug} value={s.title}>
                  {s.title}
                </option>
              ))}
              {equipment.map((eq) => (
                <option key={eq.slug} value={eq.name}>
                  {eq.name}
                </option>
              ))}
            </select>
          </div>
          <Field
            label={dict.form.location}
            name="location"
            optional
            optionalLabel={dict.form.optional}
          />
        </div>
      )}

      <div>
        <FieldLabel htmlFor="message" required optionalLabel={dict.form.optional}>
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
            "mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30",
            errors.message ? "border-danger" : "border-ink-200 focus:border-brand-500",
          )}
        />
        {errors.message && (
          <p id="message-error" role="alert" className="mt-1.5 text-sm text-danger">
            {errors.message}
          </p>
        )}
      </div>

      <p className="text-xs text-muted-foreground">{dict.form.consent}</p>

      {status === "error" && (
        <div role="alert" className="rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm">
          <p className="font-semibold text-danger">{dict.form.errorTitle}</p>
          <p className="mt-1 text-ink-700">{dict.form.errorBody}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 py-3.5 font-heading font-semibold text-ink-900 transition-all hover:bg-brand-600 disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-900/30 border-t-ink-900" />
            {dict.actions.sending}
          </>
        ) : (
          <>
            {isQuote ? dict.actions.submit : dict.actions.send}
            <Icon name="arrowRight" size={18} className="rtl:rotate-180" />
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
        <span className="text-muted-foreground font-normal"> · {optionalLabel}</span>
      ) : null}
    </label>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  optional = false,
  optionalLabel,
  error,
  autoComplete,
  inputMode,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  optionalLabel?: string;
  error?: string;
  autoComplete?: string;
  inputMode?: "email" | "tel" | "text";
}) {
  return (
    <div>
      <FieldLabel htmlFor={name} required={required} optionalLabel={optional ? optionalLabel : undefined}>
        {label}
      </FieldLabel>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(
          "mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30",
          error ? "border-danger" : "border-ink-200 focus:border-brand-500",
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
