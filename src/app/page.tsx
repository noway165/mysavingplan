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
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{user?.displayName || "Người dùng"}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3 self-end md:self-auto">
          <PageClock />
          <Link href="/transactions" className="flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary/90 px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-sm font-semibold text-primary-foreground transition-all shadow-sm whitespace-nowrap">
            <Plus size={16} /> Ghi chép
          </Link>
        </div>
      </div>

      {/* TOP: Balance & Summary Cards (Finflow Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Số dư */}
        <div className="bento-card p-5 md:p-6 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Số dư</div>
            <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center text-primary">
              <Wallet size={16} />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold tracking-tight text-primary">{formatCurrency(balance)}</div>
        </div>
        
        {/* Tiết kiệm */}
        <div className="bento-card p-5 md:p-6 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Tiết kiệm</div>
            <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center text-primary">
              <Target size={16} />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{formatCurrency(totalSaved)}</div>
        </div>

        {/* Thu nhập */}
        <div className="bento-card p-5 md:p-6 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Tổng thu</div>
            <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center text-primary">
              <ArrowDownRight size={16} />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{formatCurrency(totalIncome)}</div>
        </div>

        {/* Đã chi */}
        <div className="bento-card p-5 md:p-6 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Tổng chi</div>
            <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center text-primary">
              <ArrowUpRight size={16} />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{formatCurrency(totalExpense)}</div>
        </div>
      </div>

      {/* GAMIFICATION & AI INSIGHTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <GamificationWidget transactions={transactions} />
        </div>
        <div className="lg:col-span-1">
          <AIWidget transactions={transactions} />
        </div>
      </div>

      {/* BUCKETS ALLOCATION ROW */}
      <div>
        <BucketsWidget balance={balance} />
      </div>

      {/* MIDDLE: Tabs Layout for Charts & Plant */}
      <div>
        <div className="bento-card overflow-hidden flex flex-col">
          {/* Segmented Control Tabs */}
          <div className="p-3">
            <div className="flex items-center p-1 bg-muted rounded-xl overflow-x-auto hide-scrollbar">
              <button 
                onClick={() => setActiveTab('cashflow')}
                className={`whitespace-nowrap flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${activeTab === 'cashflow' ? 'bg-primary shadow-sm text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <BarChart3 size={16} /> Luồng tiền
              </button>
              <button 
                onClick={() => setActiveTab('category')}
                className={`whitespace-nowrap flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${activeTab === 'category' ? 'bg-primary shadow-sm text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <PieChart size={16} /> Cơ cấu
              </button>
              <button 
                onClick={() => setActiveTab('plant')}
                className={`whitespace-nowrap flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${activeTab === 'plant' ? 'bg-primary shadow-sm text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Sprout size={16} /> Cây tiết kiệm
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 md:p-6 h-[400px] md:h-[450px]">
            <AnimatePresence mode="wait">
              {activeTab === 'cashflow' && (
                <motion.div key="cashflow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="h-full">
                  <DashboardCharts transactions={transactions} />
                </motion.div>
              )}
              {activeTab === 'category' && (
                <motion.div key="category" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="h-full flex items-center justify-center">
                  <div className="w-full max-w-[500px]">
                    <CategoryPieChart transactions={transactions} />
                  </div>
                </motion.div>
              )}
              {activeTab === 'plant' && (
                <motion.div key="plant" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="h-full">
                  <SavingsPlant totalSaved={totalSaved} totalTarget={totalGoalsTarget} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* BOTTOM: Recent Transactions */}
      <div>
        <div className="bento-card p-5 md:p-8">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-widest">Giao dịch gần đây</h2>
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
