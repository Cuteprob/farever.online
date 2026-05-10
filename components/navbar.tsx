import { NavbarClient } from "./NavbarClient";

const guideItems = [
  { name: "Beginner Guide", href: "/beginner-guide" },
  { name: "Best Class", href: "/best-class" },
  { name: "Arsenal System", href: "/arsenal-system" },
  { name: "Co-op Guide", href: "/how-to-play-coop" },
  { name: "Boss Drops", href: "/boss-drops" },
  { name: "Patch Notes", href: "/patch-notes" },
];

export function Navbar() {
  return <NavbarClient guideItems={guideItems} />;
}
