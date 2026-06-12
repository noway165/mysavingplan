"use client"

import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowDownRight, ArrowUpRight, Search, Plus, Calendar, Filter, FileText, X, Trash2, Edit2, Sparkles, AlertCircle, Clock } from "lucide-react"
import { useTransactions, Transaction } from "@/hooks/useTransactions"
import { useSettings } from "@/context/SettingsContext"
import { useGamification } from "@/hooks/useGamification"
import { PageClock } from "@/components/PageClock"

const CATEGORIES_EXPENSE = ["Ăn uống", "Mua sắm", "Di chuyển", "Hóa đơn", "Giải trí", "Sức khỏe", "Giáo dục", "Khác"]
const CATEGORIES_INCOME = ["Lương", "Thưởng", "Thu nhập phụ", "Đầu tư", "Khác"]

type FilterPeriod = "all" | "week" | "month" | "custom"

export default function TransactionsPage() {
  const { t, formatCurrency } = useSettings()
  const { transactions, loading, addTransaction, deleteTransaction, updateTransaction } = useTransactions()
  const [activeTab, setActiveTab] = useState<"all" | "income" | "expense">("all")
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("all")
  
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")

  const [realTime, setRealTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setRealTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // AI Form state
  const [aiText, setAiText] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState("")

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formType, setFormType] = useState<"income" | "expense">("expense")
  const [formTitle, setFormTitle] = useState("")
  const [formAmount, setFormAmount] = useState("")
  const [formCategory, setFormCategory] = useState("")
  const [formDate, setFormDate] = useState("")
  const [formTime, setFormTime] = useState("")
  const [formIsImpulse, setFormIsImpulse] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)

  const { addXP, checkDailyStreak } = useGamification()

  // Impulse Buffer state
  const [showImpulseBuffer, setShowImpulseBuffer] = useState(false)
  const [bufferCountdown, setBufferCountdown] = useState(10)
  const [pendingTx, setPendingTx] = useState<any>(null)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (showImpulseBuffer && bufferCountdown > 0) {
      timer = setInterval(() => setBufferCountdown(prev => prev - 1), 1000)
    }
    return () => clearInterval(timer)
  }, [showImpulseBuffer, bufferCountdown])

  const resetForm = () => {
    setEditingId(null)
    setFormTitle("")
    setFormAmount("")
    setFormCategory("")
    setFormType("expense")
    setFormIsImpulse(false)
    
    // Default to current date/time
    const now = new Date()
    setFormDate(now.toISOString().split('T')[0])
    setFormTime(now.toTimeString().substring(0, 5))
  }

  const toYMD = (dateStr: string) => {
    if (dateStr && dateStr.includes('/')) {
      const parts = dateStr.split('/')
      if (parts.length === 3) return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
    }
    return dateStr
  }

  const openAddModal = () => {
    resetForm()
    setShowModal(true)
  }

  const openEditModal = (tx: Transaction) => {
    setEditingId(tx.id)
    setFormType(tx.type)
    setFormTitle(tx.title)
    setFormAmount(tx.amount.toLocaleString('en-US'))
    setFormCategory(tx.category)
    setFormDate(toYMD(tx.date) || realTime.toISOString().split('T')[0])
    setFormTime(tx.time || "00:00")
    setFormIsImpulse(tx.isImpulse || false)
    setShowModal(true)
  }

  const saveTransactionToDB = async (txData: any) => {
    setFormSubmitting(true)
    if (editingId) {
      await updateTransaction(editingId, txData)
    } else {
      await addTransaction(txData)
      checkDailyStreak() // Grant XP for logging
    }
    setFormSubmitting(false)
    setShowModal(false)
    setShowImpulseBuffer(false)
    resetForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const amountNum = Number(formAmount.replace(/,/g, ''))
    if (!formTitle.trim() || !amountNum || !formCategory) return

    setFormSubmitting(true)
    
    const txData = {
      title: formTitle.trim(),
      amount: amountNum,
      type: formType,
      category: formCategory,
      date: formDate,
      time: editingId ? formTime : realTime.toTimeString().substring(0, 5),
      isImpulse: formIsImpulse
    }

    // Check Impulse conditions
    const isBigLeisure = (formCategory === "Mua sắm" || formCategory === "Giải trí") && amountNum >= 500000;
    
    if (formType === "expense" && (formIsImpulse || isBigLeisure) && !editingId) {
      // Trigger Impulse Buffer
      setPendingTx(txData)
      setShowModal(false)
      setBufferCountdown(10)
      setShowImpulseBuffer(true)
      return
    }

    await saveTransactionToDB(txData)
  }

  const handleCancelImpulse = () => {
    // Reward for resisting impulse
    addXP(20, "Resisted Impulse Buy")
    setShowImpulseBuffer(false)
    setPendingTx(null)
    resetForm()
    // Show some toast here in a real app
    alert("🎉 Bạn đã chiến thắng cám dỗ! Thưởng +20 XP")
  }

  const handleConfirmImpulse = async () => {
    if (pendingTx) {
      await saveTransactionToDB(pendingTx)
    }
  }

  const handleAISubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiText.trim()) return
    
    setAiLoading(true)
    setAiError("")
    
    try {
      const res = await fetch("/api/ai-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: aiText })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || "Lỗi khi phân tích bằng AI")
      }
      
      // Mặc định là tiếng Anh category, ta cần map sang tiếng Việt (giả sử AI trả về tiếng Anh vì trong prompt yêu cầu)
      const catMap: Record<string, string> = {
        food: "Ăn uống", shopping: "Mua sắm", transport: "Di chuyển", bills: "Hóa đơn", 
        entertainment: "Giải trí", health: "Sức khỏe", education: "Giáo dục",
        salary: "Lương", bonus: "Thưởng", side_income: "Thu nhập phụ", investment: "Đầu tư", other: "Khác"
      }
      
      const category = catMap[data.category] || "Khác"
      const now = new Date()
      
      const txData = {
        title: data.description,
        amount: Number(data.amount),
        type: data.type as "expense" | "income",
        category: category,
        date: now.toLocaleDateString("vi-VN"),
        time: now.toTimeString().substring(0, 5)
      }
      
      await addTransaction(txData)
      setAiText("")
    } catch (err: any) {
      let errMsg = err.message || "Lỗi khi phân tích bằng AI";
      if (typeof errMsg === 'object') errMsg = JSON.stringify(errMsg);
      
      if (errMsg.includes('503') || errMsg.includes('high demand') || errMsg.includes('UNAVAILABLE')) {
        errMsg = "Hệ thống AI hiện đang bị quá tải. Bạn vui lòng thử lại sau ít phút nhé!";
      } else if (errMsg.includes('{')) {
        try {
          const parsed = JSON.parse(errMsg);
          if (parsed.error?.message) errMsg = parsed.error.message;
        } catch (e) {}
      }
      setAiError(errMsg)
    } finally {
      setAiLoading(false)
    }
  }

  const filteredTransactions = useMemo(() => {
    const now = new Date()
    const currentWeekStart = new Date(now)
    currentWeekStart.setDate(now.getDate() - now.getDay())
    
    return transactions.filter(t => {
      // Type filter
      if (activeTab !== "all" && t.type !== activeTab) return false
      
      // Search filter
      if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      
      // Date filter
      if (filterPeriod !== "all") {
        try {
          const parts = t.date.split('/')
          if (parts.length === 3) {
            const txDate = new Date(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}T00:00:00`)
            
            if (filterPeriod === "week") {
              if (txDate < currentWeekStart) return false
            } else if (filterPeriod === "month") {
              if (txDate.getMonth() !== now.getMonth() || txDate.getFullYear() !== now.getFullYear()) return false
            } else if (filterPeriod === "custom" && customStartDate && customEndDate) {
              const start = new Date(customStartDate)
              const end = new Date(customEndDate)
              end.setHours(23, 59, 59)
              if (txDate < start || txDate > end) return false
            }
          }
        } catch {
          // If date parsing fails, keep it
        }
      }
      
      return true
    })
  }, [transactions, activeTab, searchQuery, filterPeriod, customStartDate, customEndDate])

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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('tx_title')}</h1>
          <p className="text-muted-foreground mt-1">{t('tx_desc')}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <PageClock />
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Plus size={16} /> {t('add_new')}
          </button>
        </div>
      </div>

      {/* AI Assistant Bar */}
      <div className="bg-card rounded-2xl shadow-neon border-neon p-5 space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles size={20} />
          <h2 className="font-bold text-lg">Nhập liệu siêu tốc bằng AI</h2>
        </div>
        <form onSubmit={handleAISubmit} className="flex gap-3">
          <input 
            type="text" 
            value={aiText}
            onChange={(e) => setAiText(e.target.value)}
            disabled={aiLoading}
            placeholder='Ví dụ: "Trà sữa Phúc Long 55k", "Nhận lương tháng này 15 củ"...' 
            className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={!aiText.trim() || aiLoading}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]"
          >
            {aiLoading ? <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div> : "Phân tích"}
          </button>
        </form>
        {aiError && (
          <p className="text-destructive text-sm flex items-center gap-1 mt-2">
            <AlertCircle size={14} /> {aiError}
          </p>
        )}
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex gap-2 bg-muted p-1 rounded-xl w-full md:w-auto">
              <button 
                onClick={() => setActiveTab("all")}
                className={`flex-1 md:flex-none px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${activeTab === "all" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t('filter_all')}
              </button>
              <button 
                onClick={() => setActiveTab("income")}
                className={`flex-1 md:flex-none px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${activeTab === "income" ? "bg-background text-emerald-600 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t('filter_income')}
              </button>
              <button 
                onClick={() => setActiveTab("expense")}
                className={`flex-1 md:flex-none px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${activeTab === "expense" ? "bg-background text-destructive shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t('filter_expense')}
              </button>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input 
                  type="text" 
                  placeholder={t('search')} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-48 text-foreground"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground mr-2"><Filter size={14} className="inline mr-1" /> Lọc thời gian:</span>
            {(["all", "week", "month", "custom"] as FilterPeriod[]).map(period => (
              <button
                key={period}
                onClick={() => setFilterPeriod(period)}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                  filterPeriod === period 
                    ? "bg-primary/10 border-primary/20 text-primary" 
                    : "bg-background border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {period === "all" ? t('filter_all') : period === "week" ? t('this_week') : period === "month" ? t('this_month') : t('custom')}
              </button>
            ))}

            {filterPeriod === "custom" && (
              <div className="flex items-center gap-2 ml-2">
                <input 
                  type="date" 
                  value={customStartDate}
                  onChange={e => setCustomStartDate(e.target.value)}
                  className="px-2 py-1 text-xs rounded border border-border bg-background text-foreground"
                />
                <span className="text-muted-foreground">-</span>
                <input 
                  type="date" 
                  value={customEndDate}
                  onChange={e => setCustomEndDate(e.target.value)}
                  className="px-2 py-1 text-xs rounded border border-border bg-background text-foreground"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="divide-y divide-border">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={tx.id} 
                className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${tx.type === "income" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-destructive/10 text-destructive"} shadow-sm`}>
                    {tx.type === "income" ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{tx.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                        {tx.category}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar size={12} /> {tx.date} • {tx.time}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`font-bold ${tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>
                    {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                    <button 
                      onClick={() => openEditModal(tx)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      title={t('edit')}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => deleteTransaction(tx.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title={t('delete')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-12 flex flex-col items-center justify-center text-muted-foreground">
              <FileText size={48} className="mb-4 opacity-20" />
              <p className="font-medium">{t('no_transactions')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200 border border-border" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">
                {editingId ? t('edit') : t('add_new')}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="flex gap-2 bg-muted p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setFormType("expense"); setFormCategory("") }}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${formType === "expense" ? "bg-background text-destructive shadow-sm" : "text-muted-foreground"}`}
                >
                  {t('filter_expense')}
                </button>
                <button
                  type="button"
                  onClick={() => { setFormType("income"); setFormCategory("") }}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${formType === "income" ? "bg-background text-emerald-600 shadow-sm" : "text-muted-foreground"}`}
                >
                  {t('filter_income')}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('tx_title')}</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="VD: Ăn trưa, Lương..."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('amount')}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formAmount}
                  onChange={e => {
                    const rawValue = e.target.value.replace(/\D/g, '')
                    if (!rawValue) {
                      setFormAmount("")
                    } else {
                      setFormAmount(Number(rawValue).toLocaleString('en-US'))
                    }
                  }}
                  placeholder="VD: 150,000"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('category')}</label>
                <div className="flex flex-wrap gap-2">
                  {(formType === "expense" ? CATEGORIES_EXPENSE : CATEGORIES_INCOME).map(cat => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setFormCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        formCategory === cat 
                          ? (formType === "expense" ? "bg-destructive/10 border-destructive/20 text-destructive" : "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400")
                          : "bg-background border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {formType === "expense" && (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive/90">
                  <input 
                    type="checkbox" 
                    id="isImpulse"
                    checked={formIsImpulse}
                    onChange={(e) => setFormIsImpulse(e.target.checked)}
                    className="w-5 h-5 rounded border-destructive/30 text-destructive focus:ring-destructive"
                  />
                  <label htmlFor="isImpulse" className="text-sm font-semibold select-none cursor-pointer">
                    ⚠️ Đây là chi tiêu bốc đồng / cảm xúc?
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={formSubmitting || !formTitle || !formAmount || !formCategory}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formSubmitting ? t('saving') : t('save')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Impulse Buffer Modal */}
      {showImpulseBuffer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[60] p-4">
          <div className="bg-card rounded-3xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in duration-300 border border-destructive/20 p-8 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6 animate-pulse">
              <AlertCircle size={40} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Dừng lại một chút!
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Bạn có thực sự <span className="font-bold text-foreground">cần</span> món đồ này, hay đây chỉ là quyết định bốc đồng nhất thời?<br/>
              Hãy hít một hơi thật sâu và cân nhắc lại nhé.
            </p>

            <div className="text-6xl font-mono font-bold text-primary mb-8 tracking-tighter">
              {bufferCountdown > 0 ? `00:${bufferCountdown.toString().padStart(2, '0')}` : "00:00"}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button 
                onClick={handleCancelImpulse}
                className="flex-1 py-4 rounded-2xl bg-emerald-500 text-foreground font-bold text-lg hover:bg-emerald-600 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105"
              >
                HỦY MUA & NHẬN +20 XP
              </button>
              <button 
                onClick={handleConfirmImpulse}
                disabled={bufferCountdown > 0}
                className="flex-1 py-4 rounded-2xl bg-muted text-muted-foreground font-semibold hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bufferCountdown > 0 ? `Đợi ${bufferCountdown}s để xác nhận` : "Vẫn tiếp tục mua"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
