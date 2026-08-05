"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { urlFor } from "@/sanity/lib/image"
import type { SEARCH_PRODUCTS_QUERYResult } from "@/sanity.types"

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)

export function SearchCommand() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<SEARCH_PRODUCTS_QUERYResult>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  React.useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    const timeout = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => setResults(data.products ?? []))
        .finally(() => setLoading(false))
    }, 250)
    return () => clearTimeout(timeout)
  }, [query])

  const goTo = (href: string) => {
    setOpen(false)
    setQuery("")
    router.push(href)
  }

  return (
    <>
    <Button variant="ghost" size="icon" aria-label="Search" onClick={() => setOpen(true)}>
      <Search className="size-5" />
    </Button>
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command shouldFilter={false}>
      <CommandInput placeholder="Search products..." value={query} onValueChange={setQuery} />
        <CommandList>
            {!loading && query && results.length === 0 && <CommandEmpty>No products found.</CommandEmpty>}
            {results.length > 0 && (
            <CommandGroup heading="Products">
              {results.map((product) => (
              <CommandItem
                    key={product._id}
                    value={product._id}
                    onSelect={() => goTo(`/product/${product.slug?.current}`)}
                    className="gap-3"
                >
                <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                {product.images?.[0] && (
                  <Image
                    src={urlFor(product.images[0]).width(80).height(80).url()}
                    alt={product.name ?? ""}
                    fill
                    className="object-cover"
                  />
                )}
                </div>
                <div className="flex flex-1 flex-col">
                    <span className="text-sm">{product.name}</span>
                    <span className="text-xs text-muted-foreground">
                        {product.price != null ? formatPrice(product.price) : null}
                    </span>
                </div>
              </CommandItem>
            ))}
        </CommandGroup>
      )}
      {query && (
        <CommandGroup>
          <CommandItem onSelect={() => goTo(`/search?q=${encodeURIComponent(query)}`)}>
            View all results for &quot;{query}&quot;
          </CommandItem>
        </CommandGroup>
      )}
    </CommandList>
  </Command>
</CommandDialog>
    </>
  )
}