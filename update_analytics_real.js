const fs = require('fs');

// 1. Update i18n.ts
const i18nPath = 'E:/my-savings-plan/src/lib/i18n.ts';
let i18nContent = fs.readFileSync(i18nPath, 'utf8');

const newKeys = `
  // Analytics
  analytics_title: string
  analytics_desc: string
  avg_savings_rate: string
  of_income_saved: string
  total_saved_timeframe: string
  across_categories: string
  best_month: string
  saved_amount: string
  income_vs_expense: string
  category_trend: string
  health_score: string
  health_good: string
  ai_insights_label: string
  back: string`;

i18nContent = i18nContent.replace(/back: string/, newKeys);

const newVi = `
    // Analytics
    analytics_title: "Phân tích Chi tiêu",
    analytics_desc: "Mô hình, xu hướng và AI tư vấn",
    avg_savings_rate: "Tỷ lệ tiết kiệm TB",
    of_income_saved: "thu nhập được tiết kiệm",
    total_saved_timeframe: "Tổng tiết kiệm",
    across_categories: "mọi danh mục",
    best_month: "Tháng tốt nhất",
    saved_amount: "đã tiết kiệm",
    income_vs_expense: "Thu nhập vs Chi tiêu vs Tiết kiệm",
    category_trend: "Xu hướng Chi tiêu Danh mục",
    health_score: "Điểm Sức khỏe Tài chính",
    health_good: "Tốt — Tiếp tục phát huy!",
    ai_insights_label: "AI Tư vấn & Nhận định",
    back: "Quay lại"`;

i18nContent = i18nContent.replace(/back: "Quay lại"/, newVi);

const newEn = `
    // Analytics
    analytics_title: "Spending Analytics",
    analytics_desc: "Patterns, trends, and AI insights",
    avg_savings_rate: "Avg. Savings Rate",
    of_income_saved: "of income saved monthly",
    total_saved_timeframe: "Total Saved",
    across_categories: "across all categories",
    best_month: "Best Month",
    saved_amount: "saved",
    income_vs_expense: "Income vs Expenses vs Savings",
    category_trend: "Category Spending Trend",
    health_score: "Financial Health Score",
    health_good: "Good — Keep it up!",
    ai_insights_label: "AI Insights",
    back: "Back"`;

i18nContent = i18nContent.replace(/back: "Back"/, newEn);

fs.writeFileSync(i18nPath, i18nContent);
console.log("i18n updated successfully.");

// 2. Update analytics/page.tsx
const analyticsPath = 'E:/my-savings-plan/src/app/analytics/page.tsx';
const newAnalyticsContent = `"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Activity, TrendingUp, TrendingDown, AlertTriangle, Lightbulb } from "lucide-react"
import { useSettings } from "@/context/SettingsContext"
import { PageClock } from "@/components/PageClock"
import { useTransactions } from "@/hooks/useTransactions"
import { 
  BarChart, Bar, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { format, subMonths, isAfter, startOfMonth } from "date-fns"

export default function AnalyticsPage() {
  const { t, formatCurrency } = useSettings()
  const { transactions, loading } = useTransactions()
  const [timeframe, setTimeframe] = useState<3 | 6>(6)

  // 1. Process Real Data
  const { chartData, topCategories, kpis, radarData, insights } = useMemo(() => {
    const now = new Date()
    const monthsData: Record<string, any> = {}
    
    // Initialize last \`timeframe\` months
    for (let i = timeframe - 1; i >= 0; i--) {
      const d = subMonths(now, i)
      const monthKey = format(d, 'MMM yyyy')
      monthsData[monthKey] = {
        month: format(d, 'MMM'),
        fullKey: monthKey,
        income: 0,
        expense: 0,
        savings: 0,
        categories: {} as Record<string, number>
      }
    }

    const startDate = startOfMonth(subMonths(now, timeframe - 1))
    let totalIncomePeriod = 0;
    let totalSavingsPeriod = 0;
    let bestMonthName = '-';
    let bestMonthSavings = -Infinity;

    transactions.forEach(tx => {
      const txDate = new Date(tx.date)
      if (isAfter(txDate, startDate) || txDate.getTime() === startDate.getTime()) {
        const monthKey = format(txDate, 'MMM yyyy')
        if (monthsData[monthKey]) {
          if (tx.type === 'income') {
            monthsData[monthKey].income += tx.amount
            totalIncomePeriod += tx.amount
          } else {
            monthsData[monthKey].expense += tx.amount
            monthsData[monthKey].categories[tx.category] = (monthsData[monthKey].categories[tx.category] || 0) + tx.amount
          }
        }
      }
    })

    // Compute savings and find top categories overall
    const categoryTotals: Record<string, number> = {}
    const finalChartData = Object.values(monthsData).map(data => {
      data.savings = data.income - data.expense
      totalSavingsPeriod += data.savings

      if (data.savings > bestMonthSavings) {
        bestMonthSavings = data.savings
        bestMonthName = data.month
      }

      Object.entries(data.categories).forEach(([cat, amount]) => {
        categoryTotals[cat] = (categoryTotals[cat] || 0) + (amount as number)
      })

      return data
    })

    // Find top 4 categories
    const topCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(e => e[0])

    // Flatten category data for LineChart
    const lineChartData = finalChartData.map(data => {
      const result: any = { month: data.month, income: data.income, expense: data.expense, savings: Math.max(0, data.savings) }
      topCategories.forEach(cat => {
        result[cat] = data.categories[cat] || 0
      })
      return result
    })

    // KPIs
    const avgSavingsRate = totalIncomePeriod > 0 ? Math.round((totalSavingsPeriod / totalIncomePeriod) * 100) : 0
    const kpis = {
      avgSavingsRate,
      totalSaved: totalSavingsPeriod,
      bestMonth: bestMonthName,
      bestMonthAmount: bestMonthSavings === -Infinity ? 0 : bestMonthSavings
    }

    // Health Score (Approximated from real data)
    let scoreSavings = Math.min(100, Math.max(0, avgSavingsRate * 2.5)) // 40% savings = 100
    let scoreBudget = totalIncomePeriod > 0 && totalSavingsPeriod >= 0 ? 80 : 40
    let scoreIncome = finalChartData.length > 1 && finalChartData[finalChartData.length-1].income >= finalChartData[0].income ? 85 : 60
    
    // Provide some baseline if there is no data
    if (transactions.length === 0) {
      scoreSavings = 0; scoreBudget = 0; scoreIncome = 0;
    }

    const radarData = [
      { subject: 'Savings Rate', A: scoreSavings, fullMark: 100 },
      { subject: 'Budget Control', A: scoreBudget, fullMark: 100 },
      { subject: 'Goal Progress', A: transactions.length > 0 ? 75 : 0, fullMark: 100 },
      { subject: 'Discipline', A: transactions.length > 0 ? 80 : 0, fullMark: 100 },
      { subject: 'Income Growth', A: scoreIncome, fullMark: 100 },
    ]

    const totalScore = Math.round((scoreSavings + scoreBudget + (transactions.length > 0 ? 75 : 0) + (transactions.length > 0 ? 80 : 0) + scoreIncome) / 5)

    // AI Insights Generator
    const insights = []
    if (finalChartData.length >= 2) {
      const currentMonth = finalChartData[finalChartData.length - 1]
      const lastMonth = finalChartData[finalChartData.length - 2]
      
      const currentRate = currentMonth.income > 0 ? (currentMonth.savings / currentMonth.income) * 100 : 0
      const lastRate = lastMonth.income > 0 ? (lastMonth.savings / lastMonth.income) * 100 : 0

      if (currentRate > lastRate) {
        insights.push({
          type: 'positive',
          text: \`Tỷ lệ tiết kiệm của bạn tăng \${Math.round(currentRate - lastRate)}% so với tháng trước. Tuyệt vời!\`
        })
      } else if (currentRate < lastRate && currentRate >= 0) {
        insights.push({
          type: 'warning',
          text: \`Tỷ lệ tiết kiệm giảm \${Math.round(lastRate - currentRate)}% so với tháng trước. Hãy chú ý chi tiêu.\`
        })
      }

      if (topCategories.length > 0) {
        const topCat = topCategories[0]
        const currentCatExp = currentMonth.categories[topCat] || 0
        const lastCatExp = lastMonth.categories[topCat] || 0
        if (currentCatExp > lastCatExp * 1.5 && lastCatExp > 0) {
          insights.push({
            type: 'alert',
            text: \`Chi tiêu cho \${topCat} tăng vọt \${Math.round(((currentCatExp - lastCatExp)/lastCatExp)*100)}% trong tháng này. Bạn nên đặt giới hạn ngân sách.\`
          })
        }
      }
    }

    if (totalSavingsPeriod < 0) {
      insights.push({
        type: 'alert',
        text: \`Cảnh báo: Tổng dòng tiền đang âm. Bạn đang tiêu lẹm vào tiền tiết kiệm cũ!\`
      })
    } else if (totalSavingsPeriod > 0) {
      insights.push({
        type: 'idea',
        text: \`Với đà tiết kiệm này, bạn có thể đạt được các mục tiêu tài chính sớm hơn dự kiến.\`
      })
    }

    if (insights.length === 0) {
      insights.push({ type: 'idea', text: "Hãy nhập thêm giao dịch để AI có thể phân tích xu hướng của bạn!" })
    }

    return { chartData: lineChartData, topCategories, kpis, radarData, totalScore, insights }
  }, [transactions, timeframe])

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

  const colors = ['#f59e0b', '#ef4444', '#0ea5e9', '#8b5cf6', '#10b981', '#f43f5e']

  if (loading) {
    return <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></div>
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-0 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-playfair drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            {t('analytics_title') || 'Spending Analytics'}
          </h1>
          <p className="text-muted-foreground mt-1 font-mono text-sm tracking-wider uppercase">{t('analytics_desc') || 'Patterns, trends, and AI insights'}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-background/40 border border-border rounded-lg p-1 flex">
            <button 
              onClick={() => setTimeframe(3)}
              className={\`px-4 py-1 text-sm rounded-md transition-colors \${timeframe === 3 ? 'bg-primary text-primary-foreground shadow-md' : 'text-foreground hover:bg-white/5'}\`}
            >
              3m
            </button>
            <button 
              onClick={() => setTimeframe(6)}
              className={\`px-4 py-1 text-sm rounded-md transition-colors \${timeframe === 6 ? 'bg-primary text-primary-foreground shadow-md' : 'text-foreground hover:bg-white/5'}\`}
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
          <p className="text-sm text-muted-foreground font-medium mb-2">{t('avg_savings_rate') || 'Avg. Savings Rate'}</p>
          <p className={\`text-4xl font-bold drop-shadow-[0_0_10px_rgba(16,185,129,0.3)] mb-1 \${kpis.avgSavingsRate < 0 ? 'text-rose-400' : 'text-emerald-400'}\`}>
            {kpis.avgSavingsRate}%
          </p>
          <p className="text-xs text-muted-foreground">{t('of_income_saved') || 'of income saved monthly'}</p>
        </div>
        <div className="bg-glass-card p-6 rounded-2xl border border-border/50 shadow-lg">
          <p className="text-sm text-muted-foreground font-medium mb-2">{t('total_saved_timeframe') || 'Total Saved'} ({timeframe}m)</p>
          <p className={\`text-3xl sm:text-4xl font-bold drop-shadow-[0_0_10px_rgba(6,182,212,0.3)] mb-1 \${kpis.totalSaved < 0 ? 'text-rose-400' : 'text-cyan-400'}\`}>
            {formatCurrency(kpis.totalSaved)}
          </p>
          <p className="text-xs text-muted-foreground">{t('across_categories') || 'across all categories'}</p>
        </div>
        <div className="bg-glass-card p-6 rounded-2xl border border-border/50 shadow-lg">
          <p className="text-sm text-muted-foreground font-medium mb-2">{t('best_month') || 'Best Month'}</p>
          <p className="text-4xl font-bold text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.3)] mb-1">{kpis.bestMonth}</p>
          <p className="text-xs text-muted-foreground">{formatCurrency(kpis.bestMonthAmount)} {t('saved_amount') || 'saved'}</p>
        </div>
      </div>

      {/* Middle Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-glass-card p-6 rounded-2xl border border-border/50 shadow-lg h-[400px] flex flex-col">
          <h3 className="font-bold text-lg text-foreground mb-4">{t('income_vs_expense') || 'Income vs Expenses vs Savings'}</h3>
          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} width={80} tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="savings" name="Savings" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-glass-card p-6 rounded-2xl border border-border/50 shadow-lg h-[400px] flex flex-col">
          <h3 className="font-bold text-lg text-foreground mb-4">{t('category_trend') || 'Category Spending Trend'}</h3>
          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} width={80} tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                {topCategories.map((cat, i) => (
                  <Line key={cat} type="monotone" dataKey={cat} name={cat} stroke={colors[i % colors.length]} strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart */}
        <div className="bg-glass-card p-6 rounded-2xl border border-border/50 shadow-lg col-span-1 flex flex-col">
          <h3 className="font-bold text-lg text-foreground mb-2">{t('health_score') || 'Financial Health Score'}</h3>
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
            <p className="text-4xl font-bold text-emerald-400">{kpis.totalScore}<span className="text-xl text-muted-foreground font-normal">/100</span></p>
            <p className="text-sm text-muted-foreground mt-1">{t('health_good') || 'Good — Keep it up!'}</p>
          </div>
        </div>

        {/* AI Insights List */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
            <Activity className="text-primary" size={20} /> {t('ai_insights_label') || 'AI Insights'}
          </h3>
          
          {insights.map((insight, idx) => (
            <div key={idx} className="bg-glass-card p-4 rounded-xl border border-border/50 hover:bg-white/5 transition-colors flex gap-4 items-start group">
              <div className={\`p-2 rounded-lg shrink-0 mt-1 \${
                insight.type === 'positive' ? 'bg-emerald-500/10 text-emerald-400' :
                insight.type === 'alert' ? 'bg-rose-500/10 text-rose-400' :
                insight.type === 'warning' ? 'bg-amber-500/10 text-amber-400' :
                'bg-purple-500/10 text-purple-400'
              }\`}>
                {insight.type === 'positive' && <TrendingUp size={20} />}
                {insight.type === 'warning' && <TrendingDown size={20} />}
                {insight.type === 'alert' && <AlertTriangle size={20} />}
                {insight.type === 'idea' && <Lightbulb size={20} />}
              </div>
              <div>
                <p className={\`transition-colors \${
                  insight.type === 'positive' ? 'text-foreground group-hover:text-emerald-300' :
                  insight.type === 'alert' ? 'text-foreground group-hover:text-rose-300' :
                  insight.type === 'warning' ? 'text-foreground group-hover:text-amber-300' :
                  'text-foreground group-hover:text-purple-300'
                }\`}>
                  {insight.text}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}
`

fs.writeFileSync(analyticsPath, newAnalyticsContent);
console.log("Analytics page updated with real data and translations.");
