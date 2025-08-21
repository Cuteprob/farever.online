import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-card/80 backdrop-blur-sm border-t border-border">
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        {/* 链接区域 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h2 className="font-heading text-primary font-bold">Bunny Market</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <span className="text-sm text-foreground">
                  support@bunnymarket.app
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-heading text-primary font-bold">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/games/new-games" className="text-sm text-foreground hover:text-primary transition-colors">
                  New Games
                </Link>
              </li>
              <li>
                <Link href="/games/hot-games" className="text-sm text-foreground hover:text-primary transition-colors">
                  Hot Games
                </Link>
              </li>
              <li>
                <Link href="/games/animal-games" className="text-sm text-foreground hover:text-primary transition-colors">
                  Animal Games
                </Link>
              </li>
              
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-heading text-primary font-bold">Games</h3>
            <ul className="space-y-2">
              <li>

                <a href="/bunny-market-unblocked" className="text-sm text-foreground hover:text-primary transition-colors">
                  Bunny Market Unblocked
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-heading text-primary font-bold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} bunnymarket.app. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
