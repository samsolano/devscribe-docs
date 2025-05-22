"use client"

import { Card, CardContent, CardHeader } from "@/components/landing_page/ui/card"
import { Badge } from "@/components/landing_page/ui/badge"
import { motion } from "framer-motion"
import Image from "next/image"
import { CheckCircle2, Bug, Zap, ArrowRight } from "lucide-react"

export function FeaturesGrid() {
  // Animation for the squares in the bottom boxes
  const squareVariants = {
    initial: { scale: 0.8, opacity: 0.5 },
    hover: { scale: 1, opacity: 1 },
  }

  // Animation for the grid of squares
  const gridVariants = {
    initial: {},
    hover: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  return (
    <section className="bg-[#111111] py-16 md:py-32 text-gray-300">
      <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="bg-[#38B6FF] text-white hover:bg-[#38B6FF]/90 mb-4">Tools</Badge>
          <h2 className="text-3xl font-semibold mb-4 text-white">Features that excite all users</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover how our platform can transform your API docs workflow with these powerful features.
          </p>
        </div>
        <div className="mx-auto grid gap-2 sm:grid-cols-5">
          <Card className="group overflow-hidden shadow-black/5 sm:col-span-3 sm:rounded-none sm:rounded-tl-xl bg-[#111111] border-gray-700/50 hover:border-white/50 transition-colors duration-300">
            <CardHeader>
              <div className="md:p-6">
                <p className="font-medium text-white">Beautiful looking API docs</p>
                <p className="text-gray-400 mt-3 max-w-sm text-sm">
                  Get your new API docs platform up and running in a matter of seconds with our out-of-the-box solution.
                </p>
              </div>
            </CardHeader>

            <div className="relative h-fit pl-6 md:pl-12">
              <div className="absolute -inset-6 [background:radial-gradient(75%_95%_at_50%_0%,transparent,#111111_100%)]"></div>

              <div className="bg-[#1a1a1a] overflow-hidden rounded-tl-lg border-l border-t border-gray-700/50 pl-2 pt-2">
                <img
                  src="https://tailark.com/_next/image?url=%2Fmail2.png&w=3840&q=75"
                  className="hidden dark:block"
                  alt="payments illustration dark"
                  width={1207}
                  height={929}
                />
                <img
                  src="https://tailark.com/_next/image?url=%2Fmail2-light.png&w=3840&q=75"
                  className="shadow dark:hidden"
                  alt="payments illustration light"
                  width={1207}
                  height={929}
                />
              </div>
            </div>
          </Card>

          <Card className="group overflow-hidden shadow-zinc-950/5 sm:col-span-2 sm:rounded-none sm:rounded-tr-xl bg-[#111111] border-gray-700/50 hover:border-white/50 transition-colors duration-300">
            <p className="mx-auto my-6 max-w-md text-balance px-6 text-center text-lg font-semibold sm:text-2xl md:p-6 text-white">
              Directly test APIs with our API Playground
            </p>

            <CardContent className="mt-auto h-fit">
              <div className="relative mb-6 sm:mb-0">
                <div className="absolute -inset-6 [background:radial-gradient(50%_75%_at_75%_50%,transparent,#111111_100%)]"></div>
                <div className="aspect-76/59 overflow-hidden rounded-r-lg border border-gray-700/50">
                  <img
                    src="https://tailark.com/_next/image?url=%2Forigin-cal-dark.png&w=3840&q=75"
                    className="hidden dark:block"
                    alt="payments illustration dark"
                    width={1207}
                    height={929}
                  />
                  <img
                    src="https://tailark.com/_next/image?url=%2Forigin-cal.png&w=3840&q=75"
                    className="shadow dark:hidden"
                    alt="payments illustration light"
                    width={1207}
                    height={929}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="group p-6 shadow-black/5 sm:col-span-2 sm:rounded-none sm:rounded-bl-xl md:p-12 bg-[#111111] border-gray-700/50 hover:border-white/50 transition-colors duration-300">
            <p className="mx-auto mb-8 max-w-md text-balance text-center text-lg font-semibold sm:text-2xl text-white">
              Paving way for MCP
            </p>

            <motion.div
              className="flex flex-col justify-center items-center relative h-[calc(100%-4rem)]"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              {/* First Box - AI Agent (Top) */}
              <motion.div
                className="bg-[#1a1a1a] relative flex aspect-square size-20 items-center justify-center rounded-[7px] border border-gray-700/50 p-3 shadow-lg z-10"
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <span className="text-white text-sm font-medium text-center">AI Agent</span>
              </motion.div>

              {/* Connecting line between first and second box (vertical) */}
              <motion.div
                className="w-[2px] h-16 bg-gradient-to-b from-gray-700/50 via-[#38B6FF] to-gray-700/50 my-3 z-0 relative overflow-hidden"
                initial={{ boxShadow: "0 0 0px transparent" }}
                animate={{
                  boxShadow: ["0 0 2px transparent", "0 0 8px #38B6FF", "0 0 2px transparent"],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <motion.div
                  className="absolute top-0 left-0 w-full h-full bg-[#38B6FF]/70"
                  initial={{ y: "-100%" }}
                  animate={{ y: ["-100%", "100%", "-100%"] }}
                  transition={{
                    duration: 4,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
              </motion.div>

              {/* Second Box - MCP Logo (Middle) */}
              <motion.div
                className="bg-[#1a1a1a] flex aspect-square size-20 items-center justify-center rounded-[7px] border border-gray-700/50 p-3 shadow-lg z-10"
                whileHover={{ rotate: -15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <Image src="/images/mcp.png" alt="MCP Logo" width={48} height={48} className="object-contain" />
              </motion.div>

              {/* Connecting line between second and third box (vertical) */}
              <motion.div
                className="w-[2px] h-16 bg-gradient-to-b from-gray-700/50 via-[#38B6FF] to-gray-700/50 my-3 z-0 relative overflow-hidden"
                initial={{ boxShadow: "0 0 0px transparent" }}
                animate={{
                  boxShadow: ["0 0 2px transparent", "0 0 8px #38B6FF", "0 0 2px transparent"],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: 0.5,
                }}
              >
                <motion.div
                  className="absolute top-0 left-0 w-full h-full bg-[#38B6FF]/70"
                  initial={{ y: "-100%" }}
                  animate={{ y: ["-100%", "100%", "-100%"] }}
                  transition={{
                    duration: 4,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 0.5,
                  }}
                />
              </motion.div>

              {/* Third Box - API (Bottom) */}
              <motion.div
                className="bg-[#1a1a1a] flex aspect-square size-20 items-center justify-center rounded-[7px] border border-gray-700/50 p-3 shadow-lg z-10"
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <span className="text-white text-sm">API</span>
              </motion.div>
            </motion.div>
          </Card>
          <Card className="group relative shadow-black/5 sm:col-span-3 sm:rounded-none sm:rounded-br-xl bg-[#111111] border-gray-700/50 hover:border-white/50 transition-colors duration-300">
            <CardHeader className="p-6 md:p-12">
              <p className="font-medium text-white">Automatic updates to release notes</p>
              <p className="text-gray-400 mt-2 max-w-sm text-sm">
                Communicate the changes in a user-friendly way to end-users, highlighting new features and improvements.
              </p>
            </CardHeader>
            <CardContent className="relative h-fit px-6 pb-6 md:px-12 md:pb-12">
              <div className="bg-[#111111] rounded-lg border border-gray-700/50 p-4 overflow-hidden">
                <div className="flex justify-between items-center mb-4 border-b border-gray-700/50 pb-3">
                  <div>
                    <h3 className="text-white font-medium">API Release Notes</h3>
                    <p className="text-gray-400 text-sm">v2.4.0 - May 15, 2025</p>
                  </div>
                  <Badge className="bg-[#38B6FF] text-white hover:bg-[#38B6FF]/90">Latest</Badge>
                </div>

                <div className="space-y-4">
                  <motion.div
                    className="space-y-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center gap-2 text-[#38B6FF]">
                      <Zap size={16} />
                      <h4 className="font-medium">New Features</h4>
                    </div>
                    <ul className="space-y-2 pl-6 text-sm">
                      <li className="flex items-start gap-2">
                        <ArrowRight size={14} className="mt-1 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-300">
                          Added support for GraphQL subscriptions in the API Playground
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight size={14} className="mt-1 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-300">
                          Introduced new authentication methods including OAuth 2.0 and API keys
                        </span>
                      </li>
                    </ul>
                  </motion.div>

                  <motion.div
                    className="space-y-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle2 size={16} />
                      <h4 className="font-medium">Improvements</h4>
                    </div>
                    <ul className="space-y-2 pl-6 text-sm">
                      <li className="flex items-start gap-2">
                        <ArrowRight size={14} className="mt-1 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-300">Enhanced response time for all API endpoints by 40%</span>
                      </li>
                    </ul>
                  </motion.div>

                  <motion.div
                    className="space-y-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center gap-2 text-red-400">
                      <Bug size={16} />
                      <h4 className="font-medium">Bug Fixes</h4>
                    </div>
                    <ul className="space-y-2 pl-6 text-sm">
                      <li className="flex items-start gap-2">
                        <ArrowRight size={14} className="mt-1 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-300">
                          Fixed an issue with rate limiting headers not being properly set
                        </span>
                      </li>
                    </ul>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
