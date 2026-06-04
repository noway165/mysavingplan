"use client"

import { ArrowDownRight, ArrowUpRight, Wallet, Target, Plus, TrendingUp, TrendingDown, Clock } from "lucide-react"
import { DashboardCharts } from "@/components/DashboardCharts"
import { CategoryPieChart } from "@/components/CategoryPieChart"
import { ActivityHeatmap } from "@/components/ActivityHeatmap"
import { useTransactions } from "@/hooks/useTransactions"
import { useGoals } from "@/hooks/useGoals"
import { useSettings } from "@/context/SettingsContext"
import Link from "next/link"

export default function Home() {
  const { t, formatCurrency } = useSettings()
  const { transactions, loading: tLoading } = useTransactions()
  const { goals, loading: gLoading } = useGoals()

  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpense
  const totalSaved = goals.reduce((sum, g) => sum + g.saved, 0)

  // Calculate vs last month
  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  
  const thisMonthExpense = transactions.filter(t => {
    if (t.type !== "expense") return false
    try {
      const parts = t.date.split('/')
      const txDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)
      return txDate >= thisMonthStart
    } catch { return false }
  }).reduce((sum, t) => sum + t.amount, 0)

  const lastMonthExpense = transactions.filter(t => {
    if (t.type !== "expense") return false
    try {
      const parts = t.date.split('/')
      const txDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)
      return txDate >= lastMonthStart && txDate < thisMonthStart
    } catch { return false }
  }).reduce((sum, t) => sum + t.amount, 0)

  const expenseChange = lastMonthExpense === 0 ? 0 : ((thisMonthExpense - lastMonthExpense) / lastMonthExpense) * 100

  // 5 Recent transactions
  const recentTransactions = [...transactions].sort((a, b) => {
    try {
      const partsA = a.date.split('/')
      const partsB = b.date.split('/')
      const dateA = new Date(`${partsA[2]}-${partsA[1]}-${partsA[0]}T${a.time || '00:00'}`).getTime()
      const dateB = new Date(`${partsB[2]}-${partsB[1]}-${partsB[0]}T${b.time || '00:00'}`).getTime()
      return dateB - dateA // Sort descending
    } catch {
      return 0
    }
  }).slice(0, 5)

  if (tLoading || gLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{t('overview')}</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Chào mừng trở lại! Dưới đây là tình hình tài chính của bạn.</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Link href="/goals" className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-card px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-foreground shadow-sm ring-1 ring-inset ring-border hover:bg-muted transition-colors">
            <Plus size={14} /> {t('create_goal')}
          </Link>
          <Link href="/transactions" className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-primary px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors">
            <Plus size={14} /> {t('add_record')}
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
        {/* Số dư */}
        <div className="rounded-2xl bg-card p-4 sm:p-6 shadow-sm border border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Wallet size={64} />
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Wallet size={16} />
            </div>
            {t('balance')}
          </div>
          <div className={`text-2xl sm:text-3xl font-bold ${balance >= 0 ? "text-foreground" : "text-destructive"}`}>{formatCurrency(balance)}</div>
          <div className="mt-4 flex items-center text-sm">
            <span className="flex items-center text-primary font-medium">
              <TrendingUp size={16} className="mr-1" />
              Đã tiết kiệm: {formatCurrency(totalSaved)}
            </span>
          </div>
        </div>

        {/* Thu nhập */}
        <div className="rounded-2xl bg-card p-4 sm:p-6 shadow-sm border border-border">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
            <div className="h-8 w-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight size={16} />
            </div>
            {t('income')}
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-foreground">{formatCurrency(totalIncome)}</div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-muted-foreground">{transactions.filter(t => t.type === "income").length} {t('transactions_count')}</span>
          </div>
        </div>

        {/* Chi tiêu */}
        <div className="rounded-2xl bg-card p-4 sm:p-6 shadow-sm border border-border">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
            <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
              <ArrowDownRight size={16} />
            </div>
            {t('expense')}
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-foreground">{formatCurrency(totalExpense)}</div>
          <div className="mt-4 flex items-center text-sm">
            {lastMonthExpense > 0 ? (
              <span className={`flex items-center font-medium ${expenseChange > 0 ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"}`}>
                {expenseChange > 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                {Math.abs(expenseChange).toFixed(1)}% {t('vs_last_month')}
              </span>
            ) : (
              <span className="text-muted-foreground">{transactions.filter(t => t.type === "expense").length} {t('transactions_count')}</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl bg-card p-4 sm:p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Biểu đồ Thu / Chi</h2>
          </div>
          <DashboardCharts transactions={transactions} />
        </div>

        <div className="rounded-2xl bg-card p-4 sm:p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">{t('category_chart')}</h2>
          </div>
          <CategoryPieChart transactions={transactions} />
        </div>
      </div>

      <ActivityHeatmap />

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        {/* Recent Transactions */}
        <div className="rounded-2xl bg-card p-4 sm:p-6 shadow-sm border border-border flex flex-col">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">{t('recent_transactions')}</h2>
            <Link href="/transactions" className="text-sm text-primary font-medium hover:underline">
              Xem tất cả
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
               <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground opacity-50 mb-4">
                 <Clock size={28} />
               </div>
               <p className="text-muted-foreground text-sm mb-1">{t('no_data')}</p>
             </div>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${tx.type === "income" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-destructive/10 text-destructive"}`}>
                      {tx.type === "income" ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm line-clamp-1">{tx.title}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <span className={`font-semibold text-sm ${tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>
                    {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Goals */}
        <div className="rounded-2xl bg-card p-4 sm:p-6 shadow-sm border border-border flex flex-col">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">{t('savings_goals')}</h2>
            <Link href="/goals" className="text-sm text-primary font-medium hover:underline">
              Xem tất cả
            </Link>
          </div>

          {goals.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground opacity-50 mb-4">
                <Target size={28} />
              </div>
              <p className="text-muted-foreground text-sm mb-1">{t('no_goals')}</p>
            </div>
          ) : (
            <div className="space-y-6 flex-1">
              {goals.slice(0, 4).map((goal) => {
                const percent = goal.target > 0 ? Math.min(Math.round((goal.saved / goal.target) * 100), 100) : 0
                return (
                  <div key={goal.id} className="group cursor-pointer">
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`h-8 w-8 rounded-lg ${goal.color} flex items-center justify-center text-white shadow-sm`}>
                          <Target size={14} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">{goal.name}</div>
                          <div className="text-xs text-muted-foreground">Còn lại {formatCurrency(goal.target - goal.saved)}</div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-primary">{percent}%</div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full ${goal.color} rounded-full transition-all group-hover:scale-105 origin-left`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
