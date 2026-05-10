"use client"

import Link from "next/link"
import Image from "next/image"
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
  guideItems: NavItem[];
}

export function NavbarClient({ guideItems }: NavbarClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Image
              src="/logo.png"
              alt="Farever.online logo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-xl border border-theme-purple-500/30 object-cover shadow-game"
              priority
            />
            <span className="text-xl font-theme-display font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-theme-purple-400 via-theme-gold-400 to-theme-frost-400 transition-all duration-300">
              Farever.online
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/" className="px-3 py-2 rounded-lg text-sm font-medium text-theme-dark-200 hover:text-white hover:bg-theme-dark-700/50 transition-all duration-200">
              Overview
            </Link>
            <Link href="/#official-snapshot" className="px-3 py-2 rounded-lg text-sm font-medium text-theme-dark-200 hover:text-theme-frost-400 hover:bg-theme-dark-700/50 transition-all duration-200">
              Snapshot
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative px-4 py-2 rounded-lg text-sm font-semibold bg-theme-purple-500/10 text-theme-purple-300 hover:text-white transition-all duration-300 border border-theme-purple-500/25 hover:border-theme-purple-500/40 flex items-center gap-2">
                  Guides
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 border-theme-dark-600 bg-theme-dark-800 text-foreground">
                {guideItems.map((item) => (
                  <DropdownMenuItem key={item.href} className="cursor-pointer rounded-lg p-0 text-slate-200 hover:bg-theme-dark-700 hover:text-white focus:bg-theme-dark-700 focus:text-white">
                    <Link href={item.href} className="block w-full px-3 py-2.5 text-slate-200 hover:text-white focus:text-white">
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/boss-drops" className="px-3 py-2 rounded-lg text-sm font-medium text-theme-dark-200 hover:text-theme-gold-400 hover:bg-theme-dark-700/50 transition-all duration-200">
              Drops
            </Link>
            <Link href="/patch-notes" className="px-3 py-2 rounded-lg text-sm font-medium text-theme-dark-200 hover:text-theme-frost-400 hover:bg-theme-dark-700/50 transition-all duration-200">
              Patches
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-theme-dark-700/50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-theme-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-1 bg-card/95 border-t border-border shadow-game">
            <div className="mx-2 rounded-xl border border-theme-purple-500/20 bg-theme-dark-800/80 p-3">
              <Link
                href="/"
                className="block px-3 py-2 text-sm text-foreground hover:bg-theme-dark-700 hover:text-white transition-all duration-200 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Overview
              </Link>
              <Link
                href="/#official-snapshot"
                className="block px-3 py-2 text-sm text-foreground hover:bg-theme-dark-700 hover:text-white transition-all duration-200 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Snapshot
              </Link>
              <div className="mb-2 px-2 text-xs font-theme-heading uppercase tracking-[0.15em] text-theme-purple-400 font-semibold">
                Game Guides
              </div>
              {guideItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-sm text-foreground hover:bg-theme-dark-700 hover:text-white transition-all duration-200 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
