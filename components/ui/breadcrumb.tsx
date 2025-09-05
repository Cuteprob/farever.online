import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground font-theme-body">
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />}
          {index === items.length - 1 ? (
            <span className="font-theme-heading text-primary">
              {item.label}
            </span>
          ) : (
            <Link 
              href={item.href}
              className="hover:text-primary transition-colors font-theme-body"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}