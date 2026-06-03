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

const data = [
  { date: "01/06", expense: 150000, income: 0 },
  { date: "02/06", expense: 200000, income: 1000000 },
  { date: "03/06", expense: 50000, income: 0 },
  { date: "04/06", expense: 300000, income: 0 },
  { date: "05/06", expense: 120000, income: 0 },
  { date: "06/06", expense: 400000, income: 500000 },
  { date: "07/06", expense: 80000, income: 0 },
]

export function DashboardCharts() {
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
          <YAxis 
            hide 
          />
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
