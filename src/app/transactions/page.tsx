"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowDownRight, ArrowUpRight, Search, Plus, Calendar, Filter, FileText, X, Trash2 } from "lucide-react"
import { useTransactions } from "@/hooks/useTransactions"

const CATEGORIES_EXPENSE = ["Ăn uống", "Mua sắm", "Di chuyển", "Hóa đơn", "Giải trí", "Sức khỏe", "Giáo dục", "Khác"]
const CATEGORIES_INCOME = ["Lương", "Thưởng", "Thu nhập phụ", "Đầu tư", "Khác"]

export default function TransactionsPage() {
  const { transactions, loading, addTransaction, deleteTransaction } = useTransactions()
  const [activeTab, setActiveTab] = useState<"all" | "income" | "expense">("all")
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Form state
  const [formType, setFormType] = useState<"income" | "expense">("expense")
  const [formTitle, setFormTitle] = useState("")
  const [formAmount, setFormAmount] = useState("")
  const [formCategory, setFormCategory] = useState("")
  const [formSubmitting, setFormSubmitting] = useState(false)

  const resetForm = () => {
    setFormTitle("")
    setFormAmount("")
    setFormCategory("")
    setFormType("expense")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim() || !formAmount || !formCategory) return

    setFormSubmitting(true)
    await addTransaction({
      title: formTitle.trim(),
      amount: Number(formAmount),
      type: formType,
      category: formCategory,
      date: new Date().toLocaleDateString("vi-VN"),
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    })
    setFormSubmitting(false)
    setShowModal(false)
    resetForm()
  }

  const filteredTransactions = transactions
    .filter(t => {
      if (activeTab !== "all" && t.type !== activeTab) return false
      if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })

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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản lý Thu / Chi</h1>
          <p className="text-gray-500 mt-1">Ghi chép và theo dõi dòng tiền của bạn chi tiết.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus size={16} /> Thêm giao dịch
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 bg-gray-50 p-1 rounded-xl w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab("all")}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${activeTab === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Tất cả
            </button>
            <button 
              onClick={() => setActiveTab("income")}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${activeTab === "income" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Thu nhập
            </button>
            <button 
              onClick={() => setActiveTab("expense")}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${activeTab === "expense" ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Chi tiêu
            </button>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Tìm giao dịch..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
              />
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={tx.id} 
                className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${tx.type === "income" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"} shadow-sm`}>
                    {tx.type === "income" ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{tx.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                        {tx.category}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar size={12} /> {tx.date} • {tx.time}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`font-bold ${tx.type === "income" ? "text-emerald-600" : "text-gray-900"}`}>
                    {tx.type === "income" ? "+" : "-"}{tx.amount.toLocaleString()} ₫
                  </div>
                  <button 
                    onClick={() => deleteTransaction(tx.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-12 flex flex-col items-center justify-center text-gray-400">
              <FileText size={48} className="mb-4 text-gray-300" />
              <p className="font-medium">Chưa có giao dịch nào</p>
              <p className="text-sm mt-1">Bấm &quot;Thêm giao dịch&quot; để bắt đầu ghi chép.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal thêm giao dịch */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Thêm giao dịch mới</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Loại giao dịch */}
              <div className="flex gap-2 bg-gray-50 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setFormType("expense"); setFormCategory("") }}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${formType === "expense" ? "bg-white text-red-600 shadow-sm" : "text-gray-500"}`}
                >
                  Chi tiêu
                </button>
                <button
                  type="button"
                  onClick={() => { setFormType("income"); setFormCategory("") }}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${formType === "income" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500"}`}
                >
                  Thu nhập
                </button>
              </div>

              {/* Tên giao dịch */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="VD: Ăn trưa, Lương tháng 6..."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Số tiền */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Số tiền (₫)</label>
                <input
                  type="number"
                  value={formAmount}
                  onChange={e => setFormAmount(e.target.value)}
                  placeholder="VD: 150000"
                  required
                  min={1}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Danh mục */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục</label>
                <div className="flex flex-wrap gap-2">
                  {(formType === "expense" ? CATEGORIES_EXPENSE : CATEGORIES_INCOME).map(cat => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setFormCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        formCategory === cat 
                          ? (formType === "expense" ? "bg-red-50 border-red-200 text-red-600" : "bg-emerald-50 border-emerald-200 text-emerald-600")
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nút lưu */}
              <button
                type="submit"
                disabled={formSubmitting || !formTitle || !formAmount || !formCategory}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formSubmitting ? "Đang lưu..." : "Lưu giao dịch"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
