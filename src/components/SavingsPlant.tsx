"use client"

import { motion } from "framer-motion"
import { useSettings } from "@/context/SettingsContext"

interface SavingsPlantProps {
  totalSaved: number
  totalTarget: number
}

export function SavingsPlant({ totalSaved, totalTarget }: SavingsPlantProps) {
  const { t } = useSettings()
  
  const percent = totalTarget > 0 ? Math.min(Math.round((totalSaved / totalTarget) * 100), 100) : 0
  
  // Xử lý khi chưa có mục tiêu nào
  if (totalTarget === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="text-4xl mb-4 grayscale opacity-50">🌱</div>
        <p className="text-sm text-muted-foreground font-medium">Hãy đặt mục tiêu để bắt đầu trồng cây nhé!</p>
      </div>
    )
  }

  // Xác định Level của cây
  let level = 1
  if (percent >= 100) level = 5
  else if (percent >= 75) level = 4
  else if (percent >= 40) level = 3
  else if (percent >= 10) level = 2

  const plantStages = {
    1: { emoji: "🌱", title: "Mầm non hy vọng", desc: "Mọi hành trình vĩ đại đều bắt đầu từ một bước chân nhỏ." },
    2: { emoji: "🌿", title: "Cây đang vươn lên", desc: "Cây đang lớn nhanh nhờ sự nỗ lực của bạn!" },
    3: { emoji: "🪴", title: "Chậu cây vững chãi", desc: "Tài chính của bạn đang dần trở nên vững chắc." },
    4: { emoji: "🌳", title: "Cây lớn rợp bóng", desc: "Sắp đến đích rồi! Tiếp tục duy trì nhé." },
    5: { emoji: "✨💰✨", title: "Cây Tài Lộc", desc: "Tuyệt vời! Bạn đã hoàn thành xuất sắc mục tiêu!" }
  }

  const currentStage = plantStages[level as keyof typeof plantStages]

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative p-4">
      {/* Glow Effect */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-[40px] opacity-40 mix-blend-screen transition-colors duration-1000 ${
        level === 5 ? "bg-amber-500" : level >= 3 ? "bg-emerald-500" : "bg-primary"
      }`} />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div 
          key={level}
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="text-6xl sm:text-7xl mb-4 drop-shadow-2xl"
          style={{ textShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
        >
          {currentStage.emoji}
        </motion.div>
        
        <h3 className="text-lg font-bold text-foreground mb-1 font-playfair tracking-wide">{currentStage.title}</h3>
        <p className="text-xs text-muted-foreground mb-4 max-w-[200px] leading-relaxed">{currentStage.desc}</p>
        
        {/* Progress Bar Container */}
        <div className="w-full max-w-[200px] bg-background/50 rounded-full p-1 border border-border/50 shadow-inner">
          <div className="h-2.5 w-full rounded-full overflow-hidden relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={`h-full rounded-full transition-all relative overflow-hidden ${
                level === 5 ? "bg-amber-500" : "bg-emerald-500"
              }`}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </motion.div>
          </div>
        </div>
        <div className="mt-2 text-xs font-bold text-primary">
          {percent}% Hoàn thành
        </div>
      </div>
    </div>
  )
}
