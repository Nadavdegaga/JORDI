/**
 * Meta Pixel (Facebook/Instagram) tracking layer.
 *
 * The pixel ID comes from VITE_META_PIXEL_ID. With no ID configured nothing
 * loads and every track() call is a silent no-op, so local dev and preview
 * builds never pollute campaign data.
 *
 * All tracking goes through this module — components never touch window.fbq.
 */

import { getAttribution } from "./attribution";

type FbqArgs = [string, ...unknown[]];

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { queue?: FbqArgs[]; loaded?: boolean; version?: string };
    _fbq?: unknown;
  }
}

const PIXEL_ID: string | undefined = import.meta.env.VITE_META_PIXEL_ID;
const DEBUG = import.meta.env.DEV;

let initialized = false;

/** Meta standard events we use. Custom events are plain strings. */
export type StandardEvent =
  | "PageView"
  | "ViewContent"
  | "Lead"
  | "Contact"
  | "InitiateCheckout"
  | "Schedule"
  | "CompleteRegistration";

/**
 * Event IDs let Meta deduplicate a browser event against the same event sent
 * later from a server (Conversions API). Generating one now means CAPI can be
 * added without re-instrumenting anything.
 */
const newEventId = (name: string): string =>
  `${name}.${Date.now()}.${Math.random().toString(36).slice(2, 10)}`;

const log = (...args: unknown[]) => {
  if (DEBUG) console.info("[pixel]", ...args);
};

/** Injects the official Meta base snippet and fires the initial PageView. */
export const initPixel = (): void => {
  if (initialized || typeof window === "undefined") return;

  if (!PIXEL_ID) {
    log("no VITE_META_PIXEL_ID set — tracking disabled");
    initialized = true;
    return;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function (...args: unknown[]) {
      // Before fbevents.js loads, calls are queued; after, they are forwarded.
      if (n.callMethod) n.callMethod(...args);
      else n.queue.push(args);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    // Meta's own snippet assumes an existing <script> to insert before. Falling
    // back to <head> keeps a missing one from throwing inside a React effect.
    const s = b.getElementsByTagName(e)[0];
    if (s?.parentNode) s.parentNode.insertBefore(t, s);
    else (b.head ?? b.documentElement).appendChild(t);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable @typescript-eslint/no-explicit-any */

  initialized = true;

  try {
    window.fbq?.("init", PIXEL_ID);
    log("initialized", PIXEL_ID);
    trackStandard("PageView");
  } catch (error) {
    // Ad blockers and locked-down browsers break the pixel routinely. Losing
    // the measurement is acceptable; losing the landing page is not.
    log("initialization failed", error);
  }
};

export const isPixelActive = (): boolean => Boolean(PIXEL_ID);

/** Fires a Meta standard event. Returns the event ID for CAPI deduplication. */
export const trackStandard = (
  event: StandardEvent,
  params: Record<string, unknown> = {},
): string => {
  const eventID = newEventId(event);
  log("track", event, params);
  window.fbq?.("track", event, params, { eventID });
  return eventID;
};

/**
 * Fires a custom event. Use for funnel signals that aren't a Meta standard
 * event — scroll depth, pricing views, package clicks. These become the
 * behavioral signal Meta optimizes on and the basis for retargeting audiences.
 */
export const trackCustom = (event: string, params: Record<string, unknown> = {}): string => {
  const eventID = newEventId(event);
  log("trackCustom", event, params);
  window.fbq?.("trackCustom", event, params, { eventID });
  return eventID;
};

/**
 * The conversion event. Fired the moment a visitor commits to contacting us —
 * this is what the ad campaign optimizes for, so it must fire before any
 * navigation away from the page.
 */
export const trackLead = (params: {
  package?: string;
  value?: number;
  currency?: string;
  source?: string;
}): string => {
  const attr = getAttribution();
  return trackStandard("Lead", {
    content_name: params.package ?? "general_inquiry",
    content_category: "automation_services",
    currency: params.currency ?? "ILS",
    value: params.value ?? 0,
    lead_source: params.source ?? "whatsapp",
    campaign: attr.utm_campaign,
    ad_source: attr.utm_source,
    ad_content: attr.utm_content,
  });
};
