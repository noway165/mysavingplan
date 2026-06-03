import { ArrowDownRight, ArrowUpRight, Wallet, Target, CreditCard, Plus } from "lucide-react"
import { DashboardCharts } from "@/components/DashboardCharts"
import Link from "next/link"

export default function Home() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tổng quan</h1>
          <p className="text-gray-500 mt-1">Chào mừng trở lại! Dưới đây là tình hình tài chính của bạn.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50 transition-colors">
            <Plus size={16} /> Thêm mục tiêu
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors">
            <Plus size={16} /> Ghi chép
          </button>
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
            Tổng số dư hiện tại
          </div>
          <div className="text-3xl font-bold text-gray-900">24.500.000 ₫</div>
          <div className="mt-4 flex items-center text-sm">
            <span className="flex items-center text-emerald-600 font-medium">
              <ArrowUpRight size={16} className="mr-1" />
              +12.5%
            </span>
            <span className="text-gray-400 ml-2">so với tháng trước</span>
          </div>
        </div>

        {/* Thu nhập */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-3">
            <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ArrowUpRight size={16} />
            </div>
            Thu nhập tháng này
          </div>
          <div className="text-3xl font-bold text-gray-900">15.000.000 ₫</div>
          <div className="mt-4 flex items-center text-sm">
            <span className="flex items-center text-emerald-600 font-medium">
              <ArrowUpRight size={16} className="mr-1" />
              +2.1%
            </span>
            <span className="text-gray-400 ml-2">so với tháng trước</span>
          </div>
        </div>

        {/* Chi tiêu */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-3">
            <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <ArrowDownRight size={16} />
            </div>
            Chi tiêu tháng này
          </div>
          <div className="text-3xl font-bold text-gray-900">4.250.000 ₫</div>
          <div className="mt-4 flex items-center text-sm">
            <span className="flex items-center text-red-600 font-medium">
              <ArrowUpRight size={16} className="mr-1" />
              +5.4%
            </span>
            <span className="text-gray-400 ml-2">so với tháng trước</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Biểu đồ Thu / Chi</h2>
            <select className="text-sm border-none bg-gray-50 rounded-lg px-3 py-1.5 text-gray-600 font-medium outline-none cursor-pointer">
              <option>7 ngày qua</option>
              <option>30 ngày qua</option>
              <option>Năm nay</option>
            </select>
          </div>
          <DashboardCharts />
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Mục tiêu tiết kiệm</h2>
            <Link href="/goals" className="text-sm text-blue-600 font-medium hover:underline">
              Xem tất cả
            </Link>
          </div>

          <div className="space-y-6 flex-1">
            <div className="group cursor-pointer">
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Target size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Mua Macbook M3</div>
                    <div className="text-xs text-gray-500">Còn lại 15.000.000 ₫</div>
                  </div>
                </div>
                <div className="text-sm font-bold text-indigo-600">50%</div>
              </div>
              <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 w-1/2 rounded-full transition-all group-hover:scale-105 origin-left"></div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                    <CreditCard size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Quỹ dự phòng</div>
                    <div className="text-xs text-gray-500">Còn lại 5.000.000 ₫</div>
                  </div>
                </div>
                <div className="text-sm font-bold text-orange-600">80%</div>
              </div>
              <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-400 to-amber-500 w-4/5 rounded-full transition-all group-hover:scale-105 origin-left"></div>
              </div>
            </div>
          </div>
          
          <button className="w-full mt-6 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-medium text-sm hover:border-gray-300 hover:text-gray-700 transition-colors flex items-center justify-center gap-2">
            <Plus size={16} />
            Tạo mục tiêu mới
          </button>
        </div>
      </div>
    </div>
  )
}
