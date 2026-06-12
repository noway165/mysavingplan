"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Activity, TrendingUp, TrendingDown, AlertTriangle, Lightbulb } from "lucide-react"
import { useSettings } from "@/context/SettingsContext"
import { PageClock } from "@/components/PageClock"
import { TiltWrapper } from "@/components/TiltWrapper"
import { useTransactions } from "@/hooks/useTransactions"
import { 
  BarChart, Bar, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

export default function AnalyticsPage() {
  const { t, formatCurrency } = useSettings()
  const { transactions } = useTransactions()
  const [timeframe, setTimeframe] = useState<'3m' | '6m'>('6m')

  // MOCK DATA for 6 months (since we might not have 6 months of real data)
  const chartData = useMemo(() => [
    { month: 'Jan', income: 40000000, expense: 28000000, savings: 12000000, food: 8000000, bills: 5000000, transport: 3000000, leisure: 6000000 },
    { month: 'Feb', income: 42000000, expense: 29000000, savings: 13000000, food: 8200000, bills: 5100000, transport: 3200000, leisure: 5500000 },
    { month: 'Mar', income: 40000000, expense: 26000000, savings: 14000000, food: 7500000, bills: 5000000, transport: 2900000, leisure: 4000000 },
    { month: 'Apr', income: 41000000, expense: 27000000, savings: 14000000, food: 7800000, bills: 4900000, transport: 3100000, leisure: 4500000 },
    { month: 'May', income: 45000000, expense: 28000000, savings: 17000000, food: 8100000, bills: 5200000, transport: 3300000, leisure: 5000000 },
    { month: 'Jun', income: 48000000, expense: 25000000, savings: 23000000, food: 7000000, bills: 5000000, transport: 3000000, leisure: 3000000 },
  ], [])

  const displayData = timeframe === '6m' ? chartData : chartData.slice(3)

  const radarData = [
    { subject: 'Savings Rate', A: 85, fullMark: 100 },
    { subject: 'Budget Control', A: 65, fullMark: 100 },
    { subject: 'Goal Progress', A: 90, fullMark: 100 },
    { subject: 'Discipline', A: 75, fullMark: 100 },
    { subject: 'Income Growth', A: 60, fullMark: 100 },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/90 border border-border p-3 rounded-lg shadow-xl backdrop-blur-md">
          <p className="font-bold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-0 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-playfair drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            Spending Analytics
          </h1>
          <p className="text-muted-foreground mt-1 font-mono text-sm tracking-wider uppercase">Patterns, trends, and AI insights</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-background/40 border border-border rounded-lg p-1 flex">
            <button 
              onClick={() => setTimeframe('3m')}
              className={`px-4 py-1 text-sm rounded-md transition-colors ${timeframe === '3m' ? 'bg-primary text-primary-foreground shadow-md' : 'text-foreground hover:bg-white/5'}`}
            >
              3m
            </button>
            <button 
              onClick={() => setTimeframe('6m')}
              className={`px-4 py-1 text-sm rounded-md transition-colors ${timeframe === '6m' ? 'bg-primary text-primary-foreground shadow-md' : 'text-foreground hover:bg-white/5'}`}
            >
              6m
            </button>
          </div>
          <PageClock />
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-glass-card p-6 rounded-2xl border border-border/50 shadow-lg">
          <p className="text-sm text-muted-foreground font-medium mb-2">Avg. Savings Rate</p>
          <p className="text-4xl font-bold text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)] mb-1">58%</p>
          <p className="text-xs text-muted-foreground">of income saved monthly</p>
        </div>
        <div className="bg-glass-card p-6 rounded-2xl border border-border/50 shadow-lg">
          <p className="text-sm text-muted-foreground font-medium mb-2">Total Saved ({timeframe})</p>
          <p className="text-4xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.3)] mb-1">{formatCurrency(93000000)}</p>
          <p className="text-xs text-muted-foreground">across all categories</p>
        </div>
        <div className="bg-glass-card p-6 rounded-2xl border border-border/50 shadow-lg">
          <p className="text-sm text-muted-foreground font-medium mb-2">Best Month</p>
          <p className="text-4xl font-bold text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.3)] mb-1">Jun</p>
          <p className="text-xs text-muted-foreground">{formatCurrency(23000000)} saved</p>
        </div>
      </div>

      {/* Middle Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-glass-card p-6 rounded-2xl border border-border/50 shadow-lg h-[400px] flex flex-col">
          <h3 className="font-bold text-lg text-foreground mb-4">Income vs Expenses vs Savings</h3>
          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="savings" name="Savings" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-glass-card p-6 rounded-2xl border border-border/50 shadow-lg h-[400px] flex flex-col">
          <h3 className="font-bold text-lg text-foreground mb-4">Category Spending Trend</h3>
          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Line type="monotone" dataKey="food" name="Food" stroke="#f59e0b" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="bills" name="Bills" stroke="#ef4444" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="transport" name="Transport" stroke="#0ea5e9" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="leisure" name="Leisure" stroke="#8b5cf6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart */}
        <div className="bg-glass-card p-6 rounded-2xl border border-border/50 shadow-lg col-span-1 flex flex-col">
          <h3 className="font-bold text-lg text-foreground mb-2">Financial Health Score</h3>
          <div className="flex-1 w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                <Radar name="Score" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-2">
            <p className="text-4xl font-bold text-emerald-400">73<span className="text-xl text-muted-foreground font-normal">/100</span></p>
            <p className="text-sm text-muted-foreground mt-1">Good — Keep it up!</p>
          </div>
        </div>

        {/* AI Insights List */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
            <Activity className="text-primary" size={20} /> AI Insights
          </h3>
          
          <div className="bg-glass-card p-4 rounded-xl border border-border/50 hover:bg-white/5 transition-colors flex gap-4 items-start group">
            <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400 shrink-0 mt-1">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-foreground group-hover:text-emerald-300 transition-colors">
                Your savings rate improved by 29% compared to January. You're on track!
              </p>
            </div>
          </div>

          <div className="bg-glass-card p-4 rounded-xl border border-border/50 hover:bg-white/5 transition-colors flex gap-4 items-start group">
            <div className="bg-amber-500/10 p-2 rounded-lg text-amber-400 shrink-0 mt-1">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-foreground group-hover:text-amber-300 transition-colors">
                Leisure spending spiked 175% in June vs May. Consider setting a leisure budget cap.
              </p>
            </div>
          </div>

          <div className="bg-glass-card p-4 rounded-xl border border-border/50 hover:bg-white/5 transition-colors flex gap-4 items-start group">
            <div className="bg-cyan-500/10 p-2 rounded-lg text-cyan-400 shrink-0 mt-1">
              <TrendingDown size={20} />
            </div>
            <div>
              <p className="text-foreground group-hover:text-cyan-300 transition-colors">
                Food expenses are 19% lower than your 6-month average. Great discipline!
              </p>
            </div>
          </div>

          <div className="bg-glass-card p-4 rounded-xl border border-border/50 hover:bg-white/5 transition-colors flex gap-4 items-start group">
            <div className="bg-purple-500/10 p-2 rounded-lg text-purple-400 shrink-0 mt-1">
              <Lightbulb size={20} />
            </div>
            <div>
              <p className="text-foreground group-hover:text-purple-300 transition-colors">
                If you maintain June's savings rate, you'll reach your Emergency Fund goal by October.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
