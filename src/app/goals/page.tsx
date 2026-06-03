"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Target, Plus, Search, Trash2, X, Coins } from "lucide-react"
import { useGoals } from "@/hooks/useGoals"

const COLORS = [
  { name: "Xanh dương", value: "bg-blue-500" },
  { name: "Cam", value: "bg-orange-500" },
  { name: "Xanh lá", value: "bg-emerald-500" },
  { name: "Tím", value: "bg-purple-500" },
  { name: "Hồng", value: "bg-pink-500" },
  { name: "Vàng", value: "bg-amber-500" },
]

export default function GoalsPage() {
  const { goals, loading, addGoal, updateGoalSavedAmount, deleteGoal } = useGoals()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDepositModal, setShowDepositModal] = useState<string | null>(null)

  // Add goal form
  const [goalName, setGoalName] = useState("")
  const [goalTarget, setGoalTarget] = useState("")
  const [goalColor, setGoalColor] = useState("bg-blue-500")
  const [submitting, setSubmitting] = useState(false)

  // Deposit form
  const [depositAmount, setDepositAmount] = useState("")

  const resetAddForm = () => {
    setGoalName("")
    setGoalTarget("")
    setGoalColor("bg-blue-500")
  }

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!goalName.trim() || !goalTarget) return
    setSubmitting(true)
    await addGoal({
      name: goalName.trim(),
      target: Number(goalTarget),
      saved: 0,
      color: goalColor
    })
    setSubmitting(false)
    setShowAddModal(false)
    resetAddForm()
  }

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!showDepositModal || !depositAmount) return
    const goal = goals.find(g => g.id === showDepositModal)
    if (!goal) return
    setSubmitting(true)
    await updateGoalSavedAmount(showDepositModal, goal.saved + Number(depositAmount))
    setSubmitting(false)
    setShowDepositModal(null)
    setDepositAmount("")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Mục tiêu tiết kiệm</h1>
          <p className="text-gray-500 mt-1">Đặt mục tiêu và theo dõi tiến trình tiết kiệm.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors whitespace-nowrap"
        >
          <Plus size={16} /> Thêm mới
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal, index) => {
          const percent = goal.target > 0 ? Math.min(Math.round((goal.saved / goal.target) * 100), 100) : 0
          const isComplete = percent >= 100
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={goal.id}
              className={`rounded-2xl bg-white p-6 shadow-sm border transition-all hover:shadow-md ${isComplete ? "border-emerald-200 bg-emerald-50/30" : "border-gray-100"}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl ${goal.color} flex items-center justify-center text-white shadow-sm`}>
                    <Target size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                    <p className="text-xs text-gray-500">{isComplete ? "✅ Hoàn thành!" : `Còn ${(goal.target - goal.saved).toLocaleString()} ₫`}</p>
                  </div>
                </div>
                <button 
                  onClick={() => deleteGoal(goal.id)}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">{goal.saved.toLocaleString()} ₫</span>
                <span className="font-semibold text-gray-900">{goal.target.toLocaleString()} ₫</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${isComplete ? "bg-emerald-500" : "bg-gradient-to-r from-blue-500 to-indigo-500"}`}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm font-bold ${isComplete ? "text-emerald-600" : "text-blue-600"}`}>{percent}%</span>
                {!isComplete && (
                  <button
                    onClick={() => setShowDepositModal(goal.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Coins size={14} /> Nạp tiền
                  </button>
                )}
              </div>
            </motion.div>
          )
        })}

        {/* Add new goal card */}
        <div 
          onClick={() => setShowAddModal(true)}
          className="rounded-2xl bg-gray-50/50 border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer min-h-[220px]"
        >
          <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
            <Plus size={24} />
          </div>
          <span className="font-semibold text-sm">Tạo mục tiêu mới</span>
        </div>
      </div>

      {/* Modal thêm mục tiêu */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Tạo mục tiêu mới</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên mục tiêu</label>
                <input
                  type="text"
                  value={goalName}
                  onChange={e => setGoalName(e.target.value)}
                  placeholder="VD: Mua iPhone, Du lịch Đà Lạt..."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Số tiền cần đạt (₫)</label>
                <input
                  type="number"
                  value={goalTarget}
                  onChange={e => setGoalTarget(e.target.value)}
                  placeholder="VD: 10000000"
                  required
                  min={1}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Màu sắc</label>
                <div className="flex gap-3">
                  {COLORS.map(c => (
                    <button
                      type="button"
                      key={c.value}
                      onClick={() => setGoalColor(c.value)}
                      className={`h-9 w-9 rounded-full ${c.value} transition-all ${goalColor === c.value ? "ring-2 ring-offset-2 ring-blue-500 scale-110" : "hover:scale-105"}`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !goalName || !goalTarget}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Đang tạo..." : "Tạo mục tiêu"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal nạp tiền */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDepositModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Nạp tiền tiết kiệm</h2>
              <button onClick={() => setShowDepositModal(null)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleDeposit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Số tiền nạp (₫)</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                  placeholder="VD: 500000"
                  required
                  min={1}
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !depositAmount}
                className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Đang nạp..." : "Xác nhận nạp tiền"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
