"use client"

import { useGamification } from "@/hooks/useGamification"
import { Shield, ShieldAlert, ShieldCheck, Flame, Trophy } from "lucide-react"

import { useEffect } from "react"

export function GamificationWidget({ transactions }: { transactions: any[] }) {
  const { xp, level, rank, streak, xpForNextLevel, currentLevelXP, syncHistoricalData } = useGamification()
  
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      syncHistoricalData(transactions)
    }
  }, [transactions, syncHistoricalData])
  
  const progressPercent = Math.min(100, Math.max(0, (currentLevelXP / 1000) * 100))

  return (
    <div className="bento-card p-5 md:p-6 bg-gradient-to-br from-primary/10 to-transparent relative overflow-hidden">
      <div className="absolute -right-4 -top-4 opacity-5">
        <Trophy size={100} />
      </div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${rank === 'Gold' ? 'bg-yellow-500/20 text-yellow-600' : rank === 'Silver' ? 'bg-slate-300/20 text-slate-400' : 'bg-orange-500/20 text-orange-600'}`}>
            {rank === 'Gold' ? <ShieldCheck size={24} /> : rank === 'Silver' ? <Shield size={24} /> : <ShieldAlert size={24} />}
          </div>
          <div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Hạng Kỷ Luật</div>
            <div className="text-lg font-bold text-foreground">{rank} - Lvl {level}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 bg-orange-500/10 text-orange-600 px-3 py-1.5 rounded-full font-bold text-sm">
          <Flame size={16} className={streak > 0 ? "animate-pulse" : ""} />
          {streak} Ngày
        </div>
      </div>

      <div className="space-y-2 relative z-10">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-muted-foreground">Kinh nghiệm (XP)</span>
          <span className="text-foreground">{xp} / {xpForNextLevel}</span>
        </div>
        <div className="h-3 w-full bg-background/50 rounded-full overflow-hidden border border-border/50">
          <div 
            className="h-full bg-primary transition-all duration-1000 ease-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
