import { Section, SectionHeading } from "./section"
import { GsapHoverCard } from "@/components/gsap-hover-card"
import { GsapSlotNumber } from "@/components/gsap-slot-number"

const services = [
  {
    number: "01",
    title: "Custom website redesigns",
    description: "Refresh outdated practice websites with a clearer structure, stronger visuals, and patient-focused messaging.",
  },
  {
    number: "02",
    title: "Landing pages for private practices",
    description: "Create focused pages for specialties, services, campaigns, or new patient inquiries.",
  },
  {
    number: "03",
    title: "Mobile optimization",
    description: "Improve small-screen readability, navigation, speed, and calls to action for patients on phones.",
  },
  {
    number: "04",
    title: "Appointment/contact form improvements",
    description: "Make it easier for visitors to request appointments, ask questions, or contact the office.",
  },
  {
    number: "05",
    title: "SEO basics",
    description: "Set up practical page titles, descriptions, headings, and local signals for search visibility.",
  },
  {
    number: "06",
    title: "Copywriting for physician services",
    description: "Write clear service copy that explains care options without sounding generic or overly clinical.",
  },
  {
    number: "07",
    title: "Google Business Profile support",
    description: "Align profile details, links, and messaging so local patients find accurate practice information.",
  },
  {
    number: "08",
    title: "Website maintenance",
    description: "Keep pages, content, forms, and basic site details current after launch.",
  },
]

export function ServicesSection() {
  return (
    <Section id="services">
      <SectionHeading
        eyebrow="What We Improve"
        title="Services"
        description="Focused website support for physicians and private practices that need a clearer, more trustworthy online presence."
        revealVariant="standard"
      />

      <div className="mt-10 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2">
        {services.map((service, index) => (
          <GsapHoverCard
            key={service.number}
            className="group relative h-full overflow-hidden rounded-2xl border border-neutral-900/10 bg-white p-6 shadow-sm shadow-neutral-900/5 transition-colors duration-300 ease-out hover:border-neutral-900/20 hover:bg-[#fbfcfa] hover:shadow-lg hover:shadow-neutral-900/10 focus-within:border-neutral-900/20 focus-within:bg-[#fbfcfa] md:rounded-3xl md:p-10"
          >
            <div className="relative z-10">
              <GsapSlotNumber
                value={service.number}
                delay={index * 0.08}
                ariaLabel={`Service ${service.number}`}
                className="font-mono text-xs tracking-[0.28em] text-neutral-500/70 md:tracking-[0.35em]"
              />

              <h3 className="mt-5 text-balance font-mono text-lg uppercase tracking-[0.12em] text-neutral-950 md:mt-6 md:text-xl md:tracking-[0.18em]">
                {service.title}
              </h3>

              <p className="mt-4 text-pretty text-sm leading-relaxed text-neutral-600">
                {service.description}
              </p>
            </div>
          </GsapHoverCard>
        ))}
      </div>
    </Section>
  )
}
