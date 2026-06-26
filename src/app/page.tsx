"use client"

import { useState } from "react"
import { ArrowDownRight, ArrowUpRight, Wallet, Target, Plus, Clock, ChevronRight, BarChart3, PieChart, Sprout } from "lucide-react"
import { DashboardCharts } from "@/components/DashboardCharts"
import { CategoryPieChart } from "@/components/CategoryPieChart"
import { PageClock } from "@/components/PageClock"
import { SavingsPlant } from "@/components/SavingsPlant"
import { useTransactions } from "@/hooks/useTransactions"
import { useGoals } from "@/hooks/useGoals"
import { useSettings } from "@/context/SettingsContext"
import { useAuth } from "@/components/AuthProvider"
import { TiltWrapper } from "@/components/TiltWrapper"
import { GamificationWidget } from "@/components/GamificationWidget"
import { BucketsWidget } from "@/components/BucketsWidget"
import { AIWidget } from "@/components/AIWidget"
import { DashboardInsights } from "@/components/DashboardInsights"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const { t, formatCurrency } = useSettings()
  const { user } = useAuth()
  const { transactions, loading: tLoading } = useTransactions()
  const { goals, loading: gLoading } = useGoals()
  const [activeTab, setActiveTab] = useState<'cashflow' | 'category' | 'plant'>('cashflow')

  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpense
  const totalSaved = goals.reduce((sum, g) => sum + g.saved, 0)
  const totalGoalsTarget = goals.reduce((sum, g) => sum + g.target, 0)

  // 5 Recent transactions
  const recentTransactions = [...transactions].sort((a, b) => {
    try {
      const partsA = a.date.split('/')
      const partsB = b.date.split('/')
      const dateA = new Date(`${partsA[2]}-${partsA[1]}-${partsA[0]}T${a.time || '00:00'}`).getTime()
      const dateB = new Date(`${partsB[2]}-${partsB[1]}-${partsB[0]}T${b.time || '00:00'}`).getTime()
      return dateB - dateA
    } catch {
      return 0
    }
  }).slice(0, 5)

  if (tLoading || gLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-10 px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-white dark:bg-black border border-black/10 shadow-sm flex items-center justify-center text-primary font-bold text-xl md:text-2xl">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <p className="text-muted-foreground text-xs md:text-sm font-medium tracking-wide">Good morning,</p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-serif">{user?.displayName || "Người dùng"}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3 self-end md:self-auto">
          <PageClock />
          <Link href="/transactions" className="flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary/90 px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-sm font-semibold text-primary-foreground transition-all shadow-sm whitespace-nowrap">
            <Plus size={16} /> Ghi chép
          </Link>
        </div>
      </div>

      <div className="relative rounded-3xl overflow-hidden min-h-[600px] flex flex-col justify-between">

        {/* TOP ROW: Glassmorphism Control Panel */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-glass-card gradient-border shimmer-effect rounded-2xl p-4 flex flex-col justify-center border-l-4 border-l-neon-primary">
            <div className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Số dư hiện tại</div>
            <div className="text-xl md:text-2xl font-bold tracking-tight text-foreground neon-text-cyan">{formatCurrency(balance)}</div>
          </div>
          <div className="bg-glass-card gradient-border shimmer-effect rounded-2xl p-4 flex flex-col justify-center border-l-4 border-l-purple-500">
            <div className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Đã tiết kiệm</div>
            <div className="text-xl md:text-2xl font-bold tracking-tight text-foreground">{formatCurrency(totalSaved)}</div>
          </div>
          <div className="bg-glass-card rounded-2xl p-4 flex flex-col justify-center">
            <div className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1"><ArrowDownRight size={14} className="text-neon-primary" /> Tổng thu</div>
            <div className="text-lg md:text-xl font-bold tracking-tight text-foreground/90">{formatCurrency(totalIncome)}</div>
          </div>
          <div className="bg-glass-card rounded-2xl p-4 flex flex-col justify-center">
            <div className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1"><ArrowUpRight size={14} className="text-neon-secondary" /> Tổng chi</div>
            <div className="text-lg md:text-xl font-bold tracking-tight text-foreground/90">{formatCurrency(totalExpense)}</div>
          </div>
        </div>

        {/* MIDDLE: Massive Chart Area */}
        <div className="relative z-10 flex-1 flex flex-col lg:flex-row gap-6 h-full min-h-[400px]">
          {/* Main Chart */}
          <div className="flex-1 h-full w-full relative">
            <div className="absolute top-0 right-0 z-20 flex gap-2">
              <button onClick={() => setActiveTab('cashflow')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === 'cashflow' ? 'bg-neon-primary/20 text-neon-primary border border-neon-primary/50 shadow-[0_0_10px_color-mix(in_srgb,var(--neon-primary)_30%,transparent)]' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>Trend</button>
              <button onClick={() => setActiveTab('category')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === 'category' ? 'bg-neon-secondary/20 text-neon-secondary border border-neon-secondary/50 shadow-[0_0_10px_color-mix(in_srgb,var(--neon-secondary)_30%,transparent)]' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>Category</button>
              <button onClick={() => setActiveTab('plant')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === 'plant' ? 'bg-neon-primary/20 text-neon-primary border border-neon-primary/50 shadow-[0_0_10px_color-mix(in_srgb,var(--neon-primary)_30%,transparent)]' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>Plant</button>
            </div>
            
            <div className="w-full h-full pt-8 pb-4">
              <AnimatePresence mode="wait">
                {activeTab === 'cashflow' && (
                  <motion.div key="cashflow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                    <DashboardCharts transactions={transactions} />
                  </motion.div>
                )}
                {activeTab === 'category' && (
                  <motion.div key="category" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex items-center justify-center">
                    <div className="w-full max-w-[500px]">
                      <CategoryPieChart transactions={transactions} />
                    </div>
                  </motion.div>
                )}
                {activeTab === 'plant' && (
                  <motion.div key="plant" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                    <div className="absolute top-4 left-4 text-xs font-bold text-muted-foreground tracking-widest uppercase z-10">
                      Hệ Thống Tiết Kiệm
                    </div>
                    <SavingsPlant totalSaved={totalSaved} totalTarget={totalGoalsTarget} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Floating Side Panels (Glassmorphism) */}
          <div className="w-full lg:w-[350px] flex flex-col gap-4">
            <div className="bg-glass-card rounded-2xl border border-border/50 overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-neon-primary to-purple-500"></div>
              <GamificationWidget transactions={transactions} />
            </div>
            <div className="bg-glass-card rounded-2xl border border-border/50 overflow-hidden shadow-2xl relative flex-1">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-neon-secondary"></div>
              <AIWidget transactions={transactions} />
            </div>
          </div>
        </div>
      </div>

      {/* BUCKETS ALLOCATION ROW */}
      <div className="mt-8">
        <BucketsWidget balance={balance} />
      </div>

      {/* AI INSIGHTS ROW */}
      <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-1 rounded-full bg-gradient-to-b from-neon-primary to-neon-secondary"></div>
            <h2 className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-widest">AI Insights</h2>
          </div>
        <DashboardInsights transactions={transactions} balance={balance} />
      </div>

      {/* BOTTOM: Recent Transactions */}
      <div>
        <div className="bento-card p-5 md:p-8">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xs md:text-sm font-bold uppercase tracking-widest gradient-text-glow">Giao dịch gần đây</h2>
            <Link href="/transactions" className="text-sm font-semibold text-muted-foreground hover:text-foreground flex items-center transition-colors">
              Tất cả <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
             <div className="flex flex-col items-center justify-center text-center py-6">
               <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
                 <Clock size={24} />
               </div>
               <p className="text-muted-foreground text-sm font-medium tracking-wide">Chưa có giao dịch nào</p>
             </div>
          ) : (
            <div className="space-y-2">
              {recentTransactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl transition-colors hover:bg-muted/50 group">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center bg-background border border-border shadow-sm ${tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>
                      {tx.type === "income" ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm line-clamp-1">{tx.title}</p>
                      <p className="text-xs font-medium text-muted-foreground mt-0.5">{tx.category} &bull; {tx.date}</p>
                    </div>
                  </div>
                  <span className={`font-mono text-sm md:text-base whitespace-nowrap tracking-tight ${tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>
                    {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
