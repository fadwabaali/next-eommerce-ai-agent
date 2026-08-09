"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig

export function RevenueTrendChart({ data }: { data: { date: string; revenue: number }[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <AreaChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area dataKey="revenue" type="monotone" fill="var(--color-revenue)" stroke="var(--color-revenue)" fillOpacity={0.2} />
      </AreaChart>
    </ChartContainer>
  )
}