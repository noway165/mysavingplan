"use client"

import { useMemo, useState } from "react"
import { useTransactions } from "@/hooks/useTransactions"
import { useSettings } from "@/context/SettingsContext"

type Timeframe = "3m" | "6m" | "1y"

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function ActivityHeatmap() {
  const { transactions } = useTransactions()
  const { t } = useSettings()
  const [timeframe, setTimeframe] = useState<Timeframe>("1y")

  const daysToLoad = timeframe === "3m" ? 90 : timeframe === "6m" ? 180 : 365

  const activityMap = useMemo(() => {
    const map = new Map<string, number>()
    transactions.forEach(tx => {
      try {
        const parts = tx.date.split('/')
        if (parts.length === 3) {
          const dateStr = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
          map.set(dateStr, (map.get(dateStr) || 0) + 1)
        }
      } catch (e) {}
    })
    return map
  }, [transactions])

  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const rawStartDate = new Date(today)
    rawStartDate.setDate(today.getDate() - daysToLoad + 1)
    
    // Adjust to previous Sunday
    const startDate = new Date(rawStartDate)
    startDate.setDate(startDate.getDate() - startDate.getDay())

    const generatedWeeks: { date: Date, dateStr: string, count: number }[][] = []
    const generatedMonthLabels: { month: string, colIndex: number }[] = []
    
    let currentDate = new Date(startDate)
    let currentWeek: { date: Date, dateStr: string, count: number }[] = []
    let lastMonth = -1

    let colIndex = 0

    while (currentDate <= today) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`
      const month = currentDate.getMonth()

      // Add month label if it's the first week of the month (roughly)
      // We check if the 1st of the month falls in this week, or if it's the first week we are rendering
      if (month !== lastMonth && currentDate.getDate() <= 7) {
        generatedMonthLabels.push({ month: MONTH_NAMES[month], colIndex })
        lastMonth = month
      }

      currentWeek.push({
        date: new Date(currentDate),
        dateStr,
        count: activityMap.get(dateStr) || 0
      })

      if (currentWeek.length === 7) {
        generatedWeeks.push(currentWeek)
        currentWeek = []
        colIndex++
      }

      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Push the last incomplete week if any
    if (currentWeek.length > 0) {
      generatedWeeks.push(currentWeek)
    }

    return { weeks: generatedWeeks, monthLabels: generatedMonthLabels }
  }, [daysToLoad, activityMap])

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="font-bold text-lg text-foreground">Biểu đồ hoạt động</h2>
        
        <div className="flex gap-2 bg-muted p-1 rounded-xl w-full sm:w-auto self-start">
          <button 
            onClick={() => setTimeframe("3m")}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${timeframe === "3m" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            3 tháng
          </button>
          <button 
            onClick={() => setTimeframe("6m")}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${timeframe === "6m" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            6 tháng
          </button>
          <button 
            onClick={() => setTimeframe("1y")}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${timeframe === "1y" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            1 năm
          </button>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="min-w-max">
          {/* Months Header */}
          <div className="flex mb-2 text-xs text-muted-foreground" style={{ paddingLeft: "32px" }}>
            {weeks.map((_, i) => {
              const label = monthLabels.find(l => l.colIndex === i)
              return (
                <div key={i} className="w-[14px] flex-shrink-0 relative">
                  {label && <span className="absolute left-0">{label.month}</span>}
                </div>
              )
            })}
          </div>

          <div className="flex">
            {/* Days Labels (Y-axis) */}
            <div className="flex flex-col justify-between text-xs text-muted-foreground pr-2" style={{ height: "105px", paddingTop: "14px", paddingBottom: "14px" }}>
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Grid */}
            <div className="flex gap-[3px]">
              {weeks.map((week, wIndex) => (
                <div key={wIndex} className="flex flex-col gap-[3px]">
                  {/* Fill empty cells for the first week if it doesn't start on Sunday (not needed since we align to Sunday) */}
                  {week.map((day, dIndex) => {
                    const count = day.count
                    let bgClass = "bg-muted"
                    let shadowClass = ""
                    
                    if (count > 0) {
                      if (count === 1) {
                        bgClass = "bg-primary/40"
                      } else if (count === 2) {
                        bgClass = "bg-primary/70"
                      } else {
                        bgClass = "bg-primary"
                        shadowClass = "shadow-[0_0_8px_var(--color-primary)]"
                      }
                    }

                    // To match the exact image (rounded corners, specific size)
                    return (
                      <div 
                        key={dIndex}
                        title={`${day.date.toLocaleDateString('vi-VN')}: ${count} giao dịch`}
                        className={`w-[11px] h-[11px] rounded-sm transition-all hover:ring-1 hover:ring-foreground cursor-pointer ${bgClass} ${shadowClass}`}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
          {t('transactions_count')}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="w-[11px] h-[11px] rounded-sm bg-muted"></div>
          <div className="w-[11px] h-[11px] rounded-sm bg-primary/40"></div>
          <div className="w-[11px] h-[11px] rounded-sm bg-primary/70"></div>
          <div className="w-[11px] h-[11px] rounded-sm bg-primary shadow-[0_0_5px_var(--color-primary)]"></div>
          <span>More</span>
        </div>
      </div>
    </div>
  )
}
