"use client"
import { Badge } from "@/components/ui/badge"

export function Features() {
  return (
    <section className="py-16 md:py-32 bg-[#111111] text-gray-300">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-[#38B6FF] text-white hover:bg-[#38B6FF]/90 mb-4">Features</Badge>
          <h2 className="text-3xl font-semibold mb-4 text-white">Advanced Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our advanced features designed to enhance your API documentation experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            title="Interactive Documentation"
            description="Engage with live API endpoints directly from your documentation."
          />
          <FeatureCard
            title="Customizable Themes"
            description="Tailor the look and feel of your documentation to match your brand."
          />
          <FeatureCard
            title="AI-Powered Search"
            description="Find what you need quickly with our intelligent search functionality."
          />
        </div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  title: string
  description: string
}

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-gray-700/50 p-6 hover:border-white/50 transition-all duration-300">
      <h3 className="text-lg font-medium mb-2 text-white">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  )
}
