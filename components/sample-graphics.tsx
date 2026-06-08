import { cn } from "@/lib/utils"

interface BrowserMockupProps {
  className?: string
  specialty: string
  title: string
  accent?: "cyan" | "emerald" | "rose"
}

const accents = {
  cyan: {
    soft: "bg-cyan-50",
    line: "bg-cyan-700/25",
    fill: "bg-cyan-700",
    text: "text-cyan-900",
    border: "border-cyan-700/20",
  },
  emerald: {
    soft: "bg-emerald-50",
    line: "bg-emerald-700/25",
    fill: "bg-emerald-700",
    text: "text-emerald-900",
    border: "border-emerald-700/20",
  },
  rose: {
    soft: "bg-rose-50",
    line: "bg-rose-700/25",
    fill: "bg-rose-700",
    text: "text-rose-900",
    border: "border-rose-700/20",
  },
}

export function BrowserMockup({ className, specialty, title, accent = "cyan" }: BrowserMockupProps) {
  const color = accents[accent]

  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border border-neutral-900/10 bg-white shadow-xl shadow-neutral-900/10",
        className,
      )}
      aria-label={`${specialty} website mockup`}
    >
      <div className="flex items-center gap-2 border-b border-neutral-900/10 bg-neutral-50 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        <div className="ml-3 h-5 flex-1 rounded-full bg-white" />
      </div>

      <div className="grid gap-5 p-5">
        <div className={cn("overflow-hidden rounded-2xl border p-5", color.soft, color.border)}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className={cn("font-mono text-[0.62rem] uppercase tracking-[0.28em]", color.text)}>{specialty}</p>
              <h3 className="mt-3 max-w-[13rem] text-balance font-mono text-xl uppercase leading-tight tracking-[0.08em] text-neutral-950">
                {title}
              </h3>
            </div>
            <div className={cn("hidden h-20 w-20 shrink-0 rounded-full md:block", color.line)} />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className={cn("h-8 w-28 rounded-full", color.fill)} />
            <span className="h-8 w-24 rounded-full border border-neutral-900/10 bg-white" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="rounded-2xl border border-neutral-900/10 bg-neutral-50 p-3">
              <span className={cn("block h-2 w-10 rounded-full", item === 0 ? color.line : "bg-neutral-300")} />
              <span className="mt-4 block h-2 w-full rounded-full bg-neutral-300/80" />
              <span className="mt-2 block h-2 w-4/5 rounded-full bg-neutral-300/60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function MobileMockup({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[15rem] rounded-[2rem] border border-neutral-900/10 bg-neutral-950 p-2 shadow-2xl shadow-cyan-950/15",
        className,
      )}
      aria-label="Mobile appointment request mockup"
    >
      <div className="overflow-hidden rounded-[1.55rem] bg-white">
        <div className="mx-auto mt-2 h-1.5 w-16 rounded-full bg-neutral-900/15" />
        <div className="p-4">
          <div className="rounded-2xl bg-cyan-50 p-4">
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-cyan-900/70">New Patients</p>
            <h3 className="mt-3 font-mono text-base uppercase leading-tight tracking-[0.08em] text-neutral-950">
              Request an appointment
            </h3>
            <div className="mt-5 space-y-2">
              <span className="block h-8 rounded-xl bg-white" />
              <span className="block h-8 rounded-xl bg-white" />
              <span className="block h-16 rounded-xl bg-white" />
            </div>
            <span className="mt-4 block h-9 rounded-full bg-cyan-800" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <span className="h-16 rounded-2xl bg-neutral-100" />
            <span className="h-16 rounded-2xl bg-neutral-100" />
          </div>
        </div>
      </div>
    </div>
  )
}

interface ProcessPreviewProps {
  label: string
  title: string
  className?: string
}

export function ProcessPreview({ label, title, className }: ProcessPreviewProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-cyan-700/15 bg-white p-3 shadow-sm shadow-neutral-900/5",
        className,
      )}
      aria-label={`${label} process graphic`}
    >
      <div className="flex justify-end">
        <span className="h-2 w-8 rounded-full bg-cyan-700/25" />
      </div>
      <div className="mt-4 rounded-xl bg-cyan-50 p-3">
        <p className="font-mono text-[0.65rem] uppercase leading-snug tracking-[0.12em] text-neutral-950">{title}</p>
        <span className="mt-3 block h-2 w-full rounded-full bg-cyan-800/25" />
        <span className="mt-2 block h-2 w-2/3 rounded-full bg-cyan-800/15" />
      </div>
    </div>
  )
}
