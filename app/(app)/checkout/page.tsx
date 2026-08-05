"use client"

import Image from "next/image"
import { useTransition } from "react"
import { useCartStore, useCartSubtotal } from "@/lib/store/cart-store"
import { Button } from "@/components/ui/button"
import { createCheckoutSession } from "./actions"

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items)
  const subtotal = useCartSubtotal()
  const [isPending, startTransition] = useTransition()

  const handleCheckout = () => {
    startTransition(async () => {
      await createCheckoutSession({
        items: items.map((item) => ({
          productId: item.productId,
          variantSku: item.variantSku,
          quantity: item.quantity,
        })),
      })
    })
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Your bag is empty.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
      <h1 className="font-heading text-3xl italic md:text-4xl">Checkout</h1>
      <ul className="mt-8 flex flex-col gap-4">
        {items.map((item) => (
          <li key={item.variantSku} className="flex items-center gap-4">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
              {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {[item.size, item.color].filter(Boolean).join(" / ")} × {item.quantity}
              </p>
            </div>
            <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-base font-medium">
        <span>Total</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <Button size="lg" className="mt-6 w-full" onClick={handleCheckout} disabled={isPending}>
        {isPending ? "Redirecting to Stripe..." : "Pay with Stripe"}
      </Button>
    </div>
  )
}