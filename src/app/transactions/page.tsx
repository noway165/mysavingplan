"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowDownRight, ArrowUpRight, Search, Plus, Calendar, Filter, FileText } from "lucide-react"
import { useTransactions } from "@/hooks/useTransactions"

export default function TransactionsPage() {
  const { transactions, loading, addTransaction } = useTransactions()
  const [activeTab, setActiveTab] = useState<"all" | "income" | "expense">("all")

  // Mock add transaction function for demonstration
  const handleAddMockTransaction = () => {
    addTransaction({
      title: "Giao dịch mới",
      amount: Math.floor(Math.random() * 500000) + 50000,
      type: Math.random() > 0.5 ? "income" : "expense",
      category: "Khác",
      date: new Date().toLocaleDateString('vi-VN'),
      time: new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})
    })
  }

  const filteredTransactions = transactions.filter(t => {
    if (activeTab === "all") return true
    return t.type === activeTab
  })

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Quản lý Thu / Chi</h1>
          <p className="text-gray-500 mt-1">Ghi chép và theo dõi dòng tiền của bạn chi tiết.</p>
        </div>
        <button 
          onClick={handleAddMockTransaction}
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
                className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
              />
            </div>
            <button className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
              <Filter size={18} />
            </button>
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
                className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${tx.type === "income" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"} shadow-sm`}>
                    {tx.type === "income" ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{tx.title}</h3>
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
                <div className={`font-bold ${tx.type === "income" ? "text-emerald-600" : "text-gray-900"}`}>
                  {tx.type === "income" ? "+" : "-"}{tx.amount.toLocaleString()} ₫
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-12 flex flex-col items-center justify-center text-gray-400">
              <FileText size={48} className="mb-4 text-gray-300" />
              <p>Không tìm thấy giao dịch nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
