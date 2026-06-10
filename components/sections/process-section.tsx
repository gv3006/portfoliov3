import { Section, SectionHeading } from "./section"
import { ProcessMotionTimeline } from "./process-motion-timeline"

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
      <SectionHeading
        eyebrow="Simple Start"
        title="Process"
        description="Make it feel easy."
        revealVariant="standard"
      />
      <ProcessMotionTimeline steps={steps} />
    </Section>
  )
}
