"use client"

import {
  Line,
  LineChart,
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
  const textColor = theme === 'dark' ? 'rgba(255,255,255,0.85)' : '#4b5563'

  return (
    <div className="h-[320px] sm:h-[350px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <filter id="glow-income" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-expense" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={gridColor} opacity={0.3} />
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
              borderRadius: '16px', 
              border: '1px solid var(--neon-secondary)', 
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              boxShadow: '0 8px 32px 0 color-mix(in srgb, var(--neon-primary) 20%, transparent)',
              fontSize: '13px'
            }}
            itemStyle={{ color: '#fff' }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => [formatCurrency(Number(value)), '']}
            labelStyle={{ fontWeight: 600, marginBottom: '4px', color: '#ccc' }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
            formatter={(value: string) => value === 'income' ? 'Thu nhập' : 'Chi tiêu'}
          />
          <Line 
            type="monotone"
            dataKey="income" 
            stroke="color-mix(in srgb, var(--neon-primary) 40%, white)" 
            strokeWidth={4}
            dot={false}
            activeDot={{ r: 6, fill: 'var(--neon-primary)', stroke: '#fff', strokeWidth: 2, filter: 'url(#glow-income)' }}
            style={{ filter: 'url(#glow-income)' }}
          />
          <Line 
            type="monotone"
            dataKey="expense" 
            stroke="color-mix(in srgb, var(--neon-secondary) 40%, white)" 
            strokeWidth={4}
            dot={false}
            activeDot={{ r: 6, fill: 'var(--neon-secondary)', stroke: '#fff', strokeWidth: 2, filter: 'url(#glow-expense)' }}
            style={{ filter: 'url(#glow-expense)' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
