"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { stripe } from "@/lib/stripe"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"

type CheckoutInput = {
  items: { productId: string; variantSku: string; quantity: number }[]
}

export async function createCheckoutSession(input: CheckoutInput) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")
  if (input.items.length === 0) throw new Error("Cart is empty")

  const productIds = [...new Set(input.items.map((i) => i.productId))]
  const products = await client.fetch(
    `*[_type == "product" && _id in $ids]{ _id, name, price, images, variants }`,
    { ids: productIds }
  )

  const lineItems = input.items.map((item) => {
    const product = products.find((p: any) => p._id === item.productId)
    const variant = product?.variants?.find((v: any) => v.sku === item.variantSku)
    if (!product || !variant) throw new Error(`Product or variant not found: ${item.variantSku}`)
    if (variant.stock < item.quantity) throw new Error(`${product.name} is out of stock`)

    return {
      price_data: {
        currency: "usd",
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: [product.name, variant.size, variant.color].filter(Boolean).join(" — "),
          images: product.images?.[0] ? [urlFor(product.images[0]).width(400).url()] : undefined,
          metadata: {
            productId: product._id,
            variantSku: variant.sku,
            size: variant.size ?? "",
            color: variant.color ?? "",
          },
        },
      },
      quantity: item.quantity,
    }
  })

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout`,
    client_reference_id: userId,
  })

  if (!session.url) throw new Error("Could not create checkout session")
  redirect(session.url)
}