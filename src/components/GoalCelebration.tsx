"use client"

import { useEffect, useState } from "react"
import confetti from "canvas-confetti"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, X } from "lucide-react"

interface GoalCelebrationProps {
  goalName: string
  isOpen: boolean
  onClose: () => void
}

export function GoalCelebration({ goalName, isOpen, onClose }: GoalCelebrationProps) {
  const [showBadge, setShowBadge] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Fire confetti sequence
      const duration = 3 * 1000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
        })
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      
      frame()

      // Show badge after short delay
      setTimeout(() => setShowBadge(true), 500)
    } else {
      setShowBadge(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          {showBadge && (
            <motion.div 
              initial={{ scale: 0.5, y: 50, rotateX: 45 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
              className="relative w-full max-w-sm flex flex-col items-center justify-center p-8 rounded-3xl border border-white/20 bg-card/40 backdrop-blur-xl shadow-2xl text-center"
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X size={20} />
              </button>

              {/* 3D Badge */}
              <motion.div 
                animate={{ 
                  y: [0, -10, 0],
                  rotateY: [0, 10, -10, 0]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut"
                }}
                className="relative mb-6 group perspective-1000"
              >
                <div className="absolute inset-0 bg-yellow-500/40 rounded-full blur-2xl group-hover:bg-yellow-400/60 transition-colors duration-500" />
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-yellow-300 via-amber-500 to-yellow-600 shadow-[inset_0_-8px_16px_rgba(0,0,0,0.4),0_16px_32px_rgba(255,180,0,0.5)] flex items-center justify-center border-4 border-yellow-200/50 transform-style-3d">
                  <Trophy size={64} className="text-yellow-100 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] translate-z-10" />
                </div>
              </motion.div>

              <h2 className="text-3xl font-black text-white font-playfair tracking-wide mb-2 drop-shadow-lg">Tuyệt vời!</h2>
              <p className="text-lg text-white/90 mb-6 font-medium">
                Bạn đã hoàn thành mục tiêu<br/>
                <span className="text-yellow-400 font-bold text-xl block mt-1">{goalName}</span>
              </p>
              
              <button 
                onClick={onClose}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-bold shadow-lg shadow-yellow-500/30 hover:scale-105 active:scale-95 transition-all w-full"
              >
                Nhận phần thưởng
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
