import Link from "next/link"
import { siteConfig } from "@/lib/site-config"

const guideLinks = [
  { name: "Beginner Guide", href: "/beginner-guide" },
  { name: "Best Class", href: "/best-class" },
  { name: "Arsenal System", href: "/arsenal-system" },
  { name: "Co-op Guide", href: "/how-to-play-coop" },
  { name: "Boss Drops", href: "/boss-drops" },
  { name: "Patch Notes", href: "/patch-notes" },
];

export function Footer() {
  return (
    <footer className="bg-card/80 backdrop-blur-sm border-t border-border">
      <div className="container mx-auto px-4 py-10 max-w-7xl space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="font-theme-display text-primary font-bold text-lg">Farever.online</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Unofficial {siteConfig.gameName} guide hub with live player count, verified guides, and community data.
            </p>
          </div>

          {/* Guides */}
          <div className="space-y-4">
            <h3 className="font-theme-heading text-primary font-semibold">Guides</h3>
            <ul className="space-y-2">
              {guideLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-theme-heading text-primary font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://store.steampowered.com/app/3672400/Farever/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Steam Store Page ↗
                </a>
              </li>
              <li>
                <a href="https://www.shirogames.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Shiro Games ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-theme-heading text-primary font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer + Copyright */}
        <div className="border-t border-border pt-6 space-y-3 text-center">
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
            Farever.online is an unofficial fan site and is not affiliated with {siteConfig.developer}. 
            All game content and materials are trademarks and copyrights of their respective owners.
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} farever.online. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
