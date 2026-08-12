import { notFound } from "next/navigation";

/**
 * Catch-all inside the locale segment.
 *
 * Without it, a URL like /en/anything matches no route and Next serves its own
 * bare 404 outside this layout — no header, no footer, no brand, and no way
 * back into the site. Calling notFound() here renders `[locale]/not-found.tsx`
 * inside the locale layout, with the correct 404 status.
 *
 * More specific routes always win, so this never shadows a real page.
 */
export default function UnmatchedRoute(): never {
  notFound();
}
