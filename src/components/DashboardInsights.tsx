"use client"

import { useMemo } from "react"
import { TrendingDown, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react"
import { Transaction } from "@/hooks/useTransactions"
import { useSettings } from "@/context/SettingsContext"
import Link from "next/link"
import { motion } from "framer-motion"

interface DashboardInsightsProps {
  transactions: Transaction[]
  balance: number
}

export function DashboardInsights({ transactions, balance }: DashboardInsightsProps) {
  const { formatCurrency } = useSettings()

  const { highestCategory, highestCategoryAmount } = useMemo(() => {
    const categoryTotals: Record<string, number> = {}
    transactions.forEach(t => {
      if (t.type === 'expense') {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
      }
    })

    let highestCat = ""
    let highestAmt = 0
    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      if (amt > highestAmt) {
        highestAmt = amt
        highestCat = cat
      }
    })

    return { highestCategory: highestCat, highestCategoryAmount: highestAmt }
  }, [transactions])

  const insights = [
    {
      id: "savings",
      icon: TrendingDown,
      title: "Cơ hội tiết kiệm",
      borderColor: "border-neon-primary/40 hover:border-neon-primary",
      iconBg: "bg-neon-primary/10",
      iconShadow: "shadow-[0_0_12px_color-mix(in_srgb,var(--neon-primary)_30%,transparent)]",
      description: balance > 0
        ? `Bạn đang dư ${formatCurrency(balance)}. Hãy phân bổ vào Quỹ Dự Phòng!`
        : `Tháng này bạn đang thâm hụt ${formatCurrency(Math.abs(balance))}.`,
      linkText: balance > 0 ? "Phân bổ ngay" : "Xem chi tiết",
      linkHref: "/insights",
      positive: balance > 0,
    },
    {
      id: "alert",
      icon: AlertTriangle,
      title: "Cảnh báo chi tiêu",
      borderColor: "border-neon-secondary/40 hover:border-neon-secondary",
      iconBg: "bg-neon-secondary/10",
      iconShadow: "shadow-[0_0_12px_color-mix(in_srgb,var(--neon-secondary)_30%,transparent)]",
      description: highestCategoryAmount > 0
        ? `"${highestCategory}" đang ngốn nhiều tiền nhất: ${formatCurrency(highestCategoryAmount)}`
        : `Chưa có dữ liệu chi tiêu tháng này.`,
      linkText: "Xem giao dịch",
      linkHref: "/transactions",
      positive: highestCategoryAmount === 0,
    },
    {
      id: "invest",
      icon: TrendingUp,
      title: "Gợi ý đầu tư",
      borderColor: "border-emerald-500/40 hover:border-emerald-500",
      iconBg: "bg-emerald-500/10",
      iconShadow: "shadow-[0_0_12px_rgba(16,185,129,0.3)]",
      iconColor: "text-emerald-400",
      description: balance >= 5000000
        ? `Với ${formatCurrency(balance)}, bạn đủ điều kiện tham gia ETF (lãi 5-7%/năm).`
        : `Tích lũy thêm để mở khóa gợi ý đầu tư thông minh.`,
      linkText: "Lên mục tiêu",
      linkHref: "/goals",
      positive: balance >= 5000000,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {insights.map((insight, i) => (
        <motion.div
          key={insight.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Link href={insight.linkHref}>
            <div className={`bg-glass-card rounded-2xl p-4 border ${insight.borderColor} transition-all duration-300 group cursor-pointer h-full`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`h-9 w-9 rounded-lg ${insight.iconBg} flex items-center justify-center ${insight.iconColor || 'text-foreground'} ${insight.iconShadow}`}>
                  <insight.icon size={18} />
                </div>
                <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">{insight.title}</h3>
              </div>
              <p className="text-sm text-foreground/70 mb-3 line-clamp-2">{insight.description}</p>
              <span className="text-xs font-semibold text-foreground/60 flex items-center gap-1 group-hover:gap-2 transition-all">
                {insight.linkText} <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
