import { CategoryFilter } from "@/components/product/category-filter"
import { FacetFilter } from "@/components/product/facet-filter"
import type { ALL_CATEGORIES_QUERY_RESULT } from "@/sanity.types"

export function FiltersPanel(props: {
  categories: ALL_CATEGORIES_QUERY_RESULT
  activeCategorySlug: string
  buildCategoryHref: (slug: string) => string
  sizes: string[]
  selectedSizes: string[]
  colors: string[]
  selectedColors: string[]
}) {
  return (
    <div className="flex flex-col gap-6">
      <CategoryFilter
        categories={props.categories}
        activeSlug={props.activeCategorySlug}
        buildHref={props.buildCategoryHref}
      />
      <FacetFilter title="Size" paramKey="size" options={props.sizes} selected={props.selectedSizes} />
      <FacetFilter title="Color" paramKey="color" options={props.colors} selected={props.selectedColors} />
    </div>
  )
}