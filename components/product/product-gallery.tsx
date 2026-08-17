"use client"

import { useState } from "react"
import Image from "next/image"
import { urlFor } from "@/sanity/lib/image"
import { cn } from "@/lib/utils"
import type { PRODUCT_BY_SLUG_QUERY_RESULT } from "@/sanity.types"

type Product = NonNullable<PRODUCT_BY_SLUG_QUERY_RESULT>

export function ProductGallery({
  images,
  name,
}: {
  images: NonNullable<Product["images"]>
  name: string
}) {
  const [active, setActive] = useState(0)

  if (!images.length) return <div className="aspect-4/5 rounded-lg bg-muted" />

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-4/5 overflow-hidden rounded-lg bg-muted">
        <Image
          src={urlFor(images[active]).width(900).height(1125).url()}
          alt={name}
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((image, index) => (
            <button
              key={image._key ?? index}
              onClick={() => setActive(index)}
              className={cn(
                "relative size-16 overflow-hidden rounded-md bg-muted ring-1 ring-border",
                index === active && "ring-2 ring-primary"
              )}
            >
              <Image
                src={urlFor(image).width(120).height(120).url()}
                alt={`${name} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}