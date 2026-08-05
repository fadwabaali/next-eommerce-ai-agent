// components/product/facet-filter.tsx
"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { buildQueryString } from "@/lib/utils/query-string"

export function FacetFilter({
  title,
  paramKey,
  options,
  selected,
}: {
  title: string
  paramKey: string
  options: string[]
  selected: string[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (options.length === 0) return null

  const toggle = (value: string) => {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value]
    const href = buildQueryString(searchParams, { [paramKey]: next.length ? next.join(",") : null })
    router.push(`${pathname}${href}`)
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium">{title}</p>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 text-sm">
            <Checkbox checked={selected.includes(option)} onCheckedChange={() => toggle(option)} />
            {option}
          </label>
        ))}
      </div>
    </div>
  )
}