"use client"

import { useMemo } from "react"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
// import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import { Github, ArrowRight } from "lucide-react"
import { Icons } from "@/components/landing_page/ui/icons"

type Uniforms = {
  [key: string]: {
    value: number[] | number[][] | number
    type: string
  }
}

interface ShaderProps {
  source: string
  uniforms: {
    [key: string]: {
      value: number[] | number[][] | number
      type: string
    }
  }
  maxFps?: number
}

interface SignInPageProps {
  className?: string
}

export const CanvasRevealEffect = ({
  animationSpeed = 10,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
  reverse = false, // This controls the direction
}: {
  animationSpeed?: number
  opacities?: number[]
  colors?: number[][]
  containerClassName?: string
  dotSize?: number
  showGradient?: boolean
  reverse?: boolean // This prop determines the direction
}) => {
  return (
    <div className={cn("h-full relative w-full", containerClassName)}>
      <div className="h-full w-full">
        <DotMatrix
          colors={colors ?? [[0, 255, 255]]}
          dotSize={dotSize ?? 3}
          opacities={opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]}
          // Pass reverse state and speed via string flags in the empty shader prop
          shader={`
          ${reverse ? "u_reverse_active" : "false"}_;
          animation_speed_factor_${animationSpeed.toFixed(1)}_;
        `}
          center={["x", "y"]}
        />
      </div>
      {showGradient && <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />}
    </div>
  )
}

interface DotMatrixProps {
  colors?: number[][]
  opacities?: number[]
  totalSize?: number
  dotSize?: number
  shader?: string
  center?: ("x" | "y")[]
}

const DotMatrix: React.FC<DotMatrixProps> = ({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 20,
  dotSize = 2,
  shader = "", // This shader string will now contain the animation logic
  center = ["x", "y"],
}) => {
  // ... uniforms calculation remains the same for colors, opacities, etc.
  const uniforms = React.useMemo(() => {
    let colorsArray = [colors[0], colors[0], colors[0], colors[0], colors[0], colors[0]]
    if (colors.length === 2) {
      colorsArray = [colors[0], colors[0], colors[0], colors[1], colors[1], colors[1]]
    } else if (colors.length === 3) {
      colorsArray = [colors[0], colors[0], colors[1], colors[1], colors[2], colors[2]]
    }
    return {
      u_colors: {
        value: colorsArray.map((color) => [color[0] / 255, color[1] / 255, color[2] / 255]),
        type: "uniform3fv",
      },
      u_opacities: {
        value: opacities,
        type: "uniform1fv",
      },
      u_total_size: {
        value: totalSize,
        type: "uniform1f",
      },
      u_dot_size: {
        value: dotSize,
        type: "uniform1f",
      },
      u_reverse: {
        value: shader.includes("u_reverse_active") ? 1 : 0, // Convert boolean to number (1 or 0)
        type: "uniform1i", // Use 1i for bool in WebGL1/GLSL100, or just bool for GLSL300+ if supported
      },
    }
  }, [colors, opacities, totalSize, dotSize, shader]) // Add shader to dependencies

  return (
    <Shader
      // The main animation logic is now built *outside* the shader prop
      source={`
      precision mediump float;
      in vec2 fragCoord;

      uniform float u_time;
      uniform float u_opacities[10];
      uniform vec3 u_colors[6];
      uniform float u_total_size;
      uniform float u_dot_size;
      uniform vec2 u_resolution;
      uniform int u_reverse; // Changed from bool to int

      out vec4 fragColor;

      float PHI = 1.61803398874989484820459;
      float random(vec2 xy) {
          return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
      }
      float map(float value, float min1, float max1, float min2, float max2) {
          return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
      }

      void main() {
          vec2 st = fragCoord.xy;
          ${center.includes("x") ? "st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));" : ""}
          ${center.includes("y") ? "st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));" : ""}

          float opacity = step(0.0, st.x);
          opacity *= step(0.0, st.y);

          vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

          float frequency = 5.0;
          float show_offset = random(st2); // Used for initial opacity random pick and color
          float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency));
          opacity *= u_opacities[int(rand * 10.0)];
          opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
          opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

          vec3 color = u_colors[int(show_offset * 6.0)];

          // --- Animation Timing Logic ---
          float animation_speed_factor = 0.5; // Extract speed from shader string
          vec2 center_grid = u_resolution / 2.0 / u_total_size;
          float dist_from_center = distance(center_grid, st2);

          // Calculate timing offset for Intro (from center)
          float timing_offset_intro = dist_from_center * 0.01 + (random(st2) * 0.15);

          // Calculate timing offset for Outro (from edges)
          // Max distance from center to a corner of the grid
          float max_grid_dist = distance(center_grid, vec2(0.0, 0.0));
          float timing_offset_outro = (max_grid_dist - dist_from_center) * 0.02 + (random(st2 + 42.0) * 0.2);


          float current_timing_offset;
          if (u_reverse == 1) {
              current_timing_offset = timing_offset_outro;
               // Outro logic: opacity starts high, goes to 0 when time passes offset
               opacity *= 1.0 - step(current_timing_offset, u_time * animation_speed_factor);
               // Clamp for fade-out transition
               opacity *= clamp((step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
          } else {
              current_timing_offset = timing_offset_intro;
               // Intro logic: opacity starts 0, goes to base opacity when time passes offset
               opacity *= step(current_timing_offset, u_time * animation_speed_factor);
               // Clamp for fade-in transition
               opacity *= clamp((1.0 - step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
          }


          fragColor = vec4(color, opacity);
          fragColor.rgb *= fragColor.a; // Premultiply alpha
      }`}
      uniforms={uniforms}
      maxFps={60}
    />
  )
}

const ShaderMaterial = ({
  source,
  uniforms,
  maxFps = 60,
}: {
  source: string
  hovered?: boolean
  maxFps?: number
  uniforms: Uniforms
}) => {
  const { size } = useThree()
  const ref = useRef<THREE.Mesh>(null)
  let lastFrameTime = 0

  useFrame(({ clock }) => {
    if (!ref.current) return
    const timestamp = clock.getElapsedTime()

    lastFrameTime = timestamp

    const material: any = ref.current.material
    const timeLocation = material.uniforms.u_time
    timeLocation.value = timestamp
  })

  const getUniforms = () => {
    const preparedUniforms: any = {}

    for (const uniformName in uniforms) {
      const uniform: any = uniforms[uniformName]

      switch (uniform.type) {
        case "uniform1f":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1f" }
          break
        case "uniform1i":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1i" }
          break
        case "uniform3f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector3().fromArray(uniform.value),
            type: "3f",
          }
          break
        case "uniform1fv":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1fv" }
          break
        case "uniform3fv":
          preparedUniforms[uniformName] = {
            value: uniform.value.map((v: number[]) => new THREE.Vector3().fromArray(v)),
            type: "3fv",
          }
          break
        case "uniform2f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector2().fromArray(uniform.value),
            type: "2f",
          }
          break
        default:
          console.error(`Invalid uniform type for '${uniformName}'.`)
          break
      }
    }

    preparedUniforms["u_time"] = { value: 0, type: "1f" }
    preparedUniforms["u_resolution"] = {
      value: new THREE.Vector2(size.width * 2, size.height * 2),
    } // Initialize u_resolution
    return preparedUniforms
  }

  // Shader material
  const material = useMemo(() => {
    const materialObject = new THREE.ShaderMaterial({
      vertexShader: `
    precision mediump float;
    in vec2 coordinates;
    uniform vec2 u_resolution;
    out vec2 fragCoord;
    void main(){
      float x = position.x;
      float y = position.y;
      gl_Position = vec4(x, y, 0.0, 1.0);
      fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
      fragCoord.y = u_resolution.y - fragCoord.y;
    }
    `,
      fragmentShader: source,
      uniforms: getUniforms(),
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
    })

    return materialObject
  }, [size.width, size.height, source])

  return (
    <mesh ref={ref as any}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}

const Shader: React.FC<ShaderProps> = ({ source, uniforms, maxFps = 60 }) => {
  return (
    <Canvas className="absolute inset-0  h-full w-full">
      <ShaderMaterial source={source} uniforms={uniforms} maxFps={maxFps} />
    </Canvas>
  )
}

export const SignUpPage = ({ className }: SignInPageProps) => {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [step, setStep] = useState<"email" | "code" | "team" | "success">("email")
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([])
  // Replace these multiple canvas state variables
  // const [initialCanvasVisible, setInitialCanvasVisible] = useState(true)
  // const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false)
  // const [teamCanvasVisible, setTeamCanvasVisible] = useState(false)
  // Use a single canvas state that's only turned off at the end
  const [pixelCanvasVisible, setPixelCanvasVisible] = useState(true)
  const [teamName, setTeamName] = useState("")
  // First, add a new state variable for the team step canvas
  // Add this after the other canvas state variables (around line 385)
  // const [teamCanvasVisible, setTeamCanvasVisible] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return "Email is required"
    if (!emailRegex.test(email)) return "Please enter a valid email address"
    return ""
  }

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)

    if (!hasMinLength) return "Password must be at least 8 characters"
    if (!hasUpperCase) return "Password must contain an uppercase letter"
    if (!hasLowerCase) return "Password must contain a lowercase letter"
    if (!hasNumber) return "Password must contain a number"
    return ""
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const emailValidationError = validateEmail(email)
    const passwordValidationError = validatePassword(password)
    
    if (emailValidationError) {
      setEmailError(emailValidationError)
      return
    }
    if (passwordValidationError) {
      setPasswordError(passwordValidationError)
      return
    }

    if (email && password) {
      try {
        const formData = new FormData()
        formData.append('email', email)
        formData.append('password', password)

        const response = await fetch('http://localhost:8000/auth/register', {  // TODO: change to actual url later 
          method: 'POST',
          body: formData
        })

        const data = await response.json()

        if (!response.ok) {
          if (response.status === 422 || response.status === 400) {
            // Handle validation errors
            if (data.errors.email) {
              setEmailError(data.errors.email[0])
            }
            if (data.errors.password) {
              setPasswordError(data.errors.password[0]) 
            }
            return
          }
          if (response.status === 500) {
            setEmailError('Registration failed. Please try again.')
          }
          throw new Error('Registration failed')
        }

        // Success - move to code verification step
        setStep("code")

      } catch (error) {
        console.error('Registration error:', error)
        setEmailError('Registration failed. Please try again.')
      }
    }
  }

  // Focus first input when code screen appears
  useEffect(() => {
    if (step === "code") {
      setTimeout(() => {
        codeInputRefs.current[0]?.focus()
      }, 500)
    }
  }, [step])

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code]
      newCode[index] = value
      setCode(newCode)

      // Focus next input if value is entered
      if (value && index < 5) {
        codeInputRefs.current[index + 1]?.focus()
      }

      // Check if code is complete
      if (index === 5 && value) {
        const isComplete = newCode.every((digit) => digit.length === 1)
        if (isComplete) {
          // Simply transition to team step after a delay
          setTimeout(() => {
            setStep("team")
          }, 1000)
        }
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus()
    }
  }

  const handleBackClick = () => {
    setStep("email")
    setCode(["", "", "", "", "", ""])
    // Keep pixel canvas visible
    setPixelCanvasVisible(true)
  }

  // Then, modify the handleTeamSubmit function to show the animation when submitting
  // Replace the existing handleTeamSubmit function with this:
  const handleTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (teamName) {
      // Transition to success step after a delay
      setTimeout(() => {
        setStep("success")
        // Automatically redirect to dashboard after showing success message briefly
        setTimeout(() => {
          handleSuccessfulSignup()
        }, 1500)
      }, 1000)
    }
  }

  const handleSuccessfulSignup = () => {
    // Only hide the canvas when going to home page
    setPixelCanvasVisible(false)

    // Automatically redirect to home page
    window.location.href = "/"
  }

  return (
    <div className={cn("flex w-[100%] flex-col min-h-screen bg-[#111111] relative", className)}>
      <div className="absolute inset-0 z-0">
        {/* Single persistent canvas throughout the entire flow */}
        {pixelCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-[#111111]"
              colors={[
                [56, 182, 255], // #38B6FF
                [56, 182, 255],
              ]}
              dotSize={6}
              reverse={false}
            />
          </div>
        )}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,1)_0%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black to-transparent" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Main content container */}
        <div className="flex flex-1 flex-col lg:flex-row">
          {/* Left side (form) */}
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="w-full h-full flex justify-center items-center max-w-sm">
              <AnimatePresence mode="wait">
                {step === "email" ? (
                  <motion.div
                    key="email-step"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-6 text-center"
                  >
                    <div className="space-y-1">
                      <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white whitespace-nowrap">
                        Welcome to Devscribe
                      </h1>
                      <p className="text-xl text-white/70 font-light">Get started today</p>
                    </div>

                    <div className="space-y-4">
                      <button
                        onClick={() => {
                          // GitHub OAuth URL - in a real app, you would use environment variables for client ID
                          const githubClientId = "your_github_client_id"
                          const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/github/callback`)
                          const scope = encodeURIComponent("user:email")
                          const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=${scope}`

                          // Redirect to GitHub OAuth flow
                          window.location.href = githubAuthUrl
                        }}
                        className="backdrop-blur-[2px] w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full py-3 px-4 transition-colors"
                      >
                        <Github className="w-5 h-5" />
                        <span>Sign up with GitHub</span>
                      </button>

                      <button className="backdrop-blur-[2px] w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full py-3 px-4 transition-colors">
                        <svg
                          viewBox="0 0 24 24"
                          width="20"
                          height="20"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                        >
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        <span>Sign up with Google</span>
                      </button>

                      <div className="flex items-center gap-4">
                        <div className="h-px bg-white/10 flex-1" />
                        <span className="text-white/40 text-sm">or</span>
                        <div className="h-px bg-white/10 flex-1" />
                      </div>

                      <form onSubmit={handleEmailSubmit} noValidate>
                        <div className="space-y-8">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Enter your email"
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value)
                                if (emailError) setEmailError("")
                              }}
                              className={cn(
                                "w-full backdrop-blur-[1px] text-white border rounded-full py-3 px-4 bg-[#111]/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white transition-all duration-200 text-center shadow-sm [&:-webkit-autofill]:bg-black [&:-webkit-autofill]:shadow-[0_0_0_30px_#111_inset] [&:-webkit-autofill]:[text-fill-color:white] [color-scheme:dark] [&:not(:placeholder-shown)]:text-white",
                                emailError ? "border-red-500" : "border-white/30"
                              )}
                            />
                            {emailError && (
                              <p className="absolute -bottom-6 left-0 right-0 text-red-500 text-sm text-center">
                                {emailError}
                              </p>
                            )}
                          </div>
                          <div className="relative">
                            <input
                              type={passwordVisible ? "text" : "password"}
                              placeholder="Create a password"
                              value={password}
                              onChange={(e) => {
                                setPassword(e.target.value)
                                if (passwordError) setPasswordError("")
                              }}
                              className={cn(
                                "w-full backdrop-blur-[1px] text-white border rounded-full py-3 px-4 bg-[#111]/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white transition-all duration-200 text-center shadow-sm [&:-webkit-autofill]:bg-black [&:-webkit-autofill]:shadow-[0_0_0_30px_#111_inset] [&:-webkit-autofill]:[text-fill-color:white] [color-scheme:dark] [&:not(:placeholder-shown)]:text-white",
                                passwordError ? "border-red-500" : "border-white/30"
                              )}
                            />
                            <button
                              type="button"
                              onClick={() => setPasswordVisible((v) => !v)}
                              className="absolute right-3 inset-y-0 my-auto flex items-center text-white/60 hover:text-white/90 focus:outline-none"
                              tabIndex={-1}
                              aria-label={passwordVisible ? "Hide password" : "Show password"}
                            >
                              {passwordVisible ? (
                                // Eye-off icon (minimal, modern)
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.94 17.94A10.06 10.06 0 0112 20C7.03 20 2.73 16.11 1 12c.74-1.64 2.01-3.61 3.94-5.06" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 9.53A3 3 0 0012 15a3 3 0 002.47-5.47" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21L3 3" />
                                </svg>
                              ) : (
                                // Eye icon (modern, minimal)
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12zm11 3a3 3 0 100-6 3 3 0 000 6z" />
                                </svg>
                              )}
                            </button>
                            {passwordError && (
                              <p className="absolute -bottom-6 left-0 right-0 text-red-500 text-sm text-center">
                                {passwordError}
                              </p>
                            )}
                          </div>
                          <motion.button
                            type="submit"
                            className="w-full text-white flex items-center justify-center gap-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors shadow-md py-3"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleEmailSubmit}
                          >
                            <span>Continue</span>
                          </motion.button>
                        </div>
                      </form>
                    </div>

                    <p className="text-xs text-white/40 pt-10">
                      By signing up, you agree to the{" "}
                      <Link href="#" className="underline text-white/40 hover:text-white/60 transition-colors">
                        Terms of Service
                      </Link>
                      ,{" "}
                      <Link href="#" className="underline text-white/40 hover:text-white/60 transition-colors">
                        Privacy Policy
                      </Link>
                      , and{" "}
                      <Link href="#" className="underline text-white/40 hover:text-white/60 transition-colors">
                        Cookie Policy
                      </Link>
                      .
                    </p>
                  </motion.div>
                ) : step === "code" ? (
                  <motion.div
                    key="code-step"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-6 text-center relative"
                  >
                    <button
                      type="button"
                      onClick={handleBackClick}
                      className="absolute left-0 top-0 -translate-y-20 -translate-x-40 p-2 rounded-full bg-black/40 hover:bg-white/10 focus:outline-none"
                      aria-label="Back to sign up"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="space-y-1">
                      <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white">
                        Verify your email
                      </h1>
                      <p className="text-base text-white/50 font-light">Enter the code we sent to {email}</p>
                    </div>

                    <div className="w-full">
                      <div className="relative rounded-full py-4 px-5 border border-white/10 bg-transparent">
                        <div className="flex items-center justify-center">
                          {code.map((digit, i) => (
                            <div key={i} className="flex items-center">
                              <div className="relative">
                                <input
                                  ref={(el) => {
                                    codeInputRefs.current[i] = el
                                  }}
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  maxLength={1}
                                  value={digit}
                                  onChange={(e) => handleCodeChange(i, e.target.value)}
                                  onKeyDown={(e) => handleKeyDown(i, e)}
                                  className="w-8 text-center text-xl bg-transparent text-white border-none focus:outline-none focus:ring-0 appearance-none"
                                  style={{ caretColor: "transparent" }}
                                />
                                {!digit && (
                                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                                    <span className="text-xl text-white">0</span>
                                  </div>
                                )}
                              </div>
                              {i < 5 && <span className="text-white/20 text-xl">|</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <motion.p
                        className="text-white/50 hover:text-white/70 transition-colors cursor-pointer text-sm"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        Resend code
                      </motion.p>
                    </div>

                    <div className="pt-16">
                      <p className="text-xs text-white/40">
                        By signing up, you agree to the{" "}
                        <Link href="#" className="underline text-white/40 hover:text-white/60 transition-colors">
                          Terms of Service
                        </Link>
                        ,{" "}
                        <Link href="#" className="underline text-white/40 hover:text-white/60 transition-colors">
                          Privacy Policy
                        </Link>
                        , and{" "}
                        <Link href="#" className="underline text-white/40 hover:text-white/60 transition-colors">
                          Cookie Policy
                        </Link>
                        .
                      </p>
                    </div>
                  </motion.div>
                ) : step === "team" ? (
                  <motion.div
                    key="team-step"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-6 text-center"
                  >
                    <div className="space-y-1">
                      <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white whitespace-nowrap text-center mx-auto">
                        Get started today
                      </h1>
                      <p className="text-base text-white/70 font-light">Enter your company name</p>
                    </div>

                    <form onSubmit={handleTeamSubmit} className="space-y-6">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Company Name"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          className="w-full backdrop-blur-[1px] text-white border border-white/30 rounded-full py-3 px-4 bg-[#111]/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white transition-all duration-200 text-center shadow-sm [&:-webkit-autofill]:bg-black [&:-webkit-autofill]:shadow-[0_0_0_30px_#111_inset] [&:-webkit-autofill]:[text-fill-color:white]"
                          required
                        />
                      </div>

                      <div className="flex w-full gap-3">
                        <motion.button
                          type="submit"
                          className={`w-full rounded-full font-medium py-3 border transition-all duration-300 ${
                            teamName
                              ? "bg-white text-[#111111] border-transparent hover:bg-white/90 cursor-pointer"
                              : "bg-[#111] text-white/50 border-white/10 cursor-not-allowed"
                          }`}
                          disabled={!teamName}
                          whileHover={teamName ? { scale: 1.02 } : {}}
                          whileTap={teamName ? { scale: 0.98 } : {}}
                          transition={{ duration: 0.2 }}
                        >
                          Go to dashboard
                        </motion.button>
                      </div>
                    </form>

                    <div className="pt-16">
                      <p className="text-xs text-white/40">
                        By signing up, you agree to the{" "}
                        <Link href="#" className="underline text-white/40 hover:text-white/60 transition-colors">
                          Terms of Service
                        </Link>
                        ,{" "}
                        <Link href="#" className="underline text-white/40 hover:text-white/60 transition-colors">
                          Privacy Policy
                        </Link>
                        , and{" "}
                        <Link href="#" className="underline text-white/40 hover:text-white/60 transition-colors">
                          Cookie Policy
                        </Link>
                        .
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success-step"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
                    className="space-y-6 text-center flex flex-col items-center justify-center w-full"
                  >
                    <div className="space-y-1">
                      <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white">
                        Welcome, {teamName}!
                      </h1>
                      <p className="text-base text-white/50 font-light">Your API docs platform is ready</p>
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="w-full text-center"
                    >
                      <div className="flex items-center justify-center">
                        <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
                        <span className="text-white">Redirecting to home page...</span>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CanvasRevealSignUp() {
  return <SignUpPage />
}
