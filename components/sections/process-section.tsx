import { Section, SectionHeading } from "./section"
import { Reveal } from "@/components/reveal"
import { ScrollSlideIn } from "@/components/scroll-slide-in"
import { ProcessPreview } from "@/components/sample-graphics"

const steps = [
  {
    number: "01",
    title: "Build your vision",
    description: "Pick from several physician-focused website directions or request a completely custom design.",
    label: "Direction",
    preview: "Choose a style",
  },
  {
    number: "02",
    title: "Send your practice details",
    description: "Services, photos, contact info, preferred tone. The more you share, the more we can tailor your site to your specific practice.",
    label: "Content",
    preview: "Organize content",
  },
  {
    number: "03",
    title: "Review your draft site",
    description: "See a polished preview and request changes.",
    label: "Preview",
    preview: "Inspect the draft",
  },
   {
    number: "04",
    title: "Refine",
    description: "Reiterate rounds of edits on the design and content until your site is exactly how you want it.",
    label: "Edit",
    preview: "Adjust details",
  },
  {
    number: "05",
    title: "Launch",
    description: "Go live with a professional site built for patient trust.",
    label: "Live",
    preview: "Go live",
  },
]

export function ProcessSection() {
  return (
    <Section id="process">
      <Reveal>
        <SectionHeading eyebrow="Simple Start" title="Process" description="Make it feel easy." />
      </Reveal>
      <div className="mt-16 overflow-x-clip divide-y divide-neutral-900/10 border-t border-neutral-900/10">
        {steps.map((step, index) => (
          <ScrollSlideIn key={step.number} stagger={index * 0.04}>
            <article className="grid grid-cols-1 md:grid-cols-12 gap-4 py-8 group transition-colors hover:bg-cyan-50/50 -mx-6 px-6">
              <div className="md:col-span-1 font-mono text-xs tracking-widest text-cyan-800/55">{step.number}</div>
              <div className="md:col-span-6">
                <h3 className="font-mono text-lg tracking-[0.2em] uppercase">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 text-pretty">{step.description}</p>
              </div>
              <div className="md:col-span-5 md:flex md:justify-end">
                <ProcessPreview label={step.label} title={step.preview} className="w-full md:max-w-sm" />
              </div>
            </article>
          </ScrollSlideIn>
        ))}
      </div>
    </Section>
  )
}
