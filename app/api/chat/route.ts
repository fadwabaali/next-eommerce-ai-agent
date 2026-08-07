import { google } from "@ai-sdk/google"
import { auth } from "@clerk/nextjs/server"
import { convertToModelMessages, streamText, type UIMessage } from "ai"
import { getShoppingTools } from "@/lib/ai/tools"

export const maxDuration = 30

const SYSTEM_PROMPT = `You are the shopping assistant for orne, a fashion store selling clothes, shoes, jewelry, and accessories.
- Use searchProducts when the customer is looking for something specific.
- Use recommendProducts when they want suggestions or ideas rather than a specific item.
- Use trackOrder only when they ask about an existing order — it only ever returns their own orders.
- Keep responses short and direct. Never invent product details, prices, or order information — state only what the tools return.
- If someone asks about an order while signed out, tell them to sign in first rather than guessing.`

export async function POST(request: Request) {
  const { userId } = await auth()
  const body = (await request.json()) as { messages?: UIMessage[] }

  if (!Array.isArray(body.messages)) {
    return Response.json({ error: "The request must include a messages array." }, { status: 400 })
  }

  const result = streamText({
    model: google("gemini-3.6-flash"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(body.messages),
    tools: getShoppingTools(userId),
    abortSignal: request.signal,
    onError({ error }) {
      console.error("chat generation failed", error)
    },
  })

  return result.toUIMessageStreamResponse()
}