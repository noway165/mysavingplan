"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Transaction } from "@/hooks/useTransactions"
import { useSettings } from "@/context/SettingsContext"

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--destructive))', 
  'hsl(120, 100%, 70%)', 
  'hsl(280, 100%, 70%)', 
  'hsl(40, 100%, 60%)', 
  'hsl(320, 100%, 60%)'
]

interface CategoryPieChartProps {
  transactions: Transaction[]
}

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold" className="drop-shadow-md">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function CategoryPieChart({ transactions }: CategoryPieChartProps) {
  const { t, formatCurrency } = useSettings()

  const data = useMemo(() => {
    // Only analyze expenses
    const expenses = transactions.filter(t => t.type === 'expense')
    
    // Calculate total per category
    const categoryTotals: Record<string, number> = {}
    expenses.forEach(tx => {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount
    })

    // Format for Recharts
    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value) // Sort descending
  }, [transactions])

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-primary/50 bg-primary/5 rounded-xl border border-primary/20 border-dashed backdrop-blur-md">
        <p className="animate-pulse">{t('no_data')} ...</p>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full relative group">
      {/* Background glow for the chart area */}
      <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl scale-50 group-hover:scale-75 transition-transform duration-1000 pointer-events-none" />
      
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={110}
            innerRadius={80} // This makes it a Doughnut Chart
            dataKey="value"
            paddingAngle={5} // Space between slices
            label={renderCustomizedLabel}
            stroke="rgba(0,0,0,0.2)"
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                style={{
                  filter: `drop-shadow(0 0 10px ${COLORS[index % COLORS.length]}80)`
                }}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any) => formatCurrency(Number(value))}
            contentStyle={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.8)', 
              borderColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              borderRadius: '12px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 0 20px rgba(0,0,0,0.5)'
            }}
            itemStyle={{ fontWeight: 'bold' }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center text for Doughnut */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
        <span className="text-sm font-semibold text-muted-foreground">Tổng chi</span>
      </div>
    </div>
  )
}
