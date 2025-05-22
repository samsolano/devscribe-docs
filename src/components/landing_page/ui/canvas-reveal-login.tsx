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

export const LoginPage = ({ className }: SignInPageProps) => {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [password, setPassword] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [formError, setFormError] = useState("")

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  }

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasMinLength || !hasUpperCase || !hasLowerCase || !hasNumber) return "Incorrect email or password";
    return "";
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("");
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      setFormError("");
      return;
    }
    if (passwordValidationError) {
      setFormError(passwordValidationError);
      setEmailError("");
      return;
    }
    // Real login API call
    if (email && password) {
      try {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        const response = await fetch('http://localhost:8000/auth/login', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            setFormError('Incorrect email or password.');
            return;
          }
          if (response.status === 500) {
            setFormError('Login failed. Please try again.');
            return;
          }
          throw new Error('Login failed');
        }

        // Success - redirect to dashboard
        window.location.href = "/dashboard";
      } catch (error) {
        console.error('Login error:', error);
        setFormError('Login failed. Please try again.');
      }
    }
  }

  return (
    <div className={cn("flex w-[100%] flex-col min-h-screen bg-[#111111] relative", className)}>
      <div className="absolute inset-0 z-0">
        {/* Single persistent canvas throughout the entire flow */}
        <div className="absolute inset-0">
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-[#111111]"
            colors={[[56, 182, 255], [56, 182, 255]]}
            dotSize={6}
            reverse={false}
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,1)_0%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black to-transparent" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col flex-1">
        <div className="flex flex-1 flex-col lg:flex-row">
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="w-full h-full flex justify-center items-center max-w-sm">
              <div className="space-y-6 text-center w-full">
                <div className="space-y-1">
                  <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white whitespace-nowrap">
                    Welcome Back
                  </h1>
                  <p className="text-xl text-white/70 font-light">Sign in to your account</p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => {
                      // GitHub OAuth URL - in a real app, you would use environment variables for client ID
                      const githubClientId = "your_github_client_id"
                      const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/github/callback`)
                      const scope = encodeURIComponent("user:email")
                      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=${scope}`
                      window.location.href = githubAuthUrl
                    }}
                    className="backdrop-blur-[2px] w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full py-3 px-4 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    <span>Sign in with GitHub</span>
                  </button>

                  <button className="backdrop-blur-[2px] w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full py-3 px-4 transition-colors">
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                    >
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span>Sign in with Google</span>
                  </button>

                  <form onSubmit={handleLoginSubmit} noValidate>
                    <div className="space-y-8">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            if (emailError) setEmailError("")
                            if (formError) setFormError("")
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
                          placeholder="Password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value)
                            if (formError) setFormError("")
                          }}
                          className={cn(
                            "w-full backdrop-blur-[1px] text-white border rounded-full py-3 px-4 bg-[#111]/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white transition-all duration-200 text-center shadow-sm [&:-webkit-autofill]:bg-black [&:-webkit-autofill]:shadow-[0_0_0_30px_#111_inset] [&:-webkit-autofill]:[text-fill-color:white] [color-scheme:dark] [&:not(:placeholder-shown)]:text-white",
                            "border-white/30"
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
                      </div>
                      <motion.button
                        type="submit"
                        className="w-full text-white flex items-center justify-center gap-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors shadow-md py-3"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>Sign in</span>
                      </motion.button>
                      {formError && (
                        <p className="text-red-500 text-sm text-center pt-2">
                          {formError}
                        </p>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CanvasRevealLogin() {
  return <LoginPage />
}
