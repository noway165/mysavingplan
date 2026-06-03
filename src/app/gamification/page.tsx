"use client"

import { motion } from "framer-motion"
import { Trophy, Star, Medal, Target, Flame, Lock } from "lucide-react"

export default function GamificationPage() {
  const badges = [
    { id: 1, name: "Khởi đầu hoàn hảo", desc: "Tạo mục tiêu tiết kiệm đầu tiên", icon: Target, unlocked: true, color: "text-blue-500", bg: "bg-blue-50" },
    { id: 2, name: "Kiên trì 7 ngày", desc: "Ghi chép chi tiêu 7 ngày liên tiếp", icon: Flame, unlocked: true, color: "text-orange-500", bg: "bg-orange-50" },
    { id: 3, name: "Cột mốc 10 triệu", desc: "Tổng số dư đạt 10.000.000 ₫", icon: Star, unlocked: true, color: "text-amber-500", bg: "bg-amber-50" },
    { id: 4, name: "Chuyên gia tiết kiệm", desc: "Hoàn thành 3 mục tiêu", icon: Medal, unlocked: false, color: "text-gray-400", bg: "bg-gray-100" },
    { id: 5, name: "Kiên trì 30 ngày", desc: "Ghi chép chi tiêu 30 ngày liên tiếp", icon: Flame, unlocked: false, color: "text-gray-400", bg: "bg-gray-100" },
    { id: 6, name: "Đại gia", desc: "Tổng số dư đạt 100.000.000 ₫", icon: Trophy, unlocked: false, color: "text-gray-400", bg: "bg-gray-100" },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Thành tựu của bạn</h1>
          <p className="text-gray-500 mt-1">Hoàn thành các thử thách để nhận huy hiệu và xây dựng thói quen tốt.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Streak Card */}
        <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 p-8 shadow-sm text-white relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 opacity-20 group-hover:scale-110 transition-transform duration-500">
            <Flame size={200} />
          </div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 font-medium text-white/90 mb-2">
                <Flame size={20} /> Chuỗi ngày ghi chép
              </div>
              <div className="text-6xl font-bold mb-2">5 <span className="text-2xl font-semibold opacity-80">ngày</span></div>
              <p className="text-white/80">Chỉ còn 2 ngày nữa để nhận huy hiệu &quot;Kiên trì 7 ngày&quot;!</p>
            </div>
          </div>
          
          <div className="relative z-10 mt-8">
            <div className="flex justify-between mb-2 text-sm font-medium text-white/90">
              <span>Thứ 2</span>
              <span>Thứ 3</span>
              <span>Thứ 4</span>
              <span>Thứ 5</span>
              <span>Hôm nay</span>
              <span className="opacity-50">Thứ 7</span>
              <span className="opacity-50">CN</span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div key={day} className="flex-1 relative group/tooltip">
                  <div 
                    className={`h-10 w-full rounded-lg flex items-center justify-center transition-all ${
                      day <= 5 
                        ? "bg-white text-orange-500 shadow-md transform hover:-translate-y-1" 
                        : "bg-white/20 text-white/50 border border-white/20"
                    }`}
                  >
                    {day <= 5 ? <Flame size={18} /> : <Lock size={14} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Level Card */}
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border-4 border-blue-50">
                  <Star size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Cấp độ 3: Mầm non</h2>
                  <p className="text-sm text-gray-500">1,250 / 2,000 XP</p>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              Bạn đang làm rất tốt! Ghi chép chi tiêu hôm nay để nhận thêm 50 XP và sớm thăng cấp nhé.
            </p>
          </div>
          
          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span className="text-blue-600">62% hoàn thành</span>
              <span className="text-gray-400">Cấp 4</span>
            </div>
            <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "62%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
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
              <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 ${badge.bg} ${badge.color} relative`}>
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
