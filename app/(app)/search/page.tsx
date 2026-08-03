import { sanityFetch } from "@/sanity/lib/live"
import { SEARCH_PRODUCTS_QUERY } from "@/sanity/lib/queries"
import { ProductCard } from "@/components/product/product-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = "" } = await searchParams
  const { data: products } = q
    ? await sanityFetch({ query: SEARCH_PRODUCTS_QUERY, params: { term: q } })
    : { data: [] }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <h1 className="font-heading text-3xl italic md:text-4xl">{q ? `Results for "${q}"` : "Search"}</h1>

      <form action="/search" className="mt-4 flex gap-2">
        <Input type="search" name="q" defaultValue={q} placeholder="Search products..." className="max-w-sm" />
        <Button type="submit">Search</Button>
      </form>

      {q && <p className="mt-4 text-sm text-muted-foreground">{products.length} items</p>}

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {q && products.length === 0 && (
        <p className="py-16 text-center text-sm text-muted-foreground">No results.</p>
      )}
    </div>
  )
}