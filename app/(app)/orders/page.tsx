import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { auth } from "@clerk/nextjs/server"
import { sanityFetch } from "@/sanity/lib/live"
import { MY_ORDERS_QUERY } from "@/sanity/lib/queries"
import { urlFor } from "@/sanity/lib/image"
import { Badge } from "@/components/ui/badge"

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  paid: "secondary",
  shipped: "default",
  delivered: "default",
  cancelled: "destructive",
}

export default async function OrdersPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const { data: orders } = await sanityFetch({ query: MY_ORDERS_QUERY, params: { userId } })

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <h1 className="font-heading text-3xl italic md:text-4xl">Your orders</h1>

      {orders.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">You haven&apos;t placed any orders yet.</p>
          <Link href="/" className="mt-4 inline-block text-sm font-medium underline underline-offset-4">
            Continue shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-8 flex flex-col divide-y divide-border">
          {orders.map((order) => (
            <li key={order._id}>
              <Link
                href={`/orders/${order.orderNumber}`}
                className="flex items-center gap-4 py-4 hover:bg-accent/50"
              >
                <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                  {order.thumbnail && (
                    <Image
                      src={urlFor(order.thumbnail).width(120).height(120).url()}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{order.orderNumber}</p>
                    <Badge variant={STATUS_VARIANT[order.status ?? "paid"]} className="capitalize">
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {order.itemCount} item{order.itemCount === 1 ? "" : "s"} ·{" "}
                    {order.createdAt &&
                      new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                  </p>
                </div>
                <span className="text-sm font-medium">
                  {order.total != null ? formatPrice(order.total) : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}