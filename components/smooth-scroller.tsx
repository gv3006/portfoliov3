"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollSmoother } from "gsap/ScrollSmoother"

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother)

export default function SmoothScroller() {
  useGSAP(() => {
    const wrapper = document.querySelector("#smooth-wrapper")
    const content = document.querySelector("#smooth-content")

    if (!wrapper || !content) return

    ScrollTrigger.config({
      ignoreMobileResize: true,
      limitCallbacks: true,
    })

    const isTouchDevice =
      ScrollTrigger.isTouch ||
      window.matchMedia("(pointer: coarse)").matches

    // Most stable mobile behavior: native scroll + ScrollTrigger normalization.
    if (isTouchDevice) {
      const normalizer = ScrollTrigger.normalizeScroll({
        allowNestedScroll: true,
        lockAxis: false,
        momentum: (self) => Math.min(3, self.velocityY / 1000),
        type: "touch,wheel,pointer",
      })

      ScrollTrigger.refresh(true)

      return () => {
        normalizer?.kill?.()
        ScrollTrigger.normalizeScroll(false)
      }
    }

    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.1,
      effects: false,
      normalizeScroll: true,
    })

    ScrollTrigger.refresh(true)

    return () => {
      smoother.kill()
    }
  }, [])

  return null
}