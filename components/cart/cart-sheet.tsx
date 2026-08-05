"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { useCartStore, useCartCount, useCartSubtotal } from "@/lib/store/cart-store"

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)

export function CartSheet() {
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const count = useCartCount()
  const subtotal = useCartSubtotal()

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="relative" aria-label="Cart" />}>
        <ShoppingBag className="size-5" />
        {count > 0 && (
          <Badge className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px]">
            {count}
          </Badge>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your bag {count > 0 && `(${count})`}</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            <ShoppingBag className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Your bag is empty.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              <ul className="flex flex-col gap-4">
                {items.map((item) => (
                  <li key={item.variantSku} className="flex gap-3">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted">
                      {item.image && (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {[item.size, item.color].filter(Boolean).join(" / ")}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.variantSku)}
                          aria-label="Remove item"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-6"
                            onClick={() => updateQuantity(item.variantSku, item.quantity - 1)}
                          >
                            <Minus className="size-3" />
                          </Button>
                          <span className="w-4 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-6"
                            disabled={item.quantity >= item.stock}
                            onClick={() => updateQuantity(item.variantSku, item.quantity + 1)}
                          >
                            <Plus className="size-3" />
                          </Button>
                        </div>
                        <span className="text-sm font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <SheetFooter className="flex-col gap-3 border-t border-border pt-4">
              <div className="flex items-center justify-between text-sm font-medium">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <Button render={<Link href="/checkout" />} size="lg" className="w-full" nativeButton={false}>
                Checkout
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}