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
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-10 px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-white dark:bg-black border border-black/10 shadow-sm flex items-center justify-center text-primary font-bold text-xl md:text-2xl">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <p className="text-muted-foreground text-xs md:text-sm font-medium tracking-wide">Chào buổi sáng,</p>
            <h1 className="text-2xl md:text-3xl font-playfair italic font-bold tracking-tight text-foreground">{user?.displayName || "Người dùng"}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3 self-end md:self-auto">
          <PageClock />
        </div>
      </div>

      {/* TOP: Balance & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* THE BLACK CARD */}
          <div className="black-card p-6 md:p-8 relative h-full flex flex-col justify-between min-h-[220px]">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none" />
            <div className="flex justify-between items-start z-10">
              <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-white/70 uppercase tracking-widest">
                 Black Card
              </div>
              <Wallet size={20} className="text-white/50" />
            </div>
            
            <div className="z-10 mt-6">
              <div className="text-white/60 text-xs md:text-sm mb-1">Tổng tài sản</div>
              <div className={`text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter font-playfair ${balance >= 0 ? "text-white" : "text-red-400"}`}>
                {formatCurrency(balance)}
              </div>
            </div>

            <div className="z-10 mt-8 flex gap-3 md:gap-4">
              <Link href="/transactions" className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 px-5 py-3 text-sm font-medium text-white transition-all backdrop-blur-md border border-white/10">
                <Plus size={16} /> Ghi chép
              </Link>
              <Link href="/goals" className="flex items-center justify-center gap-2 rounded-2xl bg-white text-black hover:bg-gray-200 px-5 py-3 text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                <Target size={16} /> Mục tiêu
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-6">
          <div>
            <div className="neumo-flat p-5 md:p-6 flex flex-col justify-center h-full">
              <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-1 md:mb-2 tracking-wide">
                <ArrowUpRight size={16} /> THU NHẬP
              </div>
              <div className="text-xl md:text-2xl font-bold font-playfair tracking-tight">{formatCurrency(totalIncome)}</div>
            </div>
          </div>
          <div>
            <div className="neumo-flat p-5 md:p-6 flex flex-col justify-center h-full">
              <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-destructive mb-1 md:mb-2 tracking-wide">
                <ArrowDownRight size={16} /> ĐÃ CHI
              </div>
              <div className="text-xl md:text-2xl font-bold font-playfair tracking-tight">{formatCurrency(totalExpense)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE: Tabs Layout for Charts & Plant */}
      <div>
        <div className="neumo-flat overflow-hidden flex flex-col">
          {/* Tabs Navigation */}
          <div className="flex items-center p-3 overflow-x-auto overflow-y-hidden hide-scrollbar gap-4">
            <button 
              onClick={() => setActiveTab('cashflow')}
              className={`whitespace-nowrap flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-semibold transition-all border border-transparent ${activeTab === 'cashflow' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-black/5 dark:bg-white/5 text-muted-foreground hover:text-foreground'}`}
            >
              <BarChart3 size={16} /> Luồng tiền
            </button>
            <button 
              onClick={() => setActiveTab('category')}
              className={`whitespace-nowrap flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-semibold transition-all border border-transparent ${activeTab === 'category' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-black/5 dark:bg-white/5 text-muted-foreground hover:text-foreground'}`}
            >
              <PieChart size={16} /> Cơ cấu
            </button>
            <button 
              onClick={() => setActiveTab('plant')}
              className={`whitespace-nowrap flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-semibold transition-all border border-transparent ${activeTab === 'plant' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-black/5 dark:bg-white/5 text-muted-foreground hover:text-foreground'}`}
            >
              <Sprout size={16} /> Cây tiết kiệm
            </button>
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
        <div className="neumo-flat p-5 md:p-8">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-widest">Giao dịch gần đây</h2>
            <Link href="/transactions" className="text-sm font-bold text-primary flex items-center hover:opacity-80 transition-opacity">
              Tất cả <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
             <div className="flex flex-col items-center justify-center text-center py-6">
               <div className="h-12 w-12 rounded-full neumo-pressed flex items-center justify-center text-muted-foreground mb-3">
                 <Clock size={24} />
               </div>
               <p className="text-muted-foreground text-sm font-medium tracking-wide">Chưa có giao dịch nào</p>
             </div>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl transition-colors hover:bg-black/5 dark:hover:bg-white/5 group">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center bg-white dark:bg-black border border-black/5 shadow-sm ${tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}>
                      {tx.type === "income" ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">{tx.title}</p>
                      <p className="text-xs font-medium text-muted-foreground mt-0.5 tracking-wide">{tx.category} &bull; {tx.date}</p>
                    </div>
                  </div>
                  <span className={`font-black text-sm md:text-base whitespace-nowrap font-playfair tracking-tight ${tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>
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
