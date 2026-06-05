"use client"

import { useMemo } from "react"
import { Sparkles, ArrowRight } from "lucide-react"
import { useSettings } from "@/context/SettingsContext"

import Link from "next/link"

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
          Cảnh báo: Bạn đã đốt <span className="text-destructive font-bold">{percent}%</span> chi tiêu tuần này ({formatCurrency(maxVal)}) vào <span className="font-bold">{maxCat}</span>. Hãy kìm hãm lại trong những ngày tới để không bị rớt Hạng kỷ luật nhé!
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
    <div className="bento-card p-5 md:p-6 bg-card border-primary/30 relative overflow-hidden group h-full flex flex-col justify-between">
      <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
        <Sparkles size={120} />
      </div>
      
      <div>
        <div className="flex items-center gap-2 text-primary mb-3 relative z-10">
          <Sparkles size={20} className="animate-pulse" />
          <h2 className="font-bold text-sm uppercase tracking-widest">AI Insights</h2>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed relative z-10 font-medium">
          {insight}
        </p>
      </div>

      <Link href="/insights" className="mt-4 flex items-center gap-1 text-xs font-bold text-primary cursor-pointer hover:underline relative z-10 w-fit">
        Xem chi tiết báo cáo <ArrowRight size={14} />
      </Link>
    </div>
  )
}
