"use client"

import { useEffect, useRef } from "react"
import { useSettings } from "@/context/SettingsContext"

export function ThemeBackground() {
  const { colorTheme } = useSettings()

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {colorTheme === "limegreen" && <MatrixBackground />}
      {colorTheme === "amethyst" && <GalaxyBackground />}
      {colorTheme === "worldcup" && <WorldCupBackground />}
      {colorTheme === "portugal" && <PortugalBackground />}
      {colorTheme === "pastelpink" && <SakuraBackground />}
      
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

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const petals: { x: number, y: number, size: number, speedY: number, speedX: number, angle: number, spin: number, opacity: number }[] = []
    
    for (let i = 0; i < 80; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 4,
        speedY: Math.random() * 1.5 + 0.5,
        speedX: Math.random() * 2 - 1,
        angle: Math.random() * 360,
        spin: (Math.random() * 2 - 1) * 2,
        opacity: Math.random() * 0.6 + 0.3
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      petals.forEach(p => {
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle * Math.PI / 180)
        
        // Draw elegant sakura petal
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(p.size, -p.size, p.size * 2, p.size / 2, 0, p.size * 1.5)
        ctx.bezierCurveTo(-p.size * 2, p.size / 2, -p.size, -p.size, 0, 0)
        
        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(255, 182, 193, 0.8)";
        
        const grad = ctx.createLinearGradient(0, -p.size, 0, p.size * 1.5)
        grad.addColorStop(0, `rgba(255, 182, 193, ${p.opacity})`)
        grad.addColorStop(1, `rgba(255, 240, 245, ${p.opacity * 0.5})`)
        ctx.fillStyle = grad
        ctx.fill()
        
        ctx.restore()

        p.y += p.speedY
        p.x += p.speedX + Math.sin(p.angle * Math.PI / 180) * 0.5 // drifting effect
        p.angle += p.spin

        if (p.y > height + p.size * 2 || p.x > width + p.size * 2 || p.x < -p.size * 2) {
          p.y = -p.size * 2
          p.x = Math.random() * width
        }
      })
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="absolute inset-0 bg-[#2a0814]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#4a1525]/40 to-transparent" />
      <canvas ref={canvasRef} className="absolute inset-0 mix-blend-screen" />
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

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const nodes: { x: number, y: number, connections: number[] }[] = []
    const particles: { x: number, y: number, target: number, speed: number, progress: number, currentNode: number }[] = []
    
    // Create grid of nodes
    const cols = Math.floor(width / 80);
    const rows = Math.floor(height / 80);
    
    for (let i = 0; i < cols * rows; i++) {
      nodes.push({
        x: (i % cols) * 80 + 40 + (Math.random() * 20 - 10),
        y: Math.floor(i / cols) * 80 + 40 + (Math.random() * 20 - 10),
        connections: []
      })
    }

    // Connect adjacent nodes
    nodes.forEach((node, i) => {
      const neighbors = [
        i - 1, i + 1, i - cols, i + cols
      ].filter(n => n >= 0 && n < nodes.length && Math.random() > 0.3);
      node.connections = neighbors;
    });

    // Spawn packets
    for (let i = 0; i < 30; i++) {
      const start = Math.floor(Math.random() * nodes.length);
      const conns = nodes[start].connections;
      const target = conns.length > 0 ? conns[Math.floor(Math.random() * conns.length)] : start;
      particles.push({
        x: nodes[start].x,
        y: nodes[start].y,
        currentNode: start,
        target: target,
        speed: Math.random() * 0.02 + 0.01,
        progress: 0
      })
    }

    const draw = () => {
      ctx.fillStyle = "rgba(10, 5, 0, 0.2)"
      ctx.fillRect(0, 0, width, height)

      // Draw lines
      ctx.strokeStyle = "rgba(251, 191, 36, 0.15)"
      ctx.lineWidth = 1
      nodes.forEach(node => {
        node.connections.forEach(targetIdx => {
          const target = nodes[targetIdx]
          if (target) {
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(target.x, target.y)
            ctx.stroke()
          }
        })
      })

      // Draw nodes
      nodes.forEach(node => {
        ctx.fillStyle = "rgba(251, 191, 36, 0.3)"
        ctx.beginPath()
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw packets
      particles.forEach(p => {
        const start = nodes[p.currentNode]
        const end = nodes[p.target]
        
        if (start && end) {
          p.progress += p.speed
          
          if (p.progress >= 1) {
            p.progress = 0
            p.currentNode = p.target
            const conns = nodes[p.currentNode].connections
            p.target = conns.length > 0 ? conns[Math.floor(Math.random() * conns.length)] : p.currentNode
          }

          const currentX = start.x + (end.x - start.x) * p.progress
          const currentY = start.y + (end.y - start.y) * p.progress

          ctx.shadowBlur = 10
          ctx.shadowColor = "#fbbf24"
          ctx.fillStyle = "#fbbf24"
          ctx.beginPath()
          ctx.arc(currentX, currentY, 3, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="absolute inset-0 bg-[#0a0500]">
      <canvas ref={canvasRef} className="absolute inset-0 mix-blend-screen" />
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
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const bubbles: { x: number, y: number, size: number, speed: number, wobble: number, wobbleSpeed: number }[] = []
    for (let i = 0; i < 40; i++) {
      bubbles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 15 + 5,
        speed: Math.random() * 2 + 1,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.05 + 0.02
      })
    }

    let time = 0;

    const draw = () => {
      // Deep underwater gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height)
      bgGrad.addColorStop(0, "#0891b2") // cyan-600
      bgGrad.addColorStop(1, "#083344") // cyan-950
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, width, height)

      // Light God Rays
      ctx.save()
      ctx.globalCompositeOperation = "overlay"
      for (let i = 0; i < 5; i++) {
        const rayGrad = ctx.createLinearGradient(width/2, 0, width/2 + Math.sin(time + i) * 200, height)
        rayGrad.addColorStop(0, "rgba(255,255,255,0.15)")
        rayGrad.addColorStop(1, "rgba(255,255,255,0)")
        
        ctx.fillStyle = rayGrad
        ctx.beginPath()
        ctx.moveTo(width/2 - 200 + i*100, 0)
        ctx.lineTo(width/2 + 200 + i*100, 0)
        ctx.lineTo(width/2 + Math.sin(time*0.5 + i) * 300 + 400, height)
        ctx.lineTo(width/2 + Math.sin(time*0.5 + i) * 300 - 400, height)
        ctx.fill()
      }
      ctx.restore()

      // Bubbles
      bubbles.forEach(b => {
        b.y -= b.speed
        b.wobble += b.wobbleSpeed
        const currentX = b.x + Math.sin(b.wobble) * 20

        ctx.beginPath()
        ctx.arc(currentX, b.y, b.size, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)"
        ctx.lineWidth = 1.5
        ctx.stroke()
        
        // Highlight
        ctx.beginPath()
        ctx.arc(currentX - b.size*0.3, b.y - b.size*0.3, b.size*0.2, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
        ctx.fill()

        if (b.y < -50) {
          b.y = height + 50
          b.x = Math.random() * width
        }
      })

      time += 0.01
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0" />
}

function AutumnBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const leaves: { x: number, y: number, size: number, speedY: number, speedX: number, angle: number, spin: number, color: string }[] = []
    const colors = ["#ea580c", "#c2410c", "#fb923c", "#fcd34d"]
    
    for (let i = 0; i < 40; i++) {
      leaves.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 10 + 5,
        speedY: Math.random() * 1.5 + 0.5,
        speedX: Math.random() * 2 - 1,
        angle: Math.random() * 360,
        spin: (Math.random() * 4 - 2),
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }

    const draw = () => {
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height)
      bgGrad.addColorStop(0, "#431407") // warm dark brown
      bgGrad.addColorStop(1, "#1a0500")
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, width, height)

      leaves.forEach(l => {
        ctx.save()
        ctx.translate(l.x, l.y)
        ctx.rotate(l.angle * Math.PI / 180)
        
        ctx.fillStyle = l.color
        ctx.beginPath()
        // Simple leaf shape
        ctx.moveTo(0, -l.size)
        ctx.bezierCurveTo(l.size, -l.size/2, l.size, l.size/2, 0, l.size)
        ctx.bezierCurveTo(-l.size, l.size/2, -l.size, -l.size/2, 0, -l.size)
        ctx.fill()
        
        ctx.restore()

        l.y += l.speedY
        l.x += l.speedX + Math.sin(l.angle * Math.PI / 180) * 1.5
        l.angle += l.spin

        if (l.y > height + 50) {
          l.y = -50
          l.x = Math.random() * width
        }
      })
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 mix-blend-lighten" />
}

function WinterBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const flakes: { x: number, y: number, size: number, speedY: number, speedX: number, opacity: number }[] = []
    
    for (let i = 0; i < 150; i++) {
      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 0.5,
        speedY: Math.random() * 2 + 0.5,
        speedX: Math.random() * 1 - 0.5,
        opacity: Math.random() * 0.5 + 0.3
      })
    }

    let wind = 0;

    const draw = () => {
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height)
      bgGrad.addColorStop(0, "#082f49") // sky-900
      bgGrad.addColorStop(1, "#020617") // slate-950
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, width, height)

      wind += 0.01;
      const currentWind = Math.sin(wind) * 1.5;

      flakes.forEach(f => {
        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`
        ctx.shadowBlur = f.size * 2
        ctx.shadowColor = "#ffffff"
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0

        f.y += f.speedY
        f.x += f.speedX + currentWind

        if (f.y > height) {
          f.y = -10
          f.x = Math.random() * width
        }
        if (f.x > width + 10) f.x = -10
        if (f.x < -10) f.x = width + 10
      })
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0" />
}

function VietnamBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Glowing golden stars
    const stars: { x: number, y: number, size: number, speedY: number, rot: number, rotSpeed: number, delay: number }[] = []
    
    for (let i = 0; i < 20; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 15 + 10,
        speedY: -(Math.random() * 1 + 0.5),
        rot: Math.random() * 360,
        rotSpeed: (Math.random() * 2 - 1),
        delay: Math.random() * 100
      })
    }

    let time = 0;

    const draw = () => {
      // Majestic Deep Red Gradient with subtle waving
      time += 0.02;
      const xOffset = Math.sin(time) * 100;
      
      const grad = ctx.createRadialGradient(width/2 + xOffset, height/2, 0, width/2, height/2, width)
      grad.addColorStop(0, "#b91c1c") // red-700
      grad.addColorStop(1, "#450a0a") // red-950
      
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)

      // Draw Gold Stars
      stars.forEach(s => {
        if (s.delay > 0) {
          s.delay--;
          return;
        }
        
        ctx.save()
        ctx.translate(s.x, s.y)
        ctx.rotate(s.rot * Math.PI / 180)
        
        // Draw 5-pointed star
        ctx.beginPath()
        for (let j = 0; j < 5; j++) {
          ctx.lineTo(Math.cos((18 + j * 72) * Math.PI / 180) * s.size,
                     -Math.sin((18 + j * 72) * Math.PI / 180) * s.size)
          ctx.lineTo(Math.cos((54 + j * 72) * Math.PI / 180) * (s.size / 2.5),
                     -Math.sin((54 + j * 72) * Math.PI / 180) * (s.size / 2.5))
        }
        ctx.closePath()
        
        // Gold gradient fill
        const starGrad = ctx.createLinearGradient(0, -s.size, 0, s.size)
        starGrad.addColorStop(0, "#fde047") // yellow-300
        starGrad.addColorStop(1, "#b45309") // amber-700
        
        ctx.fillStyle = starGrad
        ctx.shadowBlur = 20
        ctx.shadowColor = "#fbbf24"
        ctx.fill()
        
        ctx.restore()

        s.y += s.speedY
        s.rot += s.rotSpeed

        if (s.y < -50) {
          s.y = height + 50
          s.x = Math.random() * width
        }
      })
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0" />
}


function WorldCupBackground() {
  const SoccerBall = ({ color, className, style }: any) => (
    <svg viewBox="0 0 512 512" fill={color} className={className} style={style}>
      <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zM358.5 391.2l-64.8-199-139 53.6-14.7 136.2 218.5 9.2zm-289-72L106 182.8l105-121 48 116.4-189.5 141zm238.4-239L393 189l-75 147.6-136.6-46 126.5-210.4zm76 270.8L281 334l22.6-111 138-16.7-57.7 144.5zM177.3 358L106.8 244l136-104.5 56.6 124L177.3 358z"/>
    </svg>
  );

  const TrophyIcon = ({ color, className, style }: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
      <path d="M4 22h16"></path>
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
    </svg>
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#1E002B]">
      {/* WC 2026 Core Brand Gradients */}
      <div className="absolute top-[-30%] left-[-20%] w-[80%] h-[80%] bg-[#E40046]/20 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-[#00E5FF]/20 rounded-full blur-[180px]" />
      <div className="absolute top-[20%] right-[10%] w-[50%] h-[50%] bg-[#4A00B4]/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] bg-[#00FF87]/15 rounded-full blur-[150px]" />
      
      {/* Huge subtle "26" watermark in the center */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] text-white font-black text-[40vw] select-none tracking-tighter">
        26
      </div>
      
      {/* Floating WC elements */}
      {Array.from({ length: 25 }).map((_, i) => {
        const colors = ['#E40046', '#00E5FF', '#00FF87', '#FFFFFF', '#4A00B4'];
        const color = colors[i % colors.length];
        
        let type = 'ball';
        if (i % 4 === 1) type = '26';
        if (i % 4 === 2) type = 'trophy';
        if (i % 4 === 3) type = 'fifa';

        const style = {
          left: `${Math.random() * 100}%`,
          top: `-${Math.random() * 20 + 10}%`,
          animationDuration: `${Math.random() * 15 + 15}s`,
          animationDelay: `${Math.random() * 10}s`,
          width: `${Math.random() * 40 + 20}px`,
          height: `${Math.random() * 40 + 20}px`,
          transform: `rotate(${Math.random() * 360}deg)`,
          opacity: Math.random() * 0.3 + 0.1,
          filter: `drop-shadow(0 0 10px ${color})`
        }
        
        return (
          <div 
            key={i} 
            className="absolute animate-fall-spin" 
            style={style}
          >
            {type === 'ball' && <SoccerBall color={color} className="w-full h-full" />}
            {type === 'trophy' && <TrophyIcon color={color} className="w-full h-full" />}
            {type === '26' && (
              <span className="font-bold flex items-center justify-center w-full h-full" style={{ color, fontSize: style.width }}>
                26
              </span>
            )}
            {type === 'fifa' && (
              <span className="font-black italic flex items-center justify-center w-full h-full" style={{ color, fontSize: parseFloat(style.width)*0.6 + 'px', transform: 'rotate(-10deg)' }}>
                FIFA
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

function PortugalBackground() {
  const SoccerBall = ({ color, className, style }: any) => (
    <svg viewBox="0 0 512 512" fill={color} className={className} style={style}>
      <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zM358.5 391.2l-64.8-199-139 53.6-14.7 136.2 218.5 9.2zm-289-72L106 182.8l105-121 48 116.4-189.5 141zm238.4-239L393 189l-75 147.6-136.6-46 126.5-210.4zm76 270.8L281 334l22.6-111 138-16.7-57.7 144.5zM177.3 358L106.8 244l136-104.5 56.6 124L177.3 358z"/>
    </svg>
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#050505]">
      {/* Classic Portugal Flag Layout: Green on Left (2/5), Red on Right (3/5) */}
      <div className="absolute top-0 left-[-10%] w-[50%] h-full bg-[#006600]/10 blur-[150px]" />
      <div className="absolute top-0 right-[-10%] w-[60%] h-full bg-[#E50024]/10 blur-[150px]" />
      
      {/* Central subtle gold glow */}
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[40%] h-[40%] bg-[#FFD700]/5 rounded-full blur-[100px]" />

      {/* Floating elegant soccer balls and standard elements */}
      {Array.from({ length: 15 }).map((_, i) => {
        const colors = ['#E50024', '#006600', '#FFD700', '#FFFFFF'];
        const color = colors[i % colors.length];
        
        const style = {
          left: `${Math.random() * 100}%`,
          top: `-${Math.random() * 20 + 10}%`,
          animationDuration: `${Math.random() * 20 + 15}s`,
          animationDelay: `${Math.random() * 10}s`,
          width: `${Math.random() * 25 + 15}px`,
          height: `${Math.random() * 25 + 15}px`,
          transform: `rotate(${Math.random() * 360}deg)`,
          opacity: Math.random() * 0.3 + 0.1,
          filter: `drop-shadow(0 0 5px ${color})`
        }
        
        return (
          <div 
            key={i} 
            className="absolute animate-fall-spin" 
            style={style}
          >
            {i % 2 === 0 ? (
              <SoccerBall color={color} className="w-full h-full" />
            ) : (
              <span className="font-bold flex items-center justify-center w-full h-full" style={{ color, fontSize: style.width }}>
                7
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
