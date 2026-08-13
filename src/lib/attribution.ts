/**
 * Campaign attribution capture.
 *
 * Ad traffic lands with UTM params + click IDs in the URL. The visitor then
 * scrolls, maybe navigates, and the params are gone by the time they convert.
 * We snapshot them on first load and keep them for the whole session, so every
 * lead can be traced back to the exact ad that produced it.
 */

const STORAGE_KEY = "pitstop_attribution";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
] as const;

/** Ad-platform click IDs. fbclid is Meta, gclid Google, ttclid TikTok. */
const CLICK_ID_KEYS = ["fbclid", "gclid", "ttclid", "msclkid"] as const;

export type Attribution = {
  [K in (typeof UTM_KEYS)[number]]?: string;
} & {
  [K in (typeof CLICK_ID_KEYS)[number]]?: string;
} & {
  landing_page?: string;
  referrer?: string;
  first_seen?: string;
};

const isBrowser = () => typeof window !== "undefined";

const read = (): Attribution => {
  if (!isBrowser()) return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
};

const write = (data: Attribution) => {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* private browsing — attribution is best-effort, never block the page */
  }
};

/**
 * Reads campaign params off the current URL and merges them into the stored
 * snapshot. First-touch wins: once a value is captured it is not overwritten,
 * so an internal navigation without params can't erase the original source.
 */
export const captureAttribution = (): Attribution => {
  if (!isBrowser()) return {};

  const stored = read();
  const params = new URLSearchParams(window.location.search);
  const next: Attribution = { ...stored };

  [...UTM_KEYS, ...CLICK_ID_KEYS].forEach((key) => {
    const value = params.get(key);
    if (value && !next[key]) next[key] = value.slice(0, 200);
  });

  if (!next.first_seen) {
    next.first_seen = new Date().toISOString();
    next.landing_page = window.location.pathname;
    // Same-origin referrers are internal navigation, not a traffic source.
    const ref = document.referrer;
    if (ref && !ref.startsWith(window.location.origin)) next.referrer = ref;
  }

  write(next);
  return next;
};

export const getAttribution = (): Attribution => read();

/** Compact one-line summary for embedding in a WhatsApp message. */
export const formatAttributionLine = (attr: Attribution = read()): string => {
  const source = attr.utm_source || (attr.fbclid ? "facebook" : attr.referrer ? "referral" : "direct");
  const parts = [source, attr.utm_medium, attr.utm_campaign, attr.utm_content].filter(Boolean);
  return parts.join(" / ");
};
