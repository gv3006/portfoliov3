"use client"

import { useEffect, useState } from "react"
import { Menu } from "lucide-react"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const links = [
  { id: "why-it-matters", label: "WHY IT MATTERS" },
  { id: "gallery", label: "GALLERY" },
  { id: "services", label: "SERVICES" },
  { id: "process", label: "PROCESS" },
  { id: "about", label: "ABOUT" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "GET IN TOUCH" },
]

function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

export function SiteHeader() {
  const [active, setActive] = useState<string>("")

  useEffect(() => {
    const sections = links.map((link) => document.getElementById(link.id)).filter(Boolean) as HTMLElement[]

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry most in view near the top of the viewport.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) {
          setActive(visible[0].target.id)
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-900/10 bg-white/75 px-4 py-2 shadow-sm shadow-neutral-900/5 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 font-mono tracking-wider md:hidden">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="min-w-0 truncate text-sm font-semibold text-neutral-950 transition-colors"
        >
          STUDIO PIXELÂ®
        </button>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="flex h-9 w-9 items-center justify-center text-neutral-950 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="8" height="8" fill="currentColor" />
              <rect x="12" width="8" height="8" fill="currentColor" />
              <rect y="12" width="8" height="8" fill="currentColor" />
              <rect x="12" y="12" width="8" height="8" fill="currentColor" />
            </svg>
          </button>

          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open navigation menu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-900/10 bg-white/70 text-neutral-950 shadow-sm shadow-neutral-900/5 transition-colors hover:border-cyan-700/25 hover:text-cyan-900"
              >
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent className="w-[min(20rem,calc(100vw-2rem))] border-neutral-900/10 bg-[#fffaf3] p-0">
              <SheetHeader className="border-b border-neutral-900/10 p-6 text-left">
                <SheetTitle className="font-mono text-sm uppercase tracking-[0.22em] text-neutral-950">
                  Navigation
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col p-3">
                {links.map((link) => (
                  <SheetClose asChild key={link.id}>
                    <button
                      onClick={() => scrollToId(link.id)}
                      aria-current={active === link.id ? "location" : undefined}
                      className="rounded-xl px-3 py-4 text-left font-mono text-sm uppercase tracking-[0.16em] text-neutral-950 transition-colors hover:bg-cyan-50 hover:text-cyan-900"
                    >
                      {link.label}
                    </button>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <nav className="mx-auto hidden max-w-7xl items-center justify-center gap-6 overflow-x-auto text-sm font-mono tracking-wider md:flex">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-neutral-950 transition-colors font-semibold"
        >
          STUDIO PIXEL®
        </button>
        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => scrollToId(link.id)}
            aria-current={active === link.id ? "location" : undefined}
            className="text-neutral-950 transition-colors"
          >
            {link.label}
          </button>
        ))}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="w-8 h-8 flex items-center justify-center text-neutral-950 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="8" height="8" fill="currentColor" />
            <rect x="12" width="8" height="8" fill="currentColor" />
            <rect y="12" width="8" height="8" fill="currentColor" />
            <rect x="12" y="12" width="8" height="8" fill="currentColor" />
          </svg>
        </button>
      </nav>
    </header>
  )
}
