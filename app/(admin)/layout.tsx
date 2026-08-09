import { redirect } from "next/navigation"
import Link from "next/link"
import { currentUser } from "@clerk/nextjs/server"
import { Logo } from "@/components/shared/logo"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser()

  if (!user) redirect("/sign-in")
  if (user.publicMetadata?.role !== "admin") redirect("/")

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          <Logo />
          <span className="text-sm text-muted-foreground">Admin</span>
          <Link href="/" className="ml-auto text-sm text-muted-foreground hover:text-foreground">
            ← Back to store
          </Link>
        </div>
      </header>
      {children}
    </div>
  )
}