import { notFound } from "next/navigation"
import { sanityFetch } from "@/sanity/lib/live"
import {
  ALL_CATEGORIES_QUERY,
  PRODUCTS_BY_DEPARTMENT_NEWEST_QUERY,
  PRODUCTS_BY_DEPARTMENT_PRICE_ASC_QUERY,
  PRODUCTS_BY_DEPARTMENT_PRICE_DESC_QUERY,
  PRODUCTS_BY_DEPARTMENT_COUNT_QUERY,
} from "@/sanity/lib/queries"
import { ProductCard } from "@/components/product/product-card"
import { CategoryFilter } from "@/components/product/category-filter"
import { SortSelect } from "@/components/product/sort-select"
import { Pagination } from "@/components/product/pagination"
import { DEPARTMENTS } from "@/lib/constants/departments"

const PAGE_SIZE = 8
const SORTS = ["newest", "price-asc", "price-desc"] as const
type Sort = (typeof SORTS)[number]

const QUERY_BY_SORT = {
  newest: PRODUCTS_BY_DEPARTMENT_NEWEST_QUERY,
  "price-asc": PRODUCTS_BY_DEPARTMENT_PRICE_ASC_QUERY,
  "price-desc": PRODUCTS_BY_DEPARTMENT_PRICE_DESC_QUERY,
} as const

export default async function DepartmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ department: string }>
  searchParams: Promise<{ category?: string; sort?: string; page?: string }>
}) {
  const { department } = await params
  const { category = "", sort = "newest", page = "1" } = await searchParams

  if (!DEPARTMENTS.some((d) => d.slug === department)) notFound()

  const sortKey = (SORTS as readonly string[]).includes(sort) ? (sort as Sort) : "newest"
  const pageNumber = Math.max(1, Number(page) || 1)
  const start = (pageNumber - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE

  const [{ data: categories }, { data: products }, { data: total }] = await Promise.all([
    sanityFetch({ query: ALL_CATEGORIES_QUERY }),
    sanityFetch({
      query: QUERY_BY_SORT[sortKey],
      params: { department, categorySlug: category, start, end },
    }),
    sanityFetch({
      query: PRODUCTS_BY_DEPARTMENT_COUNT_QUERY,
      params: { department, categorySlug: category },
    }),
  ])

  const departmentCategories = categories.filter((c) => c.department === department)
  const departmentLabel = DEPARTMENTS.find((d) => d.slug === department)?.label ?? department

  const buildHref = (page: number) => {
    const p = new URLSearchParams()
    if (category) p.set("category", category)
    if (sortKey !== "newest") p.set("sort", sortKey)
    if (page > 1) p.set("page", String(page))
    const qs = p.toString()
    return qs ? `?${qs}` : "?"
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <h1 className="font-heading text-3xl italic md:text-4xl">{departmentLabel}</h1>

      <div className="mt-8 grid gap-8 md:grid-cols-[200px_1fr]">
        <aside className="hidden md:block">
          <CategoryFilter categories={departmentCategories} activeSlug={category} />
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{total} items</p>
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

          <Pagination total={total} pageSize={PAGE_SIZE} currentPage={pageNumber} buildHref={buildHref} />
        </div>
      </div>
    </div>
  )
}