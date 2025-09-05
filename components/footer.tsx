import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-card/80 backdrop-blur-sm border-t border-border">
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        {/* 链接区域 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h2 className="font-theme-heading text-primary font-bold">{process.env.NEXT_PUBLIC_PROJECT_NAME}</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm font-theme-body text-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <span className="text-sm font-theme-body text-foreground">
                  {process.env.NEXT_PUBLIC_PROJECT_EMAIL}
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-theme-heading text-primary font-bold">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/games/racing-games" className="text-sm font-theme-body text-foreground hover:text-primary transition-colors">
                  Racing Games
                </Link>
              </li>
              <li>
                <Link href="/games/strategy-games" className="text-sm font-theme-body text-foreground hover:text-primary transition-colors">
                  Strategy Games
                </Link>
              </li>
              
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-theme-heading text-primary font-bold">Games</h3>
            <ul className="space-y-2">
              <li>

                <a href={process.env.NEXT_PUBLIC_WEB_URL} className="text-sm font-theme-body text-foreground hover:text-primary transition-colors">
                  {process.env.NEXT_PUBLIC_PROJECT_NAME}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-theme-heading text-primary font-bold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm font-theme-body text-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm font-theme-body text-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="text-center">
          <p className="text-sm font-theme-body text-text-secondary">
            &copy; {new Date().getFullYear()} {process.env.NEXT_PUBLIC_WEB_URL?.replace('https://', '')}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
