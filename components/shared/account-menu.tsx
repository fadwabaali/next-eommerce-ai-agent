"use client"

import { LayoutDashboard, Package } from "lucide-react"
import { Show, SignInButton, UserButton, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export function AccountMenu() {
  const { user } = useUser()
  const isAdmin = user?.publicMetadata?.role === "admin"

  return (
    <>
      <Show when="signed-in">
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Link label="Order History" labelIcon={<Package className="size-4" />} href="/orders" />
            {isAdmin && (
              <UserButton.Link label="Admin Dashboard" labelIcon={<LayoutDashboard className="size-4" />} href="/admin" />
            )}
          </UserButton.MenuItems>
        </UserButton>
      </Show>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <Button variant="outline" size="sm">
            Sign in
          </Button>
        </SignInButton>
      </Show>
    </>
  )
}