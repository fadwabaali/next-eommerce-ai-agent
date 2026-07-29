import { Hero } from "@/components/shared/hero"
import { DepartmentStrip } from "@/components/shared/department-strip"
import { FeaturedProducts } from "@/components/shared/featured-products"

export default function Page() {
  return (
    <>
      <Hero />
      <DepartmentStrip />
      <FeaturedProducts />
    </>
  )
}