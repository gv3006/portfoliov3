import { cn } from "@/lib/utils"

export function MobileMockup({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[13.5rem] rounded-[1.6rem] border border-neutral-900/10 bg-neutral-950 p-2 shadow-2xl shadow-cyan-950/15 md:max-w-[15rem] md:rounded-[2rem]",
        className,
      )}
      aria-label="Mobile appointment request mockup"
    >
      <div className="overflow-hidden rounded-[1.55rem] bg-white">
        <div className="mx-auto mt-2 h-1.5 w-16 rounded-full bg-neutral-900/15" />
        <div className="p-4">
          <div className="rounded-2xl bg-cyan-50 p-4">
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-cyan-900/70 md:tracking-[0.24em]">New Patients</p>
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
        <p className="font-mono text-[0.65rem] uppercase leading-snug tracking-[0.08em] text-neutral-950 md:tracking-[0.12em]">{title}</p>
        <span className="mt-3 block h-2 w-full rounded-full bg-cyan-800/25" />
        <span className="mt-2 block h-2 w-2/3 rounded-full bg-cyan-800/15" />
      </div>
    </div>
  )
}
