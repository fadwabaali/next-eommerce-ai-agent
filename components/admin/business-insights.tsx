import { MessageResponse } from "@/components/ai-elements/message"
import { generateBusinessInsights } from "@/lib/ai/insights"

export async function BusinessInsights(props: {
  stats: { revenue: number; orderCount: number; averageOrderValue: number }
  topProducts: { name: string; quantity: number; revenue: number }[]
  lowStock: number
}) {
  const insights = await generateBusinessInsights(props)
  return <MessageResponse>{insights}</MessageResponse>
}