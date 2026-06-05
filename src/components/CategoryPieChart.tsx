"use client"

import { useMemo, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Transaction } from "@/hooks/useTransactions"
import { useSettings } from "@/context/SettingsContext"
import { Filter } from "lucide-react"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658', '#82ca9d', '#a4de6c']

interface CategoryPieChartProps {
  transactions: Transaction[]
}

type FilterOption = 'all' | 'today' | '3days' | '7days' | 'month';

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function CategoryPieChart({ transactions }: CategoryPieChartProps) {
  const { t, formatCurrency } = useSettings()
  const [filter, setFilter] = useState<FilterOption>('all')

  const data = useMemo(() => {
    // Determine date limit
    const now = new Date()
    now.setHours(23, 59, 59, 999)
    let startDate = new Date(0) // beginning of time

    if (filter === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    } else if (filter === '3days') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2)
    } else if (filter === '7days') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
    } else if (filter === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    // Only analyze expenses and apply filter
    const expenses = transactions.filter(t => {
      if (t.type !== 'expense') return false;
      
      try {
        const parts = t.date.split('/')
        const txDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]))
        return txDate >= startDate && txDate <= now
      } catch {
        return false;
      }
    })
    
    // Calculate total per category
    const categoryTotals: Record<string, number> = {}
    expenses.forEach(tx => {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount
    })

    // Format for Recharts
    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value) // Sort descending
  }, [transactions, filter])

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Date Filter Bar */}
      <div className="flex justify-between items-center mb-2 z-10">
        <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
          <Filter size={14} /> Thời gian:
        </div>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterOption)}
          className="bg-background/40 border border-border/50 text-foreground text-xs rounded-lg focus:ring-primary focus:border-primary block p-1.5 backdrop-blur-md outline-none cursor-pointer"
        >
          <option value="all">Tất cả</option>
          <option value="today">Hôm nay</option>
          <option value="3days">3 ngày qua</option>
          <option value="7days">7 ngày qua</option>
          <option value="month">Tháng này</option>
        </select>
      </div>

      {data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 rounded-xl border border-border/50 border-dashed backdrop-blur-sm min-h-[250px]">
          <p className="text-sm font-medium">Không có chi tiêu nào</p>
          <p className="text-xs opacity-70">trong khoảng thời gian này</p>
        </div>
      ) : (
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={90}
                innerRadius={50}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
                label={renderCustomizedLabel}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => formatCurrency(Number(value))}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--color-card)', color: 'var(--color-foreground)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
