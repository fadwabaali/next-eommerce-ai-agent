import { NextResponse } from "next/server"
import { client } from "@/sanity/lib/client"
import { SEARCH_PRODUCTS_QUERY } from "@/sanity/lib/queries"

export async function GET(req: Request) {
  const term = new URL(req.url).searchParams.get("q")?.trim()
  if (!term) return NextResponse.json({ products: [] })

  const products = await client.fetch(SEARCH_PRODUCTS_QUERY, { term })
  return NextResponse.json({ products: products.slice(0, 6) })
}