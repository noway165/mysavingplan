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
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-[1.5rem] bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl border border-primary/20 shadow-sm backdrop-blur-md">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">Chào buổi sáng,</p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{user?.displayName || "Người dùng"}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <PageClock />
        </div>
      </div>

      {/* TOP: Balance & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TiltWrapper className="md:col-span-2">
          <div className="glass-bento p-8 relative overflow-hidden h-full flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
              <Wallet size={16} className="text-primary" /> Tổng tài sản
            </div>
            <div className={`text-5xl sm:text-6xl font-black tracking-tight font-playfair ${balance >= 0 ? "text-foreground" : "text-destructive"}`}>
              {formatCurrency(balance)}
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/transactions" className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02] transition-all active:scale-95">
                <Plus size={18} /> Ghi chép mới
              </Link>
              <Link href="/goals" className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-background/50 backdrop-blur-md px-6 py-4 text-sm font-bold text-foreground border border-border/50 hover:bg-muted hover:scale-[1.02] transition-all active:scale-95">
                <Target size={18} /> Tạo mục tiêu
              </Link>
            </div>
          </div>
        </TiltWrapper>

        <div className="grid grid-cols-2 md:grid-cols-1 gap-6">
          <TiltWrapper>
            <div className="glass-bento p-6 flex flex-col justify-center h-full">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                <ArrowUpRight size={16} /> Thu nhập
              </div>
              <div className="text-2xl font-bold font-playfair">{formatCurrency(totalIncome)}</div>
            </div>
          </TiltWrapper>
          <TiltWrapper>
            <div className="glass-bento p-6 flex flex-col justify-center h-full">
              <div className="flex items-center gap-2 text-sm font-semibold text-destructive mb-2">
                <ArrowDownRight size={16} /> Đã chi
              </div>
              <div className="text-2xl font-bold font-playfair">{formatCurrency(totalExpense)}</div>
            </div>
          </TiltWrapper>
        </div>
      </div>

      {/* MIDDLE: Tabs Layout for Charts & Plant */}
      <TiltWrapper>
        <div className="glass-bento overflow-hidden flex flex-col">
          {/* Tabs Navigation */}
          <div className="flex items-center p-2 border-b border-border/30 bg-background/20 backdrop-blur-sm">
            <button 
              onClick={() => setActiveTab('cashflow')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${activeTab === 'cashflow' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-background/50'}`}
            >
              <BarChart3 size={16} /> Luồng tiền
            </button>
            <button 
              onClick={() => setActiveTab('category')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${activeTab === 'category' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-background/50'}`}
            >
              <PieChart size={16} /> Cơ cấu
            </button>
            <button 
              onClick={() => setActiveTab('plant')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${activeTab === 'plant' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-background/50'}`}
            >
              <Sprout size={16} /> Cây tiết kiệm
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 h-[400px]">
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
      </TiltWrapper>

      {/* BOTTOM: Recent Transactions */}
      <TiltWrapper>
        <div className="glass-bento p-8">
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
            <div className="space-y-3">
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
        </div>
      </TiltWrapper>
    </div>
  )
}
