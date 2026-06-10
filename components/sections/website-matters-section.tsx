import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Section } from "./section"
import { GsapHoverCard } from "@/components/gsap-hover-card"
import { GsapHeadingReveal } from "@/components/gsap-heading-reveal"
import { GsapSlotNumber } from "@/components/gsap-slot-number"

function Cite({ children }: { children: string }) {
  return (
    <span
      aria-label={`Reference ${children}`}
      className="mx-1 inline-flex translate-y-[-0.12em] items-center rounded-full border border-cyan-700/20 bg-cyan-50 px-2 py-0.5 font-mono text-[0.6rem] leading-none text-cyan-800/70 transition-colors duration-200 hover:border-cyan-700/35 hover:bg-cyan-100 hover:text-cyan-900"
    >
      {children}
    </span>
  )
}

const reasons = [
  {
    number: "01",
    title: "Patient Acquisition",
    description: (
      <>
        Physicians’ online self-disclosure is associated with{" "}
        <strong className="font-semibold text-neutral-900">patient acquisition</strong>. In a cross-sectional study of
        1,798 physicians, both the breadth of information shared, including clinical performance, academic experience,
        and social reputation, and the depth of expertise coverage were positively associated with patient visits.
        <Cite>1</Cite> Other online profile features, including services offered, scientific publications, and
        professional avatars, also influence{" "}
        <strong className="font-semibold text-neutral-900">physician selection behavior</strong>.<Cite>2</Cite>
      </>
    ),
  },
  {
    number: "02",
    title: "First Impressions and Patient Decisions",
    description: (
      <>
        Prospective patients often form impressions of a physician before ever meeting in person, largely through{" "}
        <strong className="font-semibold text-neutral-900">information found online</strong>.<Cite>3-5</Cite> Many
        patients seek health information online, and online reviews are frequently used alongside recommendations from
        family or friends.<Cite>4-5</Cite> A well-maintained website helps communicate expertise, care philosophy,
        services offered, insurance participation, office hours, and{" "}
        <strong className="font-semibold text-neutral-900">contact information</strong>.<Cite>6</Cite>
      </>
    ),
  },
  {
    number: "03",
    title: "Reputation Management",
    description: (
      <>
        Online physician ratings are an important part of how patients evaluate and compare physicians, functioning as
        part of a physician’s <strong className="font-semibold text-neutral-900">digital CV</strong>.<Cite>7</Cite>{" "}
        Positive ratings are shaped by the patient experience, including physician friendliness, communication, and
        practice cleanliness.<Cite>8</Cite> A well-designed website can support this experience by making key information
        easier to find, including services, office hours, contact information, insurance participation, patient education
        resources, online scheduling, secure messaging, and bill payment.<Cite>6</Cite> By reducing friction before and
        after the visit, a website can strengthen the{" "}
        <strong className="font-semibold text-neutral-900">overall patient experience</strong> that contributes to
        online reputation.
      </>
    ),
  },
  {
    number: "04",
    title: "Practice Differentiation",
    description: (
      <>
        A physician website helps a private practice{" "}
        <strong className="font-semibold text-neutral-900">distinguish itself</strong> in a competitive market by
        communicating what sets the practice apart.<Cite>3</Cite> Beyond basic contact information, it can highlight
        subspecialty expertise, services offered, care philosophy, academic background, patient experience, and
        professional reputation.<Cite>1-3,6</Cite> By presenting a clear and credible digital identity, a website can help
        patients understand why one physician or practice may{" "}
        <strong className="font-semibold text-neutral-900">better fit their needs</strong> than another.
        <Cite>1-3</Cite>
      </>
    ),
  },
]

const references = [
  {
    number: "1",
    title:
      "Liu Q, Yin P, Fan J. The Relationship Between Physician Self-Disclosure and Patient Acquisition in Digital Health Markets: Cross-Sectional Study. Journal of Medical Internet Research. 2026.",
  },
  {
    number: "2",
    title:
      "Qin M, Zhu W, You C, Li S, Qiu S. Patientâ€™s Behavior of Selection Physician in Online Health Communities: Based on an Elaboration Likelihood Model. Frontiers in Public Health. 2022.",
  },
  {
    number: "3",
    title:
      "Kim L, Tylor DA, Chang CY. Marketing Your Practice: Setting Yourself Apart in a Competitive Market, Online Reputation Building, and Managing Patient Experience/Satisfaction. Otolaryngologic Clinics of North America. 2022.",
  },
  {
    number: "4",
    title:
      "Forgie EME, Lai H, Cao B, et al. Social Media and the Transformation of the Physician-Patient Relationship: Viewpoint. Journal of Medical Internet Research. 2021.",
  },
  {
    number: "5",
    title:
      "Kim JK, Tawk K, Kim JM, et al. Online ratings and narrative comments of American Head and Neck Society surgeons. Head & Neck. 2024.",
  },
  {
    number: "6",
    title:
      "Recupero P, Fisher CE. Resource Document on Telepsychiatry and Related Technologies in Clinical Psychiatry. American Psychiatric Association. 2014.",
  },
  {
    number: "7",
    title:
      "Committee on Patient Safety and Quality Improvement. Professional Use of Digital and Social Media: ACOG Committee Opinion, Number 791. Obstetrics and Gynecology. 2019.",
  },
  {
    number: "8",
    title:
      "Bidmon S, Elshiewy O, Terlutter R, Boztug Y. What Patients Value in Physicians: Analyzing Drivers of Patient Satisfaction Using Physician-Rating Website Data. Journal of Medical Internet Research. 2020.",
  },
]

export function WebsiteMattersSection() {
  return (
    <Section id="why-it-matters">
      <GsapHeadingReveal variant="masked">
        <header className="max-w-3xl">
          <p
            data-heading-reveal="eyebrow"
            className="font-mono text-xs uppercase tracking-[0.22em] text-neutral-500/80 md:tracking-[0.35em]"
          >
            Evidence-Based Digital Presence
          </p>

          <h2
            data-heading-reveal="title"
            className="mt-4 text-balance font-mono text-3xl uppercase tracking-tight md:text-6xl"
          >
            Why Your Website Matters
          </h2>

          <p
            data-heading-reveal="description"
            className="mt-6 text-pretty text-base leading-relaxed text-neutral-600 md:text-lg"
          >
            Websites influence private practice through four key mechanisms: patient acquisition, first impressions and
            patient decisions, reputation management, and practice differentiation in an increasingly competitive
            digital marketplace.
          </p>
        </header>
      </GsapHeadingReveal>

      <div className="mt-10 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2">
        {reasons.map((reason, index) => (
          <GsapHoverCard
            key={reason.number}
            className="group relative h-full overflow-hidden rounded-2xl border border-neutral-900/10 bg-white p-6 shadow-sm shadow-neutral-900/5 transition-colors duration-300 ease-out hover:border-neutral-900/20 hover:bg-[#fbfcfa] hover:shadow-lg hover:shadow-neutral-900/5 focus-within:border-neutral-900/20 focus-within:bg-[#fbfcfa] md:rounded-3xl md:p-10"
          >
            <div className="relative z-10">
              <GsapSlotNumber
                value={reason.number}
                delay={index * 0.08}
                ariaLabel={`Reason ${reason.number}`}
                className="font-mono text-xs tracking-[0.28em] text-neutral-500/70 md:tracking-[0.35em]"
              />

              <h3 className="mt-5 text-balance font-mono text-lg uppercase tracking-[0.12em] text-neutral-950 md:mt-6 md:text-xl md:tracking-[0.18em]">
                {reason.title}
              </h3>

              <p className="mt-4 text-pretty text-sm leading-relaxed text-neutral-600">
                {reason.description}
              </p>
            </div>
          </GsapHoverCard>
        ))}
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-neutral-900/10 bg-white/90 shadow-sm shadow-neutral-900/5 md:rounded-3xl">
        <Accordion type="single" collapsible>
          <AccordionItem value="references" className="border-b-0">
            <AccordionTrigger className="px-6 py-5 hover:bg-neutral-100/60 hover:no-underline focus-visible:ring-neutral-900/20 md:px-8 [&>svg]:text-neutral-500">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-neutral-500 md:tracking-[0.35em]">
                References
              </span>
            </AccordionTrigger>

            <AccordionContent className="pb-0">
              <div className="divide-y divide-neutral-900/10 border-t border-neutral-900/10">
                {references.map((reference) => (
                  <article
                    key={reference.number}
                    id={`ref-${reference.number}`}
                    className="px-6 py-5 md:px-8"
                  >
                    <div className="grid items-start gap-3 text-left md:grid-cols-[2rem_1fr]">
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-900/15 bg-neutral-100 font-mono text-[0.65rem] leading-none text-neutral-600 transition-colors duration-200 hover:border-neutral-900/25 hover:bg-neutral-200 hover:text-neutral-950">
                        {reference.number}
                      </span>

                      <p className="text-xs leading-relaxed text-neutral-600 md:text-sm">
                        {reference.title}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Section>
  )
}
