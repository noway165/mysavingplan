"use client"

import { useState } from "react"
import { useAuth } from "@/components/AuthProvider"
import { Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react"

export function LoginScreen() {
  const { signIn, signUp, loading: authLoading } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Đang tải...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    if (isLogin) {
      const result = await signIn(email, password)
      if (result.error) setError(result.error)
    } else {
      if (!name.trim()) {
        setError("Vui lòng nhập tên của bạn.")
        setSubmitting(false)
        return
      }
      const result = await signUp(email, password, name)
      if (result.error) setError(result.error)
    }

    setSubmitting(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-gradient-to-tr from-amber-600 to-orange-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-5 shadow-lg shadow-amber-500/30">
            <Sparkles size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">MySavingsPlan</h1>
          <p className="text-gray-500 mt-2">
            {isLogin ? "Đăng nhập để quản lý tài chính của bạn" : "Tạo tài khoản mới để bắt đầu"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field (only for register) */}
          {!isLogin && (
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Họ và tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm font-medium px-4 py-3 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:from-amber-500 hover:to-orange-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                {isLogin ? "Đăng nhập" : "Tạo tài khoản"}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Toggle login/register */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
            <button
              onClick={() => { setIsLogin(!isLogin); setError("") }}
              className="ml-1 text-amber-600 font-semibold hover:text-amber-500 transition-colors"
            >
              {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
