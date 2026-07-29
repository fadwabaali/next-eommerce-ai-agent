"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { DEPARTMENTS } from "@/lib/constants/departments"

const AUTOPLAY_DELAY = 6000

export function Hero() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const autoplay = React.useRef(
    Autoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false })
  )

  React.useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
    api.on("select", () => setCurrent(api.selectedScrollSnap()))
  }, [api])

  return (
    <section className="relative">
      <Carousel setApi={setApi} opts={{ loop: true }} plugins={[autoplay.current]}>
        <CarouselContent>
          {DEPARTMENTS.map((department, index) => (
            <CarouselItem key={department.slug}>
              <div className="relative h-[70svh] min-h-[420px] w-full overflow-hidden">
                <Image
                  src={department.image}
                  alt={`${department.label} — ${department.headline}`}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-8 md:p-16">
                  <span className="font-mono text-xs uppercase tracking-widest text-white/80">
                    {department.label}
                  </span>
                  <h1 className="font-heading text-4xl italic text-white md:text-6xl">
                    {department.headline}
                  </h1>
                  <p className="max-w-md text-sm text-white/80 md:text-base">
                    {department.subcopy}
                  </p>
                  <Button asChild size="lg" className="mt-2 w-fit">
                    <Link href={department.href}>Shop {department.label}</Link>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="absolute inset-x-0 bottom-0 flex gap-2 px-8 pb-3 md:px-16">
        {DEPARTMENTS.map((department, index) => (
          <button
            key={department.slug}
            aria-label={`Go to ${department.label} slide`}
            onClick={() => api?.scrollTo(index)}
            className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30"
          >
            <span
              className="block h-full bg-white"
              style={{
                transform: `scaleX(${index === current ? 1 : 0})`,
                transformOrigin: "left",
                transition: `transform ${index === current ? AUTOPLAY_DELAY : 300}ms linear`,
              }}
            />
          </button>
        ))}
      </div>
    </section>
  )
}