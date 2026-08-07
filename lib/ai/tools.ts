import { tool } from "ai"
import { z } from "zod"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { SEARCH_PRODUCTS_QUERY, RECOMMEND_PRODUCTS_QUERY, ORDER_BY_NUMBER_QUERY } from "@/sanity/lib/queries"

type ToolProduct = { id: string; name: string; slug: string | null; price: number; image: string | null }

function toToolProduct(p: any): ToolProduct {
  return {
    id: p._id,
    name: p.name,
    slug: p.slug?.current ?? null,
    price: p.price,
    image: p.images?.[0] ? urlFor(p.images[0]).width(300).height(300).url() : null,
  }
}

// userId comes from the authenticated request, never from the model or the client —
// see app/api/chat/route.ts, which is the only caller of this function.
export function getShoppingTools(userId: string | null) {
  return {
    searchProducts: tool({
      description:
        "Search the product catalog by name, description, or keyword. Use when the customer is looking for something specific.",
      inputSchema: z.object({
        query: z.string().describe("Search term, e.g. 'denim jacket' or 'gold necklace'"),
      }),
      execute: async ({ query }) => {
        const products = await client.fetch(SEARCH_PRODUCTS_QUERY, { term: query })
        return products.slice(0, 6).map(toToolProduct)
      },
    }),

    recommendProducts: tool({
      description:
        "Suggest products, optionally scoped to a department. Use when the customer wants ideas or suggestions rather than a specific search.",
      inputSchema: z.object({
      department: z.enum(["clothes", "shoes", "jewelry", "accessories"]).optional(),
      }),
      execute: async ({ department }) => {
        const products = await client.fetch(RECOMMEND_PRODUCTS_QUERY, { department: department ?? "" })
        return products.map(toToolProduct)
      },
    }),

    trackOrder: tool({
      description:
        "Look up the status of the signed-in customer's own order by order number. Only ever returns orders belonging to the current account.",
      inputSchema: z.object({
        orderNumber: z.string().describe("e.g. ORD-AB12CD34"),
      }),
      execute: async ({ orderNumber }) => {
        if (!userId) {
          return { error: "You'll need to sign in before I can look up an order." }
        }
        const order = await client.fetch(ORDER_BY_NUMBER_QUERY, { orderNumber, userId })
        if (!order) {
          return { error: "I couldn't find that order number on your account." }
        }
        return {
          orderNumber: order.orderNumber,
          status: order.status,
          total: order.total,
          itemCount: order.items?.length ?? 0,
        }
      },
    }),
  }
}