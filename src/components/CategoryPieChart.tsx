"use client"

import { useMemo } from "react"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts"
import { Transaction } from "@/hooks/useTransactions"
import { useSettings } from "@/context/SettingsContext"

interface CategoryPieChartProps {
  transactions: Transaction[]
}

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

    // Find the max value to set radius domain
    const maxVal = Math.max(...Object.values(categoryTotals), 0)

    // Format for Recharts
    return Object.entries(categoryTotals)
      .map(([subject, A]) => ({ subject, A, fullMark: maxVal }))
  }, [transactions])

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-primary/50 bg-primary/5 rounded-xl border border-primary/20 border-dashed backdrop-blur-md font-mono">
        <p className="animate-pulse">{t('no_data')} ...</p>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full font-mono relative group">
      {/* HUD Glow behind radar */}
      <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl scale-50 group-hover:scale-75 transition-transform duration-1000 pointer-events-none" />
      
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="rgba(var(--color-primary), 0.3)" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: "hsl(var(--primary))", fontSize: 10, fontFamily: 'monospace' }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} axisLine={false} />
          <Radar
            name="Chi tiêu"
            dataKey="A"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.4}
            className="drop-shadow-[0_0_10px_rgba(var(--color-primary),0.8)]"
          />
          <Tooltip 
            formatter={(value: any) => [formatCurrency(Number(value)), '']}
            contentStyle={{ 
              backgroundColor: 'rgba(var(--color-background), 0.9)', 
              borderColor: 'hsl(var(--primary))',
              color: 'hsl(var(--foreground))',
              borderRadius: '8px',
              fontFamily: 'monospace',
              boxShadow: '0 0 15px rgba(var(--color-primary), 0.3)'
            }}
            itemStyle={{ color: 'hsl(var(--primary))' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
