import { generateText } from "ai"
import { google } from "@ai-sdk/google"

type InsightsInput = {
  stats: { revenue: number; orderCount: number; averageOrderValue: number }
  topProducts: { name: string; quantity: number; revenue: number }[]
  lowStock: number
}

export async function generateBusinessInsights({ stats, topProducts, lowStock }: InsightsInput) {
  if (stats.orderCount === 0) {
    return "No orders in the last 30 days yet — insights will appear once sales data comes in."
  }

  const { text } = await generateText({
    model: google("gemini-3.6-flash"),
    system:
      "You are a concise retail business analyst. Given store metrics, write 2-4 short bullet points of genuinely useful observations or suggestions. No fluff, no restating the numbers verbatim, no generic advice — only insights that follow specifically from the data given. Use markdown bullets.",
    prompt: `Last 30 days:
- Revenue: $${stats.revenue.toFixed(2)}
- Orders: ${stats.orderCount}
- Average order value: $${stats.averageOrderValue.toFixed(2)}
- Top products by units sold: ${topProducts.map((p) => `${p.name} (${p.quantity} sold, $${p.revenue.toFixed(2)})`).join("; ") || "none"}
- Products currently low on stock: ${lowStock}`,
  })

  return text
}