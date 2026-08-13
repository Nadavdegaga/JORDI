/**
 * WhatsApp conversion handoff.
 *
 * Every CTA on the landing page routes through here so that two things are
 * guaranteed: the Meta Lead event fires *before* the browser leaves the page,
 * and the campaign attribution travels inside the message itself — which is
 * the only durable record of where a WhatsApp lead came from.
 */

import { WHATSAPP_NUMBER } from "@/config/landing";
import { formatAttributionLine, getAttribution } from "./attribution";
import { trackLead } from "./pixel";

export type LeadContext = {
  /** Which CTA was clicked — hero, pricing card, sticky bar, final CTA. */
  source: string;
  /** Package id when the click came from a pricing card. */
  packageId?: string;
  packageName?: string;
  /** Package price, sent to Meta as the conversion value for ROAS. */
  value?: number;
  /** Answers from the qualifier, appended to the message. */
  answers?: { label: string; value: string }[];
};

const buildMessage = (ctx: LeadContext): string => {
  const lines: string[] = ["היי, הגעתי מהאתר ומעניין אותי לשמוע עוד."];

  if (ctx.packageName) {
    lines.push("", `החבילה שעניינה אותי: ${ctx.packageName}`);
  }

  if (ctx.answers?.length) {
    lines.push("");
    ctx.answers.forEach(({ label, value }) => lines.push(`${label}: ${value}`));
    lines.push("", "אשמח לקבל פרטים והצעת מחיר.");
  }

  // Attribution tail — lets you tell which ad produced this conversation.
  const attr = getAttribution();
  const line = formatAttributionLine(attr);
  if (line && line !== "direct") {
    lines.push("", `— מקור: ${line}`);
  }

  return lines.join("\n");
};

export const buildWhatsAppUrl = (ctx: LeadContext): string =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage(ctx))}`;

/**
 * Fires the conversion event and opens WhatsApp.
 *
 * Must be called synchronously from a user gesture — mobile browsers block
 * window.open from async callbacks, and a blocked open means a lost lead.
 *
 * A new tab is preferred so the landing page stays open behind WhatsApp, but
 * window.open is blocked outright in sandboxed iframes (preview panes) and in
 * some in-app browsers — including Facebook's and Instagram's, which is where
 * this campaign's traffic actually comes from. When that happens the call
 * returns null and we navigate the current tab instead, so the handoff still
 * lands rather than failing silently.
 */
export const openWhatsApp = (ctx: LeadContext): void => {
  trackLead({
    package: ctx.packageId ?? ctx.source,
    value: ctx.value,
    source: ctx.source,
  });

  const url = buildWhatsAppUrl(ctx);
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened || opened.closed) window.location.href = url;
};
