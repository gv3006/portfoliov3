import { SiteHeader } from "@/components/site-header"
import { HeroPin } from "@/components/landing/hero-pin"
import { HeroSection } from "@/components/landing/hero-section"
import { WorksGallery } from "@/components/works-gallery"
import { BackToTop } from "@/components/back-to-top"
import { WebsiteMattersSection } from "@/components/sections/website-matters-section"
import { ProcessSection } from "@/components/sections/process-section"
import { ServicesSection } from "@/components/sections/services-section"
import { AboutSection } from "@/components/sections/about-section"
import { FaqSection } from "@/components/sections/faq-section"
import { ContactSection } from "@/components/sections/contact-section"
import SmoothScroller from "@/components/smooth-scroller"
import { SiteFlowLine } from "@/components/site-flow-line"


export default function Page() {
  return (
    <>
      <SiteHeader />
      <SmoothScroller />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="grain-background min-h-screen bg-[radial-gradient(circle_at_15%_8%,rgba(255,226,199,0.55),transparent_34%),radial-gradient(circle_at_85%_72%,rgba(207,244,242,0.42),transparent_32%),linear-gradient(135deg,#fffaf3_0%,#f7f8f5_46%,#f2f7f2_100%)] text-neutral-950">
            <HeroPin>
              <HeroSection />
            </HeroPin>

            <main className="relative z-10 -mt-[clamp(7rem,40vh,24rem)] overflow-hidden rounded-t-[1.5rem] bg-[radial-gradient(circle_at_15%_8%,rgba(255,226,199,0.55),transparent_34%),radial-gradient(circle_at_85%_72%,rgba(207,244,242,0.42),transparent_32%),linear-gradient(135deg,#fffaf3_0%,#f7f8f5_46%,#f2f7f2_100%)] shadow-[0_-28px_80px_rgba(0,0,0,0.28)] md:rounded-t-[2rem]">
              <SiteFlowLine />

              <div className="relative z-10">
                {/* In-page sections */}
                <WebsiteMattersSection />

                {/* Works Gallery */}
                <section
                  id="gallery"
                  className="scroll-mt-20 border-t border-neutral-900/10 py-16 md:scroll-mt-28 md:py-24"
                >
                  <div className="mx-auto mb-10 max-w-6xl px-5 sm:px-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
                      Gallery
                    </p>
                    <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                      Browse selections of my work below.
                    </h2>
                  </div>
                  <WorksGallery />
                </section>

                <ServicesSection />
                <ProcessSection />
                <AboutSection />
                <FaqSection />
                <ContactSection />
              </div>
            </main>
          </div>
        </div>
      </div>

      <BackToTop />
    </>
  )
}
