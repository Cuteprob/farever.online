import { getAllCategories } from "@/models/games"
import { unstable_noStore as noStore } from "next/cache"
import { NavbarClient } from "./NavbarClient"
import { guidePages } from "@/data/guides"

export async function Navbar() {
  noStore();

  const categories = await getAllCategories();
  const navItems = categories
    .filter((category) => category.gameCount > 0)
    .slice(0, 4)
    .map((category) => ({
      name: category.name,
      href: `/games/${category.slug}`,
    }));

  const guideItems = guidePages.map((guide) => ({
    name: guide.heading,
    href: `/${guide.slug}`,
  }));

  return <NavbarClient navItems={navItems} guideItems={guideItems} />;
}
