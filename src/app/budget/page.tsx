"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Wallet, Plus, Trash2, X, Edit2 } from "lucide-react"
import { useBudgets, Budget } from "@/hooks/useBudgets"
import { useTransactions } from "@/hooks/useTransactions"
import { useSettings } from "@/context/SettingsContext"

const CATEGORIES = ["Ăn uống", "Mua sắm", "Di chuyển", "Hóa đơn", "Giải trí", "Sức khỏe", "Giáo dục", "Khác"]

export default function BudgetPage() {
  const { t, formatCurrency } = useSettings()
  const { budgets, loading, addBudget, updateBudget, deleteBudget } = useBudgets()
  const { transactions } = useTransactions()
  
  const [showModal, setShowModal] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [category, setCategory] = useState(CATEGORIES[0])
  const [limit, setLimit] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Current month for calculations
  const now = new Date()
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const resetForm = () => {
    setEditingBudget(null)
    setCategory(CATEGORIES[0])
    setLimit("")
  }

  const openAddModal = () => {
    resetForm()
    setShowModal(true)
  }

  const openEditModal = (budget: Budget) => {
    setEditingBudget(budget)
    setCategory(budget.category)
    setLimit(budget.limit.toString())
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!limit || Number(limit) <= 0) return

    setSubmitting(true)
    
    if (editingBudget) {
      await updateBudget(editingBudget.id, {
        category,
        limit: Number(limit)
      })
    } else {
      // Check if already exists for this month
      const existing = budgets.find(b => b.category === category && b.month === currentMonthStr)
      if (existing) {
        await updateBudget(existing.id, {
          limit: Number(limit)
        })
      } else {
        await addBudget({
          category,
          limit: Number(limit),
          month: currentMonthStr
        })
      }
    }
    
    setSubmitting(false)
    setShowModal(false)
    resetForm()
  }

  // Calculate spent amount for each budget category
  const getSpentAmount = (cat: string) => {
    return transactions.filter(t => {
      if (t.type !== 'expense' || t.category !== cat) return false
      
      // Check if transaction is in current month
      try {
        const parts = t.date.split('/')
        if (parts.length === 3) {
          const txMonthStr = `${parts[2]}-${parts[1]}`
          return txMonthStr === currentMonthStr
        }
        return false
      } catch {
        return false
      }
    }).reduce((sum, t) => sum + t.amount, 0)
  }

  const currentBudgets = budgets.filter(b => b.month === currentMonthStr)

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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('budget_title')}</h1>
          <p className="text-muted-foreground mt-1">{t('budget_desc')}</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
        >
          <Plus size={16} /> {t('add_budget')}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {currentBudgets.map((budget, index) => {
          const spent = getSpentAmount(budget.category)
          const percent = Math.min(Math.round((spent / budget.limit) * 100), 100)
          const isOverBudget = spent >= budget.limit
          const isNearBudget = percent >= 80 && !isOverBudget

          let progressColor = "bg-primary"
          if (isOverBudget) progressColor = "bg-destructive"
          else if (isNearBudget) progressColor = "bg-amber-500"

          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={budget.id}
              className={`rounded-2xl bg-card p-6 shadow-sm border transition-all ${isOverBudget ? "border-destructive/30 bg-destructive/5" : "border-border hover:shadow-md"}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-sm ${isOverBudget ? "bg-destructive text-destructive-foreground" : "bg-primary/10 text-primary"}`}>
                    <Wallet size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{budget.category}</h3>
                    {isOverBudget ? (
                      <p className="text-xs text-destructive font-medium">{t('over_budget')}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Còn lại {formatCurrency(budget.limit - spent)}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => openEditModal(budget)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                    title={t('edit_budget')}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => deleteBudget(budget.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                    title={t('delete')}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">{t('spent')}: {formatCurrency(spent)}</span>
                <span className="font-semibold text-foreground">{t('limit')}: {formatCurrency(budget.limit)}</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${progressColor}`}
                />
              </div>
              <div className="flex justify-end">
                <span className={`text-sm font-bold ${isOverBudget ? "text-destructive" : isNearBudget ? "text-amber-500" : "text-primary"}`}>
                  {percent}% {t('usage_percent')}
                </span>
              </div>
            </motion.div>
          )
        })}

        {currentBudgets.length === 0 && (
          <div className="col-span-full rounded-2xl bg-card border-2 border-dashed border-border p-12 flex flex-col items-center justify-center text-muted-foreground">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center opacity-50 mb-4">
              <Wallet size={32} />
            </div>
            <p className="font-medium text-lg mb-1">{t('no_budget')}</p>
            <p className="text-sm">{t('set_budget')} để quản lý chi tiêu tốt hơn.</p>
            <button 
              onClick={openAddModal}
              className="mt-6 flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              <Plus size={16} /> {t('add_budget')}
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200 border border-border" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">{editingBudget ? t('edit_budget') : t('add_budget')}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('category')}</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        category === cat 
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : "bg-background border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('monthly_budget')}</label>
                <input
                  type="number"
                  value={limit}
                  onChange={e => setLimit(e.target.value)}
                  placeholder="VD: 5000000"
                  required
                  min={1}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !limit}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? t('saving') : t('save')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
