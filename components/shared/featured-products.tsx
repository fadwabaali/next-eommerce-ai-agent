import { sanityFetch } from "@/sanity/lib/live"
import { FEATURED_PRODUCTS_QUERY } from "@/sanity/lib/queries"
import { ProductCard } from "@/components/product/product-card"

export async function FeaturedProducts() {
  const { data: products } = await sanityFetch({ query: FEATURED_PRODUCTS_QUERY })

  if (!products.length) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:py-20">
      <div className="mb-6">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          New In
        </span>
        <h2 className="font-heading text-2xl italic md:text-3xl">Featured</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  )
}