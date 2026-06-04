"use client"

import { useMemo } from "react"
import { useTransactions } from "@/hooks/useTransactions"

// Helper to generate the last 365 days (ending today or ending at the end of current week)
function generateDates(days: number) {
  const dates = []
  const today = new Date()
  
  // We want the grid to end today.
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    dates.push(d)
  }
  return dates
}

export function ActivityHeatmap() {
  const { transactions } = useTransactions()

  // We want to show a 52x7 grid = 364 days.
  // We align it so that it's a full grid.
  const dates = useMemo(() => generateDates(364), [])

  const activityMap = useMemo(() => {
    const map = new Map<string, number>()
    
    transactions.forEach(tx => {
      // tx.date format is DD/MM/YYYY
      try {
        const parts = tx.date.split('/')
        if (parts.length === 3) {
          // Format as YYYY-MM-DD for easy mapping
          const dateStr = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
          const currentCount = map.get(dateStr) || 0
          map.set(dateStr, currentCount + 1)
        }
      } catch (e) {
        // ignore malformed dates
      }
    })
    
    return map
  }, [transactions])

  const weeks = useMemo(() => {
    const w = []
    for (let i = 0; i < dates.length; i += 7) {
      w.push(dates.slice(i, i + 7))
    }
    return w
  }, [dates])

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-6 mt-6">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="font-bold text-lg text-foreground">Chuỗi tiết kiệm</h2>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">365 ngày qua</span>
      </div>

      <div className="overflow-x-auto pb-2 custom-scrollbar">
        <div className="flex gap-1.5" style={{ minWidth: "max-content" }}>
          {weeks.map((week, wIndex) => (
            <div key={wIndex} className="flex flex-col gap-1.5">
              {week.map((date, dIndex) => {
                const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
                const count = activityMap.get(dateStr) || 0
                
                // Determine neon intensity
                let bgClass = "bg-muted"
                let shadowClass = ""
                
                if (count > 0) {
                  if (count === 1) {
                    bgClass = "bg-primary/40"
                  } else if (count === 2) {
                    bgClass = "bg-primary/70"
                  } else {
                    bgClass = "bg-primary"
                    shadowClass = "shadow-[0_0_10px_var(--color-primary)]"
                  }
                }

                return (
                  <div 
                    key={dIndex}
                    title={`${date.toLocaleDateString('vi-VN')}: ${count} hoạt động`}
                    className={`w-3.5 h-3.5 rounded-sm transition-all hover:scale-125 hover:z-10 cursor-pointer ${bgClass} ${shadowClass}`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end items-center gap-2 mt-4 text-xs text-muted-foreground">
        <span>Ít</span>
        <div className="w-3 h-3 rounded-sm bg-muted"></div>
        <div className="w-3 h-3 rounded-sm bg-primary/40"></div>
        <div className="w-3 h-3 rounded-sm bg-primary/70"></div>
        <div className="w-3 h-3 rounded-sm bg-primary shadow-[0_0_5px_var(--color-primary)]"></div>
        <span>Nhiều</span>
      </div>
    </div>
  )
}
