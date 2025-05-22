import { Badge } from "@/components/ui/badge"
import { Code, FileText, GitBranch, RefreshCw } from "lucide-react"

export function GenerateDocumentation() {
  return (
    <section className="py-16 md:py-32 bg-[#111111] text-gray-300">
      <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-[#38B6FF] text-white hover:bg-[#38B6FF]/90 mb-4">Generate Documentation</Badge>
          <h2 className="text-3xl font-semibold mb-4 text-white">Automated Documentation Generation</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Transform your API code into comprehensive, well-structured documentation in seconds, saving your team
            countless hours of manual work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-700/50 p-6 hover:border-white/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/10 p-2 rounded-lg">
                <Code className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-medium text-white">Code Analysis</h3>
            </div>
            <p className="text-gray-400">
              Our intelligent system analyzes your codebase to extract API endpoints, parameters, response formats, and
              error codes automatically.
            </p>
          </div>

          <div className="bg-[#1a1a1a] rounded-xl border border-gray-700/50 p-6 hover:border-white/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/10 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-medium text-white">Documentation Templates</h3>
            </div>
            <p className="text-gray-400">
              Choose from a variety of professional templates designed for different API types and documentation styles.
            </p>
          </div>

          <div className="bg-[#1a1a1a] rounded-xl border border-gray-700/50 p-6 hover:border-white/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/10 p-2 rounded-lg">
                <GitBranch className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-medium text-white">Version Control</h3>
            </div>
            <p className="text-gray-400">
              Keep your documentation in sync with your code through seamless integration with your version control
              system.
            </p>
          </div>

          <div className="bg-[#1a1a1a] rounded-xl border border-gray-700/50 p-6 hover:border-white/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/10 p-2 rounded-lg">
                <RefreshCw className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-medium text-white">Continuous Updates</h3>
            </div>
            <p className="text-gray-400">
              Set up automated workflows to regenerate documentation whenever your API changes, ensuring it's always
              up-to-date.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
