const siteName = process.env.NEXT_PUBLIC_PROJECT_NAME || "Farever Guide Hub";
const siteUrl = process.env.NEXT_PUBLIC_WEB_URL || process.env.NEXT_PUBLIC_BASE_URL || "";
const siteEmail = process.env.NEXT_PUBLIC_PROJECT_EMAIL || "";
const siteLocale = process.env.NEXT_PUBLIC_SITE_LOCALE || "en-US";
const siteThemeColor = process.env.NEXT_PUBLIC_THEME_COLOR || "#7C3AED";
const siteDescription =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
  "Farever guide hub with live Steam player count, official facts, beginner tips, class guidance, co-op help, boss drops, and patch notes.";
const siteShortName = process.env.NEXT_PUBLIC_SITE_SHORT_NAME || "Farever.online";
const plausibleDomain =
  process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ||
  siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
const plausibleScriptSrc =
  process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC || "https://plausible.io/js/script.js";
const steamAppId = process.env.NEXT_PUBLIC_STEAM_APP_ID || "3672400";
const defaultOgImage =
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3672400/d74c0f5e9ab49639b0659727c9dfa107c261c825/ss_d74c0f5e9ab49639b0659727c9dfa107c261c825.1920x1080.jpg?t=1778171154";

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
  steamAppId,
  defaultOgImage,
  gameName: "Farever",
  developer: "Shiro Games",
};
