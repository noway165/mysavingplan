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

    // Katakana + Latin + Digits for authenticity
    const chars = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('')
    const fontSize = 16
    const columns = Math.floor(canvas.width / fontSize) + 1
    
    // Array to store current Y position (in rows) for each column
    const drops: number[] = []
    for (let x = 0; x < columns; x++) {
      drops[x] = Math.random() * -100 // Start above screen with random offset
    }

    let animationFrameId: number;
    let lastDrawTime = 0;

    const draw = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(draw)
      if (timestamp - lastDrawTime < 50) return // Limit to ~20 FPS for Matrix effect
      lastDrawTime = timestamp

      // Create trailing effect using semi-transparent black
      ctx.fillStyle = "rgba(0, 5, 0, 0.15)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px monospace`
      ctx.textAlign = 'center'

      for (let i = 0; i < drops.length; i++) {
        // Only draw if within reasonable bounds to save performance
        if (drops[i] > -1) {
          const text = chars[Math.floor(Math.random() * chars.length)]
          
          // Previous character is bright green (drawn over next frame as tail)
          ctx.fillStyle = "#22c55e"
          ctx.shadowBlur = 0
          ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize + fontSize/2, (drops[i] - 1) * fontSize)

          // Head of the drop is white, glowing
          ctx.fillStyle = "#ffffff"
          ctx.shadowBlur = 8
          ctx.shadowColor = "#4ade80"
          ctx.fillText(text, i * fontSize + fontSize/2, drops[i] * fontSize)
        }

        // Reset drop to top randomly after it crosses screen
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
          drops[i] = 0
        }
        
        drops[i]++
      }
    }

    animationFrameId = requestAnimationFrame(draw)

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
    <div className="absolute inset-0 bg-[#000500]">
      <div className="absolute inset-0 bg-gradient-to-b from-green-900/10 to-transparent" />
      <canvas ref={canvasRef} className="absolute inset-0 mix-blend-screen" />
    </div>
  )
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

    // Logarithmic Spiral Galaxy
    const stars: { x: number, y: number, size: number, angle: number, dist: number, baseDist: number, color: string, alpha: number }[] = []
    const colors = ['#ffffff', '#fdf4ff', '#fbcfe8', '#a78bfa', '#60a5fa'] // White, pinkish, purple, blue
    
    const numStars = 800
    const arms = 3
    const armSpread = 0.5
    const maxRadius = Math.max(canvas.width, canvas.height) * 0.8
    
    for (let i = 0; i < numStars; i++) {
      // Golden ratio spiral distribution
      const dist = Math.pow(Math.random(), 2) * maxRadius // More stars near center
      const armIndex = i % arms
      const baseAngle = (armIndex * Math.PI * 2) / arms
      
      // Logarithmic spiral angle offset
      const spiralAngle = dist * 0.005 
      
      // Add random spread around the arm
      const spread = (Math.random() - 0.5) * armSpread * (1 + dist * 0.01)
      
      const angle = baseAngle + spiralAngle + spread

      stars.push({
        x: 0, y: 0,
        size: Math.random() * 1.5 + (dist < 50 ? 1 : 0),
        angle: angle,
        dist: dist,
        baseDist: dist,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.5
      })
    }

    const meteors: { x: number, y: number, length: number, speed: number, angle: number, active: boolean }[] = []
    for(let i=0; i<2; i++) {
       meteors.push({ x: 0, y: 0, length: 0, speed: 0, angle: 0, active: false })
    }

    let animationFrameId: number;
    let rotation = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      
      rotation -= 0.0005 // Global rotation

      // Draw Center Glow / Black hole
      const centerGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 150)
      centerGlow.addColorStop(0, "rgba(255, 255, 255, 1)")
      centerGlow.addColorStop(0.1, "rgba(232, 121, 249, 0.8)") // Fuchsia
      centerGlow.addColorStop(0.4, "rgba(56, 189, 248, 0.2)") // Sky blue
      centerGlow.addColorStop(1, "rgba(0, 0, 0, 0)")
      
      ctx.fillStyle = centerGlow
      ctx.beginPath()
      ctx.arc(centerX, centerY, 150, 0, Math.PI * 2)
      ctx.fill()

      stars.forEach(star => {
        // Individual star rotation based on distance (Keplerian-ish)
        const currentAngle = star.angle + rotation * (1 + 100/(star.dist+10))
        
        star.x = centerX + Math.cos(currentAngle) * star.dist
        star.y = centerY + Math.sin(currentAngle) * star.dist * 0.6 // Tilt the galaxy slightly (elliptical)

        ctx.beginPath()
        ctx.fillStyle = star.color
        
        // Stars twinkle
        const alpha = star.alpha * (0.5 + Math.sin(Date.now() * 0.001 + star.dist) * 0.5)
        ctx.globalAlpha = Math.max(0.1, alpha * (1 - star.dist / maxRadius))
        
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
      })
      
      // Meteors
      ctx.globalAlpha = 1.0
      meteors.forEach(m => {
        if (!m.active && Math.random() < 0.005) {
          m.active = true
          m.x = Math.random() * canvas.width
          m.y = -50
          m.length = Math.random() * 100 + 50
          m.speed = Math.random() * 15 + 10
          m.angle = Math.PI / 4 + (Math.random() * 0.2 - 0.1)
        }
        
        if (m.active) {
          m.x += Math.cos(m.angle) * m.speed
          m.y += Math.sin(m.angle) * m.speed
          
          const grad = ctx.createLinearGradient(m.x, m.y, m.x - Math.cos(m.angle) * m.length, m.y - Math.sin(m.angle) * m.length)
          grad.addColorStop(0, "rgba(255, 255, 255, 1)")
          grad.addColorStop(1, "rgba(56, 189, 248, 0)")
          
          ctx.beginPath()
          ctx.strokeStyle = grad
          ctx.lineWidth = 2
          ctx.moveTo(m.x, m.y)
          ctx.lineTo(m.x - Math.cos(m.angle) * m.length, m.y - Math.sin(m.angle) * m.length)
          ctx.stroke()
          
          if (m.y > canvas.height + m.length || m.x > canvas.width + m.length) {
            m.active = false
          }
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
    <div className="absolute inset-0 bg-[#04010a]">
      {/* Background Deep Space */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#04010a] to-[#04010a]" />
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

    // Multi-layer fire and sparks
    const particles: { x: number, y: number, size: number, speedY: number, speedX: number, life: number, maxLife: number, type: 'flame' | 'spark' | 'smoke' }[] = []

    const createParticle = (type: 'flame' | 'spark' | 'smoke') => {
      let x = Math.random() * canvas.width;
      // Concentrate flames in the middle bottom
      if (type === 'flame') {
         x = canvas.width/2 + (Math.random() - 0.5) * canvas.width * 0.8;
      }
      
      particles.push({
        x,
        y: canvas.height + (type === 'spark' ? 10 : 50),
        size: type === 'flame' ? Math.random() * 40 + 20 : type === 'smoke' ? Math.random() * 60 + 40 : Math.random() * 3 + 1,
        speedY: type === 'spark' ? Math.random() * -5 - 2 : Math.random() * -2 - 1,
        speedX: Math.random() * 2 - 1,
        life: 0,
        maxLife: type === 'spark' ? Math.random() * 100 + 50 : Math.random() * 80 + 40,
        type
      })
    }

    let animationFrameId: number;

    const draw = () => {
      // Create trailing blur effect for flames
      ctx.fillStyle = "rgba(10, 5, 5, 0.3)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add new particles
      for(let i=0; i<3; i++) createParticle('flame');
      if (Math.random() < 0.4) createParticle('smoke');
      if (Math.random() < 0.6) createParticle('spark');

      // Sort so smoke is behind, then flame, then sparks
      particles.sort((a, b) => {
         const getZ = (t: string) => t === 'smoke' ? 0 : t === 'flame' ? 1 : 2;
         return getZ(a.type) - getZ(b.type);
      })

      ctx.globalCompositeOperation = 'lighter'

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        
        // Sway effect
        p.x += p.speedX + Math.sin(p.life * 0.05) * (p.type === 'smoke' ? 2 : 0.5)
        p.y += p.speedY
        p.life++
        
        // Shrink flames and smoke
        if (p.type !== 'spark') {
           p.size *= 0.96;
        }

        const opacity = Math.max(0, 1 - (p.life / p.maxLife))
        
        ctx.beginPath()
        if (p.type === 'flame') {
           const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(0.1, p.size))
           // Colors from white -> yellow -> orange -> red -> dark
           const progress = p.life / p.maxLife;
           if (progress < 0.2) {
             gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`)
             gradient.addColorStop(0.5, `rgba(255, 200, 0, ${opacity * 0.8})`)
           } else if (progress < 0.5) {
             gradient.addColorStop(0, `rgba(255, 150, 0, ${opacity})`)
           } else {
             gradient.addColorStop(0, `rgba(255, 50, 0, ${opacity})`)
           }
           gradient.addColorStop(1, `rgba(255, 0, 0, 0)`)
           ctx.fillStyle = gradient
           ctx.arc(p.x, p.y, Math.max(0.1, p.size), 0, Math.PI * 2)
           ctx.fill()
        } else if (p.type === 'spark') {
           ctx.fillStyle = `rgba(255, 200, 50, ${opacity})`
           ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
           ctx.fill()
        } else if (p.type === 'smoke') {
           ctx.globalCompositeOperation = 'source-over'
           const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(0.1, p.size))
           gradient.addColorStop(0, `rgba(50, 20, 20, ${opacity * 0.2})`)
           gradient.addColorStop(1, `rgba(0, 0, 0, 0)`)
           ctx.fillStyle = gradient
           ctx.arc(p.x, p.y, Math.max(0.1, p.size), 0, Math.PI * 2)
           ctx.fill()
           ctx.globalCompositeOperation = 'lighter'
        }

        if (p.life >= p.maxLife || p.size <= 0.2) {
          particles.splice(i, 1)
        }
      }
      ctx.globalCompositeOperation = 'source-over'
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
    <div className="absolute inset-0 bg-[#0a0202]">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-orange-950/40 via-transparent to-transparent pointer-events-none" />
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

    const meteors: { x: number, y: number, length: number, speed: number, opacity: number, thickness: number, color: string }[] = []
    const stars: { x: number, y: number, size: number, opacity: number, speed: number }[] = []

    // Pre-fill static stars
    for(let i=0; i<200; i++) {
       stars.push({
         x: Math.random() * canvas.width,
         y: Math.random() * canvas.height,
         size: Math.random() * 1.5,
         opacity: Math.random(),
         speed: Math.random() * 0.02
       })
    }

    const colors = ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#ffffff']

    const createMeteor = () => {
      meteors.push({
        x: Math.random() * canvas.width * 2, // Allow spawning further right to cross screen
        y: -100,
        length: Math.random() * 300 + 100, // Much longer trails
        speed: Math.random() * 20 + 20, // Very fast
        opacity: 1,
        thickness: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }

    let animationFrameId: number;

    const draw = () => {
      // Dark deep space background
      ctx.fillStyle = "#020617" 
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      stars.forEach(s => {
         s.opacity += s.speed
         if (s.opacity > 1 || s.opacity < 0) s.speed *= -1
         ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(s.opacity) * 0.8})`
         ctx.beginPath()
         ctx.arc(s.x, s.y, s.size, 0, Math.PI*2)
         ctx.fill()
      })

      ctx.globalCompositeOperation = 'screen'

      if (Math.random() < 0.05) createMeteor() // More frequent

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i]
        
        ctx.beginPath()
        // Bright glowing head
        const headGradient = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.thickness * 4)
        headGradient.addColorStop(0, "#ffffff")
        headGradient.addColorStop(0.2, m.color)
        headGradient.addColorStop(1, "rgba(0,0,0,0)")
        
        ctx.fillStyle = headGradient
        ctx.arc(m.x, m.y, m.thickness * 4, 0, Math.PI*2)
        ctx.fill()

        // Long tail
        const tailGradient = ctx.createLinearGradient(m.x, m.y, m.x - m.length, m.y + m.length)
        tailGradient.addColorStop(0, m.color)
        tailGradient.addColorStop(1, `rgba(0,0,0,0)`)
        
        ctx.strokeStyle = tailGradient
        ctx.lineWidth = m.thickness
        ctx.lineCap = "round"
        ctx.beginPath()
        ctx.moveTo(m.x, m.y)
        ctx.lineTo(m.x - m.length, m.y + m.length)
        ctx.stroke()

        m.x -= m.speed
        m.y += m.speed
        m.opacity -= 0.01

        if (m.y > canvas.height + m.length || m.opacity <= 0) {
          meteors.splice(i, 1)
        }
      }
      
      ctx.globalCompositeOperation = 'source-over'
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
    <div className="absolute inset-0 bg-[#020617]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
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

    // Cyberpunk circuitry nodes and paths
    const particles: { x: number, y: number, vx: number, vy: number, life: number, maxLife: number, trail: {x:number, y:number}[] }[] = []
    
    const gridSize = 40; // Circuit grid size

    const snapToGrid = (val: number) => Math.round(val / gridSize) * gridSize;

    const createParticle = () => {
      const isHorizontal = Math.random() > 0.5
      const speed = 2
      particles.push({
        x: snapToGrid(Math.random() * canvas.width),
        y: snapToGrid(Math.random() * canvas.height),
        vx: isHorizontal ? (Math.random() > 0.5 ? speed : -speed) : 0,
        vy: !isHorizontal ? (Math.random() > 0.5 ? speed : -speed) : 0,
        life: 0,
        maxLife: Math.random() * 200 + 100,
        trail: []
      })
    }

    let animationFrameId: number;

    const draw = () => {
      // Trail fade effect
      ctx.fillStyle = "rgba(10, 10, 15, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (Math.random() < 0.1) createParticle()

      ctx.lineCap = "square"
      ctx.lineJoin = "miter"

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        
        // Track trail
        p.trail.push({x: p.x, y: p.y})
        if (p.trail.length > 50) p.trail.shift() // Limit trail length

        // Draw trail
        if (p.trail.length > 1) {
           ctx.beginPath()
           ctx.moveTo(p.trail[0].x, p.trail[0].y)
           for (let j=1; j<p.trail.length; j++) {
             ctx.lineTo(p.trail[j].x, p.trail[j].y)
           }
           ctx.strokeStyle = `rgba(251, 191, 36, ${Math.max(0, 1 - p.life / p.maxLife)})` // Amber
           ctx.lineWidth = 2
           ctx.stroke()
        }

        // Draw node head
        ctx.fillStyle = "#ffffff"
        ctx.shadowBlur = 10
        ctx.shadowColor = "#fbbf24"
        ctx.beginPath()
        ctx.arc(p.x, p.y, 3, 0, Math.PI*2)
        ctx.fill()
        ctx.shadowBlur = 0
        
        // Change direction on grid intersections
        if (p.x % gridSize === 0 && p.y % gridSize === 0) {
           // 20% chance to turn 90 degrees
           if (Math.random() < 0.2) {
             const speed = 2
             if (p.vx !== 0) {
               p.vy = Math.random() > 0.5 ? speed : -speed
               p.vx = 0
             } else {
               p.vx = Math.random() > 0.5 ? speed : -speed
               p.vy = 0
             }
           }
        }

        p.x += p.vx
        p.y += p.vy
        p.life++

        if (p.life >= p.maxLife || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
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
    <div className="absolute inset-0 bg-[#0a0a0f]">
      {/* Circuit grid background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <canvas ref={canvasRef} className="absolute inset-0 opacity-80 mix-blend-screen" />
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

    // 5-petal flowers with better bezier curves
    const flowers: { x: number, y: number, size: number, speedY: number, speedX: number, color: string, sway: number, rotSpeed: number, type: 'apricot' | 'peach' }[] = []
    
    for (let i = 0; i < 30; i++) {
      const type = Math.random() > 0.5 ? 'apricot' : 'peach';
      flowers.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 8 + 6,
        speedY: Math.random() * 1.5 + 0.5,
        speedX: Math.random() * 1.5 - 0.75,
        color: type === 'apricot' ? '#fbbf24' : '#fbcfe8', // Gold vs Pink
        sway: Math.random() * Math.PI * 2,
        rotSpeed: Math.random() * 0.05 - 0.025,
        type
      })
    }

    // Glowing lanterns
    const lanterns: { x: number, y: number, size: number, sway: number, swaySpeed: number }[] = []
    for(let i=0; i<5; i++) {
       lanterns.push({
          x: (i + 0.5) * (canvas.width / 5) + (Math.random()*50 - 25),
          y: Math.random() * canvas.height * 0.4 + 50,
          size: Math.random() * 15 + 20,
          sway: Math.random() * Math.PI * 2,
          swaySpeed: Math.random() * 0.02 + 0.01
       })
    }

    // Gold dust
    const dust: { x: number, y: number, size: number, speedY: number, sway: number }[] = []
    for (let i = 0; i < 50; i++) {
      dust.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedY: Math.random() * -1 - 0.5,
        sway: Math.random() * Math.PI * 2
      })
    }

    let animationFrameId: number;

    const drawFlower = (ctx: CanvasRenderingContext2D, size: number, color: string, type: string) => {
      ctx.fillStyle = color
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.rotate((Math.PI * 2) / 5)
        
        // Beautiful petal shape
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(size*1.5, size*0.5, size*1.5, -size*0.5, 0, 0)
        ctx.fill()
      }
      // Center
      ctx.fillStyle = type === 'apricot' ? '#ea580c' : '#be123c' // Dark orange or dark red center
      ctx.beginPath()
      ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2)
      ctx.fill()
      
      // Stamen dots
      ctx.fillStyle = '#ffffff'
      for(let i=0; i<5; i++) {
        ctx.beginPath()
        ctx.rotate((Math.PI * 2) / 5)
        ctx.arc(size*0.4, 0, 1, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const drawLantern = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, sway: number) => {
      ctx.save()
      ctx.translate(x, y)
      // Pendulum sway from an invisible string above
      ctx.rotate(Math.sin(sway) * 0.1)

      // Glow
      const glow = ctx.createRadialGradient(0, 0, size*0.5, 0, 0, size*3)
      glow.addColorStop(0, "rgba(239, 68, 68, 0.4)") // Red glow
      glow.addColorStop(1, "rgba(239, 68, 68, 0)")
      ctx.fillStyle = glow
      ctx.fillRect(-size*3, -size*3, size*6, size*6)

      // Lantern body
      ctx.fillStyle = "#ef4444" // Red
      ctx.beginPath()
      ctx.ellipse(0, 0, size*0.8, size, 0, 0, Math.PI*2)
      ctx.fill()
      
      // Lines
      ctx.strokeStyle = "rgba(127, 29, 29, 0.5)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.ellipse(0, 0, size*0.4, size, 0, 0, Math.PI*2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, -size)
      ctx.lineTo(0, size)
      ctx.stroke()

      // Top and bottom caps (Gold)
      ctx.fillStyle = "#fbbf24"
      ctx.fillRect(-size*0.4, -size-size*0.1, size*0.8, size*0.2)
      ctx.fillRect(-size*0.4, size-size*0.1, size*0.8, size*0.2)

      // Tassel
      ctx.strokeStyle = "#fbbf24"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, size+size*0.1)
      ctx.lineTo(0, size+size*0.8)
      ctx.stroke()

      ctx.restore()
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      lanterns.forEach(l => {
         l.sway += l.swaySpeed
         drawLantern(ctx, l.x, l.y, l.size, l.sway)
      })

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
        drawFlower(ctx, p.size, p.color, p.type)
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
    <div className="absolute inset-0 bg-gradient-to-b from-[#2a0606] to-[#450a0a]">
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
