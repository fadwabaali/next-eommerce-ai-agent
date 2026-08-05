"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store/cart-store"

export default function CheckoutSuccessPage() {
  const clear = useCartStore((state) => state.clear)

  useEffect(() => {
    clear()
  }, [clear])

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-heading text-3xl italic md:text-4xl">Thank you</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Your order is confirmed. A receipt is on its way to your email.
      </p>
      <Button render={<Link href="/orders" />} size="lg" className="mt-8" nativeButton={false}>
        View your orders
      </Button>      
    </div>
  )
}

// "use client"

// import { useEffect } from "react"
// import Link from "next/link"
// import { Slot } from "@radix-ui/react-slot"
// import { Button } from "@/components/ui/button"
// import { useCartStore } from "@/lib/store/cart-store"

// export default function CheckoutSuccessPage() {
//   const clear = useCartStore((state) => state.clear)

//   useEffect(() => {
//     clear()
//   }, [clear])

//   return (
//     <div className="mx-auto max-w-lg px-4 py-24 text-center">
//       <h1 className="font-heading text-3xl italic md:text-4xl">Thank you</h1>
//       <p className="mt-3 text-sm text-muted-foreground">
//         Your order is confirmed. A receipt is on its way to your email.
//       </p>
//       <Link href="/orders">
//         <Button size="lg" className="mt-8">
//           View your orders
//         </Button>
//       </Link>
//     </div>
//   )
// }