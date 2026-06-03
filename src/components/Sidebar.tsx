"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Target, PieChart, Sparkles, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Mục tiêu", href: "/goals", icon: Target },
  { name: "Thu chi", href: "/transactions", icon: PieChart },
  { name: "AI Insights", href: "/insights", icon: Sparkles },
  { name: "Thành tựu", href: "/gamification", icon: Trophy },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-100 shadow-sm">
      <div className="flex h-16 items-center px-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white">
            <Sparkles size={18} />
          </div>
          MySavingsPlan
        </Link>
      </div>
      
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon 
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors duration-200",
                  isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
                )} 
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
      
      <div className="p-4 mt-auto">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 p-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-900 mb-1 relative z-10">
            <Trophy className="h-4 w-4 text-amber-500" />
            Chuỗi ngày
          </div>
          <p className="text-xs text-indigo-600/80 mb-3 relative z-10">Bạn đã ghi chép 5 ngày liên tiếp!</p>
          <div className="flex gap-1 relative z-10">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div 
                key={day} 
                className={cn(
                  "h-6 w-full rounded-md flex items-center justify-center text-[10px] font-medium transition-transform hover:scale-110",
                  day <= 5 
                    ? "bg-gradient-to-tr from-amber-400 to-orange-400 text-white shadow-sm" 
                    : "bg-white text-gray-400 border border-indigo-100"
                )}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
