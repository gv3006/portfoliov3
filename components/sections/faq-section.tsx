import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Reveal } from "@/components/reveal"
import { Section, SectionHeading } from "./section"

const faqs = [
  {
    question: "What types of doctors or practices do you work with?",
    answer:
      "I work with individual physicians, dentists, chiropractors, therapists, specialty clinics, and truly any healthcare professionals who need a clearer and high quality online presence.",
  },
  {
    question: "Can you redesign an existing website?",
    answer:
      "Yes. Existing sites can be refreshed with better structure, cleaner visuals, clearer copy, mobile improvements, and stronger calls to action.",
  },
  {
    question: "Do I need to know exactly what I want before starting?",
    answer:
      "No. We can begin with your practice details, goals, services, photos, and preferred tone, then move into a draft direction.",
  },
  {
    question: "Can you help with the wording on my website?",
    answer:
      "Yes. I can write or refine copy so patients understand who you are, what you offer, and how to contact the practice.",
  },
  {
    question: "Will the website be mobile-friendly?",
    answer:
      "Yes. The design should be easy to read and navigate on phones, since many patients first visit from a mobile device.",
  },
  {
    question: "Can you help patients contact the practice more easily?",
    answer:
      "Yes. The site can include clearer contact areas, appointment request paths, and form improvements where appropriate.",
  },
  {
    question: "Do you handle hosting or launch?",
    answer:
      "I offer the optional add-on service of completely handling website launch, hosting, and maintenance. Alternatively, I can include a practical launch handoff and basic guidance so the final site can move from draft to live.",
  },
  {
    question: "How do we get started?",
    answer:
      "Send a short message with your practice type, current website if you have one, and what you want improved.",
  },
]

export function FaqSection() {
  return (
    <Section id="faq">
      <Reveal>
        <SectionHeading
          eyebrow="Questions"
          title="FAQ"
          description="Common questions about building a clearer, more professional website for your practice."
        />
      </Reveal>

      <Reveal delay={120} rootMargin="0px 0px 15% 0px" threshold={0}>
        <div className="mt-10 overflow-hidden rounded-2xl border border-neutral-900/10 bg-white/90 shadow-sm shadow-neutral-900/5 md:mt-16 md:rounded-3xl">
          <Accordion type="single" collapsible className="divide-y divide-neutral-900/10">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index + 1}`} className="border-b-0">
                <AccordionTrigger className="px-5 py-5 text-left hover:bg-cyan-50/60 hover:no-underline focus-visible:ring-cyan-700/30 md:px-8 md:py-6 [&>svg]:text-neutral-500">
                  <span className="min-w-0 font-mono text-sm uppercase tracking-[0.1em] text-neutral-950 md:text-base md:tracking-[0.18em]">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 md:px-8 md:pb-6">
                  <p className="max-w-3xl text-pretty text-sm leading-relaxed text-neutral-600 md:text-base">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Reveal>
    </Section>
  )
}
