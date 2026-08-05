import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { writeClient } from "@/sanity/lib/write-client"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error("Webhook signature verification failed", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    // Idempotency — Stripe retries on any non-2xx response, so re-deliveries must be a no-op
    const existing = await writeClient.fetch(
      `*[_type == "order" && stripeSessionId == $sessionId][0]{_id}`,
      { sessionId: session.id }
    )
    if (existing) return NextResponse.json({ received: true })

    const clerkUserId = session.client_reference_id
    if (!clerkUserId) {
      console.error("Missing client_reference_id on session", session.id)
      return NextResponse.json({ error: "Missing user reference" }, { status: 400 })
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
    })

    const orderItems = lineItems.data.map((line) => {
      const product = line.price?.product as Stripe.Product
      return {
        _key: line.id,
        product: { _type: "reference", _ref: product.metadata.productId },
        variantSku: product.metadata.variantSku,
        size: product.metadata.size || undefined,
        color: product.metadata.color || undefined,
        quantity: line.quantity ?? 1,
        priceAtPurchase: (line.price?.unit_amount ?? 0) / 100,
      }
    })

    const customerId = `customer-${clerkUserId}`
    await writeClient.createIfNotExists({
      _id: customerId,
      _type: "customer",
      clerkUserId,
      email: session.customer_details?.email ?? "",
      stripeCustomerId: typeof session.customer === "string" ? session.customer : "",
      createdAt: new Date().toISOString(),
    })

    await writeClient.create({
      _type: "order",
      orderNumber: `ORD-${session.id.slice(-8).toUpperCase()}`,
      stripeSessionId: session.id,
      stripePaymentId: typeof session.payment_intent === "string" ? session.payment_intent : "",
      clerkUserId,
      customer: { _type: "reference", _ref: customerId },
      email: session.customer_details?.email ?? "",
      status: "paid",
      total: (session.amount_total ?? 0) / 100,
      items: orderItems,
      createdAt: new Date().toISOString(),
    })

    for (const item of orderItems) {
      if (!item.variantSku) continue
      const productId = item.product._ref
      const productDoc = await writeClient.fetch(
        `*[_type == "product" && _id == $id][0]{ "variant": variants[sku == $sku][0] }`,
        { id: productId, sku: item.variantSku }
      )
      if (!productDoc?.variant?._key) continue

      await writeClient
        .patch(productId)
        .dec({ [`variants[_key=="${productDoc.variant._key}"].stock`]: item.quantity })
        .commit()
    }
  }

  return NextResponse.json({ received: true })
}