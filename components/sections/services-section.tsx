import { Section, SectionHeading } from "./section"
import { Reveal } from "@/components/reveal"

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
      <Reveal>
        <SectionHeading
          eyebrow="What We Improve"
          title="Services"
          description="Focused website support for physicians and private practices that need a clearer, more trustworthy online presence."
        />
      </Reveal>
      <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2">
        {services.map((service, index) => (
          <Reveal key={service.number} className="h-full" delay={index * 80} rootMargin="0px 0px 15% 0px" threshold={0}>
            <article className="group relative h-full overflow-hidden rounded-3xl border border-neutral-900/10 bg-white p-10 shadow-sm shadow-neutral-900/5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-cyan-700/20 hover:bg-[#fbfcfa] hover:shadow-lg hover:shadow-cyan-950/5 focus-within:border-cyan-700/20 focus-within:bg-[#fbfcfa]">
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(8,145,178,0.10),transparent_34%)]" />
              </div>

              <div className="relative z-10">
                <span className="font-mono text-xs tracking-[0.35em] text-cyan-800/45">{service.number}</span>
                <h3 className="mt-6 text-balance font-mono text-xl uppercase tracking-[0.18em] text-neutral-950">
                  {service.title}
                </h3>
                <p className="mt-4 text-pretty text-sm leading-relaxed text-neutral-600">{service.description}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
