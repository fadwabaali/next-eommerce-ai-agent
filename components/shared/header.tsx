// components/shared/header.tsx
import Link from "next/link"
import { Menu, Search, ShoppingBag } from "lucide-react"
import { Show, SignInButton, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Logo } from "@/components/shared/logo"
import { ThemeToggle } from "@/components/shared/theme-toggle"

const DEPARTMENTS = [
  { label: "Clothes", href: "/shop/clothes" },
  { label: "Shoes", href: "/shop/shoes" },
  { label: "Jewelry", href: "/shop/jewelry" },
  { label: "Accessories", href: "/shop/accessories" },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-1 px-4">
              {DEPARTMENTS.map((department) => (
                <Link
                  key={department.href}
                  href={department.href}
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  {department.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Logo />

        <NavigationMenu className="ml-2 hidden md:flex">
          <NavigationMenuList>
            {DEPARTMENTS.map((department) => (
              <NavigationMenuItem key={department.href}>
                <NavigationMenuLink asChild>
                  <Link href={department.href} className="px-3 py-2 text-sm font-medium">
                    {department.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="size-5" />
          </Button>

          <ThemeToggle />

          <Button variant="ghost" size="icon" className="relative" aria-label="Cart">
            <ShoppingBag className="size-5" />
            <Badge className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px]">
              0
            </Badge>
          </Button>

          <Show when="signed-in">
            <UserButton />
          </Show>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="outline" size="sm">
                Sign in
              </Button>
            </SignInButton>
          </Show>
        </div>
      </div>
    </header>
  )
}