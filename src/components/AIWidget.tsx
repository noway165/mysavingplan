"use client"

import { useMemo } from "react"
import { Sparkles, ArrowRight } from "lucide-react"
import { useSettings } from "@/context/SettingsContext"

import Link from "next/link"
import { AIRubik } from "./AIRubik"

export function AIWidget({ transactions }: { transactions: any[] }) {
  const { formatCurrency } = useSettings()

  const insight = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return "Chưa có đủ dữ liệu giao dịch để AI phân tích. Hãy ghi chép thêm nhé!"
    }

    const now = new Date()
    const currentWeekStart = new Date(now)
    currentWeekStart.setDate(now.getDate() - now.getDay())
    currentWeekStart.setHours(0,0,0,0)

    // Tính tổng chi tiêu tuần này theo danh mục
    const weekExpenses = transactions.filter(t => {
      if (t.type !== 'expense') return false
      try {
        const parts = t.date.split('/')
        const txDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)
        return txDate >= currentWeekStart
      } catch { return false }
    })

    if (weekExpenses.length === 0) {
      return "Tuần này bạn chưa tiêu đồng nào! Kỷ luật quá xuất sắc, tiếp tục phát huy nhé!"
    }

    const categoryTotals: Record<string, number> = {}
    weekExpenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
    })

    // Tìm danh mục tiêu nhiều nhất
    let maxCat = ""
    let maxVal = 0
    let totalExpense = 0
    Object.entries(categoryTotals).forEach(([cat, val]) => {
      totalExpense += val
      if (val > maxVal) {
        maxVal = val
        maxCat = cat
      }
    })

    const percent = Math.round((maxVal / totalExpense) * 100)

    if (maxCat === "Mua sắm" || maxCat === "Giải trí" || maxCat === "Ăn uống") {
      return (
        <>
          Cảnh báo: Bạn đã đốt <span className="text-[#fe0979] font-bold">{percent}%</span> chi tiêu tuần này ({formatCurrency(maxVal)}) vào <span className="font-bold">{maxCat}</span>. Hãy kìm hãm lại trong những ngày tới để không bị rớt Hạng kỷ luật nhé!
        </>
      )
    }

    return (
      <>
        Phân tích: Tuần này bạn dành phần lớn chi tiêu ({percent}%) cho <span className="font-bold">{maxCat}</span>. Dòng tiền của bạn đang khá ổn định, hãy tiếp tục duy trì thói quen ghi chép!
      </>
    )

  }, [transactions, formatCurrency])

  return (
    <div className="hud-panel p-5 md:p-6 h-full flex flex-col justify-between">
      <div className="absolute -right-10 -top-10 opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none">
        <AIRubik size={200} isAnalyzing={false} />
      </div>
      
      <div>
        <div className="flex items-center gap-3 text-[#fe0979] mb-3 relative z-10">
          <div className="w-8 h-8">
            <AIRubik size={32} isAnalyzing={true} />
          </div>
          <h2 className="font-bold text-sm uppercase tracking-widest text-white/80 font-serif">AI Insights</h2>
        </div>

        <p className="text-sm text-white/70 leading-relaxed relative z-10 font-medium">
          {insight}
        </p>
      </div>

      <Link href="/insights" className="mt-4 flex items-center gap-1 text-xs font-bold text-[#00f2fe] cursor-pointer hover:underline relative z-10 w-fit">
        Xem chi tiết báo cáo <ArrowRight size={14} />
      </Link>
    </div>
  )
}
