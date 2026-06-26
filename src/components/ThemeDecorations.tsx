"use client"

import { useSettings } from "@/context/SettingsContext"
import { motion } from "framer-motion"

export function ThemeDecorations() {
  const { colorTheme } = useSettings()

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Sakura */}
      {colorTheme === "pastelpink" && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-10 right-10 text-pink-300/40 blur-[1px] transform rotate-12"
        >
          <svg width="150" height="150" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2C10,6 6,10 2,12C6,14 10,18 12,22C14,18 18,14 22,12C18,10 14,6 12,2Z" />
          </svg>
        </motion.div>
      )}

      {/* Halloween */}
      {colorTheme === "whitesmoke" && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-0 right-0 text-orange-500/20"
        >
          {/* Spider web corner */}
          <svg width="200" height="200" viewBox="0 0 100 100">
            <path d="M100,0 L100,100 Q80,80 50,100 Q20,80 0,100 L0,0 Z" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M100,0 L100,60 Q80,50 50,60 Q20,50 0,60 L0,0 Z" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M100,0 L100,30 Q80,25 50,30 Q20,25 0,30 L0,0 Z" fill="none" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="1" />
            <line x1="100" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="1" />
          </svg>
        </motion.div>
      )}

      {/* Matrix */}
      {colorTheme === "limegreen" && (
        <motion.div 
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-10 right-10 text-green-500/30 font-mono text-4xl"
        >
          {">_"}
        </motion.div>
      )}

      {/* Spring (Tết) */}
      {colorTheme === "spring" && (
        <motion.div 
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute top-0 right-20 text-red-500/40 origin-top"
        >
          {/* Lantern */}
          <svg width="80" height="120" viewBox="0 0 24 24" fill="currentColor">
            <rect x="11" y="0" width="2" height="4" />
            <ellipse cx="12" cy="12" rx="8" ry="10" />
            <rect x="9" y="2" width="6" height="2" />
            <rect x="9" y="20" width="6" height="2" />
            <rect x="11" y="22" width="2" height="6" />
          </svg>
        </motion.div>
      )}

      {/* Autumn */}
      {colorTheme === "autumn" && (
        <motion.div 
          animate={{ y: [0, 10, 0], x: [0, 5, 0], rotate: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
          className="absolute bottom-20 left-10 text-orange-500/30"
        >
          {/* Maple Leaf approx */}
          <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2L15,8L22,9L17,14L18,21L12,18L6,21L7,14L2,9L9,8L12,2Z" />
          </svg>
        </motion.div>
      )}

      {/* Galaxy */}
      {colorTheme === "amethyst" && (
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
          className="absolute -top-20 -left-20 text-purple-500/10 blur-[2px]"
        >
          <svg width="400" height="400" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 6" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </motion.div>
      )}

      {/* Winter */}
      {colorTheme === "winter" && (
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="absolute top-20 right-20 text-blue-300/30"
        >
          {/* Snowflake approx */}
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <line x1="12" y1="2" x2="12" y2="22" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="5" y1="5" x2="19" y2="19" />
            <line x1="5" y1="19" x2="19" y2="5" />
          </svg>
        </motion.div>
      )}
    </div>
  )
}
