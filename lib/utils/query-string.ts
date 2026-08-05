export function buildQueryString(
  current: URLSearchParams | Record<string, string | undefined>,
  updates: Record<string, string | null>
) {
  const currentString =
    current instanceof URLSearchParams
      ? current.toString()
      : new URLSearchParams(
          Object.entries(current).filter(([, v]) => v !== undefined) as [string, string][]
        ).toString()

  const params = new URLSearchParams(currentString)
  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === "") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
  }
  if (!("page" in updates)) params.delete("page") // any filter/sort change resets to page 1

  const qs = params.toString()
  return qs ? `?${qs}` : "?"
}