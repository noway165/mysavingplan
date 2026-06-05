"use client"

import { useMemo } from "react"
import { Transaction } from "@/hooks/useTransactions"
import { useSettings } from "@/context/SettingsContext"

interface CategoryPieChartProps {
  transactions: Transaction[]
}

export function CategoryPieChart({ transactions }: CategoryPieChartProps) {
  const { t, formatCurrency } = useSettings()

  const { totalIncome, totalExpense, percentage } = useMemo(() => {
    let income = 0
    let expense = 0
    transactions.forEach(tx => {
      if (tx.type === 'income') income += tx.amount
      else expense += tx.amount
    })
    
    // Percentage of expense relative to income
    const pct = income === 0 ? (expense > 0 ? 100 : 0) : Math.min(Math.round((expense / income) * 100), 100)
    
    return { totalIncome: income, totalExpense: expense, percentage: pct }
  }, [transactions])

  if (transactions.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-primary/50 bg-primary/5 rounded-xl border border-primary/20 border-dashed backdrop-blur-md">
        <p className="animate-pulse">{t('no_data')} ...</p>
      </div>
    )
  }

  // Calculate the wave height based on percentage (100% = top, 0% = bottom)
  // We use CSS top property for this. 100% full = top 0%. 0% full = top 100%
  const topPosition = 100 - percentage;

  return (
    <div className="h-[300px] w-full relative flex items-center justify-center p-4">
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-primary/30 overflow-hidden shadow-[0_0_30px_rgba(var(--color-primary),0.3)] bg-background/50">
        
        {/* Background glow */}
        <div className="absolute inset-0 bg-primary/10" />

        {/* Liquid waves */}
        <div 
          className="absolute left-[-50%] right-[-50%] bottom-0 transition-all duration-1000 ease-in-out"
          style={{ top: `${topPosition}%` }}
        >
          {/* Back wave */}
          <div className="absolute w-[200%] h-[200%] bg-primary/40 rounded-[45%] animate-[spin_8s_linear_infinite]" style={{ top: '-10%' }} />
          {/* Front wave */}
          <div className="absolute w-[200%] h-[200%] bg-primary/80 rounded-[40%] animate-[spin_6s_linear_infinite_reverse]" style={{ top: '-5%' }} />
        </div>

        {/* Text content inside the circle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 drop-shadow-md">
          <span className="text-4xl sm:text-5xl font-black text-white mix-blend-difference">{percentage}%</span>
          <span className="text-xs uppercase tracking-widest text-white/80 mix-blend-difference mt-1">Đã tiêu</span>
        </div>
      </div>

      <div className="absolute bottom-2 w-full flex justify-between px-6 text-sm">
        <div className="flex flex-col">
          <span className="text-muted-foreground">Thu nhập</span>
          <span className="font-bold text-emerald-400">{formatCurrency(totalIncome)}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-muted-foreground">Chi tiêu</span>
          <span className="font-bold text-destructive">{formatCurrency(totalExpense)}</span>
        </div>
      </div>
    </div>
  )
}
