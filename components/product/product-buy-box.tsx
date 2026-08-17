"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { urlFor } from "@/sanity/lib/image"
import { useCartStore } from "@/lib/store/cart-store"
import type { PRODUCT_BY_SLUG_QUERY_RESULT } from "@/sanity.types"

type Product = NonNullable<PRODUCT_BY_SLUG_QUERY_RESULT>

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)

export function ProductBuyBox({ product }: { product: Product }) {
  const variants = product.variants ?? []
  const sizes = useMemo(
    () => Array.from(new Set(variants.map((v) => v.size).filter(Boolean))) as string[],
    [variants]
  )
  const colors = useMemo(
    () => Array.from(new Set(variants.map((v) => v.color).filter(Boolean))) as string[],
    [variants]
  )

  const [size, setSize] = useState<string | undefined>(sizes[0])
  const [color, setColor] = useState<string | undefined>(colors[0])

  const selectedVariant = variants.find(
    (v) => (sizes.length === 0 || v.size === size) && (colors.length === 0 || v.color === color)
  )
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    if (!selectedVariant || !product.slug?.current) return
    addItem({
      productId: product._id,
      slug: product.slug.current,
      name: product.name ?? "",
      image: product.images?.[0]
        ? urlFor(product.images[0]).width(200).height(200).url()
        : undefined,
      price: product.price ?? 0,
      variantSku: selectedVariant.sku ?? "",
      size: selectedVariant.size,
      color: selectedVariant.color,
      stock: selectedVariant.stock ?? 0,
    })
    toast.success(`Added ${product.name} to your bag`)
  }

  const outOfStock = !selectedVariant || selectedVariant.stock <= 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        {product.category?.title && (
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {product.category.title}
          </p>
        )}
        <h1 className="font-heading text-3xl italic md:text-4xl">{product.name}</h1>
        <div className="mt-2 flex items-baseline gap-2">
          {product.compareAtPrice && (
            <span className="text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
          <span className="text-lg font-medium">
            {product.price != null ? formatPrice(product.price) : null}
          </span>
        </div>
      </div>

      {product.description && <p className="text-sm text-muted-foreground">{product.description}</p>}

      {colors.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium">Color</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={cn(
                  "rounded-full border border-border px-4 py-1.5 text-sm",
                  color === c && "border-primary bg-primary text-primary-foreground"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium">Size</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={cn(
                  "rounded-full border border-border px-4 py-1.5 text-sm",
                  size === s && "border-primary bg-primary text-primary-foreground"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <Button size="lg" disabled={outOfStock} onClick={handleAddToCart}>
        {outOfStock ? "Out of stock" : "Add to bag"}
      </Button>

      {product.material && (
        <p className="text-xs text-muted-foreground">Material: {product.material}</p>
      )}
    </div>
  )
}