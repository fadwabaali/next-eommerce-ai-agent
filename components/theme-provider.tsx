// "use client"

// import { ThemeProvider as NextThemesProvider } from "next-themes"
// import type { ComponentProps } from "react"

// export function ThemeProvider({
//   children,
//   ...props
// }: ComponentProps<typeof NextThemesProvider>) {
//   return <NextThemesProvider {...props}>{children}</NextThemesProvider>
// }

// components/theme-provider.tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ComponentProps } from "react"

// React 19 + Next.js 16.2 warn about any <script> tag rendered inside a
// component. next-themes intentionally injects one (a no-flash script that
// only ever runs during the initial SSR HTML parse) and the library hasn't
// been updated for this — confirmed false positive:
// https://github.com/pacocoursey/next-themes/issues/385
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalError = console.error
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) {
      return
    }
    originalError(...args)
  }
}

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}