"use client";

import { useEffect, useRef, useState } from "react";

const words = [
  "reflect the quality of your care.",
  "earn patients’ trust.",
  "turn visitors into patients.",
  "make your expertise visible.",
  "build confidence.",
];

const WORD_CYCLE_MS = 4800;

function BlurWord({ word, trigger }: { word: string; trigger: number }) {
  const letters = word.split("");
  const STAGGER = 45;
  const DURATION = 500;
  const GRADIENT_HOLD = STAGGER * letters.length + DURATION + 1200;

  const [letterStates, setLetterStates] = useState<{ opacity: number; blur: number }[]>(
    letters.map(() => ({ opacity: 0, blur: 20 }))
  );

  const [showGradient, setShowGradient] = useState(true);
  const framesRef = useRef<number[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    framesRef.current.forEach(cancelAnimationFrame);
    timersRef.current.forEach(clearTimeout);
    framesRef.current = [];
    timersRef.current = [];

    setLetterStates(letters.map(() => ({ opacity: 0, blur: 20 })));
    setShowGradient(true);

    letters.forEach((_, i) => {
      const timer = setTimeout(() => {
        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - start) / DURATION, 1);
          const eased = 1 - Math.pow(1 - progress, 3);

          setLetterStates((prev) => {
            const next = [...prev];
            next[i] = {
              opacity: eased,
              blur: 20 * (1 - eased),
            };
            return next;
          });

          if (progress < 1) {
            const id = requestAnimationFrame(tick);
            framesRef.current.push(id);
          }
        };

        const id = requestAnimationFrame(tick);
        framesRef.current.push(id);
      }, i * STAGGER);

      timersRef.current.push(timer);
    });

    const gradientTimer = setTimeout(() => {
      setShowGradient(false);
    }, GRADIENT_HOLD);

    timersRef.current.push(gradientTimer);

    return () => {
      framesRef.current.forEach(cancelAnimationFrame);
      timersRef.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  const gradientColors = ["#eca8d6", "#a78bfa", "#67e8f9", "#fbbf24", "#eca8d6"];

  return (
    <>
      {letters.map((char, i) => {
        const colorIndex = (i / Math.max(letters.length - 1, 1)) * (gradientColors.length - 1);
        const lower = Math.floor(colorIndex);
        const upper = Math.min(lower + 1, gradientColors.length - 1);
        const t = colorIndex - lower;

        const hexToRgb = (hex: string) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return [r, g, b];
        };

        const [r1, g1, b1] = hexToRgb(gradientColors[lower]);
        const [r2, g2, b2] = hexToRgb(gradientColors[upper]);

        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const b = Math.round(b1 + (b2 - b1) * t);

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: letterStates[i]?.opacity ?? 0,
              filter: `blur(${letterStates[i]?.blur ?? 20}px)`,
              color: showGradient ? `rgb(${r}, ${g}, ${b})` : "white",
              transition: "color 0.4s ease",
            }}
          >
            {char}
          </span>
        );
      })}
    </>
  );
}

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, WORD_CYCLE_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-start overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#05070b]">
        <div className="absolute inset-0 bg-[url('/hero.jpg')] bg-cover bg-center" />

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />
      </div>

      {/* Subtle grid lines */}
      <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none opacity-20">
        {[...Array(8)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px bg-white/10"
            style={{
              top: `${12.5 * (i + 1)}%`,
              left: 0,
              right: 0,
            }}
          />
        ))}

        {[...Array(12)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px bg-white/10"
            style={{
              left: `${8.33 * (i + 1)}%`,
              top: 0,
              bottom: 0,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 py-28 sm:px-6 md:py-32 lg:px-12 lg:py-40">
        <div className="lg:max-w-[55%]">
          {/* Eyebrow */}
          <div
            className={`mb-8 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="inline-flex max-w-full items-center gap-3 text-sm font-mono text-white/60">
              <span className="h-px w-6 shrink-0 bg-white/30 sm:w-8" />
              Modern Healthcare Website Design
            </span>
          </div>

          {/* Main headline */}
          <div className="mb-12">
            <h1
              className={`text-left text-[clamp(2.25rem,13vw,4.5rem)] font-display leading-[0.98] tracking-tight text-white transition-all duration-1000 sm:text-[clamp(2rem,6vw,7rem)] sm:leading-[0.92] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <span className="block sm:whitespace-nowrap">Your website should</span>

              <span className="block sm:whitespace-nowrap">
                <span className="relative inline-block">
                  <BlurWord word={words[wordIndex]} trigger={wordIndex} />
                </span>
              </span>

              <span className="block sm:whitespace-nowrap">Let&apos;s get started.</span>
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
