"use client"

import { motion } from "framer-motion"
import { Target, Plus, Search, MoreVertical, CheckCircle2 } from "lucide-react"
import { useGoals } from "@/hooks/useGoals"

export default function GoalsPage() {
  const { goals, loading, addGoal, updateGoalSavedAmount } = useGoals()

  const handleAddMockGoal = () => {
    addGoal({
      name: "Mục tiêu mới",
      target: 10000000,
      saved: 0,
      color: "bg-blue-500"
    })
  }

  const handleAddMoney = (id: string, currentSaved: number) => {
    updateGoalSavedAmount(id, currentSaved + 500000)
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Mục tiêu tiết kiệm</h1>
          <p className="text-gray-500 mt-1">Theo dõi quá trình tiết kiệm cho các mục tiêu của bạn.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
            />
          </div>
          <button 
            onClick={handleAddMockGoal}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors whitespace-nowrap"
          >
            <Plus size={16} /> Thêm mới
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal, index) => {
          const progress = Math.min(100, Math.round((goal.saved / goal.target) * 100))
          const isCompleted = progress >= 100
          
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={goal.id} 
              className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 relative group"
            >
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical size={20} />
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white ${goal.color} shadow-sm`}>
                  {isCompleted ? <CheckCircle2 size={24} /> : <Target size={24} />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{progress}% hoàn thành</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-900">{goal.saved.toLocaleString()} ₫</span>
                  <span className="text-gray-500">{goal.target.toLocaleString()} ₫</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`absolute top-0 left-0 h-full rounded-full ${goal.color}`}
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex gap-2">
                <button 
                  onClick={() => handleAddMoney(goal.id, goal.saved)}
                  className="flex-1 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Nạp tiền
                </button>
                <button className="flex-1 py-2 text-sm font-semibold text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  Chi tiết
                </button>
              </div>
            </motion.div>
          )
        })}

        <div 
          onClick={handleAddMockGoal}
          className="rounded-2xl bg-gray-50/50 border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer min-h-[220px]"
        >
          <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
            <Plus size={24} />
          </div>
          <p className="font-medium">Tạo mục tiêu mới</p>
        </div>
      </div>
    </div>
  )
}
