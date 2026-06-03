"use client"

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts"
import { FileText } from "lucide-react"
import { Transaction } from "@/hooks/useTransactions"
import { useSettings } from "@/context/SettingsContext"

type Props = {
  transactions: Transaction[]
}

export function DashboardCharts({ transactions }: Props) {
  const { t, formatCurrency, theme } = useSettings()

  if (transactions.length === 0) {
    return (
      <div className="h-[300px] w-full mt-4 flex flex-col items-center justify-center text-center">
        <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground opacity-50 mb-4">
          <FileText size={28} />
        </div>
        <p className="text-muted-foreground text-sm mb-1">{t('no_data')}</p>
      </div>
    )
  }

  // Group transactions by date and sum amounts
  const dateMap = new Map<string, { income: number; expense: number }>()
  
  // Sort transactions by date ascending before processing to ensure chronological order
  const sortedTx = [...transactions].sort((a, b) => {
    try {
      const partsA = a.date.split('/')
      const partsB = b.date.split('/')
      const dateA = new Date(`${partsA[2]}-${partsA[1]}-${partsA[0]}`).getTime()
      const dateB = new Date(`${partsB[2]}-${partsB[1]}-${partsB[0]}`).getTime()
      return dateA - dateB
    } catch {
      return 0
    }
  })

  sortedTx.forEach(t => {
    const existing = dateMap.get(t.date) || { income: 0, expense: 0 }
    if (t.type === "income") {
      existing.income += t.amount
    } else {
      existing.expense += t.amount
    }
    dateMap.set(t.date, existing)
  })

  const data = Array.from(dateMap.entries())
    .map(([date, values]) => {
      // Shorten date for display (e.g. 15/06/2026 -> 15/06)
      const shortDate = date.split('/').slice(0, 2).join('/')
      return { date: shortDate, ...values }
    })
    .slice(-7) // Show last 7 dates

  const gridColor = theme === 'dark' ? '#374151' : '#f3f4f6'
  const textColor = theme === 'dark' ? '#9ca3af' : '#9ca3af'

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: textColor }} 
            dy={10}
          />
          <YAxis hide />
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={gridColor} />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: '1px solid var(--border)', 
              background: 'var(--card)',
              color: 'var(--foreground)',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => [formatCurrency(Number(value)), '']}
          />
          <Area 
            type="monotone" 
            dataKey="income" 
            stroke="#22c55e" 
            fillOpacity={1} 
            fill="url(#colorIncome)" 
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="expense" 
            stroke="#ef4444" 
            fillOpacity={1} 
            fill="url(#colorExpense)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
