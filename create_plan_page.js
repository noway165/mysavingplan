const fs = require('fs');

const dir = 'E:/my-savings-plan/src/app/plan';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const pageContent = `"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Map, TrendingUp, AlertTriangle, CheckCircle2, ChevronRight, Activity, Wallet, Target } from "lucide-react"
import { useGoals } from "@/hooks/useGoals"
import { useTransactions } from "@/hooks/useTransactions"
import { useSettings } from "@/context/SettingsContext"
import { PageClock } from "@/components/PageClock"
import { TiltWrapper } from "@/components/TiltWrapper"

export default function PlannerPage() {
  const { t, formatCurrency } = useSettings()
  const { goals, loading: loadingGoals } = useGoals()
  const { transactions, loading: loadingTx } = useTransactions()
  const [strategy, setStrategy] = useState<'50_30_20' | 'aggressive' | 'custom'>('50_30_20')
  const [customRate, setCustomRate] = useState(30)

  // 1. Cashflow Analysis (Based on this month's transactions for simplicity)
  const cashflow = useMemo(() => {
    const now = new Date()
    const thisMonthTx = transactions.filter(tx => {
      const txDate = new Date(tx.date)
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear()
    })
    
    const income = thisMonthTx.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) || 0
    const expense = thisMonthTx.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) || 0
    // If no income this month, use a fallback to make UI work for demo
    const baseIncome = income > 0 ? income : 15000000; 
    const baseExpense = income > 0 ? expense : 8000000;
    
    return {
      income: baseIncome,
      expense: baseExpense,
      free: baseIncome - baseExpense
    }
  }, [transactions])

  // 2. Strategy Application
  const allocation = useMemo(() => {
    let savingsRate = 20;
    let needsRate = 50;
    
    if (strategy === '50_30_20') {
      savingsRate = 20; needsRate = 50;
    } else if (strategy === 'aggressive') {
      savingsRate = 40; needsRate = 40;
    } else {
      savingsRate = customRate; needsRate = (100 - customRate) / 2; // rough split
    }

    return {
      savings: (cashflow.income * savingsRate) / 100,
      needs: (cashflow.income * needsRate) / 100,
      wants: (cashflow.income * (100 - savingsRate - needsRate)) / 100,
      rate: savingsRate
    }
  }, [strategy, customRate, cashflow])

  // 3. Goal Projection
  const projections = useMemo(() => {
    return goals.map(goal => {
      let monthsRemaining = 12; // default
      if (goal.deadline) {
        const diffTime = new Date(goal.deadline).getTime() - new Date().getTime()
        const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))
        monthsRemaining = diffMonths > 0 ? diffMonths : 1
      }
      
      const remainingAmount = Math.max(0, goal.target - goal.saved)
      const requiredPerMonth = remainingAmount / monthsRemaining
      
      return {
        ...goal,
        monthsRemaining,
        remainingAmount,
        requiredPerMonth
      }
    }).sort((a, b) => b.requiredPerMonth - a.requiredPerMonth)
  }, [goals])

  const totalRequired = projections.reduce((sum, p) => sum + p.requiredPerMonth, 0)
  const isDeficit = totalRequired > allocation.savings
  const canAchieveAll = totalRequired <= allocation.savings && allocation.savings <= cashflow.free

  if (loadingGoals || loadingTx) {
    return <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></div>
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-playfair drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{t('planner') || 'Lập Kế Hoạch Tiết Kiệm'}</h1>
          <p className="text-muted-foreground mt-1 font-mono text-sm tracking-wider uppercase">{t('planner_desc') || 'Định hướng dòng tiền và chiến lược'}</p>
        </div>
        <div className="flex items-center gap-3">
          <PageClock />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Cashflow & Strategy */}
        <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          {/* Cashflow Card */}
          <TiltWrapper className="bg-glass-card p-6 rounded-2xl border border-border/50 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-primary/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700" />
            <h2 className="font-bold text-sm uppercase tracking-widest text-foreground/80 font-serif mb-4 flex items-center gap-2">
              <Activity size={16} className="text-neon-primary" /> {t('cashflow_analysis') || 'Phân tích dòng tiền'}
            </h2>
            
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-end">
                <p className="text-sm text-foreground/60">{t('avg_income') || 'Thu nhập / tháng'}</p>
                <p className="font-bold text-emerald-400">{formatCurrency(cashflow.income)}</p>
              </div>
              <div className="flex justify-between items-end border-b border-border/30 pb-3">
                <p className="text-sm text-foreground/60">{t('avg_expense') || 'Chi tiêu / tháng'}</p>
                <p className="font-bold text-rose-400">{formatCurrency(cashflow.expense)}</p>
              </div>
              <div className="flex justify-between items-end pt-1">
                <p className="font-bold text-sm">{t('free_cashflow') || 'Tiền Nhàn Rỗi'}</p>
                <p className={\`text-xl font-bold neon-text-primary \${cashflow.free < 0 ? 'text-rose-500' : 'text-primary'}\`}>
                  {formatCurrency(cashflow.free)}
                </p>
              </div>
            </div>
          </TiltWrapper>

          {/* Strategy Selection */}
          <TiltWrapper className="bg-glass-card p-6 rounded-2xl border border-border/50 shadow-2xl relative overflow-hidden group">
             <h2 className="font-bold text-sm uppercase tracking-widest text-foreground/80 font-serif mb-4 flex items-center gap-2">
              <Wallet size={16} className="text-neon-secondary" /> {t('savings_strategy') || 'Chiến lược tiết kiệm'}
            </h2>
            <div className="space-y-3 relative z-10">
              <button 
                onClick={() => setStrategy('50_30_20')}
                className={\`w-full text-left px-4 py-3 rounded-xl border transition-all \${strategy === '50_30_20' ? 'border-neon-secondary bg-neon-secondary/20 shadow-[0_0_15px_color-mix(in_srgb,var(--neon-secondary)_30%,transparent)]' : 'border-border/50 bg-background/30 hover:bg-white/5'}\`}
              >
                <div className="font-bold text-foreground">50/30/20 Rule</div>
                <div className="text-xs text-foreground/60 mt-1">20% Savings, 50% Needs, 30% Wants</div>
              </button>
              <button 
                onClick={() => setStrategy('aggressive')}
                className={\`w-full text-left px-4 py-3 rounded-xl border transition-all \${strategy === 'aggressive' ? 'border-neon-secondary bg-neon-secondary/20 shadow-[0_0_15px_color-mix(in_srgb,var(--neon-secondary)_30%,transparent)]' : 'border-border/50 bg-background/30 hover:bg-white/5'}\`}
              >
                <div className="font-bold text-foreground">Aggressive (40%)</div>
                <div className="text-xs text-foreground/60 mt-1">Focus strictly on saving quickly</div>
              </button>
              <button 
                onClick={() => setStrategy('custom')}
                className={\`w-full text-left px-4 py-3 rounded-xl border transition-all \${strategy === 'custom' ? 'border-neon-secondary bg-neon-secondary/20 shadow-[0_0_15px_color-mix(in_srgb,var(--neon-secondary)_30%,transparent)]' : 'border-border/50 bg-background/30 hover:bg-white/5'}\`}
              >
                <div className="flex justify-between items-center">
                  <div className="font-bold text-foreground">Custom ({customRate}%)</div>
                </div>
                {strategy === 'custom' && (
                  <input 
                    type="range" min="5" max="80" step="5" 
                    value={customRate} onChange={(e) => setCustomRate(Number(e.target.value))}
                    className="w-full mt-3 accent-neon-secondary"
                  />
                )}
              </button>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-black/20 border border-white/5">
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-neon-secondary">Savings Quota</span>
                <span className="font-bold text-foreground">{formatCurrency(allocation.savings)}</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500" style={{ width: \`\${allocation.rate}%\` }} title="Savings" />
                <div className="h-full bg-blue-500" style={{ width: \`\${strategy === '50_30_20' ? 50 : strategy==='aggressive'?40: (100-customRate)/2}%\` }} title="Needs" />
                <div className="h-full bg-amber-500" style={{ width: \`\${strategy === '50_30_20' ? 30 : strategy==='aggressive'?20: (100-customRate)/2}%\` }} title="Wants" />
              </div>
            </div>
          </TiltWrapper>
        </div>

        {/* Right Column: Goal Projection */}
        <div className="lg:col-span-2 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          <TiltWrapper className="bg-glass-card p-6 rounded-2xl border border-border/50 shadow-2xl min-h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-sm uppercase tracking-widest text-foreground/80 font-serif flex items-center gap-2">
                <Target size={16} className="text-neon-primary" /> {t('goal_projection') || 'Dự phóng Mục tiêu'}
              </h2>
              
              <div className="flex items-center gap-4 text-sm font-mono bg-black/20 px-4 py-2 rounded-lg border border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-foreground/60">Total Required:</span>
                  <span className="font-bold text-neon-primary">{formatCurrency(totalRequired)}/mo</span>
                </div>
              </div>
            </div>

            {cashflow.free < 0 && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-start gap-3">
                <AlertTriangle className="text-rose-400 shrink-0 mt-0.5" size={18} />
                <p className="text-sm font-bold text-rose-200 leading-relaxed">
                  {t('deficit_warning') || 'CẢNH BÁO: Hiện tại dòng tiền của bạn đang ÂM. Hãy thắt chặt chi tiêu trước khi lập kế hoạch phân bổ.'}
                </p>
              </div>
            )}

            {isDeficit && cashflow.free >= 0 && (
              <div className="mb-6 p-4 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-start gap-3">
                <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={18} />
                <p className="text-sm font-bold text-amber-200 leading-relaxed">
                  Cảnh báo: Bạn đang cần tiết kiệm <span className="text-white">{formatCurrency(totalRequired)}/tháng</span> để kịp thời hạn tất cả mục tiêu, nhưng Ngân quỹ Tiết kiệm (theo chiến lược) chỉ có <span className="text-white">{formatCurrency(allocation.savings)}</span>. Sẽ có mục tiêu bị trễ hạn!
                </p>
              </div>
            )}

            {canAchieveAll && goals.length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-start gap-3">
                <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                <p className="text-sm font-bold text-emerald-200 leading-relaxed">
                  Tuyệt vời! Chiến lược hiện tại giúp bạn hoàn toàn dư sức đạt được mọi mục tiêu đúng thời hạn.
                </p>
              </div>
            )}

            {goals.length === 0 ? (
              <div className="py-12 text-center text-foreground/50 flex flex-col items-center">
                <Target size={48} className="mb-4 opacity-20" />
                <p>{t('no_goals') || 'Chưa có mục tiêu nào'}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {projections.map(goal => (
                  <motion.div 
                    key={goal.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-background/40 border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className={\`w-3 h-3 rounded-full \${goal.color}\`} />
                          <h3 className="font-bold text-foreground text-lg">{goal.name}</h3>
                        </div>
                        <p className="text-xs text-foreground/60">
                          Còn lại: <span className="font-bold text-foreground">{formatCurrency(goal.remainingAmount)}</span> • 
                          Thời gian: <span className="font-bold text-foreground">{goal.monthsRemaining} tháng</span>
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-foreground/60 uppercase tracking-wider mb-1">{t('monthly_required') || 'Cần tiết kiệm'}</p>
                        <p className="font-bold text-xl text-neon-secondary drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                          {formatCurrency(goal.requiredPerMonth)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Auto-allocation suggestion visual */}
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        {goal.requiredPerMonth > allocation.savings ? (
                          <span className="flex items-center gap-1 text-rose-400 bg-rose-400/10 px-2 py-1 rounded">
                            <AlertTriangle size={12} /> Nguy cơ trễ hạn
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                            <CheckCircle2 size={12} /> Khả thi
                          </span>
                        )}
                      </div>
                      
                      <div className="text-xs text-foreground/50 flex items-center gap-1">
                        Chiếm <span className="text-foreground font-bold">{((goal.requiredPerMonth / Math.max(1, allocation.savings)) * 100).toFixed(0)}%</span> quỹ tiết kiệm
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TiltWrapper>
        </div>

      </div>
    </div>
  )
}
`

fs.writeFileSync('E:/my-savings-plan/src/app/plan/page.tsx', pageContent);
console.log("Plan page created successfully");
