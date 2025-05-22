import { Compare } from "@/components/compare"
import { Badge } from "@/components/ui/badge"

export function CompareSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge className="bg-[#38B6FF] text-white hover:bg-[#38B6FF]/90 mb-4">Compare</Badge>
          <h2 className="text-3xl font-semibold mb-4 md:text-4xl lg:text-5xl">See the Difference</h2>
          <p className="text-muted-foreground text-lg">
            Compare how Nexus transforms your workflow from chaotic to streamlined with our powerful integration
            platform.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Compare
            beforeImage="https://images.unsplash.com/photo-1611224885990-ab7363d7f2a9?q=80&w=1974&auto=format&fit=crop"
            afterImage="https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?q=80&w=2070&auto=format&fit=crop"
            beforeLabel="Without Nexus"
            afterLabel="With Nexus"
            className="aspect-[16/9] shadow-xl border border-muted rounded-xl overflow-hidden"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            <div className="bg-background p-6 rounded-lg border">
              <h3 className="text-xl font-medium mb-3">Before Nexus</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Fragmented communication across platforms</li>
                <li>• Manual data entry and transfers</li>
                <li>• Slow response times to customer inquiries</li>
                <li>• Limited visibility across channels</li>
                <li>• Disconnected team collaboration</li>
              </ul>
            </div>

            <div className="bg-background p-6 rounded-lg border border-primary/20">
              <h3 className="text-xl font-medium mb-3 text-primary">After Nexus</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Unified communication hub</li>
                <li>• Automated workflows and data synchronization</li>
                <li>• Real-time customer engagement</li>
                <li>• Complete cross-channel visibility</li>
                <li>• Seamless team collaboration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
