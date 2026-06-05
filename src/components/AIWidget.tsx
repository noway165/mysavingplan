"use client"

import { Sparkles, ArrowRight } from "lucide-react"

export function AIWidget() {
  return (
    <div className="bento-card p-5 md:p-6 bg-card border-primary/30 relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
        <Sparkles size={120} />
      </div>
      
      <div className="flex items-center gap-2 text-primary mb-3 relative z-10">
        <Sparkles size={20} className="animate-pulse" />
        <h2 className="font-bold text-sm uppercase tracking-widest">AI Insights</h2>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed relative z-10 font-medium">
        Cảnh báo: Bạn đã chi tiêu nhiều hơn <span className="text-destructive font-bold">15%</span> cho Mua sắm tuần này. Hãy tự nấu ăn ở nhà 2 ngày tới để giữ vững chuỗi Kỷ luật và không bị rớt Hạng nhé!
      </p>

      <div className="mt-4 flex items-center gap-1 text-xs font-bold text-primary cursor-pointer hover:underline relative z-10">
        Xem chi tiết <ArrowRight size={14} />
      </div>
    </div>
  )
}
