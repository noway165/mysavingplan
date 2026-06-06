"use client"

import { motion } from "framer-motion"
import Image from "next/image"

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
  size = 200,
  isSleeping = false 
}: DragonAvatarProps) {
  
  // Size of dragon scales with level
  const scale = 0.8 + Math.min(level * 0.02, 0.5)
  
  // Convert basic hex colors to hue rotation (rough estimate based on the cyan default image)
  // Assuming default image is cyan (#00f2fe)
  let hueRotate = 0
  if (gender === 'female') hueRotate = 150 // Shift towards pink/magenta
  if (color.includes("pink") || color.includes("fe0979")) hueRotate = 150
  if (color.includes("emerald")) hueRotate = -90
  
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
        className="relative z-10 w-full h-full drop-shadow-[0_0_15px_rgba(0,242,254,0.5)]"
        style={{ filter: `hue-rotate(${hueRotate}deg)` }}
      >
        <Image 
          src="/dragon.png" 
          alt="Cyber Dragon Pet"
          fill
          className="object-contain"
          priority
        />
      </motion.div>
      
      {/* HUD Scanner Ring behind dragon */}
      <motion.div
        className="absolute inset-0 rounded-full border border-white/20 border-t-[#00f2fe]"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ filter: `hue-rotate(${hueRotate}deg)` }}
      />
      <motion.div
        className="absolute inset-4 rounded-full border border-white/10 border-b-[#fe0979]"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{ filter: `hue-rotate(${hueRotate}deg)` }}
      />
    </div>
  )
}
