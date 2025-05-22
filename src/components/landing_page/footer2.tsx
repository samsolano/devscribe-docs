"use client"

interface MenuItem {
  title: string
  links: {
    text: string
    url: string
  }[]
}

interface Footer2Props {
  logo?: {
    url: string
    src: string
    alt: string
    title: string
  }
  tagline?: string
  menuItems?: MenuItem[]
  copyright?: string
  bottomLinks?: {
    text: string
    url: string
  }[]
}

export function Footer2({
  logo = {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2019-HbtPxj9mVbmhcv2H14epAP1G1Hu7aI.png",
    alt: "Devscribe logo",
    title: "Devscribe",
    url: "/",
  },
  tagline = "Automate your API docs workflow",
  menuItems = [
    {
      title: "Product",
      links: [
        { text: "Overview", url: "#" },
        { text: "Pricing", url: "#" },
        { text: "Marketplace", url: "#" },
        { text: "Features", url: "#" },
        { text: "Integrations", url: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About", url: "#" },
        { text: "Team", url: "#" },
        { text: "Blog", url: "#" },
        { text: "Careers", url: "#" },
        { text: "Contact", url: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { text: "Help", url: "#" },
        { text: "Documentation", url: "#" },
        { text: "API Reference", url: "#" },
      ],
    },
    {
      title: "Social",
      links: [
        { text: "Twitter", url: "#" },
        { text: "LinkedIn", url: "#" },
        { text: "GitHub", url: "#" },
      ],
    },
  ],
  copyright = "© 2025 Devscribe, Inc. All rights reserved.",
  bottomLinks = [
    { text: "Terms and Conditions", url: "#" },
    { text: "Privacy Policy", url: "#" },
  ],
}: Footer2Props) {
  return (
    <section className="relative py-20 bg-[#111111] text-gray-300">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#111111]" />
        <div
          className="absolute bottom-0 left-0 right-0 h-[80%] z-1 opacity-60"
          style={{
            background: "radial-gradient(ellipse at bottom center, rgba(59, 130, 246, 0.6) 0%, transparent 70%)",
            filter: "blur(120px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <footer>
          {/* Main footer content */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
            {/* Logo and tagline on the left */}
            <div className="mb-12 lg:mb-0 lg:max-w-xs">
              <a href={logo.url} className="inline-block">
                <img src={logo.src || "/placeholder.svg"} alt={logo.alt} className="h-8" />
              </a>
              <p className="mt-4 font-medium text-gray-400">{tagline}</p>
            </div>

            {/* Menu items on the right */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6">
              {menuItems.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">{section.title}</h3>
                  <ul className="space-y-3 text-sm">
                    {section.links.map((link, linkIdx) => (
                      <li key={linkIdx}>
                        <a href={link.url} className="text-gray-400 hover:text-white transition-colors duration-200">
                          {link.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center sm:items-start sm:justify-between">
            <p className="text-sm text-gray-400 mb-4 sm:mb-0">{copyright}</p>
            <ul className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {bottomLinks.map((link, linkIdx) => (
                <li key={linkIdx}>
                  <a href={link.url} className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  )
}
