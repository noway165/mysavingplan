"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

export function AIRubik({ size = 100, isAnalyzing = false }: { size?: number, isAnalyzing?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springConfig = { damping: 20, stiffness: 100 }
  const mouseRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [45, -45]), springConfig)
  const mouseRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-45, 45]), springConfig)

  const [autoRotate, setAutoRotate] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let animationFrameId: number
    const animate = () => {
      setAutoRotate(prev => ({
        x: prev.x + (isAnalyzing ? 2 : 0.3),
        y: prev.y + (isAnalyzing ? 2 : 0.5)
      }))
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(animationFrameId)
  }, [isAnalyzing])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseXPos = e.clientX - rect.left
    const mouseYPos = e.clientY - rect.top
    const xPct = mouseXPos / width - 0.5
    const yPct = mouseYPos / height - 0.5
    mouseX.set(xPct)
    mouseY.set(yPct)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div 
      ref={containerRef}
      className="relative cursor-grab active:cursor-grabbing" 
      style={{ width: size, height: size, perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <style>{`
        .cube-face {
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: rgba(0, 242, 254, 0.1);
          border: 2px solid rgba(0, 242, 254, 0.8);
          box-shadow: 0 0 15px rgba(0, 242, 254, 0.5), inset 0 0 15px rgba(0, 242, 254, 0.5);
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 2px;
          padding: 2px;
          backface-visibility: visible;
        }
        .cube-face > div {
          background: rgba(0, 242, 254, 0.2);
          border: 1px solid rgba(0, 242, 254, 0.5);
        }
        .front  { transform: translateZ(${size/2}px); }
        .back   { transform: rotateY(180deg) translateZ(${size/2}px); }
        .right  { transform: rotateY(90deg) translateZ(${size/2}px); }
        .left   { transform: rotateY(-90deg) translateZ(${size/2}px); }
        .top    { transform: rotateX(90deg) translateZ(${size/2}px); }
        .bottom { transform: rotateX(-90deg) translateZ(${size/2}px); }
      `}</style>
      
      <motion.div 
        className="w-full h-full absolute"
        style={{
          transformStyle: 'preserve-3d',
          rotateX: useTransform(() => mouseRotateX.get() + autoRotate.x),
          rotateY: useTransform(() => mouseRotateY.get() + autoRotate.y)
        }}
      >
        {['front', 'back', 'right', 'left', 'top', 'bottom'].map((face) => (
          <div key={face} className={`cube-face ${face}`}>
            {[...Array(9)].map((_, i) => (
              <motion.div 
                key={i}
                animate={isAnalyzing ? {
                  opacity: [0.2, 1, 0.2],
                  backgroundColor: ['rgba(0, 242, 254, 0.2)', 'rgba(254, 9, 121, 0.5)', 'rgba(0, 242, 254, 0.2)'],
                } : {
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: isAnalyzing ? 0.5 : 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
