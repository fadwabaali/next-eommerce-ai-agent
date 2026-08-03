"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CartItem = {
  productId: string
  slug: string
  name: string
  image?: string
  price: number
  variantSku: string
  size?: string
  color?: string
  stock: number
  quantity: number
}

type CartState = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeItem: (variantSku: string) => void
  updateQuantity: (variantSku: string, quantity: number) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) => {
        const existing = get().items.find((i) => i.variantSku === item.variantSku)
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.variantSku === item.variantSku
                ? { ...i, quantity: Math.min(i.quantity + quantity, i.stock) }
                : i
            ),
          })
        } else {
          set({ items: [...get().items, { ...item, quantity: Math.min(quantity, item.stock) }] })
        }
      },
      removeItem: (variantSku) =>
        set({ items: get().items.filter((i) => i.variantSku !== variantSku) }),
      updateQuantity: (variantSku, quantity) =>
        set({
          items:
            quantity <= 0
              ? get().items.filter((i) => i.variantSku !== variantSku)
              : get().items.map((i) =>
                  i.variantSku === variantSku ? { ...i, quantity: Math.min(quantity, i.stock) } : i
                ),
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "orne-cart" }
  )
)

export const useCartCount = () =>
  useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0))

export const useCartSubtotal = () =>
  useCartStore((state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0))