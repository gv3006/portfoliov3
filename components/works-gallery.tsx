"use client"

import { useState } from "react"
import { VideoCard } from "./video-card"

const projects = [
  {
    id: 1,
    title: "DERMATOLOGY",
    category: "DESIGN",
    year: "2026",
    thumbnail: "/image1.jpg",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    id: 2,
    title: "PRIMARY CARE",
    category: "DESIGN",
    year: "2026",
    thumbnail: "/image2.jpg",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    id: 3,
    title: "SENIOR LIVING",
    category: "DESIGN",
    year: "2026",
    thumbnail: "/image3.jpg",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  },
  {
    id: 4,
    title: "MENTAL HEALTH",
    category: "DESIGN",
    year: "2026",
    thumbnail: "/image4.jpg",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
  {
    id: 5,
    title: "DENTISTRY",
    category: "DESIGN",
    year: "2026",
    thumbnail: "/image5.jpg",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  },
]

export function WorksGallery() {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)
  const hasHoveredProject = hoveredKey !== null

  return (
    <div className="flex w-full flex-col gap-4 overflow-hidden">
      {["right-to-left", "left-to-right"].map((direction) => (
        <div key={direction} className="works-gallery-marquee overflow-hidden">
          <div
            className={`works-gallery-track flex w-max items-stretch ${
              direction === "left-to-right" ? "works-gallery-track-reverse" : ""
            }`}
          >
            {[0, 1].map((loopIndex) => (
              <div key={loopIndex} className="works-gallery-set flex shrink-0 items-stretch gap-4 pr-4">
                {projects.map((project) => {
                  const projectKey = `${direction}-${loopIndex}-${project.id}`

                  return (
                    <VideoCard
                      key={projectKey}
                      project={project}
                      isHovered={hoveredKey === projectKey}
                      isDimmed={hasHoveredProject && hoveredKey !== projectKey}
                      onHoverChange={(hovered) => setHoveredKey(hovered ? projectKey : null)}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
