"use client"
import Link from "next/link"
import Image from "next/image"
import { GameCategory } from "@/config/sprunkigame"
import { useState } from "react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { name: 'Sprunki Retake', href: '/sprunki-retake', isHot: true },
    { name: 'Sprunki Phase 5', href: '/sprunki-phase-5' },
    { name: 'Sprunki Phase 3', href: '/sprunki-phase-3' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-14">
        {/* Desktop Navigation */}
        <div className="flex items-center justify-between h-full">
          <Link href="/" className="flex items-center space-x-4">
          
            <span className="text-2xl font-heading font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:animate-shake transition-all duration-300 transform hover:scale-110">
            sprunksters.top
            </span>
          </Link>

          {/* Mobile Menu Button */}
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

          {/* Desktop Categories */}
          <div className="hidden md:flex items-center space-x-4">
            {/* {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                className="relative px-3 py-1.5 rounded-full text-sm font-medium bg-background hover:bg-muted text-foreground hover:text-primary transition-all duration-300 border border-border hover:shadow-game hover:scale-105 flex items-center gap-2"
              >
                {item.name}
                {item.isHot && (
                  <span className="absolute -top-1.5 -right-1 px-1.5 py-[1px] text-[9px] font-bold text-white rounded-full bg-gradient-to-r from-red-500 to-orange-500 shadow-sm animate-pulse border border-white/20">
                    HOT
                  </span>
                )}
              </Link>
            ))} */}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 bg-card/95 border-t border-border shadow-game">
            {/* {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                className="relative block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-all duration-300 rounded-lg mx-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
                {item.isHot && (
                  <span className="absolute top-1.5 left-[calc(100%-40px)] px-1.5 py-[1px] text-[9px] font-bold text-white rounded-full bg-gradient-to-r from-red-500 to-orange-500 shadow-sm animate-pulse border border-white/20">
                    HOT
                  </span>
                )}
              </Link>
            ))} */}
          </div>
        )}
      </div>
    </nav>
  )
}
