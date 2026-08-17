// components/product/category-filter.tsx
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { ALL_CATEGORIES_QUERY_RESULT } from "@/sanity.types"

export function CategoryFilter({
  categories,
  activeSlug,
  buildHref,
}: {
  categories: ALL_CATEGORIES_QUERY_RESULT
  activeSlug: string
  buildHref: (slug: string) => string
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">Category</p>
      <nav className="flex flex-col gap-1">
        <Link
          href={buildHref("")}
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
            href={buildHref(cat.slug?.current ?? "")}
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
    </div>
  )
}