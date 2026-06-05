"use client"

import { useBuckets } from "@/hooks/useBuckets"
import { useSettings } from "@/context/SettingsContext"
import { Layers, Zap } from "lucide-react"

export function BucketsWidget({ balance }: { balance: number }) {
  const { buckets, allocateLeftover, totalBucketBalance } = useBuckets()
  const { formatCurrency } = useSettings()

  const availableToAllocate = Math.max(0, balance - totalBucketBalance)

  return (
    <div className="bento-card p-5 md:p-6 bg-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-foreground">
          <Layers className="text-primary" size={20} />
          <h2 className="font-bold text-lg">Quỹ Dự Phòng (Buckets)</h2>
        </div>
        
        <button 
          onClick={() => allocateLeftover(availableToAllocate)}
          disabled={availableToAllocate <= 0}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-neon"
        >
          <Zap size={16} /> Tự Phân Bổ ({formatCurrency(availableToAllocate)})
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {buckets.map(b => (
          <div key={b.id} className="bg-background border border-border rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase">{b.name}</span>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">{b.percentage}%</span>
            </div>
            <div className="text-lg font-bold text-foreground">
              {formatCurrency(b.balance)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
