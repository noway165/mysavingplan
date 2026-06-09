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
      {colorTheme === "slate" && <MeteorShowerBackground />}
      {colorTheme === "whitesmoke" && <DynamicSmokeBackground />}
      {colorTheme === "default" && <CyberCircuitBackground />}
      {colorTheme === "spring" && <SpringBackground />}
      {colorTheme === "summer" && <SummerBackground />}
      {colorTheme === "autumn" && <AutumnBackground />}
      {colorTheme === "winter" && <WinterBackground />}
      {colorTheme === "vietnam" && <VietnamBackground />}
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
      ctx.fillStyle = "rgba(10, 10, 26, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#4ade80"
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

function MeteorShowerBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const meteors: { x: number, y: number, length: number, speed: number, opacity: number }[] = []

    const createMeteor = () => {
      meteors.push({
        x: Math.random() * canvas.width * 1.5,
        y: -50,
        length: Math.random() * 100 + 50,
        speed: Math.random() * 15 + 10,
        opacity: Math.random() * 0.8 + 0.2
      })
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.fillStyle = "rgba(10, 15, 24, 0.3)" // Trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (Math.random() < 0.1) createMeteor()

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i]
        
        ctx.beginPath()
        const gradient = ctx.createLinearGradient(m.x, m.y, m.x - m.length, m.y + m.length)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${m.opacity})`)
        gradient.addColorStop(1, `rgba(148, 163, 184, 0)`)
        
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.moveTo(m.x, m.y)
        ctx.lineTo(m.x - m.length, m.y + m.length)
        ctx.stroke()

        m.x -= m.speed
        m.y += m.speed

        if (m.y > canvas.height + m.length) {
          meteors.splice(i, 1)
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
    <div className="absolute inset-0 bg-[#0a0f18]">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}

function DynamicSmokeBackground() {
  return (
    <div className="absolute inset-0 bg-[#0a0f18] overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-gradient-radial from-slate-400/10 to-transparent blur-[120px] animate-[pulse_10s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-gradient-radial from-white/10 to-transparent blur-[150px] animate-[pulse_15s_ease-in-out_infinite]" />
      <div className="absolute top-1/2 left-1/2 w-[80%] h-[80%] -translate-x-1/2 -translate-y-1/2 bg-gradient-radial from-gray-500/5 to-transparent blur-[100px] animate-[pulse_20s_ease-in-out_infinite]" />
    </div>
  )
}

function CyberCircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: { x: number, y: number, vx: number, vy: number, life: number, maxLife: number }[] = []
    
    const createParticle = () => {
      const isHorizontal = Math.random() > 0.5
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: isHorizontal ? (Math.random() > 0.5 ? 2 : -2) : 0,
        vy: !isHorizontal ? (Math.random() > 0.5 ? 2 : -2) : 0,
        life: 0,
        maxLife: Math.random() * 100 + 50
      })
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (Math.random() < 0.2) createParticle()

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        
        ctx.fillStyle = `rgba(251, 191, 36, ${1 - p.life / p.maxLife})` // Amber glow
        ctx.fillRect(p.x, p.y, 2, 2)
        
        // 5% chance to change direction 90 degrees
        if (Math.random() < 0.05) {
          if (p.vx !== 0) {
            p.vy = Math.random() > 0.5 ? 2 : -2
            p.vx = 0
          } else {
            p.vx = Math.random() > 0.5 ? 2 : -2
            p.vy = 0
          }
        }

        p.x += p.vx
        p.y += p.vy
        p.life++

        if (p.life >= p.maxLife) {
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
    <div className="absolute inset-0 bg-[#0a0a0a]">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-70" />
    </div>
  )
}

function SpringBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const spores: { x: number, y: number, radius: number, speedX: number, speedY: number, angle: number }[] = []
    for (let i = 0; i < 60; i++) {
      spores.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * -1 - 0.5,
        angle: Math.random() * 360
      })
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      spores.forEach(s => {
        s.x += s.speedX + Math.sin(s.angle) * 0.5
        s.y += s.speedY
        s.angle += 0.05

        if (s.y < -10) {
          s.y = canvas.height + 10
          s.x = Math.random() * canvas.width
        }

        ctx.beginPath()
        ctx.fillStyle = "rgba(236, 72, 153, 0.6)" // Pink
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx.fill()
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
    <div className="absolute inset-0 bg-gradient-to-br from-[#100c14] to-[#0a1510]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-900/10 via-transparent to-transparent" />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}

function SummerBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const fireflies: { x: number, y: number, size: number, vx: number, vy: number, life: number, phase: number }[] = []
    for (let i = 0; i < 80; i++) {
      fireflies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        vx: Math.random() * 1 - 0.5,
        vy: Math.random() * 1 - 0.5,
        life: Math.random() * Math.PI * 2,
        phase: Math.random() * 0.05 + 0.01
      })
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      fireflies.forEach(f => {
        f.x += f.vx
        f.y += f.vy
        f.life += f.phase

        if (f.x < 0 || f.x > canvas.width) f.vx *= -1
        if (f.y < 0 || f.y > canvas.height) f.vy *= -1

        const opacity = (Math.sin(f.life) + 1) / 2
        
        ctx.beginPath()
        ctx.fillStyle = `rgba(234, 179, 8, ${opacity})` // Yellow
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2)
        ctx.fill()
        
        // Glow
        const gradient = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * 4)
        gradient.addColorStop(0, `rgba(234, 179, 8, ${opacity * 0.3})`)
        gradient.addColorStop(1, "rgba(234, 179, 8, 0)")
        ctx.fillStyle = gradient
        ctx.arc(f.x, f.y, f.size * 4, 0, Math.PI * 2)
        ctx.fill()
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
    <div className="absolute inset-0 bg-[#081218]">
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/10 to-transparent" />
      <canvas ref={canvasRef} className="absolute inset-0 mix-blend-screen" />
    </div>
  )
}

function AutumnBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const leaves: { x: number, y: number, size: number, speedY: number, speedX: number, angle: number, spin: number, color: string }[] = []
    const colors = ["#f97316", "#ea580c", "#ca8a04", "#b45309"]
    
    for (let i = 0; i < 40; i++) {
      leaves.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 8 + 4,
        speedY: Math.random() * 1.5 + 0.5,
        speedX: Math.random() * 2 - 1,
        angle: Math.random() * 360,
        spin: Math.random() * 3 - 1.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      leaves.forEach(l => {
        ctx.save()
        ctx.translate(l.x, l.y)
        ctx.rotate(l.angle * Math.PI / 180)
        
        ctx.beginPath()
        ctx.fillStyle = l.color
        // draw simple leaf shape
        ctx.moveTo(0, -l.size)
        ctx.lineTo(l.size/2, 0)
        ctx.lineTo(0, l.size)
        ctx.lineTo(-l.size/2, 0)
        ctx.fill()
        
        ctx.restore()

        l.y += l.speedY
        l.x += l.speedX + Math.sin(l.angle * Math.PI / 180) * 0.5
        l.angle += l.spin

        if (l.y > canvas.height) {
          l.y = -20
          l.x = Math.random() * canvas.width
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
    <div className="absolute inset-0 bg-[#120a05]">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/10 to-transparent" />
      <canvas ref={canvasRef} className="absolute inset-0 opacity-60" />
    </div>
  )
}

function WinterBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const flakes: { x: number, y: number, radius: number, speed: number, wind: number }[] = []
    for (let i = 0; i < 150; i++) {
      flakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        speed: Math.random() * 1 + 0.5,
        wind: Math.random() * 2 * Math.PI
      })
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"

      flakes.forEach(f => {
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2)
        ctx.fill()
        
        f.y += f.speed
        f.wind += 0.01
        f.x += Math.sin(f.wind) * 0.5

        if (f.y > canvas.height) {
          f.y = -5
          f.x = Math.random() * canvas.width
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
    <div className="absolute inset-0 bg-[#080d14]">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent" />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}

function VietnamBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const lanterns: { x: number, y: number, size: number, speedY: number, speedX: number, sway: number }[] = []
    
    for (let i = 0; i < 25; i++) {
      lanterns.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 10 + 5,
        speedY: Math.random() * -0.5 - 0.2,
        speedX: Math.random() * 0.2 - 0.1,
        sway: Math.random() * Math.PI * 2
      })
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      lanterns.forEach(l => {
        l.x += l.speedX + Math.sin(l.sway) * 0.2
        l.y += l.speedY
        l.sway += 0.02

        if (l.y < -30) {
          l.y = canvas.height + 30
          l.x = Math.random() * canvas.width
        }

        ctx.save()
        ctx.translate(l.x, l.y)
        
        // Lantern body
        ctx.beginPath()
        ctx.fillStyle = "#fbbf24" // Gold
        ctx.ellipse(0, 0, l.size, l.size * 1.5, 0, 0, Math.PI * 2)
        ctx.fill()
        
        // Glow
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, l.size * 3)
        gradient.addColorStop(0, "rgba(251, 191, 36, 0.4)")
        gradient.addColorStop(1, "rgba(251, 191, 36, 0)")
        ctx.fillStyle = gradient
        ctx.arc(0, 0, l.size * 3, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.restore()
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
    <div className="absolute inset-0 bg-[#1a0505]">
      <div className="absolute inset-0 bg-gradient-to-t from-red-900/30 to-[#1a0505]" />
      <canvas ref={canvasRef} className="absolute inset-0 mix-blend-screen" />
    </div>
  )
}
