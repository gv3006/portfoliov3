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
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches

    if (!wrapper || !content) return

    ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.5,
      effects: false,
      smoothTouch: 0.1,
      normalizeScroll: !isTouchDevice,
    })
  })

  return null
}
