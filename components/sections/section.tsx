import type React from "react"
import { GsapHeadingReveal, type HeadingRevealVariant } from "@/components/gsap-heading-reveal"
import { ScrollMorphDot, type MorphKind } from "@/components/scroll-morph-dot"

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  revealVariant?: HeadingRevealVariant
  morphKind?: MorphKind
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  revealVariant = "standard",
  morphKind,
}: SectionHeadingProps) {
  return (
    <header className="flex max-w-6xl items-start justify-between gap-3">
      <GsapHeadingReveal variant={revealVariant} className="min-w-0 flex-1">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p
              data-heading-reveal="eyebrow"
              className="font-mono text-xs tracking-[0.22em] uppercase text-cyan-700/70 md:tracking-[0.35em]"
            >
              {eyebrow}
            </p>
          ) : null}

          <h2
            data-heading-reveal="title"
            className="mt-4 text-balance font-mono text-3xl uppercase tracking-tight md:text-6xl"
          >
            {title}
          </h2>

          {description ? (
            <p
              data-heading-reveal="description"
              className="mt-6 text-base leading-relaxed text-neutral-600 text-pretty md:text-lg"
            >
              {description}
            </p>
          ) : null}
        </div>
      </GsapHeadingReveal>

      {morphKind ? <ScrollMorphDot kind={morphKind} className="-mt-1 text-current md:-mt-2" /> : null}
    </header>
  )
}

interface SectionProps {
  id: string
  children: React.ReactNode
}

export function Section({ id, children }: SectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-20 border-t border-neutral-900/10 py-16 md:scroll-mt-28 md:py-24"
    >
      <div className="container mx-auto px-5 sm:px-6">{children}</div>
    </section>
  )
}
