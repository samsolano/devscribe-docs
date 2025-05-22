import { DevFeatures } from "@/components/landing_page/dev-features"
import { FeaturesGrid } from "@/components/landing_page/features-grid"
import { CustomerFeatures } from "@/components/landing_page/customer-features"
import { Integrations } from "@/components/landing_page/integrations"
import { UseCases } from "@/components/landing_page/use-cases"
import { LearnMore } from "@/components/landing_page/learn-more"
import { HeroSectionDemoNew } from "@/components/landing_page/hero-section-demo-new"
import { Demo } from "@/components/landing_page/demo"
import HeroSection from "@/components/landing_page/hero-section"
import LandingLayout from "@/components/layout/LandingLayout"

export default function Home() {
  return (
    <LandingLayout>
    <main className="flex min-h-screen flex-col bg-[#111111]">
      <HeroSection isNavOnly={true} />
      <HeroSectionDemoNew />
      <Demo />
      <DevFeatures />
      <FeaturesGrid />
      <CustomerFeatures />
      <Integrations />
      <UseCases />
      <LearnMore />
    </main>
    </LandingLayout>
  )
}
