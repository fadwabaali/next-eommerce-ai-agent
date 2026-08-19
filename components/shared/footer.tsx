import Link from "next/link"
import { Logo } from "@/components/shared/logo"
import { DEPARTMENTS } from "@/lib/constants/departments"
import { NewsletterForm } from "@/components/shared/newsletter-form"

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4 md:py-16">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Modern fashion, edited — clothes, shoes, jewelry, and accessories.
          </p>
        </div>

        <div>
          <p className="text-sm font-medium">Shop</p>
          <ul className="mt-3 flex flex-col gap-2">
            {DEPARTMENTS.map((department) => (
              <li key={department.slug}>
                <Link href={department.href} className="text-sm text-muted-foreground hover:text-foreground">
                  {department.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium">Account</p>
          <ul className="mt-3 flex flex-col gap-2">
            <li>
              <Link href="/orders" className="text-sm text-muted-foreground hover:text-foreground">
                Order history
              </Link>
            </li>
            <li>
              <Link href="/search" className="text-sm text-muted-foreground hover:text-foreground">
                Search
              </Link>
            </li>
            <li>
              <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-foreground">
                Sign in
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium">Stay in touch</p>
          <p className="mt-3 text-sm text-muted-foreground">Sale alerts and new arrivals, occasionally.</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} orne. All rights reserved.</p>
          <p>Built as a student project.</p>
        </div>
      </div>
    </footer>
  )
}