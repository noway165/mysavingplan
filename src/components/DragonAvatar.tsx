"use client"

import { motion } from "framer-motion"

export type DragonGender = "male" | "female"

interface DragonAvatarProps {
  level: number
  color?: string
  gender?: DragonGender
  size?: number
  isSleeping?: boolean
}

export function DragonAvatar({ 
  level, 
  color = "#00f2fe", 
  gender = "male", 
  size = 150,
  isSleeping = false 
}: DragonAvatarProps) {
  
  // Size of dragon scales with level (max out at level 50)
  const scale = 0.8 + Math.min(level * 0.01, 0.4)
  
  // Female dragons have slightly more elegant curves, male has sharper spikes
  const hornsPath = gender === "male" 
    ? "M 50 20 L 45 5 L 60 15 Z" 
    : "M 50 20 Q 40 0 70 10 Q 50 5 60 15 Z"

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <motion.div
        animate={{ 
          y: isSleeping ? [0, 5, 0] : [0, -10, 0],
          scale: scale
        }}
        transition={{ 
          duration: isSleeping ? 4 : 3, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="relative z-10"
      >
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Dragon Aura/Glow */}
          <circle cx="50" cy="50" r="40" fill={color} opacity="0.1" filter="blur(10px)" />
          
          {/* Dragon Head */}
          <path d="M 30 60 Q 50 80 70 60 Q 80 40 60 30 Q 40 20 30 40 Z" fill={color} opacity="0.8" />
          
          {/* Dragon Snout */}
          <path d="M 30 60 Q 20 65 15 55 Q 20 45 30 40 Z" fill={color} />
          
          {/* Dragon Horns */}
          <path d={hornsPath} fill={color} opacity="0.9" />
          
          {/* Dragon Eye */}
          {isSleeping ? (
             <path d="M 45 45 Q 50 50 55 45" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <>
              <circle cx="50" cy="45" r="4" fill="#fff" />
              <circle cx="50" cy="45" r="1.5" fill="#000" />
            </>
          )}

          {/* Dragon Wing (appears when level > 5) */}
          {level >= 5 && (
            <motion.path 
              d="M 65 40 Q 90 20 95 45 Q 80 50 70 50 Z" 
              fill={color} 
              opacity="0.6"
              animate={isSleeping ? {} : { rotate: [0, 10, 0] }}
              style={{ originX: "65px", originY: "40px" }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </svg>
      </motion.div>
      
      {/* HUD Scanner Ring behind dragon */}
      <motion.div
        className="absolute inset-0 rounded-full border border-white/20 border-t-[#00f2fe]"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-4 rounded-full border border-white/10 border-b-[#fe0979]"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}
