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
      {colorTheme === "whitesmoke" && <HalloweenBackground />}
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
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars: { x: number, y: number, radius: number, angle: number, dist: number, speed: number, color: string }[] = []
    const colors = ['#ffffff', '#fdf4ff', '#e879f9', '#38bdf8', '#818cf8']
    
    for (let i = 0; i < 400; i++) {
      const dist = Math.random() * (canvas.width > canvas.height ? canvas.width : canvas.height)
      stars.push({
        x: 0,
        y: 0,
        radius: Math.random() * 2 + (dist < 100 ? 1 : 0),
        angle: Math.random() * Math.PI * 2,
        dist: dist,
        speed: (Math.random() * 0.002 + 0.001) * (dist < 200 ? 1.5 : 0.5),
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      stars.forEach(star => {
        star.angle += star.speed
        
        // Spiral effect
        const currentDist = star.dist + Math.sin(star.angle * 3) * 20

        star.x = centerX + Math.cos(star.angle) * currentDist
        star.y = centerY + Math.sin(star.angle) * currentDist

        ctx.beginPath()
        ctx.fillStyle = star.color
        
        // Closer to center = brighter
        ctx.globalAlpha = Math.max(0.1, 1 - (currentDist / (canvas.width / 1.5)))
        
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()
        
        // Occasional twinkle
        if (Math.random() < 0.01) {
          const g = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 4)
          g.addColorStop(0, "rgba(255,255,255,0.8)")
          g.addColorStop(1, "rgba(255,255,255,0)")
          ctx.fillStyle = g
          ctx.arc(star.x, star.y, star.radius * 4, 0, Math.PI * 2)
          ctx.fill()
        }
      })
      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="absolute inset-0 bg-[#090514]">
      {/* Huge Nebulas */}
      <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-fuchsia-900/20 blur-[120px] mix-blend-screen animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-900/20 blur-[150px] mix-blend-screen animate-[pulse_10s_ease-in-out_infinite_reverse]" />
      <canvas ref={canvasRef} className="absolute inset-0" />
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

function HalloweenBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const bats: { x: number, y: number, size: number, speedX: number, speedY: number, flap: number, flapSpeed: number }[] = []
    for (let i = 0; i < 20; i++) {
      bats.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.7,
        size: Math.random() * 30 + 15, // Bigger bats
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 1 - 0.5,
        flap: Math.random() * Math.PI * 2,
        flapSpeed: Math.random() * 0.15 + 0.1
      })
    }
    
    // Floating embers instead of fog
    const embers: { x: number, y: number, size: number, speedY: number, sway: number }[] = []
    for (let i = 0; i < 40; i++) {
      embers.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 1,
        speedY: Math.random() * -1.5 - 0.5,
        sway: Math.random() * Math.PI * 2
      })
    }

    let animationFrameId: number;

    const drawBat = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, flapOffset: number) => {
      ctx.save()
      ctx.translate(x, y)
      
      // Draw orange glow behind bat
      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2)
      glow.addColorStop(0, "rgba(249, 115, 22, 0.6)")
      glow.addColorStop(1, "rgba(249, 115, 22, 0)")
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(0, 0, size * 2, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#0f172a' // Dark slate
      ctx.beginPath()
      ctx.ellipse(0, 0, size * 0.2, size * 0.4, 0, 0, Math.PI * 2)
      ctx.fill()
      
      const wingY = Math.sin(flapOffset) * size * 0.5
      ctx.beginPath()
      ctx.moveTo(0, -size * 0.2)
      ctx.quadraticCurveTo(size, wingY - size * 0.5, size * 1.5, wingY)
      ctx.quadraticCurveTo(size, wingY + size * 0.2, size * 0.5, wingY + size * 0.1)
      ctx.quadraticCurveTo(size * 0.2, wingY + size * 0.3, 0, size * 0.2)
      ctx.quadraticCurveTo(-size * 0.2, wingY + size * 0.3, -size * 0.5, wingY + size * 0.1)
      ctx.quadraticCurveTo(-size, wingY + size * 0.2, -size * 1.5, wingY)
      ctx.quadraticCurveTo(-size, wingY - size * 0.5, 0, -size * 0.2)
      ctx.fill()
      ctx.restore()
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw Giant Moon
      const moonX = canvas.width * 0.8
      const moonY = canvas.height * 0.3
      const moonRadius = canvas.width > 800 ? 150 : 80
      
      const moonGlow = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.5, moonX, moonY, moonRadius * 3)
      moonGlow.addColorStop(0, "rgba(249, 115, 22, 0.4)")
      moonGlow.addColorStop(1, "rgba(249, 115, 22, 0)")
      ctx.fillStyle = moonGlow
      ctx.beginPath()
      ctx.arc(moonX, moonY, moonRadius * 3, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#ffedd5" // Pale orange moon
      ctx.beginPath()
      ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2)
      ctx.fill()
      
      // Embers
      embers.forEach(e => {
        e.y += e.speedY
        e.x += Math.sin(e.sway) * 1
        e.sway += 0.05
        if (e.y < -10) {
          e.y = canvas.height + 10
          e.x = Math.random() * canvas.width
        }
        ctx.beginPath()
        ctx.fillStyle = "rgba(249, 115, 22, 0.8)"
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2)
        ctx.fill()
      })

      bats.forEach(b => {
        b.x += b.speedX
        b.y += b.speedY + Math.sin(b.flap) * 2
        b.flap += b.flapSpeed
        
        if (b.x > canvas.width + b.size * 2) b.x = -b.size * 2
        if (b.x < -b.size * 2) b.x = canvas.width + b.size * 2
        if (b.y > canvas.height + b.size * 2) b.y = -b.size * 2
        if (b.y < -b.size * 2) b.y = canvas.height + b.size * 2
        
        drawBat(ctx, b.x, b.y, b.size, b.flap)
      })

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="absolute inset-0 bg-[#1e1b4b]">
      <canvas ref={canvasRef} className="absolute inset-0 mix-blend-screen" />
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
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // 5-petal flowers
    const flowers: { x: number, y: number, size: number, speedY: number, speedX: number, color: string, sway: number, rotSpeed: number }[] = []
    
    // Tet theme: Red, Gold/Yellow, Pink
    const colors = ['#facc15', '#fde047', '#fbcfe8', '#fecdd3', '#fda4af'] 
    
    for (let i = 0; i < 40; i++) {
      flowers.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 8 + 4,
        speedY: Math.random() * 1.5 + 0.5,
        speedX: Math.random() * 1.5 - 0.75,
        color: colors[Math.floor(Math.random() * colors.length)],
        sway: Math.random() * Math.PI * 2,
        rotSpeed: Math.random() * 0.05 - 0.025
      })
    }

    // Gold dust
    const dust: { x: number, y: number, size: number, speedY: number, sway: number }[] = []
    for (let i = 0; i < 60; i++) {
      dust.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedY: Math.random() * -1 - 0.5,
        sway: Math.random() * Math.PI * 2
      })
    }

    let animationFrameId: number;

    const drawFlower = (ctx: CanvasRenderingContext2D, size: number, color: string) => {
      ctx.fillStyle = color
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.rotate((Math.PI * 2) / 5)
        ctx.ellipse(0, size, size * 0.5, size, 0, 0, Math.PI * 2)
        ctx.fill()
      }
      // Center
      ctx.fillStyle = '#ea580c' // Orange center
      ctx.beginPath()
      ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2)
      ctx.fill()
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      dust.forEach(d => {
        d.y += d.speedY
        d.x += Math.sin(d.sway) * 0.5
        d.sway += 0.02
        if (d.y < -10) {
          d.y = canvas.height + 10
          d.x = Math.random() * canvas.width
        }
        ctx.fillStyle = "rgba(250, 204, 21, 0.6)" // Yellow
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2)
        ctx.fill()
      })

      flowers.forEach(p => {
        p.x += p.speedX + Math.sin(p.sway) * 1
        p.y += p.speedY
        p.sway += p.rotSpeed

        if (p.y > canvas.height + 20) {
          p.y = -20
          p.x = Math.random() * canvas.width
        }

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.sway)
        drawFlower(ctx, p.size, p.color)
        ctx.restore()
      })

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#450a0a] to-[#7f1d1d]">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}

function SummerBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const fireflies: { x: number, y: number, size: number, speedX: number, speedY: number, alpha: number, alphaChange: number, layer: number }[] = []
    
    for (let i = 0; i < 100; i++) {
      const layer = Math.random() > 0.8 ? 1 : Math.random() > 0.4 ? 2 : 3 // 1: Fore, 2: Mid, 3: Back
      const sizeMultiplier = layer === 1 ? 3 : layer === 2 ? 1.5 : 0.8
      const speedMultiplier = layer === 1 ? 1.5 : layer === 2 ? 0.8 : 0.4
      
      fireflies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: (Math.random() * 3 + 1) * sizeMultiplier,
        speedX: (Math.random() * 1 - 0.5) * speedMultiplier,
        speedY: (Math.random() * 1 - 0.5) * speedMultiplier,
        alpha: Math.random(),
        alphaChange: (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
        layer: layer
      })
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      fireflies.forEach(f => {
        f.x += f.speedX
        f.y += f.speedY
        f.alpha += f.alphaChange
        
        if (f.alpha <= 0.1 || f.alpha >= 1) f.alphaChange *= -1
        if (f.x < 0 || f.x > canvas.width) f.speedX *= -1
        if (f.y < 0 || f.y > canvas.height) f.speedY *= -1

        ctx.save()
        ctx.globalAlpha = f.layer === 1 ? 0.5 : f.layer === 2 ? 0.8 : 1.0
        
        ctx.beginPath()
        ctx.fillStyle = `rgba(234, 179, 8, ${f.alpha})` // Yellow
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2)
        ctx.fill()
        
        // Glow
        const gradient = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size * (f.layer === 1 ? 6 : 4))
        gradient.addColorStop(0, `rgba(234, 179, 8, ${f.alpha * 0.5})`)
        gradient.addColorStop(1, "rgba(234, 179, 8, 0)")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.size * (f.layer === 1 ? 6 : 4), 0, Math.PI * 2)
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
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="absolute inset-0 bg-[#081218]">
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-transparent" />
      <canvas ref={canvasRef} className="absolute inset-0 mix-blend-screen" />
    </div>
  )
}

function AutumnBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const leaves: { x: number, y: number, size: number, speedY: number, speedX: number, rotX: number, rotY: number, rotZ: number, rotSpeedX: number, rotSpeedY: number, rotSpeedZ: number, color: string }[] = []
    
    const colors = ['#f97316', '#ea580c', '#c2410c', '#f59e0b', '#fbbf24'] // Orange, Dark Orange, Amber
    
    for (let i = 0; i < 40; i++) {
      leaves.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 15 + 10,
        speedY: Math.random() * 1 + 1,
        speedX: Math.random() * 2 - 1,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        rotSpeedX: Math.random() * 0.05 + 0.02,
        rotSpeedY: Math.random() * 0.05 + 0.02,
        rotSpeedZ: Math.random() * 0.02 + 0.01,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }

    const drawLeaf = (ctx: CanvasRenderingContext2D, size: number, color: string) => {
      ctx.fillStyle = color
      ctx.beginPath()
      // A simple maple/autumn leaf shape using arcs and curves
      ctx.moveTo(0, -size)
      ctx.quadraticCurveTo(size * 0.5, -size * 0.5, size, 0)
      ctx.quadraticCurveTo(size * 0.5, size * 0.5, 0, size)
      ctx.quadraticCurveTo(-size * 0.5, size * 0.5, -size, 0)
      ctx.quadraticCurveTo(-size * 0.5, -size * 0.5, 0, -size)
      ctx.fill()
      
      // Stem
      ctx.strokeStyle = 'rgba(0,0,0,0.2)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, size * 0.5)
      ctx.lineTo(0, size * 1.5)
      ctx.stroke()
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      leaves.forEach(l => {
        l.x += l.speedX
        l.y += l.speedY
        l.rotX += l.rotSpeedX
        l.rotY += l.rotSpeedY
        l.rotZ += l.rotSpeedZ
        
        // Sway in wind
        l.x += Math.sin(l.rotZ) * 1.5

        if (l.y > canvas.height + 30) {
          l.y = -30
          l.x = Math.random() * canvas.width
        }

        ctx.save()
        ctx.translate(l.x, l.y)
        
        // 3D Rotation effect using scaling
        const scaleX = Math.cos(l.rotY)
        const scaleY = Math.cos(l.rotX)
        
        ctx.rotate(l.rotZ)
        ctx.scale(scaleX, scaleY)
        
        // Ensure color isn't completely flat when facing away
        const isBack = scaleX * scaleY < 0
        ctx.globalAlpha = isBack ? 0.7 : 1.0
        
        drawLeaf(ctx, l.size, l.color)
        
        ctx.restore()
      })
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="absolute inset-0 bg-[#120a05]">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-transparent" />
      <canvas ref={canvasRef} className="absolute inset-0 opacity-80" />
    </div>
  )
}

function WinterBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const snowflakes: { x: number, y: number, size: number, speedY: number, sway: number, layer: number }[] = []
    
    for (let i = 0; i < 200; i++) {
      const layer = Math.random() > 0.9 ? 1 : Math.random() > 0.5 ? 2 : 3 
      const sizeMultiplier = layer === 1 ? 4 : layer === 2 ? 2 : 1
      const speedMultiplier = layer === 1 ? 2.5 : layer === 2 ? 1.2 : 0.5
      
      snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: (Math.random() * 2 + 1) * sizeMultiplier,
        speedY: (Math.random() * 1 + 1) * speedMultiplier,
        sway: Math.random() * Math.PI * 2,
        layer: layer
      })
    }

    let animationFrameId: number;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      time += 0.005;
      const wind = Math.sin(time) * 1.2

      snowflakes.forEach(s => {
        const windEffect = s.layer === 1 ? wind * 2 : s.layer === 2 ? wind : wind * 0.5
        
        s.x += Math.sin(s.sway) * 0.3 + windEffect
        s.y += s.speedY
        s.sway += 0.015

        if (s.y > canvas.height + 10) {
          s.y = -10
          s.x = Math.random() * canvas.width
        }
        if (s.x > canvas.width + 10) s.x = -10
        if (s.x < -10) s.x = canvas.width + 10

        ctx.save()
        if (s.layer === 1) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
        } else if (s.layer === 2) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 1.0)'
        }

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
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
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
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

    const stars: { x: number, y: number, size: number, speedY: number, speedX: number, sway: number, rot: number }[] = []
    
    for (let i = 0; i < 25; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 8 + 4,
        speedY: Math.random() * -0.5 - 0.2,
        speedX: Math.random() * 0.2 - 0.1,
        sway: Math.random() * Math.PI * 2,
        rot: Math.random() * Math.PI * 2
      })
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      stars.forEach(s => {
        s.x += s.speedX + Math.sin(s.sway) * 0.2
        s.y += s.speedY
        s.sway += 0.02
        s.rot += 0.01

        if (s.y < -30) {
          s.y = canvas.height + 30
          s.x = Math.random() * canvas.width
        }

        ctx.save()
        ctx.translate(s.x, s.y)
        ctx.rotate(s.rot)
        
        // Draw 5-pointed star
        ctx.beginPath()
        for (let j = 0; j < 5; j++) {
          ctx.lineTo(Math.cos((18 + j * 72) * Math.PI / 180) * s.size,
                     -Math.sin((18 + j * 72) * Math.PI / 180) * s.size)
          ctx.lineTo(Math.cos((54 + j * 72) * Math.PI / 180) * (s.size / 2.5),
                     -Math.sin((54 + j * 72) * Math.PI / 180) * (s.size / 2.5))
        }
        ctx.closePath()
        
        ctx.fillStyle = "#fbbf24" // Gold
        ctx.fill()
        
        // Glow
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, s.size * 4)
        gradient.addColorStop(0, "rgba(251, 191, 36, 0.5)")
        gradient.addColorStop(1, "rgba(251, 191, 36, 0)")
        ctx.fillStyle = gradient
        ctx.arc(0, 0, s.size * 4, 0, Math.PI * 2)
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
