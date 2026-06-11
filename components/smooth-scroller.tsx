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

    // Touch devices are most stable with native browser scrolling.
    if (isTouchDevice) {
      ScrollTrigger.refresh(true)
      return
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
