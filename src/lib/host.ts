/**
 * Host-based routing for the campaign landing page.
 *
 * The landing page is served two ways from this one codebase:
 *   lp.<domain>/    — the campaign host, landing page at the root
 *   <domain>/lp     — fallback so older ad links keep working
 *
 * The main site is never served from the campaign host, which is what keeps
 * the two separate without a second repo or a second deploy.
 */

/** Subdomain prefix that identifies the campaign host. Includes the dot. */
export const CAMPAIGN_SUBDOMAIN = "lp.";

export const isCampaignHost = (): boolean =>
  typeof window !== "undefined" && window.location.hostname.startsWith(CAMPAIGN_SUBDOMAIN);

/**
 * Absolute URL of the main marketing site.
 *
 * Derived by stripping the campaign prefix off the current hostname rather
 * than hard-coding a domain, so this keeps working if the domain changes and
 * needs no separate configuration for preview deployments or local dev.
 * Returns a relative "/" off the campaign host, where the main site is just
 * another route.
 */
export const getMainSiteUrl = (): string => {
  if (!isCampaignHost()) return "/";
  const { protocol, hostname, port } = window.location;
  const mainHost = hostname.slice(CAMPAIGN_SUBDOMAIN.length);
  return `${protocol}//${mainHost}${port ? `:${port}` : ""}`;
};
