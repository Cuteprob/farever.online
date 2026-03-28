const siteName = process.env.NEXT_PUBLIC_PROJECT_NAME || "Game Site";
const siteUrl = process.env.NEXT_PUBLIC_WEB_URL || process.env.NEXT_PUBLIC_BASE_URL || "";
const siteEmail = process.env.NEXT_PUBLIC_PROJECT_EMAIL || "";
const siteLocale = process.env.NEXT_PUBLIC_SITE_LOCALE || "en-US";
const siteThemeColor = process.env.NEXT_PUBLIC_THEME_COLOR || "#FF4500";
const siteDescription =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
  `${siteName} is a browser-based game site where you can jump in and play instantly.`;
const siteShortName = process.env.NEXT_PUBLIC_SITE_SHORT_NAME || siteName;
const plausibleDomain =
  process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ||
  siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
const plausibleScriptSrc =
  process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC || "https://plausible.io/js/script.js";

export const siteConfig = {
  siteName,
  siteShortName,
  siteUrl,
  siteEmail,
  siteLocale,
  siteThemeColor,
  siteDescription,
  plausibleDomain,
  plausibleScriptSrc,
};

export function createGameFallbackDescription(gameTitle: string) {
  return `Play ${gameTitle} on ${siteName} directly in your browser. No download required.`;
}
