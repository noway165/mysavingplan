"use client"

import { ArrowDownRight, ArrowUpRight, Wallet, Target, Plus, TrendingUp, TrendingDown, Clock, ChevronRight } from "lucide-react"
import { DashboardCharts } from "@/components/DashboardCharts"
import { CategoryPieChart } from "@/components/CategoryPieChart"
import { PageClock } from "@/components/PageClock"
import { SavingsPlant } from "@/components/SavingsPlant"
import { useTransactions } from "@/hooks/useTransactions"
import { useGoals } from "@/hooks/useGoals"
import { useSettings } from "@/context/SettingsContext"
import { useAuth } from "@/components/AuthProvider"
import { TiltWrapper } from "@/components/TiltWrapper"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Home() {
  const { t, formatCurrency } = useSettings()
  const { user } = useAuth()
  const { transactions, loading: tLoading } = useTransactions()
  const { goals, loading: gLoading } = useGoals()

  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpense
  const totalSaved = goals.reduce((sum, g) => sum + g.saved, 0)
  const totalGoalsTarget = goals.reduce((sum, g) => sum + g.target, 0)

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
  }).slice(0, 4) // Show 4 instead of 5 for better fit in Bento

  if (tLoading || gLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-2">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-bold text-xl border border-primary/20 shadow-sm">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">Chào buổi sáng,</p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{user?.displayName || "Người dùng"}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <PageClock />
        </div>
      </div>

      {/* BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 auto-rows-[minmax(140px,auto)]">
        
        {/* BENTO 1: Tổng quan (Span 2x2) */}
        <TiltWrapper className="md:col-span-2 lg:col-span-3 md:row-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-[2rem] bg-card/60 backdrop-blur-2xl p-6 sm:p-8 shadow-sm border border-primary/20 relative overflow-hidden flex flex-col justify-between group hover:border-primary transition-colors duration-500 h-full"
          >
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                <Wallet size={16} className="text-primary" />
                Tổng tài sản
              </div>
              <div className={`text-4xl sm:text-5xl font-black tracking-tight font-playfair ${balance >= 0 ? "text-foreground" : "text-destructive"}`}>
                {formatCurrency(balance)}
              </div>
            </div>

            <div className="relative z-10 mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/transactions" className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02] transition-all active:scale-95">
                <Plus size={18} /> Ghi chép mới
              </Link>
              <Link href="/goals" className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-background/50 backdrop-blur-md px-4 py-3.5 text-sm font-bold text-foreground border border-border/50 hover:bg-muted hover:scale-[1.02] transition-all active:scale-95">
                <Target size={18} /> Tạo mục tiêu
              </Link>
            </div>
          </motion.div>
        </TiltWrapper>

        {/* BENTO 2: Thu nhập (Span 1x1) */}
        <TiltWrapper className="md:col-span-1 lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-[2rem] bg-card/60 backdrop-blur-2xl p-6 shadow-sm border border-emerald-500/20 flex flex-col justify-center relative overflow-hidden h-full group hover:border-emerald-500/50 transition-colors"
          >
            <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
              <TrendingUp size={100} />
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
              <div className="h-8 w-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <ArrowUpRight size={16} />
              </div>
              Thu nhập
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground font-playfair">{formatCurrency(totalIncome)}</div>
          </motion.div>
        </TiltWrapper>

        {/* BENTO 3: Chi tiêu (Span 1x1) */}
        <TiltWrapper className="md:col-span-1 lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-[2rem] bg-card/60 backdrop-blur-2xl p-6 shadow-sm border border-destructive/20 flex flex-col justify-center relative overflow-hidden h-full group hover:border-destructive/50 transition-colors"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-destructive mb-2">
              <div className="h-8 w-8 rounded-xl bg-destructive/20 flex items-center justify-center">
                <ArrowDownRight size={16} />
              </div>
              Đã chi
            </div>
            <div className="text-2xl font-bold text-foreground font-playfair">{formatCurrency(totalExpense)}</div>
          </motion.div>
        </TiltWrapper>

        {/* BENTO 4: Chậu Cây Tiết Kiệm (Span 2x2) */}
        <TiltWrapper className="md:col-span-2 lg:col-span-3 md:row-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-[2rem] bg-card/60 backdrop-blur-2xl shadow-sm border border-primary/20 flex flex-col justify-center overflow-hidden h-full group hover:border-primary transition-colors"
          >
            <SavingsPlant totalSaved={totalSaved} totalTarget={totalGoalsTarget} />
          </motion.div>
        </TiltWrapper>

        {/* BENTO 5: Biểu đồ Thu/Chi (Span 2x2) */}
        <TiltWrapper className="md:col-span-2 lg:col-span-3 md:row-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-[2rem] bg-card/60 backdrop-blur-2xl p-6 shadow-sm border border-primary/20 h-full group hover:border-primary transition-colors"
          >
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">Thống kê Luồng tiền</h2>
            <DashboardCharts transactions={transactions} />
          </motion.div>
        </TiltWrapper>

        {/* BENTO 6: Cơ cấu chi tiêu (Span 2x2) */}
        <TiltWrapper className="md:col-span-2 lg:col-span-3 md:row-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-[2rem] bg-card/60 backdrop-blur-2xl p-6 shadow-sm border border-primary/20 h-full group hover:border-primary transition-colors"
          >
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Cơ cấu chi tiêu</h2>
            <CategoryPieChart transactions={transactions} />
          </motion.div>
        </TiltWrapper>

        {/* BENTO 7: Giao dịch gần nhất (Span 4x2) */}
        <TiltWrapper className="md:col-span-4 lg:col-span-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-[2rem] bg-card/60 backdrop-blur-2xl p-6 shadow-sm border border-primary/20 flex flex-col h-full group hover:border-primary transition-colors"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Giao dịch gần đây</h2>
              <Link href="/transactions" className="text-sm font-bold text-primary flex items-center hover:opacity-80 transition-opacity">
                Tất cả <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>

            {recentTransactions.length === 0 ? (
               <div className="flex flex-col items-center justify-center text-center py-6">
                 <div className="h-12 w-12 rounded-2xl bg-background/50 flex items-center justify-center text-muted-foreground mb-3">
                   <Clock size={24} />
                 </div>
                 <p className="text-muted-foreground text-sm font-medium">Chưa có giao dịch nào</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentTransactions.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-background/40 hover:bg-background/60 transition-colors border border-border/30">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${tx.type === "income" ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-destructive/20 text-destructive"} shadow-inner`}>
                        {tx.type === "income" ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-sm line-clamp-1">{tx.title}</p>
                        <p className="text-xs font-medium text-muted-foreground mt-0.5">{tx.category} &bull; {tx.date}</p>
                      </div>
                    </div>
                    <span className={`font-black text-sm whitespace-nowrap ${tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>
                      {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </TiltWrapper>
      </div>
    </div>
  )
}
