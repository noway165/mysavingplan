"use client"

import { motion } from "framer-motion"
import { Trophy, Star, Medal, Target, Flame, Lock } from "lucide-react"
import { useTransactions } from "@/hooks/useTransactions"
import { useGoals } from "@/hooks/useGoals"

export default function GamificationPage() {
  const { transactions } = useTransactions()
  const { goals } = useGoals()

  // Calculate real stats
  const totalTransactions = transactions.length
  const completedGoals = goals.filter(g => g.saved >= g.target).length
  const totalBalance = transactions.reduce((sum, t) => t.type === "income" ? sum + t.amount : sum - t.amount, 0)

  // Dynamic XP based on activity
  const xp = (totalTransactions * 50) + (completedGoals * 200) + (goals.length * 100)
  const level = Math.floor(xp / 500) + 1
  const xpInLevel = xp % 500
  const xpPercent = Math.min(Math.round((xpInLevel / 500) * 100), 100)

  const levelNames = ["Người mới", "Tập sự", "Mầm non", "Chiến binh", "Chuyên gia", "Bậc thầy", "Huyền thoại"]
  const levelName = levelNames[Math.min(level - 1, levelNames.length - 1)]

  const badges = [
    { id: 1, name: "Khởi đầu hoàn hảo", desc: "Tạo mục tiêu tiết kiệm đầu tiên", icon: Target, unlocked: goals.length >= 1, color: "text-amber-500", bg: "bg-amber-50" },
    { id: 2, name: "Ghi chép đầu tiên", desc: "Ghi chép giao dịch đầu tiên", icon: Flame, unlocked: totalTransactions >= 1, color: "text-orange-500", bg: "bg-orange-50" },
    { id: 3, name: "Siêng năng", desc: "Ghi chép 10 giao dịch", icon: Star, unlocked: totalTransactions >= 10, color: "text-amber-500", bg: "bg-amber-50" },
    { id: 4, name: "Chuyên gia tiết kiệm", desc: "Hoàn thành 1 mục tiêu", icon: Medal, unlocked: completedGoals >= 1, color: "text-emerald-500", bg: "bg-emerald-50" },
    { id: 5, name: "Chiến binh tài chính", desc: "Ghi chép 50 giao dịch", icon: Flame, unlocked: totalTransactions >= 50, color: "text-purple-500", bg: "bg-purple-50" },
    { id: 6, name: "Đại gia", desc: "Hoàn thành 5 mục tiêu", icon: Trophy, unlocked: completedGoals >= 5, color: "text-yellow-500", bg: "bg-yellow-50" },
  ]

  const unlockedCount = badges.filter(b => b.unlocked).length

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Thành tựu của bạn</h1>
          <p className="text-gray-500 mt-1">Hoàn thành các thử thách để nhận huy hiệu và xây dựng thói quen tốt.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Stats Card */}
        <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 p-8 shadow-sm text-white relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 opacity-20 group-hover:scale-110 transition-transform duration-500">
            <Flame size={200} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 font-medium text-white/90 mb-2">
              <Flame size={20} /> Hoạt động của bạn
            </div>
            <div className="text-6xl font-bold mb-2">{totalTransactions} <span className="text-2xl font-semibold opacity-80">giao dịch</span></div>
            <p className="text-white/80">{goals.length} mục tiêu đã tạo &bull; {completedGoals} đã hoàn thành</p>
          </div>
          
          <div className="relative z-10 mt-8 grid grid-cols-3 gap-4">
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{unlockedCount}</div>
              <div className="text-xs text-white/80">Huy hiệu</div>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{xp}</div>
              <div className="text-xs text-white/80">Tổng XP</div>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">Lv.{level}</div>
              <div className="text-xs text-white/80">Cấp độ</div>
            </div>
          </div>
        </div>

        {/* Level Card */}
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 border-4 border-amber-50">
                  <Star size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Cấp {level}: {levelName}</h2>
                  <p className="text-sm text-gray-500">{xpInLevel} / 500 XP</p>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              {totalTransactions === 0 
                ? "Hãy bắt đầu ghi chép giao dịch để nhận XP và thăng cấp nhé!" 
                : `Bạn đang làm rất tốt! Tiếp tục ghi chép để sớm đạt cấp ${level + 1}.`
              }
            </p>
          </div>
          
          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span className="text-amber-600">{xpPercent}% hoàn thành</span>
              <span className="text-gray-400">Cấp {level + 1}</span>
            </div>
            <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-6">Bộ sưu tập huy hiệu</h2>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {badges.map((badge, index) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              key={badge.id}
              className={`rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all ${
                badge.unlocked 
                  ? "bg-white shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-md cursor-pointer" 
                  : "bg-gray-50 border border-gray-100 opacity-70 grayscale"
              }`}
            >
              <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 ${badge.unlocked ? badge.bg : "bg-gray-100"} ${badge.unlocked ? badge.color : "text-gray-400"} relative`}>
                {!badge.unlocked && (
                  <div className="absolute -top-1 -right-1 bg-gray-200 rounded-full p-1 border-2 border-white text-gray-500">
                    <Lock size={12} />
                  </div>
                )}
                <badge.icon size={28} />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{badge.name}</h3>
              <p className="text-[11px] text-gray-500 line-clamp-2">{badge.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
