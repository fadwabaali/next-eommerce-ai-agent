// app/(app)/shop/[department]/page.tsx — updated
import { notFound } from "next/navigation"
import { sanityFetch } from "@/sanity/lib/live"
import {
  ALL_CATEGORIES_QUERY,
  PRODUCTS_BY_DEPARTMENT_NEWEST_QUERY,
  PRODUCTS_BY_DEPARTMENT_PRICE_ASC_QUERY,
  PRODUCTS_BY_DEPARTMENT_PRICE_DESC_QUERY,
  PRODUCTS_BY_DEPARTMENT_COUNT_QUERY,
  DEPARTMENT_VARIANT_OPTIONS_QUERY,
} from "@/sanity/lib/queries"
import { ProductCard } from "@/components/product/product-card"
import { FiltersPanel } from "@/components/product/filters-panel"
import { MobileFilters } from "@/components/product/mobile-filters"
import { SortSelect } from "@/components/product/sort-select"
import { Pagination } from "@/components/product/pagination"
import { DEPARTMENTS } from "@/lib/constants/departments"
import { buildQueryString } from "@/lib/utils/query-string"

const PAGE_SIZE = 8
const SORTS = ["newest", "price-asc", "price-desc"] as const
type Sort = (typeof SORTS)[number]

const QUERY_BY_SORT = {
  newest: PRODUCTS_BY_DEPARTMENT_NEWEST_QUERY,
  "price-asc": PRODUCTS_BY_DEPARTMENT_PRICE_ASC_QUERY,
  "price-desc": PRODUCTS_BY_DEPARTMENT_PRICE_DESC_QUERY,
} as const

const parseList = (value?: string) => (value ? value.split(",").filter(Boolean) : [])

export default async function DepartmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ department: string }>
  searchParams: Promise<{ category?: string; sort?: string; page?: string; size?: string; color?: string }>
}) {
  const { department } = await params
  const { category = "", sort = "newest", page = "1", size = "", color = "" } = await searchParams

  if (!DEPARTMENTS.some((d) => d.slug === department)) notFound()

  const sortKey = (SORTS as readonly string[]).includes(sort) ? (sort as Sort) : "newest"
  const pageNumber = Math.max(1, Number(page) || 1)
  const start = (pageNumber - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE
  const sizes = parseList(size)
  const colors = parseList(color)

  const [{ data: categories }, { data: products }, { data: total }, { data: variantOptions }] =
    await Promise.all([
      sanityFetch({ query: ALL_CATEGORIES_QUERY }),
      sanityFetch({
        query: QUERY_BY_SORT[sortKey],
        params: { department, categorySlug: category, sizes, colors, start, end },
      }),
      sanityFetch({
        query: PRODUCTS_BY_DEPARTMENT_COUNT_QUERY,
        params: { department, categorySlug: category, sizes, colors },
      }),
      sanityFetch({ query: DEPARTMENT_VARIANT_OPTIONS_QUERY, params: { department } }),
    ])

  const departmentCategories = categories.filter((c) => c.department === department)
  const departmentLabel = DEPARTMENTS.find((d) => d.slug === department)?.label ?? department
  const availableSizes = [...new Set(variantOptions.flatMap((p) => p.sizes ?? []))]
    .filter((s): s is string => Boolean(s))
    .sort()
  const availableColors = [...new Set(variantOptions.flatMap((p) => p.colors ?? []))]
    .filter((c): c is string => Boolean(c))
    .sort()

  const currentParams = { category, sort, size, color }
  
  const filterProps = {
    categories: departmentCategories,
    activeCategorySlug: category,
    buildCategoryHref: (slug: string) => buildQueryString(currentParams, { category: slug || null }),
    sizes: availableSizes,
    selectedSizes: sizes,
    colors: availableColors,
    selectedColors: colors,
  }

  const mobileFilterProps = {
    categories: departmentCategories,
    activeCategorySlug: category,
    sizes: availableSizes,
    selectedSizes: sizes,
    colors: availableColors,
    selectedColors: colors,
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <h1 className="font-heading text-3xl italic md:text-4xl">{departmentLabel}</h1>

      <div className="mt-8 grid gap-8 md:grid-cols-[220px_1fr]">
          <aside className="hidden md:block">
            <FiltersPanel {...filterProps} />
          </aside>
        <div>
          
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">{total} items</p>
              <MobileFilters {...mobileFilterProps} />
            </div>
            <SortSelect value={sortKey} />
          </div>

          {products.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <Pagination
            total={total}
            pageSize={PAGE_SIZE}
            currentPage={pageNumber}
            buildHref={(p) => buildQueryString(currentParams, { page: p > 1 ? String(p) : null })}
          />
        </div>
      </div>
    </div>
  )
}