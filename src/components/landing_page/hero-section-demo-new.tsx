"use client"

import { HeroSectionNew } from "@/components/landing_page/hero-section-new"
import { GitHubIcon } from "@/components/landing_page/ui/icons"

export function HeroSectionDemoNew() {
  return (
    <HeroSectionNew
      badge={{
        text: "Version 1.0 will be live 5/31 📣",
        action: {
          text: "Learn more",
          href: "/docs",
        },
      }}
      title="Automate your API docs workflow"
      description="Devscribe boosts your team's efficiency by automating and managing your API documentation, allowing readability for all."
      actions={[
        {
          text: "Book a demo",
          href: "/demo",
          variant: "default",
        },
        {
          text: "Get started for free",
          href: "/signup",
          variant: "glow",
          icon: <GitHubIcon className="h-5 w-5" />,
        },
      ]}
      video={{
        src: "https://me7aitdbxq.ufs.sh/f/2wsMIGDMQRdYuZ5R8ahEEZ4aQK56LizRdfBSqeDMsmUIrJN1",
        // src: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        poster: "https://images.pexels.com/videos/5752729/space-earth-universe-cosmos-5752729.jpeg",
        alt: "API Documentation Workflow Demo",
        // preload: "auto",
        // crossOrigin: "anonymous",
      }}
    />
  )
}
