import Image from "next/image"
import { RefreshCw, FileText, GitBranch, Plus, ChevronDown, Globe } from "lucide-react"

export default function DocumentationPortal() {
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-medium mb-1">Good morning, Devscribe</h1>
          <p className="text-gray-400">Welcome back to your documentation portal</p>
        </div>
        <div className="relative">
          <button className="flex items-center gap-2 bg-black border border-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Things to do
            <ChevronDown className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>

      <hr className="border-gray-800 mb-8" />

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Documentation preview */}
        <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
          <Image
            src="/placeholder.svg?height=300&width=500"
            alt="Documentation preview"
            width={500}
            height={300}
            className="w-full h-auto"
          />
        </div>

        {/* Status information */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-green-500">Live</span>
          </div>

          <div className="flex items-center gap-2 text-gray-400">
            <span>Last updated</span>
            <span className="text-white">1 week ago by</span>
            <span className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4 text-gray-400" />
              <span className="text-white">Manual Update</span>
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-gray-400">Domain</p>
            <p className="text-white">devscribe.mintify.app</p>
            <button className="flex items-center gap-2 mt-2 bg-transparent border border-gray-800 text-green-500 px-3 py-1 rounded-md text-sm hover:bg-gray-900">
              <Plus className="h-4 w-4" />
              Add custom domain
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-400" />
              <span className="text-white">samsolano / docs</span>
            </div>
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-gray-400" />
              <span className="text-gray-400">branch</span>
              <span className="text-white">main</span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button className="flex items-center justify-center w-10 h-10 bg-transparent border border-gray-800 text-white rounded-md hover:bg-gray-900">
              <RefreshCw className="h-4 w-4" />
            </button>
            <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200">
              <Globe className="h-4 w-4" />
              Visit docs
            </button>
          </div>
        </div>
      </div>

      {/* Activity history */}
      <div className="mt-12">
        <h2 className="text-xl font-medium mb-1">Activity history</h2>
        <p className="text-gray-400 mb-6">Showing history of updates made on your docs</p>

        <div className="bg-black border border-gray-800 rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 p-4 border-b border-gray-800 text-gray-400">
            <div>Activity</div>
            <div>Status</div>
            <div>Changes</div>
          </div>

          {/* Activity item 1 */}
          <div className="grid grid-cols-3 p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                <RefreshCw className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <div className="text-white">Manual Update</div>
                <div className="text-gray-400 text-sm">May 6, 3:28 PM</div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-green-500">Successful</span>
              </span>
            </div>
            <div className="flex items-center justify-end">
              <button className="text-gray-400 hover:bg-gray-900 p-1 rounded-md">
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Activity item 2 */}
          <div className="grid grid-cols-3 p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                <RefreshCw className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <div className="text-white">Manual Update</div>
                <div className="text-gray-400 text-sm">Feb 24, 8:37 PM</div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-green-500">Successful</span>
              </span>
            </div>
            <div className="flex items-center justify-end">
              <button className="text-gray-400 hover:bg-gray-900 p-1 rounded-md">
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Activity item 3 */}
          <div className="grid grid-cols-3 p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                <FileText className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <div className="text-white">Manual Update</div>
                <div className="text-gray-400 text-sm">Feb 24, 8:32 PM</div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-green-500">Successful</span>
              </span>
            </div>
            <div className="flex items-center justify-end">
              <button className="text-gray-400 hover:bg-gray-900 p-1 rounded-md">
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
