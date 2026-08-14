"use client";

import { useId, useMemo, useState, type ReactNode } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { Icon } from "@/components/Icon";

export interface FleetSearchItem {
  slug: string;
  /** Everything worth matching against, pre-lowercased on the server. */
  haystack: string;
  card: ReactNode;
}

/**
 * Text filter over the equipment grid.
 *
 * The cards are server-rendered and passed in as children, so this island adds
 * an input and a `hidden` toggle rather than re-rendering 26 cards on the
 * client or shipping a second copy of the catalogue in the JS payload. With
 * JavaScript unavailable the input never appears and the full grid is simply
 * there, which is the right fallback for a catalogue.
 *
 * Matching is case-insensitive substring across name, summary, category and
 * capacity text, so "1200", "crawler" or "صهريج" all land on the right unit.
 */
export function FleetFilter({
  items,
  dict,
}: {
  items: FleetSearchItem[];
  dict: Dictionary;
}) {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const needle = query.trim().toLowerCase();

  const matched = useMemo(
    () =>
      new Set(
        (needle ? items.filter((item) => item.haystack.includes(needle)) : items).map(
          (item) => item.slug,
        ),
      ),
    [items, needle],
  );

  return (
    <>
      <div className="mt-6 max-w-md">
        <label htmlFor={inputId} className="sr-only">
          {dict.labels.searchEquipment}
        </label>
        <div className="relative">
          <Icon
            name="search"
            size={18}
            className="pointer-events-none absolute inset-y-0 start-3.5 my-auto text-ink-400"
          />
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={dict.labels.searchEquipmentPlaceholder}
            className="min-h-[44px] w-full rounded-lg border border-ink-200 bg-white py-2.5 pe-3.5 ps-11 text-ink-900 transition-colors focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/25"
          />
        </div>
      </div>

      {/*
        Announced politely, so a screen-reader user learns the grid changed
        underneath them — something a purely visual filter never tells them.
      */}
      <p aria-live="polite" className="mt-3 min-h-[1.25rem] text-sm text-muted-foreground">
        {needle
          ? `${matched.size} ${
              matched.size === 1
                ? dict.labels.resultSingular
                : dict.labels.resultPlural
            }`
          : ""}
      </p>

      <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/*
          h-full on the wrapper keeps the card stretching to the tallest in its
          row; without it the grid item, not the card, owns the height and rows
          go ragged.
        */}
        {items.map((item) => (
          <div key={item.slug} hidden={!matched.has(item.slug)} className="h-full">
            {item.card}
          </div>
        ))}
      </div>

      {matched.size === 0 && (
        <div className="mt-4 rounded-2xl border border-ink-150 bg-surface-muted p-8 text-center">
          <p className="font-heading text-lg font-bold text-ink-900">
            {dict.labels.noResults}
          </p>
          <p className="measure mx-auto mt-2 text-sm text-muted-foreground">
            {dict.labels.noResultsHint}
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-5 min-h-[44px] rounded-lg border border-ink-200 bg-white px-5 text-sm font-semibold text-ink-900 transition-colors hover:border-brand-600 hover:text-brand-700"
          >
            {dict.labels.clearSearch}
          </button>
        </div>
      )}
    </>
  );
}
