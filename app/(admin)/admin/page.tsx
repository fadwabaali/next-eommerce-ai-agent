import { Suspense } from "react"
import { sanityFetch } from "@/sanity/lib/live"
import { ADMIN_ORDERS_QUERY, ADMIN_LOW_STOCK_QUERY } from "@/sanity/lib/queries"
import { computeRevenueStats, computeRevenueTrend, computeTopProducts } from "@/lib/admin/stats"
import { RevenueTrendChart } from "@/components/admin/revenue-trend-chart"
import { BusinessInsights } from "@/components/admin/business-insights"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const TREND_DAYS = 30

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)

export default async function AdminDashboardPage() {
  const since = new Date(Date.now() - TREND_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const [{ data: orders }, { data: lowStock }] = await Promise.all([
    sanityFetch({ query: ADMIN_ORDERS_QUERY, params: { since } }),
    sanityFetch({ query: ADMIN_LOW_STOCK_QUERY, params: { threshold: 5 } }),
  ])

  const { revenue, orderCount, averageOrderValue } = computeRevenueStats(orders)
  const trend = computeRevenueTrend(orders, TREND_DAYS)
  const topProducts = computeTopProducts(orders)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <h1 className="font-heading text-3xl italic md:text-4xl">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Last {TREND_DAYS} days</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-medium">{formatPrice(revenue)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-medium">{orderCount}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. order value</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-medium">{formatPrice(averageOrderValue)}</CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Revenue trend</CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueTrendChart data={trend} />
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Sold</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((product) => (
                  <TableRow key={product.name}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell className="text-right">{product.quantity}</TableCell>
                    <TableCell className="text-right">{formatPrice(product.revenue)}</TableCell>
                  </TableRow>
                ))}
                {topProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No sales yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low stock</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Variant</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStock.flatMap((product) =>
                  (product.lowVariants ?? []).map((variant) => (
                    <TableRow key={`${product._id}-${variant.sku}`}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {[variant.size, variant.color].filter(Boolean).join(" / ")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={variant.stock === 0 ? "destructive" : "secondary"}>{variant.stock}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                {lowStock.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Everything&apos;s well stocked.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>AI insights</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p className="text-sm text-muted-foreground">Generating insights...</p>}>
            <BusinessInsights
              stats={{ revenue, orderCount, averageOrderValue }}
              topProducts={topProducts}
              lowStock={lowStock.length}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}