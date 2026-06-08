"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Sparkles, ArrowRight, TrendingDown, TrendingUp, AlertTriangle, Send, Cpu } from "lucide-react"
import { PageClock } from "@/components/PageClock"
import { useTransactions } from "@/hooks/useTransactions"
import { AIRubik } from "@/components/AIRubik"

export default function AIInsightsPage() {
  const { transactions } = useTransactions()
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Tính toán dữ liệu thực tế
  const { totalIncome, totalExpense, balance, highestCategory, highestCategoryAmount } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    const categoryTotals: Record<string, number> = {};

    transactions.forEach(t => {
      if (t.type === 'income') inc += t.amount;
      if (t.type === 'expense') {
        exp += t.amount;
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      }
    });

    let highestCat = "Chưa có";
    let highestAmt = 0;
    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      if (amt > highestAmt) {
        highestAmt = amt;
        highestCat = cat;
      }
    });

    return {
      totalIncome: inc,
      totalExpense: exp,
      balance: inc - exp,
      highestCategory: highestCat,
      highestCategoryAmount: highestAmt
    }
  }, [transactions]);

  const [messages, setMessages] = useState([
    { role: "ai", content: "Hệ thống AI đã khởi động. Xin chào Thuyền trưởng! Bổn AI đã quét qua dữ liệu chi tiêu của bạn tháng này. Cần tôi 'vả' sự thật vào mặt bạn hay đưa ra lời khuyên nhẹ nhàng?" }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim()) return
    
    const userMsg = input
    const newMessages = [...messages, { role: "user", content: userMsg }]
    setMessages(newMessages)
    setInput("")
    setIsTyping(true)
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: newMessages,
          contextData: {
            totalIncome: totalIncome.toLocaleString('vi-VN'),
            totalExpense: totalExpense.toLocaleString('vi-VN'),
            balance: balance.toLocaleString('vi-VN'),
            highestCategory,
            highestCategoryAmount: highestCategoryAmount.toLocaleString('vi-VN')
          }
        })
      })
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setMessages(prev => [...prev, { role: "ai", content: data.content }])
    } catch (error: unknown) {
      setMessages(prev => [...prev, { role: "ai", content: "[LỖI HỆ THỐNG] Mất kết nối tới trung tâm dữ liệu. Vui lòng thử lại sau." }])
      console.error(error)
    } finally {
      setIsTyping(false)
    }
  }

  // Formatting helpers
  const formatMoney = (amount: number) => amount.toLocaleString('vi-VN') + ' ₫';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-playfair drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">J.A.R.V.I.S Insights</h1>
          <p className="text-white/50 mt-1 font-mono text-sm tracking-wider uppercase">Trung tâm Phân tích Dữ liệu</p>
        </div>
        <div className="flex items-center gap-3">
          <PageClock />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 flex-1 min-h-0">
        <div className="md:col-span-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          
          {/* Real Data Insights */}
          <div className="hud-panel p-5 border border-[#00f2fe]/30 hover:border-[#00f2fe] transition-colors relative group">
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00f2fe]" />
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-[#00f2fe]/10 flex items-center justify-center text-[#00f2fe] shadow-[0_0_15px_rgba(0,242,254,0.3)]">
                <TrendingDown size={20} />
              </div>
              <h3 className="font-semibold text-white font-mono uppercase tracking-wider text-sm">Cơ hội tiết kiệm</h3>
            </div>
            <p className="text-sm text-white/70 mb-3">
              {balance > 0 
                ? `Hệ thống ghi nhận bạn đang dư ${formatMoney(balance)}. Hãy chuyển số tiền này vào Quỹ Dự Phòng hoặc Đầu tư ngay!`
                : `Tháng này bạn đang thâm hụt ${formatMoney(Math.abs(balance))}. Tạm thời không có dư dả để tiết kiệm.`}
            </p>
            {balance > 0 && (
              <button className="text-sm font-semibold text-[#00f2fe] flex items-center gap-1 hover:gap-2 transition-all">
                Thực hiện ngay <ArrowRight size={16} />
              </button>
            )}
          </div>

          <div className="hud-panel p-5 border border-[#fe0979]/30 hover:border-[#fe0979] transition-colors relative">
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#fe0979]" />
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-[#fe0979]/10 flex items-center justify-center text-[#fe0979] shadow-[0_0_15px_rgba(254,9,121,0.3)] animate-pulse">
                <AlertTriangle size={20} />
              </div>
              <h3 className="font-semibold text-white font-mono uppercase tracking-wider text-sm">Cảnh báo chi tiêu</h3>
            </div>
            <p className="text-sm text-white/70 mb-3">
              {highestCategoryAmount > 0
                ? `Danh mục "${highestCategory}" đang ngốn nhiều tiền nhất của bạn (${formatMoney(highestCategoryAmount)}). Hãy kiểm soát lại!`
                : `Chưa có dữ liệu chi tiêu tháng này. Tốt lắm, cứ giữ vậy nhé!`}
            </p>
          </div>
          
          <div className="hud-panel p-5 border border-emerald-500/30 hover:border-emerald-500 transition-colors relative">
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-emerald-500" />
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <TrendingUp size={20} />
              </div>
              <h3 className="font-semibold text-white font-mono uppercase tracking-wider text-sm">Đầu tư tiềm năng</h3>
            </div>
            <p className="text-sm text-white/70 mb-3">
              {balance >= 5000000 
                ? `Với số dư ${formatMoney(balance)}, bạn đủ điều kiện tham gia các quỹ ETF hoặc gửi tiết kiệm dài hạn. Lãi suất dự kiến: 5-7%/năm.`
                : `Số dư nhàn rỗi dưới 5 triệu. Hãy tích lũy thêm trước khi nghĩ đến các kênh đầu tư lớn.`}
            </p>
          </div>
        </div>

        {/* Chat Area - HUD Style */}
        <div className="md:col-span-2 hud-panel border border-[#00f2fe]/20 flex flex-col overflow-hidden h-full relative">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,242,254,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,254,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20 pointer-events-none" />
          
          <div className="p-4 border-b border-[#00f2fe]/20 bg-black/40 flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#00f2fe]/10 border border-[#00f2fe]/50 flex items-center justify-center text-[#00f2fe] shadow-[0_0_10px_rgba(0,242,254,0.5)]">
                <Cpu size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-white font-mono uppercase tracking-widest text-sm">Hệ Thống Trí Tuệ Nhân Tạo</h2>
                <div className="text-xs font-medium text-[#00f2fe] flex items-center gap-1 font-mono">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f2fe] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f2fe]"></span>
                  </span>
                  ONLINE_
                </div>
              </div>
            </div>
            <div className="hidden sm:block">
              <AIRubik size={40} isAnalyzing={isTyping} />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {msg.role === "ai" && (
                  <div className="h-8 w-8 rounded-lg border border-[#00f2fe]/50 bg-[#00f2fe]/10 flex items-center justify-center text-[#00f2fe] shrink-0 mt-1 shadow-[0_0_8px_rgba(0,242,254,0.5)]">
                    <Sparkles size={14} />
                  </div>
                )}
                <div className={`p-4 rounded-xl max-w-[80%] text-sm leading-relaxed backdrop-blur-md font-mono ${
                  msg.role === "user" 
                    ? "bg-[#fe0979]/20 text-[#fe0979] border border-[#fe0979]/30 rounded-tr-none shadow-[0_0_15px_rgba(254,9,121,0.15)]" 
                    : "bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/30 rounded-tl-none shadow-[0_0_15px_rgba(0,242,254,0.15)]"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-lg border border-[#00f2fe]/50 bg-[#00f2fe]/10 flex items-center justify-center text-[#00f2fe] shrink-0 mt-1">
                  <Sparkles size={14} />
                </div>
                <div className="p-4 rounded-xl bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[#00f2fe] rounded-tl-none flex items-center gap-1.5 w-16 h-12">
                  <div className="w-1.5 h-1.5 bg-[#00f2fe] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-[#00f2fe] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-[#00f2fe] rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          
          <div className="p-4 border-t border-[#00f2fe]/20 bg-black/40 relative z-10">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#00f2fe]/50 font-mono">
                &gt;
              </div>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Gõ lệnh hoặc câu hỏi..." 
                className="w-full pl-8 pr-12 py-3.5 rounded-lg border border-[#00f2fe]/30 text-sm focus:outline-none focus:ring-1 focus:ring-[#00f2fe] focus:border-[#00f2fe] bg-black/50 text-[#00f2fe] placeholder:text-[#00f2fe]/30 font-mono transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md bg-[#00f2fe]/20 text-[#00f2fe] hover:bg-[#00f2fe]/40 hover:shadow-[0_0_10px_rgba(0,242,254,0.5)] transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-[#00f2fe]/30"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
