"use client";

import { site, whatsappLink } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Floating WhatsApp button — a high-intent, always-available contact channel
 * favoured in the GCC. Fixed to the bottom corner, respects RTL (end-anchored).
 */
export function FloatingCTA({ dict }: { dict: Dictionary }) {
  const message = `Hello ${site.name}, I'd like to enquire about equipment rental.`;
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={dict.actions.whatsapp}
      className="fixed bottom-5 end-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white font-semibold shadow-[0_10px_30px_-8px_rgba(37,211,102,0.6)] hover:bg-[#1ebe5a] hover:-translate-y-0.5 transition-all"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.16c-.25.69-1.44 1.32-1.98 1.4-.53.08-1.02.11-1.65-.1-.38-.12-.87-.28-1.5-.55-2.63-1.14-4.35-3.79-4.48-3.97-.13-.18-1.07-1.42-1.07-2.71 0-1.29.68-1.92.92-2.19.24-.26.53-.33.71-.33.18 0 .35 0 .51.01.16.01.38-.06.6.46.22.53.76 1.83.83 1.96.07.13.11.29.02.46-.09.18-.13.29-.26.44-.13.16-.28.35-.4.47-.13.13-.27.28-.12.54.15.26.67 1.1 1.44 1.78.99.88 1.83 1.16 2.09 1.29.26.13.41.11.56-.07.15-.18.65-.76.82-1.02.17-.26.35-.22.59-.13.24.09 1.53.72 1.79.85.26.13.43.2.5.31.06.11.06.64-.19 1.32Z" />
      </svg>
      <span className="hidden sm:inline">{dict.actions.whatsapp}</span>
    </a>
  );
}
