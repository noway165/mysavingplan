"use client"

import { useEffect, useRef } from "react"
import { useSettings } from "@/context/SettingsContext"

export function ThemeBackground() {
  const { colorTheme } = useSettings()

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {colorTheme === "limegreen" && <MatrixBackground />}
      {colorTheme === "amethyst" && <GalaxyBackground />}
      {colorTheme === "orangered" && <FireBackground />}
      {colorTheme === "pastelpink" && <SakuraBackground />}
      {colorTheme === "slate" && <GridBackground />}
      {colorTheme === "whitesmoke" && <FogBackground />}
      {colorTheme === "default" && <DefaultBackground />}
    </div>
  )
}

function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~"
    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops: number[] = []

    for (let x = 0; x < columns; x++) {
      drops[x] = 1
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 26, 0.1)" // Dark background with trail
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#4ade80" // Matrix Green
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 opacity-40 mix-blend-screen" />
}

function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars: { x: number, y: number, radius: number, speed: number }[] = []
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.5 + 0.1
      })
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#fff"

      stars.forEach(star => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()
        
        star.y -= star.speed
        if (star.y < 0) {
          star.y = canvas.height
          star.x = Math.random() * canvas.width
        }
      })
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#1a0b2e] to-[#0a0a1a]">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] mix-blend-screen" />
    </div>
  )
}

function FireBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: { x: number, y: number, size: number, speedY: number, speedX: number, life: number, maxLife: number }[] = []

    const createParticle = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        size: Math.random() * 4 + 1,
        speedY: Math.random() * -3 - 1,
        speedX: Math.random() * 2 - 1,
        life: 0,
        maxLife: Math.random() * 100 + 50
      })
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (Math.random() < 0.3) createParticle()

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.speedX
        p.y += p.speedY
        p.life++

        const opacity = 1 - (p.life / p.maxLife)
        
        ctx.beginPath()
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
        gradient.addColorStop(0, `rgba(255, 200, 0, ${opacity})`)
        gradient.addColorStop(1, `rgba(255, 50, 0, 0)`)
        
        ctx.fillStyle = gradient
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
        ctx.fill()

        if (p.life >= p.maxLife || p.size <= 0.2) {
          particles.splice(i, 1)
        }
      }
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="absolute inset-0 bg-[#0a0505]">
      <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-red-900/20 to-transparent" />
      <canvas ref={canvasRef} className="absolute inset-0 opacity-80 mix-blend-screen" />
    </div>
  )
}

function SakuraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const petals: { x: number, y: number, size: number, speedY: number, speedX: number, angle: number, spin: number }[] = []
    
    for (let i = 0; i < 50; i++) {
      petals.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 5 + 3,
        speedY: Math.random() * 1 + 0.5,
        speedX: Math.random() * 2 - 1,
        angle: Math.random() * 360,
        spin: Math.random() * 2 - 1
      })
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      petals.forEach(p => {
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle * Math.PI / 180)
        
        ctx.beginPath()
        ctx.fillStyle = "rgba(255, 182, 193, 0.6)"
        ctx.arc(0, 0, p.size, 0, Math.PI, false)
        ctx.fill()
        
        ctx.restore()

        p.y += p.speedY
        p.x += p.speedX
        p.angle += p.spin

        if (p.y > canvas.height) {
          p.y = -10
          p.x = Math.random() * canvas.width
        }
      })
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="absolute inset-0 bg-[#140c10]">
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-900/10 to-transparent" />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}

function GridBackground() {
  return (
    <div className="absolute inset-0 bg-[#070b14]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#070b14]" />
    </div>
  )
}

function FogBackground() {
  return (
    <div className="absolute inset-0 bg-[#0a0f18] overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-gradient-radial from-slate-200/5 to-transparent blur-[80px] animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[60%] h-[60%] bg-gradient-radial from-white/5 to-transparent blur-[100px] animate-pulse" style={{ animationDuration: '15s' }} />
    </div>
  )
}

function DefaultBackground() {
  return (
    <div className="absolute inset-0">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[400px] bg-neon-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
    </div>
  )
}
