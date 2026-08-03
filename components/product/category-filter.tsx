import Link from "next/link"
import { cn } from "@/lib/utils"
import type { ALL_CATEGORIES_QUERYResult } from "@/sanity.types"

export function CategoryFilter({
  categories,
  activeSlug,
}: {
  categories: ALL_CATEGORIES_QUERYResult
  activeSlug: string
}) {
  return (
    <nav className="flex flex-col gap-1">
      <Link
        href="?"
        className={cn(
          "rounded-md px-2 py-1.5 text-sm",
          !activeSlug ? "bg-accent font-medium" : "text-muted-foreground hover:bg-accent"
        )}
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat._id}
          href={`?category=${cat.slug?.current}`}
          className={cn(
            "rounded-md px-2 py-1.5 text-sm",
            activeSlug === cat.slug?.current
              ? "bg-accent font-medium"
              : "text-muted-foreground hover:bg-accent"
          )}
        >
          {cat.title}
        </Link>
      ))}
    </nav>
  )
}