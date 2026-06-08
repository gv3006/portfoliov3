import { Reveal } from "@/components/reveal"
import { Section, SectionHeading } from "./section"
import Image from "next/image"

const paragraphs = [
  "I'm a medical student with a strong interest in the intersection of medicine, technology, design, and patient communication. I build modern websites for physicians and healthcare practices that want their online presence to reflect the quality of care they provide.",
  "I started this because I noticed that many excellent physicians have websites that do not match the level of professionalism, trust, and expertise they bring to their patients every day.",
  "A physician's website is often one of the first places a patient goes before making a decision. It can shape whether they feel confident reaching out, whether they understand the practice, and whether they see the physician as credible and approachable.",
  "Because I am training in medicine, I understand that healthcare websites need to feel different from ordinary business websites. They need to be clear, trustworthy, professional, easy to navigate, and respectful of the patient experience.",
  "Unlike a generic web designer, I approach each project with this perspective in mind. I understand the importance of credibility, patient trust, clean communication, and professional presentation in healthcare.",
  "I focus on creating websites that do more than look good. They should help patients quickly understand who you are, what you offer, and why they can feel confident contacting your practice.",
]

export function AboutSection() {
  return (
    <Section id="about">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <div className="space-y-10">
            <SectionHeading
              eyebrow="About Me"
              title="A medical student building better websites for doctors."
            />
            <div className="mx-auto w-full max-w-64 overflow-hidden rounded-3xl border border-neutral-900/10 bg-white p-2 shadow-lg shadow-neutral-900/10">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100">
                <Image
                  src="/placeholder-user.jpg"
                  alt="Headshot placeholder"
                  fill
                  className="object-cover"
                  sizes="16rem"
                />
              </div>
            </div>
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <div className="space-y-6 border-l border-neutral-900/10 pl-6 md:pl-10">
            {paragraphs.map((paragraph, index) => (
              <Reveal key={paragraph} delay={index * 70} rootMargin="0px 0px 15% 0px" threshold={0}>
                <p className="text-pretty text-base leading-relaxed text-neutral-600 md:text-lg">{paragraph}</p>
              </Reveal>
            ))}

            <Reveal delay={paragraphs.length * 70} rootMargin="0px 0px 15% 0px" threshold={0}>
              <p className="pt-4 font-mono text-sm uppercase leading-relaxed tracking-[0.24em] text-neutral-950">
                -George Verdelis
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  )
}
