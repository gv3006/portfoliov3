import type React from "react"

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <header className="max-w-3xl">
      {eyebrow ? <p className="font-mono text-xs tracking-[0.35em] uppercase text-cyan-700/70">{eyebrow}</p> : null}
      <h2 className="mt-4 font-mono text-4xl md:text-6xl tracking-tight uppercase text-balance">{title}</h2>
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
    <section id={id} className="scroll-mt-28 py-24 border-t border-neutral-900/10">
      <div className="container mx-auto px-6">{children}</div>
    </section>
  )
}
