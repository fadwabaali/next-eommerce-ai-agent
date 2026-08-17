"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { FiltersPanel } from "@/components/product/filters-panel"
import { buildQueryString } from "@/lib/utils/query-string"
import type { ALL_CATEGORIES_QUERY_RESULT } from "@/sanity.types"

export function MobileFilters(props: {
  categories: ALL_CATEGORIES_QUERY_RESULT
  activeCategorySlug: string
  sizes: string[]
  selectedSizes: string[]
  colors: string[]
  selectedColors: string[]
}) {
  const searchParams = useSearchParams()
  const buildCategoryHref = (slug: string) => buildQueryString(searchParams, { category: slug || null })

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" size="sm" className="md:hidden" />}>
        <SlidersHorizontal className="mr-2 size-4" />
        Filters
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-4 px-4">
          <FiltersPanel {...props} buildCategoryHref={buildCategoryHref} />
        </div>
      </SheetContent>
    </Sheet>
  )
}