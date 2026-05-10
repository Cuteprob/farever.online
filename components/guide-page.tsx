import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { GuideMarkdown } from "@/components/guide-markdown";
import { GuideEndAdsterraSlot, GuideMidAdsterraSlot } from "@/components/adsterra-slot";
import { GuidePageData } from "@/data/guides";
import { siteConfig } from "@/lib/site-config";
import { SourceBadge } from "@/components/source-badge";

function extractSections(content: string) {
  return content
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => {
      const title = line.replace(/^##\s+/, "").trim();
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      return { id, title };
    });
}

function splitGuideContent(content: string) {
  const headingMatches = Array.from(content.matchAll(/^##\s+/gm));

  if (headingMatches.length < 3) {
    return {
      topContent: content,
      bottomContent: "",
    };
  }

  const splitIndex = headingMatches[2]?.index ?? content.length;

  return {
    topContent: content.slice(0, splitIndex).trim(),
    bottomContent: content.slice(splitIndex).trim(),
  };
}

// 获取所有指南列表（静态引入避免循环依赖）
const allGuides = [
  { slug: "beginner-guide", heading: "Beginner Guide", metaDescription: "New to Farever? Start here for early priorities, first 30 minutes, and common mistakes." },
  { slug: "best-class", heading: "Best Class", metaDescription: "Find the best Farever class for solo, co-op, and beginners with situational recommendations." },
  { slug: "arsenal-system", heading: "Arsenal System", metaDescription: "How the Arsenal system works, best choices, and class synergy in Farever." },
  { slug: "how-to-play-coop", heading: "Invite Friends & Fix Co-op", metaDescription: "Step-by-step party setup, Steam invite walkthrough, and troubleshooting when co-op is not working." },
  { slug: "boss-drops", heading: "Boss Drops", metaDescription: "Community-tracked Farever boss drops with verification status." },
  { slug: "patch-notes", heading: "Patch Notes", metaDescription: "Farever patch notes with player impact analysis and affected guides." },
  { slug: "free-mount", heading: "Free Mount", metaDescription: "How to get a free mount and companion in Farever Early Access." },
  { slug: "weapons-guide", heading: "Weapons Guide", metaDescription: "Known weapon types, how weapon skills work, and best class pairings in Early Access." },
  { slug: "coop-explained", heading: "Multiplayer FAQ", metaDescription: "Party size, shared loot, shared XP, solo vs co-op, and pre-purchase multiplayer answers." },
  { slug: "worth-it", heading: "Worth It?", metaDescription: "Is Farever worth buying in Early Access? Honest evaluation with player data." },
  { slug: "performance-guide", heading: "Performance Guide", metaDescription: "Fix stuttering, optimize settings, and check system requirements for Farever." },
];

const guideVerification: Record<string, { verified: string; sources: { label: string; href: string }[] }> = {
  "beginner-guide": {
    verified: "Steam store facts: Early Access release, online co-op, open-world exploration, dynamic combat, crafting, and platforming.",
    sources: [
      { label: "Steam Store", href: "https://store.steampowered.com/app/3672400/Farever/" },
      { label: "Steam News", href: "https://store.steampowered.com/news/app/3672400" },
    ],
  },
  "best-class": {
    verified: "Steam confirms multiple classes, weapon skills, attributes, and group roles; rankings are Early Access judgment, not final balance data.",
    sources: [
      { label: "Steam Store", href: "https://store.steampowered.com/app/3672400/Farever/" },
      { label: "Patch Notes", href: "/patch-notes" },
    ],
  },
  "arsenal-system": {
    verified: "Steam confirms class, weapon skill, attribute, specialization, and custom gear systems; detailed build advice is patch-sensitive.",
    sources: [
      { label: "Steam Store", href: "https://store.steampowered.com/app/3672400/Farever/" },
      { label: "Patch Notes", href: "/patch-notes" },
    ],
  },
  "how-to-play-coop": {
    verified: "Steam confirms online co-op; launch-week priority notes mention Steam invite, connection, syncing, latency, and stability work.",
    sources: [
      { label: "Steam Store", href: "https://store.steampowered.com/app/3672400/Farever/" },
      { label: "Steam Discussions", href: "https://steamcommunity.com/app/3672400/discussions/" },
    ],
  },
  "boss-drops": {
    verified: "Steam confirms dungeons, bosses, loot, crafting, and gear progression; specific drop tables require player evidence before listing.",
    sources: [
      { label: "Steam Store", href: "https://store.steampowered.com/app/3672400/Farever/" },
      { label: "Steam Discussions", href: "https://steamcommunity.com/app/3672400/discussions/" },
    ],
  },
  "patch-notes": {
    verified: "Steam news and store pages are treated as primary sources; player-impact notes are site analysis.",
    sources: [
      { label: "Steam News", href: "https://store.steampowered.com/news/app/3672400" },
      { label: "Steam Store", href: "https://store.steampowered.com/app/3672400/Farever/" },
    ],
  },
  "free-mount": {
    verified: "Free mount and companion via in-game Shop confirmed by multiple Reddit beginner-tips posts and Steam community threads.",
    sources: [
      { label: "Reddit: Beginner Tips", href: "https://www.reddit.com/r/FareverGame/comments/1t628uq/beginner_tips_in_text_form/" },
      { label: "Steam Store", href: "https://store.steampowered.com/app/3672400/Farever/" },
    ],
  },
  "weapons-guide": {
    verified: "Weapon system mechanics from Steam store page. Weapon categories and Arsenal interactions from community testing. Weapon list request confirmed as common need.",
    sources: [
      { label: "Reddit: Weapon List Request", href: "https://www.reddit.com/r/FareverGame/comments/1t5wmyb/is_there_a_list_of_all_the_weapons_in_the_game/" },
      { label: "Steam Store", href: "https://store.steampowered.com/app/3672400/Farever/" },
    ],
  },
  "coop-explained": {
    verified: "Co-op support confirmed by Steam store. Party size, loot sharing, and grouping value from community testing and Reddit party-benefit discussions.",
    sources: [
      { label: "Reddit: Is Party Worth It?", href: "https://www.reddit.com/r/FareverGame/comments/1t663kw/being_in_a_party_is_good/" },
      { label: "Steam: Co-op Player Count", href: "https://steamcommunity.com/app/3672400/discussions/0/837249796380088617/" },
      { label: "Steam Store", href: "https://store.steampowered.com/app/3672400/Farever/" },
    ],
  },
  "worth-it": {
    verified: "Review data from Steam store, player count from SteamDB and official announcement, roadmap from Shiro Games EA description.",
    sources: [
      { label: "Steam Store", href: "https://store.steampowered.com/app/3672400/Farever/" },
      { label: "SteamDB", href: "https://steamdb.info/app/3672400/charts/" },
      { label: "Reddit r/FareverGame", href: "https://www.reddit.com/r/FareverGame/" },
    ],
  },
  "performance-guide": {
    verified: "System requirements from official Steam store page. Performance issues and workarounds from Reddit beginner-tips threads and Steam community reports.",
    sources: [
      { label: "Steam Store", href: "https://store.steampowered.com/app/3672400/Farever/" },
      { label: "Reddit: Beginner Tips", href: "https://www.reddit.com/r/FareverGame/comments/1t628uq/beginner_tips_in_text_form/" },
      { label: "SteamDB", href: "https://steamdb.info/app/3672400/charts/" },
    ],
  },
};

export function GuidePage({ guide }: { guide: GuidePageData }) {
  const sections = extractSections(guide.content);
  const { topContent, bottomContent } = splitGuideContent(guide.content);
  const relatedGuides = allGuides.filter((item) => item.slug !== guide.slug).slice(0, 3);
  const isCommunityHeavy = guide.slug === "boss-drops" || guide.slug === "how-to-play-coop" || guide.slug === "free-mount" || guide.slug === "coop-explained" || guide.slug === "performance-guide";
  const isJudgmentHeavy = guide.slug === "best-class" || guide.slug === "arsenal-system" || guide.slug === "worth-it" || guide.slug === "weapons-guide";
  const verification = guideVerification[guide.slug];
  const showMidAd = guide.slug === "beginner-guide" || guide.slug === "best-class" || guide.slug === "arsenal-system" || guide.slug === "weapons-guide" || guide.slug === "worth-it" || guide.slug === "performance-guide";
  const showEndAd = showMidAd || guide.slug === "how-to-play-coop" || guide.slug === "patch-notes" || guide.slug === "free-mount" || guide.slug === "coop-explained";

  return (
    <main className="container mx-auto max-w-7xl px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Farever.online", href: "/" },
          { label: guide.heading, href: `/${guide.slug}` },
        ]}
      />

      {/* Hero Banner */}
      <section className="relative mt-8 overflow-hidden rounded-2xl border border-theme-dark-600 bg-gradient-to-br from-theme-dark-800 via-theme-dark-900 to-theme-dark-800 px-6 py-10 shadow-game sm:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsla(270,60%,55%,0.12),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsla(45,80%,55%,0.06),_transparent_50%)]" />
        <div className="relative max-w-3xl">
          <div className="mb-4 inline-flex items-center rounded-full border border-theme-purple-500/30 bg-theme-purple-500/10 px-4 py-1 text-xs font-theme-heading uppercase tracking-[0.2em] text-theme-purple-300">
            {siteConfig.gameName} Guide
          </div>
          <h1 className="font-theme-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            {guide.heading}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-theme-dark-200 sm:text-lg">
            {guide.intro}
          </p>
        </div>
      </section>

      {verification && (
        <section className="mt-5 rounded-2xl border border-theme-dark-600 bg-theme-dark-800/80 px-5 py-4 shadow-game">
          <div className="flex flex-wrap items-center gap-2">
            <SourceBadge type="official" />
            {isCommunityHeavy && <SourceBadge type="community" />}
            {isJudgmentHeavy && <SourceBadge type="needs-testing" label="Patch-Sensitive" />}
            <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Last reviewed: May 8, 2026</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-theme-dark-200">{verification.verified}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            {verification.sources.map((source) => (
              <a
                key={source.href}
                href={source.href}
                target={source.href.startsWith("http") ? "_blank" : undefined}
                rel={source.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-theme-frost-300 hover:text-white"
              >
                {source.label}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Content Grid */}
      <section className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
        {/* Main Article */}
        <article className="overflow-hidden rounded-2xl border border-theme-dark-600 bg-theme-dark-800/90 shadow-game">
          <div className="border-b border-theme-dark-600 bg-theme-dark-900/60 px-6 py-4 sm:px-8">
            <h2 className="font-theme-heading text-lg font-semibold text-primary">Guide Content</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Based on Early Access gameplay. Data sources are marked where applicable.
            </p>
          </div>
          <div className="px-6 py-8 sm:px-8">
            <div className="mb-8 rounded-2xl border border-theme-dark-600 bg-theme-dark-900/60 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <SourceBadge type="official" />
                {isCommunityHeavy && <SourceBadge type="community" />}
                {isJudgmentHeavy && <SourceBadge type="needs-testing" label="Early Access Judgment" />}
              </div>
              <div className="mt-4 grid gap-4 text-sm text-theme-dark-200 sm:grid-cols-3">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Official Facts Used</div>
                  <p className="mt-2 leading-6">Steam store information, official release details, and confirmed high-level systems.</p>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Community Layer</div>
                  <p className="mt-2 leading-6">Player reports are included only where the page topic requires them and should be treated as patch-sensitive.</p>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Review Status</div>
                  <p className="mt-2 leading-6">Last reviewed during Farever Early Access launch week. Re-check after balance or co-op patches.</p>
                </div>
              </div>
            </div>
            <GuideMarkdown content={topContent} />
            {showMidAd && bottomContent && (
              <div className="my-10">
                <GuideMidAdsterraSlot />
              </div>
            )}
            {bottomContent && <GuideMarkdown content={bottomContent} />}
            {showEndAd && (
              <div className="mt-10">
                <GuideEndAdsterraSlot />
              </div>
            )}
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          {/* Table of Contents */}
          <div className="rounded-2xl border border-theme-dark-600 bg-theme-dark-800/95 p-5 shadow-game">
            <h2 className="font-theme-heading text-base font-semibold text-primary">On This Page</h2>
            <div className="mt-3 space-y-1.5">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-lg bg-theme-dark-700/40 px-3 py-2 text-sm text-theme-dark-200 transition-all hover:bg-theme-dark-700 hover:text-white hover:pl-4"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </div>

          {/* Related Guides */}
          <div className="rounded-2xl border border-theme-dark-600 bg-theme-dark-800/95 p-5 shadow-game">
            <h2 className="font-theme-heading text-base font-semibold text-primary">More Farever Guides</h2>
            <div className="mt-3 space-y-2">
              {relatedGuides.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${item.slug}`}
                  className="block rounded-xl border border-theme-dark-600 bg-theme-dark-700/30 px-4 py-3 transition-all hover:border-theme-purple-500/30 hover:bg-theme-dark-700/60"
                >
                  <div className="text-sm font-semibold text-white">{item.heading}</div>
                  <div className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.metaDescription}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="rounded-2xl border border-theme-dark-600 bg-theme-dark-800/95 p-5 shadow-game">
            <h2 className="font-theme-heading text-base font-semibold text-primary">Quick Links</h2>
            <div className="mt-3 grid gap-2">
              <a href="https://store.steampowered.com/app/3672400/Farever/" target="_blank" rel="noopener noreferrer" className="btn-primary text-center text-sm">
                Farever on Steam ↗
              </a>
              <Link href="/" className="btn-secondary text-center text-sm">
                Back to Hub
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: guide.title,
            description: guide.metaDescription,
            mainEntityOfPage: `${siteConfig.siteUrl}/${guide.slug}`,
            dateModified: "2026-05-08",
            datePublished: "2026-05-08",
            author: {
              "@type": "Organization",
              name: siteConfig.siteShortName,
              url: siteConfig.siteUrl,
            },
            publisher: {
              "@type": "Organization",
              name: siteConfig.siteShortName,
              url: siteConfig.siteUrl,
            },
            image: siteConfig.defaultOgImage,
          }),
        }}
      />
    </main>
  );
}
