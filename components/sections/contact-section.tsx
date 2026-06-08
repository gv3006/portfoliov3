"use client"

import type React from "react"

import { useState } from "react"
import { Reveal } from "@/components/reveal"
import { Section, SectionHeading } from "./section"

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <Section id="contact">
      <Reveal>
        <SectionHeading
          eyebrow="Say Hello"
          title="Get In Touch"
          description="Tell us about your project. This is a placeholder form - submissions are not yet wired to a backend."
        />
      </Reveal>
      <div className="mt-10 grid grid-cols-1 gap-10 md:mt-16 lg:grid-cols-2 lg:gap-12">
        <Reveal delay={80}>
          <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block font-mono text-xs tracking-widest uppercase text-neutral-500">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Your name"
                className="w-full bg-white/70 border border-neutral-900/15 rounded-xl px-4 py-3 text-sm text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:border-cyan-700/50 focus:bg-white transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block font-mono text-xs tracking-widest uppercase text-neutral-500">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full bg-white/70 border border-neutral-900/15 rounded-xl px-4 py-3 text-sm text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:border-cyan-700/50 focus:bg-white transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="block font-mono text-xs tracking-widest uppercase text-neutral-500">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder="Tell us about your project..."
                className="w-full bg-white/70 border border-neutral-900/15 rounded-xl px-4 py-3 text-sm text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:border-cyan-700/50 focus:bg-white transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-neutral-950 px-8 py-3 font-mono text-xs uppercase tracking-widest text-white transition-colors hover:bg-cyan-950 sm:w-auto"
            >
              Send Message
            </button>
            {submitted ? (
              <p className="font-mono text-xs tracking-widest uppercase text-neutral-600" role="status">
                Thanks - this is a placeholder, no message was sent.
              </p>
            ) : null}
          </form>
        </Reveal>

        <Reveal delay={160}>
          <div className="space-y-8 font-mono text-sm">
            <div>
              <p className="text-xs tracking-widest uppercase text-neutral-500">Email</p>
              <p className="mt-2 text-neutral-700">hello@studiopixel.example</p>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-neutral-500">Studio</p>
              <p className="mt-2 text-neutral-700 leading-relaxed">
                123 Placeholder Ave
                <br />
                Suite 000
                <br />
                New York, NY 10000
              </p>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase text-neutral-500">Social</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-neutral-700">
                <span className="hover:text-cyan-800 transition-colors cursor-pointer">Instagram</span>
                <span className="hover:text-cyan-800 transition-colors cursor-pointer">Behance</span>
                <span className="hover:text-cyan-800 transition-colors cursor-pointer">LinkedIn</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
