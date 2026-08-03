import { notFound } from "next/navigation"
import { sanityFetch } from "@/sanity/lib/live"
import { PRODUCT_BY_SLUG_QUERY, RELATED_PRODUCTS_QUERY } from "@/sanity/lib/queries"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductBuyBox } from "@/components/product/product-buy-box"
import { ProductCard } from "@/components/product/product-card"

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: product } = await sanityFetch({ query: PRODUCT_BY_SLUG_QUERY, params: { slug } })
  if (!product) notFound()

  const { data: related } = await sanityFetch({
    query: RELATED_PRODUCTS_QUERY,
    params: { department: product.category?.department ?? "", excludeId: product._id },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="grid gap-8 md:grid-cols-2 md:gap-16">
        <ProductGallery images={product.images ?? []} name={product.name ?? ""} />
        <ProductBuyBox product={product} />
      </div>

      {related.length > 0 && (
        <section className="mt-16 md:mt-24">
          <h2 className="mb-6 font-heading text-2xl italic md:text-3xl">You may also like</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {related.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}