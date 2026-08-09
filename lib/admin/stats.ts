type AdminOrder = {
  _id: string
  total: number | null
  status: string | null
  createdAt: string | null
  items: Array<{
    quantity: number | null
    priceAtPurchase: number | null
    product: { _id: string; name: string | null; slug: { current: string } | null } | null
  }> | null
}

export function computeRevenueStats(orders: AdminOrder[]) {
  const revenue = orders.reduce((sum, o) => sum + (o.total ?? 0), 0)
  const orderCount = orders.length
  const averageOrderValue = orderCount > 0 ? revenue / orderCount : 0
  return { revenue, orderCount, averageOrderValue }
}

export function computeRevenueTrend(orders: AdminOrder[], days: number) {
  const buckets = new Map<string, number>()
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    buckets.set(date.toISOString().slice(0, 10), 0)
  }
  for (const order of orders) {
    if (!order.createdAt) continue
    const key = order.createdAt.slice(0, 10)
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + (order.total ?? 0))
  }
  return Array.from(buckets.entries()).map(([date, revenue]) => ({ date, revenue }))
}

export function computeTopProducts(orders: AdminOrder[], limit = 5) {
  const totals = new Map<string, { name: string; quantity: number; revenue: number }>()
  for (const order of orders) {
    for (const item of order.items ?? []) {
      if (!item.product) continue
      const key = item.product._id
      const existing = totals.get(key) ?? { name: item.product.name ?? "Unknown", quantity: 0, revenue: 0 }
      existing.quantity += item.quantity ?? 0
      existing.revenue += (item.priceAtPurchase ?? 0) * (item.quantity ?? 0)
      totals.set(key, existing)
    }
  }
  return Array.from(totals.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit)
}