import Image from "next/image"
import Link from "next/link"
import { DEPARTMENTS } from "@/lib/constants/departments"

export function DepartmentStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:py-20">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {DEPARTMENTS.map((department) => (
          <Link
            key={department.slug}
            href={department.href}
            className="group relative aspect-3/4 overflow-hidden rounded-lg"
          >
            <Image
              src={department.image}
              alt={department.label}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <span className="absolute bottom-4 left-4 font-heading text-lg italic text-white md:text-xl">
              {department.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}