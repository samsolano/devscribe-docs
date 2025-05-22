"use client"

import { useState, useEffect } from "react"
import ScrollExpandMedia from "@/components/blocks/scroll-expansion-hero"
import { Badge } from "@/components/ui/badge"

interface MediaAbout {
  overview: string
  conclusion: string
}

interface MediaContent {
  src: string
  poster?: string
  background: string
  title: string
  date: string
  scrollToExpand: string
  about: MediaAbout
}

interface MediaContentCollection {
  [key: string]: MediaContent
}

const sampleMediaContent: MediaContentCollection = {
  video: {
    src: "https://me7aitdbxq.ufs.sh/f/2wsMIGDMQRdYuZ5R8ahEEZ4aQK56LizRdfBSqeDMsmUIrJN1",
    poster: "https://images.pexels.com/videos/5752729/space-earth-universe-cosmos-5752729.jpeg",
    background: "https://me7aitdbxq.ufs.sh/f/2wsMIGDMQRdYMNjMlBUYHaeYpxduXPVNwf8mnFA61L7rkcoS",
    title: "Immersive Video Experience",
    date: "Cosmic Journey",
    scrollToExpand: "Scroll to Expand Demo",
    about: {
      overview:
        "This is a demonstration of the ScrollExpandMedia component with a video. As you scroll, the video expands to fill more of the screen, creating an immersive experience. This component is perfect for showcasing video content in a modern, interactive way.",
      conclusion:
        "The ScrollExpandMedia component provides a unique way to engage users with your content through interactive scrolling. Try switching between video and image modes to see different implementations.",
    },
  },
  image: {
    src: "https://images.unsplash.com/photo-1682687982501-1e58ab814714?q=80&w=1280&auto=format&fit=crop",
    background: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1920&auto=format&fit=crop",
    title: "Dynamic Image Showcase",
    date: "Underwater Adventure",
    scrollToExpand: "Scroll to Expand Demo",
    about: {
      overview:
        "This is a demonstration of the ScrollExpandMedia component with an image. The same smooth expansion effect works beautifully with static images, allowing you to create engaging visual experiences without video content.",
      conclusion:
        "The ScrollExpandMedia component works equally well with images and videos. This flexibility allows you to choose the media type that best suits your content while maintaining the same engaging user experience.",
    },
  },
}

const MediaContent = ({ mediaType }: { mediaType: "video" | "image" }) => {
  const currentMedia = sampleMediaContent[mediaType]

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-white">About This Component</h2>
      <p className="text-lg mb-8 text-white">{currentMedia.about.overview}</p>

      <p className="text-lg mb-8 text-white">{currentMedia.about.conclusion}</p>
    </div>
  )
}

export function HeroDemo() {
  const [mediaType, setMediaType] = useState<"video" | "image">("video")
  const currentMedia = sampleMediaContent[mediaType]

  useEffect(() => {
    window.scrollTo(0, 0)

    const resetEvent = new Event("resetSection")
    window.dispatchEvent(resetEvent)
  }, [mediaType])

  return (
    <section className="py-16 bg-[#111111] text-gray-300">
      <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8 mb-8">
        <div className="text-center">
          <Badge className="bg-white text-[#111111] hover:bg-white/90 mb-4">Hero demo</Badge>
          <h2 className="text-3xl font-semibold mb-4 text-white">Interactive Media Experience</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience our interactive scroll-based media expansion. Switch between video and image modes to see
            different implementations.
          </p>
        </div>
      </div>

      <div className="min-h-screen relative">
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button
            onClick={() => setMediaType("video")}
            className={`px-4 py-2 rounded-lg ${
              mediaType === "video" ? "bg-white text-black" : "bg-black/50 text-white border border-white/30"
            }`}
          >
            Video
          </button>

          <button
            onClick={() => setMediaType("image")}
            className={`px-4 py-2 rounded-lg ${
              mediaType === "image" ? "bg-white text-black" : "bg-black/50 text-white border border-white/30"
            }`}
          >
            Image
          </button>
        </div>

        <ScrollExpandMedia
          mediaType={mediaType}
          mediaSrc={currentMedia.src}
          posterSrc={mediaType === "video" ? currentMedia.poster : undefined}
          bgImageSrc={currentMedia.background}
          title={currentMedia.title}
          date={currentMedia.date}
          scrollToExpand={currentMedia.scrollToExpand}
        >
          <MediaContent mediaType={mediaType} />
        </ScrollExpandMedia>
      </div>
    </section>
  )
}
