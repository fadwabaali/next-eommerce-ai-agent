import Link from "next/link"
import { Menu} from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { ThemeToggle} from "@/components/shared/theme-toggle"
import { SearchCommand } from "@/components/shared/search-command"
import { AccountMenu } from "@/components/shared/account-menu"
import { DEPARTMENTS } from "@/lib/constants/departments"
import { CartSheet } from "../cart/cart-sheet"


export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" />}>
            <Menu className="size-5" />
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
                <NavigationMenuLink render={<Link href={department.href} className="px-3 py-2 text-sm font-medium" />}>
                  {department.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex items-center gap-1">
          <SearchCommand />

          <ThemeToggle />

          <CartSheet />

          <AccountMenu />
        </div>
      </div>
    </header>
  )
}