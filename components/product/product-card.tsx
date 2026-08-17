import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/sanity/lib/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { PRODUCT_BY_SLUG_QUERY_RESULT } from "@/sanity.types"

type Product = PRODUCT_BY_SLUG_QUERY_RESULT[number]

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)

export function ProductCard({ product }: { product: Product }) {
  const image = product.images?.[0]

  return (
    <Link href={`/product/${product.slug?.current}`}>
      <Card className="overflow-hidden border-none py-0 shadow-none">
        <CardContent className="p-0">
          <div className="relative aspect-4/5 overflow-hidden rounded-md bg-muted">
            {image && (
              <Image
                src={urlFor(image).width(600).height(750).url()}
                alt={product.name ?? ""}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            )}
            {product.compareAtPrice && (
              <Badge className="absolute left-2 top-2" variant="destructive">
                Sale
              </Badge>
            )}
          </div>
          <div className="flex items-baseline justify-between px-1 pt-3">
            <div>
              <p className="text-sm font-medium">{product.name}</p>
              {product.category?.title && (
                <p className="text-xs text-muted-foreground">{product.category.title}</p>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              {product.compareAtPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
              <span className="text-sm font-medium">
                {product.price != null ? formatPrice(product.price) : null}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}