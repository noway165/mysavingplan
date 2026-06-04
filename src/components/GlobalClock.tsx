"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

export function GlobalClock() {
  const [realTime, setRealTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setRealTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed top-4 right-4 z-[100] px-3 py-2 bg-card/80 backdrop-blur-md rounded-xl border border-border shadow-md shadow-black/5 flex items-center gap-2">
      <Clock size={16} className="text-primary" />
      <div className="text-sm font-bold tabular-nums text-foreground">
        {realTime.toLocaleTimeString('vi-VN')}
      </div>
    </div>
  )
}
