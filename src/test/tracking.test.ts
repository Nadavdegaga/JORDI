import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

/**
 * The tracking layer is the part of the landing page that fails silently:
 * a broken pixel or a dropped UTM looks exactly like a working page while
 * the campaign spends money on untraceable leads. These tests pin the wiring.
 */

const loadModules = async () => {
  vi.resetModules();
  const attribution = await import("@/lib/attribution");
  const pixel = await import("@/lib/pixel");
  const whatsapp = await import("@/lib/whatsapp");
  return { attribution, pixel, whatsapp };
};

const setUrl = (url: string) => window.history.replaceState({}, "", url);

beforeEach(() => {
  window.sessionStorage.clear();
  setUrl("/lp");
  delete window.fbq;
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("attribution", () => {
  it("captures campaign params off the landing URL", async () => {
    setUrl("/lp?utm_source=facebook&utm_medium=cpc&utm_campaign=q3&fbclid=abc123");
    const { attribution } = await loadModules();

    const captured = attribution.captureAttribution();

    expect(captured.utm_source).toBe("facebook");
    expect(captured.utm_medium).toBe("cpc");
    expect(captured.utm_campaign).toBe("q3");
    expect(captured.fbclid).toBe("abc123");
    expect(captured.landing_page).toBe("/lp");
  });

  it("keeps first-touch values when a later navigation has no params", async () => {
    setUrl("/lp?utm_source=facebook&utm_campaign=q3");
    const { attribution } = await loadModules();
    attribution.captureAttribution();

    setUrl("/lp");
    const second = attribution.captureAttribution();

    expect(second.utm_source).toBe("facebook");
    expect(second.utm_campaign).toBe("q3");
  });

  it("survives a page change via sessionStorage", async () => {
    setUrl("/lp?utm_source=instagram");
    const first = await loadModules();
    first.attribution.captureAttribution();

    // Fresh module instance = same visitor, new page load.
    const second = await loadModules();
    expect(second.attribution.getAttribution().utm_source).toBe("instagram");
  });

  it("falls back to a readable source when there are no UTMs", async () => {
    const { attribution } = await loadModules();
    attribution.captureAttribution();
    expect(attribution.formatAttributionLine()).toBe("direct");
  });
});

describe("whatsapp handoff", () => {
  it("embeds package, qualifier answers and campaign source in the message", async () => {
    setUrl("/lp?utm_source=facebook&utm_medium=cpc&utm_campaign=q3");
    const { attribution, whatsapp } = await loadModules();
    attribution.captureAttribution();

    const url = whatsapp.buildWhatsAppUrl({
      source: "pricing_growth",
      packageId: "growth",
      packageName: "מערכת לעסק",
      answers: [{ label: "תקציב משוער", value: "₪5,000–15,000" }],
    });

    const message = decodeURIComponent(url.split("?text=")[1]);
    expect(url.startsWith("https://wa.me/")).toBe(true);
    expect(message).toContain("מערכת לעסק");
    expect(message).toContain("תקציב משוער: ₪5,000–15,000");
    expect(message).toContain("facebook / cpc / q3");
  });

  /**
   * Popup blocking is the failure mode that costs real leads: sandboxed
   * iframes and the Facebook/Instagram in-app browsers refuse window.open,
   * and without a fallback the CTA does nothing at all.
   */
  it("navigates the current tab when the popup is blocked", async () => {
    const { whatsapp } = await loadModules();
    const realLocation = window.location;
    const fakeLocation = { href: "" } as Location;
    Object.defineProperty(window, "location", { configurable: true, value: fakeLocation });
    vi.stubGlobal("open", vi.fn(() => null));

    try {
      whatsapp.openWhatsApp({ source: "hero_primary" });
      expect(fakeLocation.href).toContain("https://wa.me/");
    } finally {
      Object.defineProperty(window, "location", { configurable: true, value: realLocation });
    }
  });

  it("leaves the landing page open when the popup succeeds", async () => {
    const { whatsapp } = await loadModules();
    const realLocation = window.location;
    const fakeLocation = { href: "" } as Location;
    Object.defineProperty(window, "location", { configurable: true, value: fakeLocation });
    vi.stubGlobal("open", vi.fn(() => ({ closed: false }) as Window));

    try {
      whatsapp.openWhatsApp({ source: "hero_primary" });
      expect(fakeLocation.href).toBe("");
    } finally {
      Object.defineProperty(window, "location", { configurable: true, value: realLocation });
    }
  });

  it("omits the source line for direct traffic", async () => {
    const { attribution, whatsapp } = await loadModules();
    attribution.captureAttribution();

    const message = decodeURIComponent(
      whatsapp.buildWhatsAppUrl({ source: "hero_primary" }).split("?text=")[1],
    );
    expect(message).not.toContain("מקור");
  });
});

describe("meta pixel", () => {
  it("stays inert when no pixel id is configured", async () => {
    vi.stubEnv("VITE_META_PIXEL_ID", "");
    const { pixel } = await loadModules();

    pixel.initPixel();

    expect(pixel.isPixelActive()).toBe(false);
    expect(window.fbq).toBeUndefined();
  });

  it("initializes and fires PageView when an id is configured", async () => {
    vi.stubEnv("VITE_META_PIXEL_ID", "1234567890");
    const { pixel } = await loadModules();

    pixel.initPixel();
    const calls = window.fbq?.queue ?? [];

    expect(pixel.isPixelActive()).toBe(true);
    expect(calls[0]).toEqual(["init", "1234567890"]);
    expect(calls[1]?.[0]).toBe("track");
    expect(calls[1]?.[1]).toBe("PageView");
  });

  it("sends the Lead conversion with value, currency and campaign", async () => {
    vi.stubEnv("VITE_META_PIXEL_ID", "1234567890");
    setUrl("/lp?utm_source=facebook&utm_campaign=q3");
    const { attribution, pixel } = await loadModules();
    attribution.captureAttribution();
    pixel.initPixel();

    const eventId = pixel.trackLead({ package: "growth", value: 9000, source: "pricing_growth" });
    const lead = (window.fbq?.queue ?? []).find((c) => c[1] === "Lead");

    expect(lead).toBeDefined();
    expect(lead?.[2]).toMatchObject({
      content_name: "growth",
      value: 9000,
      currency: "ILS",
      lead_source: "pricing_growth",
      campaign: "q3",
      ad_source: "facebook",
    });
    // Event IDs are what let a server-side Conversions API event deduplicate.
    expect(lead?.[3]).toEqual({ eventID: eventId });
  });

  it("forwards custom funnel events", async () => {
    vi.stubEnv("VITE_META_PIXEL_ID", "1234567890");
    const { pixel } = await loadModules();
    pixel.initPixel();

    pixel.trackCustom("ScrollDepth", { depth: 50 });
    const custom = (window.fbq?.queue ?? []).find((c) => c[0] === "trackCustom");

    expect(custom?.[1]).toBe("ScrollDepth");
    expect(custom?.[2]).toEqual({ depth: 50 });
  });
});
