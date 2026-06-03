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

type Props = {
  transactions: Transaction[]
}

export function DashboardCharts({ transactions }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="h-[300px] w-full mt-4 flex flex-col items-center justify-center text-center">
        <div className="h-14 w-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-4">
          <FileText size={28} />
        </div>
        <p className="text-gray-400 text-sm mb-1">Chưa có dữ liệu</p>
        <p className="text-gray-400 text-xs">Hãy ghi chép giao dịch đầu tiên để xem biểu đồ.</p>
      </div>
    )
  }

  // Group transactions by date and sum amounts
  const dateMap = new Map<string, { income: number; expense: number }>()
  transactions.forEach(t => {
    const existing = dateMap.get(t.date) || { income: 0, expense: 0 }
    if (t.type === "income") {
      existing.income += t.amount
    } else {
      existing.expense += t.amount
    }
    dateMap.set(t.date, existing)
  })

  const data = Array.from(dateMap.entries())
    .map(([date, values]) => ({ date, ...values }))
    .reverse()
    .slice(-7) // Show last 7 dates

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
            tick={{ fontSize: 12, fill: '#9ca3af' }} 
            dy={10}
          />
          <YAxis hide />
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f3f4f6" />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => [`${Number(value).toLocaleString()} ₫`, 'Số tiền']}
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
