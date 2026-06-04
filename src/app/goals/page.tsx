"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Target, Plus, Trash2, X, Coins, Edit2, Calendar, History, ArrowDownToLine, ArrowUpFromLine } from "lucide-react"
import { useGoals, useGoalHistory, Goal, GoalHistoryEntry } from "@/hooks/useGoals"
import { useTransactions } from "@/hooks/useTransactions"
import { useSettings } from "@/context/SettingsContext"

import confetti from "canvas-confetti"

const COLORS = [
  { name: "Blue", value: "bg-blue-500" },
  { name: "Orange", value: "bg-orange-500" },
  { name: "Emerald", value: "bg-emerald-500" },
  { name: "Purple", value: "bg-purple-500" },
  { name: "Pink", value: "bg-pink-500" },
  { name: "Amber", value: "bg-amber-500" },
]

export default function GoalsPage() {
  const { t, formatCurrency } = useSettings()
  const { goals, loading, addGoal, updateGoal, updateGoalSavedAmount, withdrawFromGoal, deleteGoal, addGoalHistory } = useGoals()
  const { addTransaction } = useTransactions()
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDepositModal, setShowDepositModal] = useState<string | null>(null)
  const [showWithdrawModal, setShowWithdrawModal] = useState<string | null>(null)
  const [showHistoryModal, setShowHistoryModal] = useState<string | null>(null)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  // Add/Edit goal form
  const [goalName, setGoalName] = useState("")
  const [goalTarget, setGoalTarget] = useState("")
  const [goalColor, setGoalColor] = useState("bg-amber-500")
  const [goalDeadline, setGoalDeadline] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Transaction form
  const [amount, setAmount] = useState("")

  const resetForm = () => {
    setGoalName("")
    setGoalTarget("")
    setGoalColor("bg-amber-500")
    setGoalDeadline("")
    setEditingGoal(null)
  }

  const openAddModal = () => {
    resetForm()
    setShowAddModal(true)
  }

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal)
    setGoalName(goal.name)
    setGoalTarget(goal.target.toString())
    setGoalColor(goal.color)
    setGoalDeadline(goal.deadline || "")
    setShowAddModal(true)
  }

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!goalName.trim() || !goalTarget) return
    setSubmitting(true)
    
    const goalData: Partial<Omit<Goal, "id" | "createdAt" | "saved">> = {
      name: goalName.trim(),
      target: Number(goalTarget),
      color: goalColor,
    }
    
    if (goalDeadline) {
      goalData.deadline = goalDeadline
    }
    
    if (editingGoal) {
      await updateGoal(editingGoal.id, goalData)
    } else {
      await addGoal({
        name: goalData.name!,
        target: goalData.target!,
        color: goalData.color!,
        deadline: goalData.deadline,
        saved: 0,
      })
    }
    
    setSubmitting(false)
    setShowAddModal(false)
    resetForm()
  }

  const handleTransaction = async (e: React.FormEvent, type: 'deposit' | 'withdraw') => {
    e.preventDefault()
    const goalId = type === 'deposit' ? showDepositModal : showWithdrawModal
    if (!goalId || !amount) return
    
    const goal = goals.find(g => g.id === goalId)
    if (!goal) return
    
    setSubmitting(true)
    const numAmount = Number(amount)
    
    const now = new Date()
    const dateStr = now.toLocaleDateString('vi-VN')
    const timeStr = now.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})
    
    if (type === 'deposit') {
      const newSaved = goal.saved + numAmount
      await updateGoalSavedAmount(goalId, newSaved)
      
      // Bắn pháo giấy nếu đạt 100% mục tiêu
      if (goal.saved < goal.target && newSaved >= goal.target) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        })
      }

      await addTransaction({
        title: `Nạp tiền: ${goal.name}`,
        amount: numAmount,
        type: 'expense',
        category: 'Khác',
        date: dateStr,
        time: timeStr
      })
    } else {
      await withdrawFromGoal(goalId, numAmount, goal.saved)
      await addTransaction({
        title: `Rút tiền: ${goal.name}`,
        amount: numAmount,
        type: 'income',
        category: 'Khác',
        date: dateStr,
        time: timeStr
      })
    }
    
    // Add history
    await addGoalHistory(goalId, {
      type,
      amount: numAmount,
      date: dateStr + " " + timeStr
    })
    
    setSubmitting(false)
    setShowDepositModal(null)
    setShowWithdrawModal(null)
    setAmount("")
  }

  const getDaysLeft = (deadline?: string) => {
    if (!deadline) return null
    const end = new Date(deadline)
    const now = new Date()
    end.setHours(23, 59, 59)
    const diff = end.getTime() - now.getTime()
    return Math.ceil(diff / (1000 * 3600 * 24))
  }

  if (loading) {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('goals_title')}</h1>
          <p className="text-muted-foreground mt-1">{t('goals_desc')}</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
        >
          <Plus size={16} /> {t('create_goal')}
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal, index) => {
          const percent = goal.target > 0 ? Math.min(Math.round((goal.saved / goal.target) * 100), 100) : 0
          const isComplete = percent >= 100
          const daysLeft = getDaysLeft(goal.deadline)

          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={goal.id}
              className={`rounded-2xl bg-card p-6 shadow-sm border transition-all hover:shadow-md ${isComplete ? "border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-500/5" : "border-border"}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl ${goal.color} flex items-center justify-center text-white shadow-sm`}>
                    <Target size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground line-clamp-1" title={goal.name}>{goal.name}</h3>
                    {daysLeft !== null && !isComplete && (
                      <p className={`text-xs flex items-center gap-1 mt-0.5 ${daysLeft < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        <Calendar size={12} />
                        {daysLeft < 0 ? t('overdue') : `${daysLeft} ${t('days_left')}`}
                      </p>
                    )}
                    {isComplete && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">✅ {t('completed')}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => setShowHistoryModal(goal.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                    title={t('history')}
                  >
                    <History size={16} />
                  </button>
                  <button 
                    onClick={() => openEditModal(goal)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                    title={t('edit')}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                    title={t('delete')}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">{formatCurrency(goal.saved)}</span>
                <span className="font-semibold text-foreground">{formatCurrency(goal.target)}</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${isComplete ? "bg-emerald-500" : goal.color}`}
                />
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className={`text-sm font-bold ${isComplete ? "text-emerald-600 dark:text-emerald-400" : "text-primary"}`}>{percent}%</span>
                
                <div className="flex gap-2">
                  {!isComplete && (
                    <button
                      onClick={() => setShowDepositModal(goal.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                      title={t('deposit')}
                    >
                      <ArrowDownToLine size={14} /> {t('deposit')}
                    </button>
                  )}
                  {goal.saved > 0 && (
                    <button
                      onClick={() => setShowWithdrawModal(goal.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-muted-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                      title={t('withdraw')}
                    >
                      <ArrowUpFromLine size={14} /> {t('withdraw')}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}

        {/* Add new goal card */}
        <div 
          onClick={openAddModal}
          className="rounded-2xl bg-card border-2 border-dashed border-border p-6 flex flex-col items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer min-h-[220px]"
        >
          <div className="h-12 w-12 rounded-full bg-background shadow-sm flex items-center justify-center mb-3">
            <Plus size={24} />
          </div>
          <span className="font-semibold text-sm">{t('create_goal')}</span>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200 border border-border" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">{editingGoal ? t('edit') : t('create')}</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('goal_name')}</label>
                <input
                  type="text"
                  value={goalName}
                  onChange={e => setGoalName(e.target.value)}
                  placeholder="VD: Mua xe, Du lịch..."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('target_amount')}</label>
                <input
                  type="number"
                  value={goalTarget}
                  onChange={e => setGoalTarget(e.target.value)}
                  placeholder="VD: 10000000"
                  required
                  min={1}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('deadline')} (Tùy chọn)</label>
                <input
                  type="date"
                  value={goalDeadline}
                  onChange={e => setGoalDeadline(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('color')}</label>
                <div className="flex gap-3 flex-wrap">
                  {COLORS.map(c => (
                    <button
                      type="button"
                      key={c.value}
                      onClick={() => setGoalColor(c.value)}
                      className={`h-9 w-9 rounded-full ${c.value} transition-all ${goalColor === c.value ? "ring-2 ring-offset-2 ring-background ring-offset-primary scale-110" : "hover:scale-105"}`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !goalName || !goalTarget}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? t('saving') : t('save')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Deposit / Withdraw Modal */}
      {(showDepositModal || showWithdrawModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => {setShowDepositModal(null); setShowWithdrawModal(null); setAmount("")}}>
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-200 border border-border" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">
                {showDepositModal ? t('deposit_money') : t('withdraw_money')}
              </h2>
              <button onClick={() => {setShowDepositModal(null); setShowWithdrawModal(null); setAmount("")}} className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => handleTransaction(e, showDepositModal ? 'deposit' : 'withdraw')} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('amount')}</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="VD: 500000"
                  required
                  min={1}
                  max={showWithdrawModal ? goals.find(g => g.id === showWithdrawModal)?.saved : undefined}
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !amount}
                className={`w-full py-3 rounded-xl text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${showDepositModal ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-destructive hover:bg-destructive/90'}`}
              >
                {submitting ? t('saving') : (showDepositModal ? t('confirm_deposit') : t('confirm_withdraw'))}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && <HistoryModal goalId={showHistoryModal} onClose={() => setShowHistoryModal(null)} />}
    </div>
  )
}

function HistoryModal({ goalId, onClose }: { goalId: string, onClose: () => void }) {
  const { history, loading } = useGoalHistory(goalId)
  const { t, formatCurrency } = useSettings()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 border border-border" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">{t('history')}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
             <div className="flex justify-center p-4">
               <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : history.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">{t('no_data')}</p>
          ) : (
            <div className="space-y-4">
              {history.map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 rounded-xl border border-border bg-background">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.type === 'deposit' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-destructive/10 text-destructive'}`}>
                      {item.type === 'deposit' ? <ArrowDownToLine size={16} /> : <ArrowUpFromLine size={16} />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.type === 'deposit' ? t('deposited') : t('withdrawn')}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${item.type === 'deposit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>
                    {item.type === 'deposit' ? '+' : '-'}{formatCurrency(item.amount)}
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
