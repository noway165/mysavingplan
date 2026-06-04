"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

export function PageClock() {
  const [realTime, setRealTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setRealTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted) return null

  return (
    <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-card rounded-xl border border-border shadow-sm">
      <Clock size={16} className="text-primary" />
      <div className="text-sm font-bold tabular-nums text-foreground">
        {realTime.toLocaleTimeString('vi-VN')}
      </div>
    </div>
  )
}
