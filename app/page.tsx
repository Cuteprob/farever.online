import { Metadata } from "next";
import Link from "next/link";
import { PlayerCount } from "@/components/player-count";
import { SourceBadge } from "@/components/source-badge";
import { HomeAdsterraSlot } from "@/components/adsterra-slot";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Farever Guide Hub - Live Player Count & Beginner Guides",
  description:
    "Farever guide hub with live Steam player count, official facts, beginner tips, class guidance, co-op help, boss drops, and patch notes.",
  alternates: { canonical: siteConfig.siteUrl },
  openGraph: {
    title: "Farever Guide Hub - Live Player Count & Beginner Guides",
    description:
      "Farever guide hub with live Steam player count, official facts, beginner tips, class guidance, co-op help, boss drops, and patch notes.",
    url: siteConfig.siteUrl,
    siteName: siteConfig.siteName,
    type: "website",
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 675,
        alt: "Official Farever gameplay screenshot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Farever Guide Hub - Live Player Count & Beginner Guides",
    description:
      "Farever guide hub with live Steam player count, official facts, beginner tips, class guidance, co-op help, boss drops, and patch notes.",
    images: [siteConfig.defaultOgImage],
  },
};

const steamUrl = "https://store.steampowered.com/app/3672400/Farever/";

const tabs = [
  { label: "Overview", href: "#overview" },
  { label: "Beginner Guide", href: "/beginner-guide" },
  { label: "Best Class", href: "/best-class" },
  { label: "Arsenal System", href: "/arsenal-system" },
  { label: "Weapons", href: "/weapons-guide" },
  { label: "Free Mount", href: "/free-mount" },
  { label: "Invite Friends", href: "/how-to-play-coop" },
  { label: "Multiplayer FAQ", href: "/coop-explained" },
  { label: "Worth It?", href: "/worth-it" },
  { label: "Performance", href: "/performance-guide" },
  { label: "Boss Drops", href: "/boss-drops" },
  { label: "Patch Notes", href: "/patch-notes" },
];

const gameInfo = [
  ["Title", "Farever"],
  ["Genre", "Action, Adventure, RPG, Early Access"],
  ["Developer", "Shiro Games"],
  ["Publisher", "Shiro Games"],
  ["Franchise", "Farever"],
  ["Release Date", "6 May, 2026"],
  ["Early Access Release Date", "6 May, 2026"],
  ["Current Status", "Early Access"],
  ["Current Steam Reviews", "Mostly Positive (74% of 1,164)"],
  ["Price (as of May 8)", "$17.99 intro offer, down from $19.99"],
  ["Planned EA Length", "About 1 year"],
];

const minimumRequirements = [
  "Requires a 64-bit processor and operating system",
  "OS: Windows 10 64 bits",
  "Processor: Intel i7 6700K or AMD Ryzen 5 5500",
  "Memory: 16 GB RAM",
  "Graphics: Geforce 3060 or AMD Radeon RX 5600 XT",
  "Storage: 25 GB available space",
  "Additional Notes: 1080@30fps",
];

const recommendedRequirements = [
  "Requires a 64-bit processor and operating system",
  "OS: Windows 10 64 bits",
  "Processor: Intel i5 11400T or AMD Ryzen 5 3600X",
  "Memory: 32 GB RAM",
  "Graphics: Geforce 4060 or AMD Radeon RX 7600",
  "Storage: 25 GB available space",
  "Additional Notes: 1080@60fps",
];

const mediaAssets = [
  {
    type: "video",
    title: "Official Gameplay Overview",
    src: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3672400/extras/440b2f3f089cf38cdd560e3851c439e4.mp4?t=1778171154",
  },
  {
    type: "video",
    title: "Official Exploration Footage",
    src: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3672400/extras/f8bb8daf28dbbc2b89c7397093944b33.mp4?t=1778171154",
  },
  {
    type: "video",
    title: "Official Combat Footage",
    src: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3672400/extras/2667aed2d4ea78c8018ce6a9ae53077b.mp4?t=1778171154",
  },
  {
    type: "image",
    title: "Official Screenshot",
    src: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3672400/d74c0f5e9ab49639b0659727c9dfa107c261c825/ss_d74c0f5e9ab49639b0659727c9dfa107c261c825.1920x1080.jpg?t=1778171154",
  },
];

const needRightNow = [
  {
    title: "I just started",
    description: "First 30 minutes, early priorities, and what to avoid wasting time on.",
    href: "/beginner-guide",
    badge: "official" as const,
  },
  {
    title: "How do I get a free mount?",
    description: "Claim your free mount and companion from the in-game Shop. Takes 30 seconds.",
    href: "/free-mount",
    badge: "community" as const,
  },
  {
    title: "Which class should I pick?",
    description: "Situational recommendations for solo, co-op, and beginner players.",
    href: "/best-class",
    badge: "needs-testing" as const,
    badgeLabel: "Early Access Judgment",
  },
  {
    title: "What weapons are there?",
    description: "All weapon types, how to get them, skill systems, and best class combos.",
    href: "/weapons-guide",
    badge: "community" as const,
  },
  {
    title: "How do builds work?",
    description: "Arsenal system basics, secondary weapon logic, and what is still being tested.",
    href: "/arsenal-system",
    badge: "needs-testing" as const,
  },
  {
    title: "How does multiplayer work?",
    description: "Party size, shared loot, shared XP, solo vs co-op, and all pre-purchase multiplayer questions.",
    href: "/coop-explained",
    badge: "community" as const,
  },
  {
    title: "How do I invite friends?",
    description: "Step-by-step party setup, Steam invite fix, and troubleshooting when co-op is not working.",
    href: "/how-to-play-coop",
    badge: "community" as const,
  },
  {
    title: "Is Farever worth buying?",
    description: "Honest evaluation with live player data, pros, cons, and who should wait.",
    href: "/worth-it",
    badge: "needs-testing" as const,
    badgeLabel: "Data-Backed",
  },
  {
    title: "How do I fix stuttering?",
    description: "Performance optimization, recommended settings, and community workarounds.",
    href: "/performance-guide",
    badge: "community" as const,
  },
  {
    title: "What drops from bosses?",
    description: "Tracker format first, verified loot later. No fake complete database.",
    href: "/boss-drops",
    badge: "community" as const,
  },
  {
    title: "What changed recently?",
    description: "Patch note summaries focused on player impact instead of raw changelog copy.",
    href: "/patch-notes",
    badge: "official-news" as const,
  },
];

const watchlist = [
  {
    title: "Co-op friction reports",
    summary: "Monitoring player reports around party invites, dungeon sync, and party travel behavior.",
    href: "https://steamcommunity.com/app/3672400/discussions/",
    badge: "community" as const,
    lastChecked: "May 8",
  },
  {
    title: "Boss drops still thin",
    summary: "The tracker is live, but most drops still need post-launch verification before they should be treated as dependable.",
    href: "/boss-drops",
    badge: "needs-testing" as const,
    lastChecked: "May 8",
  },
  {
    title: "Patch-sensitive class advice",
    summary: "Class recommendations are intentionally situational and should move when Shiro adjusts balance.",
    href: "/best-class",
    badge: "needs-testing" as const,
    lastChecked: "May 8",
  },
  {
    title: "Live player tracking",
    summary: "Current players come from Steam. Peak and trend values are sampled by Farever.online as history builds.",
    href: "#player-count",
    badge: "site-tracked" as const,
    lastChecked: "May 8",
  },
];

const siteUpdates = [
  {
    date: "May 8",
    title: "Live Pulse launched",
    summary: "Current players, site-tracked peaks, and the first 7-day trend slot are live.",
    href: "#player-count",
  },
  {
    date: "May 8",
    title: "Core launch guides published",
    summary: "Beginner, class, Arsenal, co-op, drops, and patch pages now route from the hub.",
    href: "#need-right-now",
  },
  {
    date: "May 8",
    title: "Watchlist opened",
    summary: "Official facts and community-reported items are now separated instead of blended together.",
    href: "#watchlist",
  },
];

const faqItems = [
  {
    q: "What is Farever?",
    a: "Farever is an online cooperative action RPG by Shiro Games, set in the fantasy world of Siagarta. It launched in Steam Early Access on May 6, 2026.",
  },
  {
    q: "Is Farever multiplayer?",
    a: "Yes. Farever supports co-op for up to 4 players. You can also play the entire game solo.",
  },
  {
    q: "How does the Arsenal system work?",
    a: "Farever unlocks a secondary weapon setup early in progression. Our Arsenal guide separates officially confirmed behavior from launch-week testing notes so you can see what is stable and what still needs validation.",
  },
  {
    q: "Where can I check live player count?",
    a: "The Live Pulse card on the homepage shows current Steam players and Farever.online site-tracked samples for 24-hour peak and trend history.",
  },
  {
    q: "Where can I check boss drops?",
    a: "Our Boss Drops Tracker page lists community-reported and verified drops with explicit accuracy status for each entry.",
  },
  {
    q: "How do I know what is official vs tested by the community?",
    a: "Every important section uses source badges such as Official Steam, Official News, Community Reported, Site-Tracked, and Needs Testing.",
  },
];

function InfoRows({ rows }: { rows: string[][] }) {
  return (
    <div className="divide-y divide-theme-dark-600">
      {rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 py-3 text-sm">
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="text-right text-theme-dark-100">{value}</dd>
        </div>
      ))}
    </div>
  );
}

function RequirementsList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold text-white">{title}</h4>
      <ul className="space-y-2 text-sm leading-6 text-theme-dark-200">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="container-page">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(24,18,38,0.88),rgba(8,13,20,0.96))]" />
        <div className="relative container mx-auto max-w-7xl px-4 py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)] lg:items-start">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-md border border-theme-purple-500/30 bg-theme-purple-500/10 px-4 py-1.5 text-xs font-theme-heading uppercase tracking-[0.16em] text-theme-purple-300">
                Unofficial Fan Site · Early Access · Official + Community Tracked
              </div>
              <div>
                <h1 className="max-w-3xl font-theme-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
                  Farever Guide Hub
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-theme-dark-200 sm:text-xl">
                  Live Steam player count, official game facts, beginner routes, co-op help, boss drop tracking, and patch impact notes for Farever.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/beginner-guide" className="btn-accent btn-large">
                  Start Beginner Guide
                </Link>
                <Link href="/patch-notes" className="btn-secondary btn-large">
                  View Live Patch Notes
                </Link>
              </div>
              <div className="rounded-lg border border-theme-dark-600 bg-theme-dark-800/80 p-6 shadow-game">
                <div className="mb-4 flex items-center gap-2">
                  <SourceBadge type="official" />
                  <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">What is Farever?</span>
                </div>
                <p className="max-w-2xl text-sm leading-7 text-theme-dark-200 sm:text-base">
                  Farever is an online cooperative action RPG by Shiro Games. Explore Siagarta solo or with friends, clear dungeons, craft gear, and experiment with class plus weapon builds as Early Access systems take shape.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="border-l border-theme-dark-500 pl-3 text-sm text-theme-dark-200">Online co-op action RPG</div>
                  <div className="border-l border-theme-dark-500 pl-3 text-sm text-theme-dark-200">Open world + dungeons</div>
                  <div className="border-l border-theme-dark-500 pl-3 text-sm text-theme-dark-200">Class + weapon experimentation</div>
                </div>
              </div>
            </div>

            <section id="player-count">
              <PlayerCount />
            </section>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="mb-10">
          <HomeAdsterraSlot />
        </div>

        <nav className="hide-scrollbar mb-8 overflow-x-auto border-b border-theme-dark-600">
          <div className="flex min-w-max gap-8">
            {tabs.map((tab, index) => (
              <a
                key={tab.href}
                href={tab.href}
                className={`border-b-2 px-1 pb-4 text-sm font-medium transition-colors ${
                  index === 0
                    ? "border-white text-white"
                    : "border-transparent text-muted-foreground hover:text-white"
                }`}
              >
                {tab.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <main className="min-w-0 space-y-12">
            <section id="overview">
              <h2 className="font-theme-heading text-3xl font-bold text-white">Introduction</h2>
              <div className="mt-6 max-w-4xl space-y-4 text-base leading-8 text-theme-dark-200">
                <p>
                  Farever is a cooperative action RPG from Shiro Games. The short version: explore Siagarta, fight through action encounters, enter dungeons, gather materials, craft gear, and keep testing class plus weapon combinations as the Early Access version changes.
                </p>
                <p>
                  This Farever overview is written for new players who want to understand what the game is before opening a build guide or drop tracker. Official Steam facts, site-tracked player data, and community-reported Early Access issues are kept separate so the page stays useful without pretending launch-week information is final.
                </p>
              </div>

              <section className="mt-8">
                <h3 className="font-theme-heading text-2xl font-semibold text-white">How Farever Plays</h3>
                <p className="mt-4 max-w-4xl text-base leading-8 text-theme-dark-200">
                  Farever plays closer to an action RPG than a tab-target MMO. Movement, positioning, dodging, enemy patterns, traversal, and weapon skills all matter. New Farever players should treat the first hours as a learning loop: try a class, test how a weapon feels, explore open areas, then use dungeons and crafting to refine the build.
                </p>
              </section>

              <div className="mt-6 overflow-hidden rounded-lg border border-theme-dark-600 bg-theme-dark-800/80">
                <video
                  className="aspect-video w-full bg-black object-cover"
                  src={mediaAssets[0].src}
                  poster="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3672400/d74c0f5e9ab49639b0659727c9dfa107c261c825/ss_d74c0f5e9ab49639b0659727c9dfa107c261c825.1920x1080.jpg?t=1778171154"
                  controls
                  preload="metadata"
                />
                <div className="border-t border-theme-dark-600 px-5 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <SourceBadge type="official" />
                    <span className="text-sm font-medium text-white">Official Steam video showing Farever exploration and action combat.</span>
                  </div>
                </div>
              </div>

              <section className="mt-10 border-t border-theme-dark-600 pt-8">
                <h3 className="font-theme-heading text-2xl font-semibold text-white">Explore Siagarta</h3>
                <p className="mt-4 max-w-4xl text-base leading-8 text-theme-dark-200">
                  Farever is not only a sequence of menus and dungeon queues. The official footage presents Siagarta as a bright adventure space with open areas, vertical movement, environmental routes, and places to discover between fights. For a new Farever player, exploration is part of progression because it feeds materials, route knowledge, and dungeon readiness.
                </p>
                <video
                  className="mt-6 aspect-video w-full rounded-lg border border-theme-dark-600 bg-black object-cover"
                  src={mediaAssets[1].src}
                  controls
                  preload="metadata"
                />
              </section>

              <section className="mt-10 border-t border-theme-dark-600 pt-8">
                <h3 className="font-theme-heading text-2xl font-semibold text-white">Fight, Dodge, and Learn Weapons</h3>
                <p className="mt-4 max-w-4xl text-base leading-8 text-theme-dark-200">
                  The practical question is not just "which Farever class is best?" It is whether a class and weapon setup gives you enough control, survivability, damage windows, and utility for the content you are running. That is why this site treats class advice as patch-sensitive and keeps weapon-system notes separate from confirmed facts.
                </p>
                <video
                  className="mt-6 aspect-video w-full rounded-lg border border-theme-dark-600 bg-black object-cover"
                  src={mediaAssets[2].src}
                  controls
                  preload="metadata"
                />
              </section>

              <section className="mt-10 border-t border-theme-dark-600 pt-8">
                <h3 className="font-theme-heading text-2xl font-semibold text-white">Build Solo or Play Co-op</h3>
                <p className="mt-4 max-w-4xl text-base leading-8 text-theme-dark-200">
                  Farever can be played solo, but the game is clearly positioned around online co-op, party coordination, and shared dungeon progression. If you play with friends, start with stable basics: agree on roles, keep expectations flexible during Early Access, and check patch notes before assuming a co-op issue is on your side.
                </p>
                <img
                  className="mt-6 aspect-video w-full rounded-lg border border-theme-dark-600 object-cover"
                  src={mediaAssets[3].src}
                  alt="Official Farever screenshot showing players in a cooperative scene"
                />
              </section>

              <section className="mt-10 border-t border-theme-dark-600 pt-8">
                <h3 className="font-theme-heading text-2xl font-semibold text-white">Who Farever Is For</h3>
                <p className="mt-4 max-w-4xl text-base leading-8 text-theme-dark-200">
                  Farever is a better fit if you enjoy approachable co-op ARPGs, MMO-lite worlds, build experimentation, and watching an Early Access game evolve. It is a weaker fit if you need a fully solved loot database, perfectly stable launch-state networking, or final balance answers before choosing a class.
                </p>
              </section>

              <section className="mt-8 border-y border-theme-dark-600 py-6">
                <h3 className="font-theme-heading text-xl font-semibold text-white">Why players are watching Farever now</h3>
                <p className="mt-3 max-w-4xl text-sm leading-7 text-theme-dark-200">
                  Farever launched into Early Access with enough momentum for the official team to call out a peak of over 7,000 concurrent players. That matters because a new online RPG lives or dies by whether players keep showing up, whether co-op improves quickly, and whether the build systems create enough reasons to return. Farever.online tracks those signals through live player data, patch notes, community reports, and guide updates instead of treating the launch version as final.
                </p>
              </section>

              <section className="mt-8">
                <h3 className="font-theme-heading text-xl font-semibold text-white">What New Farever Players Should Read Next</h3>
                <p className="mt-3 max-w-4xl text-sm leading-7 text-theme-dark-200">
                  If you are still deciding whether to play, stay on this Farever overview and watch the official media above. If you already installed the game, start with the{" "}
                  <Link href="/beginner-guide" className="text-theme-frost-300 hover:text-white">
                    beginner guide
                  </Link>
                  , then check{" "}
                  <Link href="/best-class" className="text-theme-frost-300 hover:text-white">
                    best class
                  </Link>
                  ,{" "}
                  <Link href="/arsenal-system" className="text-theme-frost-300 hover:text-white">
                    Arsenal system
                  </Link>
                  ,{" "}
                  <Link href="/how-to-play-coop" className="text-theme-frost-300 hover:text-white">
                    co-op help
                  </Link>
                  ,{" "}
                  <Link href="/boss-drops" className="text-theme-frost-300 hover:text-white">
                    boss drops
                  </Link>
                  , and{" "}
                  <Link href="/patch-notes" className="text-theme-frost-300 hover:text-white">
                    patch notes
                  </Link>
                  .
                </p>
              </section>
            </section>

            <section id="guides" className="border-t border-theme-dark-600 pt-8">
              <h2 className="font-theme-heading text-2xl font-bold text-white">Guides</h2>
              <div className="mt-5 divide-y divide-theme-dark-600 border-y border-theme-dark-600">
                {needRightNow.map((item) => (
                  <div key={item.href} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-white">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-theme-dark-200">{item.description}</p>
                    </div>
                    <Link href={item.href} className="text-sm font-medium text-theme-frost-300 hover:text-white">
                      Open
                    </Link>
                  </div>
                ))}
              </div>
            </section>

            <section id="news">
              <h2 className="font-theme-heading text-2xl font-bold text-white">Latest Site Updates</h2>
              <div className="mt-5 space-y-4">
                {siteUpdates.map((item) => (
                  <div key={item.title} className="border-l border-theme-dark-500 pl-4">
                    <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{item.date}</div>
                    <h3 className="mt-1 text-base font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-theme-dark-200">{item.summary}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="drops">
              <h2 className="font-theme-heading text-2xl font-bold text-white">Drops</h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-theme-dark-200">
                Boss drops are tracked as reports first, then marked verified only after enough evidence is available. The tracker avoids presenting launch-week guesses as a complete loot database.
              </p>
              <Link href="/boss-drops" className="mt-4 inline-flex text-sm font-medium text-theme-frost-300 hover:text-white">
                Open Boss Drops Tracker
              </Link>
            </section>

            <section id="community-watch">
              <h2 className="font-theme-heading text-2xl font-bold text-white">Early Access Watchlist</h2>
              <div className="mt-5 space-y-4">
                {watchlist.map((item) => (
                  <div key={item.title} className="border-l border-theme-dark-500 pl-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <SourceBadge type={item.badge} />
                      <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Last checked {item.lastChecked}</span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-theme-dark-200">{item.summary}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="faq">
              <h2 className="font-theme-heading text-2xl font-bold text-white">Frequently Asked Questions</h2>
              <div className="mt-5 divide-y divide-theme-dark-600 border-y border-theme-dark-600">
                {faqItems.map((item) => (
                  <details key={item.q} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-white">
                      {item.q}
                      <span className="text-muted-foreground transition-transform group-open:rotate-180">v</span>
                    </summary>
                    <p className="mt-3 text-sm leading-6 text-theme-dark-200">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </main>

          <aside id="official-snapshot" className="lg:self-start">
            <div className="rounded-lg border border-theme-dark-600 bg-theme-dark-800/90 p-6 shadow-game">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-theme-heading text-xl font-bold text-white">Official Snapshot</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Steam-sourced game details.</p>
                </div>
                <SourceBadge type="official" />
              </div>

              <section>
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-theme-dark-200">Game Info</h3>
                <dl className="mt-3">
                  <InfoRows rows={gameInfo} />
                </dl>
                <p className="mt-4 text-xs leading-6 text-muted-foreground">
                  Store pricing, review totals, and discounts can change. This snapshot reflects the public Steam store page on May 8, 2026.
                </p>
              </section>

              <section className="mt-7 border-t border-theme-dark-600 pt-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-theme-dark-200">System Requirements</h3>
                <div className="mt-4 space-y-6">
                  <RequirementsList title="Minimum" items={minimumRequirements} />
                  <RequirementsList title="Recommended" items={recommendedRequirements} />
                </div>
              </section>

              <div className="mt-7 border-t border-theme-dark-600 pt-6">
                <a href={steamUrl} target="_blank" rel="noopener noreferrer" className="btn-accent w-full">
                  Play on Steam
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteConfig.siteName,
            url: siteConfig.siteUrl,
            description: siteConfig.siteDescription,
          }),
        }}
      />
    </div>
  );
}
