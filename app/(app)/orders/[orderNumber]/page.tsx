import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { auth } from "@clerk/nextjs/server"
import { sanityFetch } from "@/sanity/lib/live"
import { ORDER_BY_NUMBER_QUERY } from "@/sanity/lib/queries"
import { urlFor } from "@/sanity/lib/image"
import { Badge } from "@/components/ui/badge"

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)

const STATUS_STEPS = ["paid", "shipped", "delivered"] as const

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>
}) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const { orderNumber } = await params
  const { data: order } = await sanityFetch({
    query: ORDER_BY_NUMBER_QUERY,
    params: { orderNumber, userId },
  })

  if (!order) notFound()

  const isCancelled = order.status === "cancelled"
  const currentStepIndex = STATUS_STEPS.indexOf(order.status as (typeof STATUS_STEPS)[number])

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <Link href="/orders" className="text-sm text-muted-foreground hover:underline">
        ← Back to orders
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="font-heading text-3xl italic md:text-4xl">{order.orderNumber}</h1>
        <Badge variant={isCancelled ? "destructive" : "secondary"} className="capitalize">
          {order.status}
        </Badge>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Placed{" "}
        {order.createdAt &&
          new Date(order.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
      </p>

      {!isCancelled && (
        <div className="mt-8 flex items-center">
          {STATUS_STEPS.map((step, index) => (
            <div key={step} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`size-2.5 rounded-full ${index <= currentStepIndex ? "bg-primary" : "bg-muted"}`} />
                <span className="text-xs capitalize text-muted-foreground">{step}</span>
              </div>
              {index < STATUS_STEPS.length - 1 && (
                <div className={`mx-2 h-px flex-1 ${index < currentStepIndex ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>
      )}

      <ul className="mt-10 flex flex-col divide-y divide-border">
        {order.items?.map((item) => (
          <li key={item._key} className="flex items-center gap-4 py-4">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
              {item.product?.images?.[0] && (
                <Image
                  src={urlFor(item.product.images[0]).width(120).height(120).url()}
                  alt={item.product.name ?? ""}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex-1">
              {item.product?.slug?.current ? (
                <Link href={`/product/${item.product.slug.current}`} className="text-sm font-medium hover:underline">
                  {item.product?.name}
                </Link>
              ) : (
                <p className="text-sm font-medium">{item.product?.name}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {[item.size, item.color].filter(Boolean).join(" / ")} × {item.quantity}
              </p>
            </div>
            <span className="text-sm font-medium">
              {item.priceAtPurchase != null ? formatPrice(item.priceAtPurchase * (item.quantity ?? 1)) : null}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-base font-medium">
        <span>Total</span>
        <span>{order.total != null ? formatPrice(order.total) : null}</span>
      </div>
    </div>
  )
}