"use client"

import { useState } from "react"
import { Sparkles, ArrowRight, TrendingDown, TrendingUp, AlertTriangle, Send } from "lucide-react"

export default function AIInsightsPage() {
  const [messages, setMessages] = useState([
    { role: "ai", content: "Chào bạn! Tôi là trợ lý tài chính AI của MySavingsPlan. Dựa trên dữ liệu tháng này, tôi có một vài lời khuyên giúp bạn quản lý tiền tốt hơn. Bạn muốn nghe chứ?" }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

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
        body: JSON.stringify({ messages: newMessages })
      })
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setMessages(prev => [...prev, { role: "ai", content: data.content }])
    } catch (error: unknown) {
      setMessages(prev => [...prev, { role: "ai", content: "Xin lỗi, tôi đang gặp trục trặc kỹ thuật. Vui lòng thử lại sau nhé!" }])
      console.error(error)
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">AI Insights</h1>
          <p className="text-gray-500 mt-1">Khám phá góc nhìn tài chính sâu sắc từ trợ lý ảo AI.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 flex-1 min-h-0">
        <div className="md:col-span-1 space-y-6 overflow-y-auto pr-2">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <TrendingDown size={20} />
              </div>
              <h3 className="font-semibold text-gray-900">Cơ hội tiết kiệm</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Bạn chi tiêu ít hơn 15% vào ăn uống so với tuần trước. Hãy chuyển số tiền dư này vào Quỹ dự phòng nhé!
            </p>
            <button className="text-sm font-semibold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all">
              Thực hiện ngay <ArrowRight size={16} />
            </button>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm border border-orange-200 bg-orange-50/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <AlertTriangle size={20} />
              </div>
              <h3 className="font-semibold text-gray-900">Cảnh báo chi tiêu</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Ngân sách Mua sắm của bạn đã đạt 80% hạn mức tháng. Hãy cẩn thận trong 15 ngày tới.
            </p>
            <button className="text-sm font-semibold text-orange-600 flex items-center gap-1 hover:gap-2 transition-all">
              Xem chi tiết <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <TrendingUp size={20} />
              </div>
              <h3 className="font-semibold text-gray-900">Đầu tư tiềm năng</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Số dư nhàn rỗi của bạn đang là 10.000.000 ₫. Gửi tiết kiệm kỳ hạn 1 tháng có thể mang lại 50.000 ₫ tiền lãi.
            </p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 rounded-2xl bg-white shadow-sm border border-gray-100 flex flex-col overflow-hidden h-full">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-sm">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Trợ lý AI</h2>
              <div className="text-xs font-medium text-blue-600 flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Đang trực tuyến
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {msg.role === "ai" && (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shrink-0 mt-1">
                    <Sparkles size={14} />
                  </div>
                )}
                <div className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
                  msg.role === "user" 
                    ? "bg-blue-600 text-white rounded-tr-none" 
                    : "bg-gray-100 text-gray-800 rounded-tl-none"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shrink-0 mt-1">
                  <Sparkles size={14} />
                </div>
                <div className="p-4 rounded-2xl bg-gray-100 text-gray-800 rounded-tl-none flex items-center gap-1.5 w-16">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Hỏi AI về cách tối ưu chi tiêu..." 
                className="w-full pl-4 pr-12 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
