"use client"

import Link from "next/link"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavItem {
  name: string;
  href: string;
}

interface NavbarClientProps {
  navItems: NavItem[];
  guideItems: NavItem[];
}

export function NavbarClient({ navItems, guideItems }: NavbarClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8 lg:gap-12 xl:gap-16">
            <Link href="/" className="flex items-center space-x-4">
              <span className="text-2xl font-theme-heading font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent hover:animate-bounce transition-all duration-300 transform">
                {process.env.NEXT_PUBLIC_PROJECT_NAME}
              </span>
            </Link>

            <div className="hidden md:flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-theme-fire-500/20 to-theme-dark-700 text-white hover:text-white transition-all duration-300 border border-theme-fire-500/40 shadow-neon hover:scale-105 flex items-center gap-2">
                    Game Guides
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-80 border-theme-dark-600 bg-theme-dark-800 text-foreground">
                  {guideItems.map((item) => (
                    <DropdownMenuItem key={item.href} className="cursor-pointer rounded-lg p-0 text-slate-100 hover:bg-theme-dark-700 hover:text-white focus:bg-theme-dark-700 focus:text-white">
                      <Link href={item.href} className="block w-full px-3 py-3 text-slate-100 hover:text-white focus:text-white">
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          <div className="hidden md:flex items-center space-x-4 lg:ml-10 xl:ml-14">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-3 py-1.5 rounded-full text-sm font-medium bg-background hover:bg-muted text-foreground hover:text-primary transition-all duration-300 border border-border hover:shadow-game hover:scale-105 flex items-center gap-2"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 bg-card/95 border-t border-border shadow-game">
            <div className="mx-2 rounded-xl border border-theme-fire-500/30 bg-theme-dark-800/80 p-3">
              <div className="mb-2 px-2 text-xs font-theme-heading uppercase tracking-[0.2em] text-primary">
                Game Guides
              </div>
              {guideItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-all duration-300 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-all duration-300 rounded-lg mx-2"
                onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
