"use client"

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LabelList
} from "recharts"
import { FileText } from "lucide-react"
import { Transaction } from "@/hooks/useTransactions"
import { useSettings } from "@/context/SettingsContext"

type Props = {
  transactions: Transaction[]
}

function shortenCurrency(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
  return value.toString()
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
      const shortDate = date.split('/').slice(0, 2).join('/')
      return { date: shortDate, ...values }
    })
    .slice(-7)

  const gridColor = theme === 'dark' ? '#374151' : '#f3f4f6'
  const textColor = theme === 'dark' ? '#9ca3af' : '#6b7280'

  return (
    <div className="h-[320px] sm:h-[350px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }} barGap={4} barCategoryGap="20%">
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: textColor }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: textColor }}
            tickFormatter={(value: number) => shortenCurrency(value)}
            width={55}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: '1px solid var(--border)', 
              background: 'var(--card)',
              color: 'var(--foreground)',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              fontSize: '13px'
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => [formatCurrency(Number(value)), '']}
            labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
            formatter={(value: string) => value === 'income' ? 'Thu nhập' : 'Chi tiêu'}
          />
          <Bar 
            dataKey="income" 
            fill="#22c55e" 
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
          >
            <LabelList 
              dataKey="income" 
              position="top" 
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => Number(value) > 0 ? shortenCurrency(Number(value)) : ''} 
              style={{ fontSize: 10, fill: '#22c55e', fontWeight: 600 }}
            />
          </Bar>
          <Bar 
            dataKey="expense" 
            fill="#ef4444" 
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
          >
            <LabelList 
              dataKey="expense" 
              position="top" 
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => Number(value) > 0 ? shortenCurrency(Number(value)) : ''} 
              style={{ fontSize: 10, fill: '#ef4444', fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
