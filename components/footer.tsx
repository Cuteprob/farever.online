import Link from "next/link"
import { GameCategory } from "@/config/sprunkigame"

export function Footer() {
  return (
    <footer className="bg-card/80 backdrop-blur-sm border-t border-border">
      <div className="container mx-auto px-4 py-12 max-w-7xl space-y-12">
        {/* 分类导航区 */}
        
        

        {/* 链接区域 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h2 className="font-heading text-primary font-bold">sprunksters.top</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="mailto:support@sprunksters.top" className="text-sm text-foreground hover:text-primary transition-colors">
                  support@sprunksters.top
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-heading text-primary font-bold">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-sm text-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/how-to-play" className="text-sm text-foreground hover:text-primary transition-colors">
                  How to Play
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-sm text-foreground hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              
            </ul>
          </div>

          {/* <div className="space-y-4">
            <h3 className="font-heading text-primary font-bold">Games</h3>
            <ul className="space-y-2">
              <li>

                <a href="https://slotmaker.app" className="text-sm text-foreground hover:text-primary transition-colors">
                  Slot Maker
                </a>
              </li>
            </ul>
          </div> */}

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
            &copy; {new Date().getFullYear()} sprunksters.top. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
