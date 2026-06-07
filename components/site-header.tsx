"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const links = [
  { id: "why-it-matters", label: "WHY IT MATTERS" },
  { id: "process", label: "PROCESS" },
  { id: "services", label: "SERVICES" },
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
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-8 px-6 py-6">
      <nav className="flex items-center gap-8 text-sm font-mono tracking-wider">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-neutral-950 hover:text-cyan-800 transition-colors font-semibold"
        >
          STUDIO PIXEL®
        </button>
        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => scrollToId(link.id)}
            className={cn(
              "transition-colors",
              active === link.id ? "text-neutral-950" : "text-neutral-500 hover:text-cyan-800",
            )}
          >
            {link.label}
          </button>
        ))}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="w-8 h-8 flex items-center justify-center text-neutral-950 hover:text-cyan-800 transition-colors"
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
