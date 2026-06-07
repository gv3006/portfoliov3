"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface Project {
  id: number
  title: string
  category: string
  year: string
  thumbnail: string
  video: string
}

interface VideoCardProps {
  project: Project
  isHovered: boolean
  isDimmed: boolean
  onHoverChange: (hovered: boolean) => void
}

export function VideoCard({ project, isHovered, isDimmed, onHoverChange }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  useEffect(() => {
    if (isHovered && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    } else if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [isHovered])

  return (
    <div
      className={cn(
        "group relative rounded-[2.5rem] overflow-hidden bg-neutral-100",
        "transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
        "h-[600px] min-w-[180px]",
        isHovered ? "flex-[2] shadow-2xl shadow-cyan-950/15" : "flex-[0.8]",
      )}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      {/* Thumbnail Image */}
      <div className="absolute inset-0">
        <img
          src={project.thumbnail || "/placeholder.svg"}
          alt={project.title}
          className={cn(
            "w-full h-full object-cover object-top origin-top transition-all duration-700",
            !isHovered && "grayscale brightness-75",
          )}
        />
        <div
          className={cn(
            "absolute inset-0 bg-black transition-opacity duration-700",
            isDimmed ? "opacity-45" : "opacity-0",
          )}
        />
      </div>

      {/* Video */}
      <div className={cn("absolute inset-0 transition-opacity duration-700", isHovered ? "opacity-100" : "opacity-0")}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover object-top origin-top"
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoLoaded(true)}
        >
          <source src={project.video} type="video/mp4" />
        </video>
      </div>

      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 p-8",
          isHovered ? "" : "pointer-events-none",
        )}
      >
        {/* Glassmorphic card */}
        <div
          className={cn(
            "relative backdrop-blur-xl bg-black/20 rounded-2xl p-6 border border-white/10",
            "shadow-2xl",
            "transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
            isHovered ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
          )}
        >
          <div className="space-y-1 text-left">
            <h3 className="text-white font-mono text-sm tracking-[0.3em] uppercase font-medium leading-relaxed">
              {project.title}
            </h3>
            <p className="text-white/80 font-mono text-xs tracking-[0.25em] uppercase leading-relaxed">
              {project.category}
            </p>
            <div className="pt-3 mt-3 border-t border-white/10">
              <p className="text-white/60 font-mono text-xs tracking-widest">{project.year}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
