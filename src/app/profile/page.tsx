"use client"

import { useState } from "react"
import { User as UserIcon, Camera, Save, LogOut } from "lucide-react"
import { useAuth } from "@/components/AuthProvider"
import { useSettings } from "@/context/SettingsContext"
import { updateProfile } from "firebase/auth"

export default function ProfilePage() {
  const { t } = useSettings()
  const { user, signOut } = useAuth()
  
  const [displayName, setDisplayName] = useState(user?.displayName || "")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    setLoading(true)
    setMessage({ type: '', text: '' })
    
    try {
      await updateProfile(user, {
        displayName
      })
      setMessage({ type: 'success', text: t('updated_success') })
    } catch (error) {
      setMessage({ type: 'error', text: t('error') })
      console.error(error)
    }
    
    setLoading(false)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('profile')}</h1>
        <p className="text-muted-foreground mt-1">Quản lý thông tin cá nhân của bạn.</p>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl border-4 border-background shadow-sm">
              {displayName ? displayName.charAt(0).toUpperCase() : <UserIcon size={40} />}
            </div>
            <button className="absolute bottom-0 right-0 h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-not-allowed opacity-80" title="Chưa hỗ trợ đổi ảnh đại diện">
              <Camera size={14} />
            </button>
          </div>
          <h2 className="text-xl font-bold mt-4 text-foreground">{user?.displayName || "Người dùng"}</h2>
          <p className="text-muted-foreground text-sm">{user?.email}</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          {message.text && (
            <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-destructive/10 text-destructive'}`}>
              {message.text}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t('display_name')}</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email (Không thể thay đổi)</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-muted-foreground cursor-not-allowed"
            />
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading || displayName === user?.displayName}
              className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {loading ? t('saving') : t('update')}
            </button>
            <button
              type="button"
              onClick={signOut}
              className="flex-1 py-3 px-4 rounded-xl bg-destructive/10 text-destructive font-semibold hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              {t('logout')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
