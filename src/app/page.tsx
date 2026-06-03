"use client"

import { ArrowDownRight, ArrowUpRight, Wallet, Target, Plus, TrendingUp, FileText } from "lucide-react"
import { DashboardCharts } from "@/components/DashboardCharts"
import { useTransactions } from "@/hooks/useTransactions"
import { useGoals } from "@/hooks/useGoals"
import Link from "next/link"

export default function Home() {
  const { transactions, loading: tLoading } = useTransactions()
  const { goals, loading: gLoading } = useGoals()

  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpense
  const totalSaved = goals.reduce((sum, g) => sum + g.saved, 0)

  const fmt = (n: number) => n.toLocaleString("vi-VN") + " ₫"

  if (tLoading || gLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tổng quan</h1>
          <p className="text-gray-500 mt-1">Chào mừng trở lại! Dưới đây là tình hình tài chính của bạn.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/goals" className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50 transition-colors">
            <Plus size={16} /> Thêm mục tiêu
          </Link>
          <Link href="/transactions" className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors">
            <Plus size={16} /> Ghi chép
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Số dư */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Wallet size={64} />
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-3">
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Wallet size={16} />
            </div>
            Số dư hiện tại
          </div>
          <div className={`text-3xl font-bold ${balance >= 0 ? "text-gray-900" : "text-red-600"}`}>{fmt(balance)}</div>
          <div className="mt-4 flex items-center text-sm">
            <span className="flex items-center text-blue-600 font-medium">
              <TrendingUp size={16} className="mr-1" />
              Đã tiết kiệm: {fmt(totalSaved)}
            </span>
          </div>
        </div>

        {/* Thu nhập */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-3">
            <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ArrowUpRight size={16} />
            </div>
            Tổng thu nhập
          </div>
          <div className="text-3xl font-bold text-gray-900">{fmt(totalIncome)}</div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-400">{transactions.filter(t => t.type === "income").length} giao dịch</span>
          </div>
        </div>

        {/* Chi tiêu */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-3">
            <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <ArrowDownRight size={16} />
            </div>
            Tổng chi tiêu
          </div>
          <div className="text-3xl font-bold text-gray-900">{fmt(totalExpense)}</div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-400">{transactions.filter(t => t.type === "expense").length} giao dịch</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Biểu đồ Thu / Chi</h2>
          </div>
          <DashboardCharts transactions={transactions} />
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Mục tiêu tiết kiệm</h2>
            <Link href="/goals" className="text-sm text-blue-600 font-medium hover:underline">
              Xem tất cả
            </Link>
          </div>

          {goals.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <div className="h-14 w-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-4">
                <Target size={28} />
              </div>
              <p className="text-gray-400 text-sm mb-1">Chưa có mục tiêu nào</p>
              <p className="text-gray-400 text-xs">Hãy tạo mục tiêu tiết kiệm đầu tiên!</p>
            </div>
          ) : (
            <div className="space-y-6 flex-1">
              {goals.slice(0, 3).map((goal) => {
                const percent = goal.target > 0 ? Math.min(Math.round((goal.saved / goal.target) * 100), 100) : 0
                return (
                  <div key={goal.id} className="group cursor-pointer">
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Target size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{goal.name}</div>
                          <div className="text-xs text-gray-500">Còn lại {fmt(goal.target - goal.saved)}</div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-indigo-600">{percent}%</div>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all group-hover:scale-105 origin-left"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <Link href="/goals" className="w-full mt-6 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-medium text-sm hover:border-gray-300 hover:text-gray-700 transition-colors flex items-center justify-center gap-2">
            <Plus size={16} />
            Tạo mục tiêu mới
          </Link>
        </div>
      </div>
    </div>
  )
}
