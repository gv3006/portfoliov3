import type React from "react"

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <header className="max-w-3xl">
      {eyebrow ? (
        <p className="font-mono text-xs tracking-[0.22em] uppercase text-cyan-700/70 md:tracking-[0.35em]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-4 text-balance font-mono text-3xl uppercase tracking-tight md:text-6xl">{title}</h2>
      {description ? (
        <p className="mt-6 text-base md:text-lg leading-relaxed text-neutral-600 text-pretty">{description}</p>
      ) : null}
    </header>
  )
}

interface SectionProps {
  id: string
  children: React.ReactNode
}

export function Section({ id, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-neutral-900/10 py-16 md:scroll-mt-28 md:py-24">
      <div className="container mx-auto px-5 sm:px-6">{children}</div>
    </section>
  )
}
