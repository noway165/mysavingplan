"use client"

import { useSettings, Theme, Currency } from "@/context/SettingsContext"
import { Locale } from "@/lib/i18n"
import { Moon, Sun, Globe, DollarSign, Palette, User, Wallet, Trophy, Sparkles, ChevronRight } from "lucide-react"
import Link from "next/link"
import { PageClock } from "@/components/PageClock"

export default function SettingsPage() {
  const { t, theme, setTheme, colorTheme, setColorTheme, locale, setLocale, currency, setCurrency } = useSettings()

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('settings')}</h1>
          <p className="text-muted-foreground mt-1">Cấu hình trải nghiệm ứng dụng của bạn.</p>
        </div>
        <div className="flex items-center gap-3">
          <PageClock />
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border divide-y divide-border">
        
        
        {/* App Modules */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-foreground text-lg">Mở rộng & Công cụ</h3>
            <p className="text-muted-foreground text-sm">Truy cập nhanh các tính năng phân tích và hồ sơ.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/profile" className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><User size={20}/></div>
                <div>
                  <div className="font-semibold text-foreground group-hover:text-neon-primary transition-colors">Hồ sơ cá nhân</div>
                  <div className="text-xs text-muted-foreground">Quản lý thông tin</div>
                </div>
              </div>
              <ChevronRight size={16} className="text-muted-foreground group-hover:text-neon-primary transition-colors" />
            </Link>
            
            <Link href="/budget" className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><Wallet size={20}/></div>
                <div>
                  <div className="font-semibold text-foreground group-hover:text-neon-primary transition-colors">Ngân sách</div>
                  <div className="text-xs text-muted-foreground">Kiểm soát chi tiêu</div>
                </div>
              </div>
              <ChevronRight size={16} className="text-muted-foreground group-hover:text-neon-primary transition-colors" />
            </Link>

            <Link href="/gamification" className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500"><Trophy size={20}/></div>
                <div>
                  <div className="font-semibold text-foreground group-hover:text-neon-primary transition-colors">Thành tựu</div>
                  <div className="text-xs text-muted-foreground">Cấp độ & Huy hiệu</div>
                </div>
              </div>
              <ChevronRight size={16} className="text-muted-foreground group-hover:text-neon-primary transition-colors" />
            </Link>

            <Link href="/insights" className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500"><Sparkles size={20}/></div>
                <div>
                  <div className="font-semibold text-foreground group-hover:text-neon-primary transition-colors">AI J.A.R.V.I.S</div>
                  <div className="text-xs text-muted-foreground">Tư vấn thông minh</div>
                </div>
              </div>
              <ChevronRight size={16} className="text-muted-foreground group-hover:text-neon-primary transition-colors" />
            </Link>
          </div>
        </div>

        {/* Color Settings */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Palette size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">Màu sắc chủ đạo</h3>
              <p className="text-muted-foreground text-sm">Chọn tông màu yêu thích của bạn.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full mt-4 sm:mt-0">
            {([
              { id: 'default', name: 'Mặc định', color: 'bg-amber-500' },
              { id: 'pastelpink', name: 'Hoa Anh Đào', color: 'bg-[#FFC0CB]' },

              { id: 'worldcup', name: 'World Cup', color: 'bg-[#10b981]' },
                { id: 'limegreen', name: 'Ma Trận', color: 'bg-[#32CD32]' },

              { id: 'whitesmoke', name: 'Halloween', color: 'bg-[#a855f7]' },
              { id: 'amethyst', name: 'Ngân Hà', color: 'bg-[#9966CC]' },
              { id: 'spring', name: 'Mùa Xuân (Tết)', color: 'bg-[#ec4899]' },
              { id: 'summer', name: 'Mùa Hè', color: 'bg-[#06b6d4]' },
              { id: 'autumn', name: 'Mùa Thu', color: 'bg-[#f97316]' },
              { id: 'winter', name: 'Mùa Đông', color: 'bg-[#bae6fd]' },
              { id: 'vietnam', name: 'Việt Nam', color: 'bg-[#ef4444]' },
            ] as const).map(t => (
              <button
                key={t.id}
                onClick={() => setColorTheme(t.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${colorTheme === t.id ? 'border-primary bg-primary/10 shadow-neon scale-[1.02]' : 'border-border bg-card hover:bg-muted'}`}
                title={t.name}
              >
                <div className={`w-6 h-6 rounded-full flex-shrink-0 shadow-sm ${t.color}`} />
                <span className="text-sm font-medium text-foreground whitespace-nowrap">{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Language Settings */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">{t('language')}</h3>
              <p className="text-muted-foreground text-sm">{t('language_desc')}</p>
            </div>
          </div>
          <div className="flex bg-muted p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setLocale('vi')}
              className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-lg transition-colors ${locale === 'vi' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Tiếng Việt
            </button>
            <button
              onClick={() => setLocale('en')}
              className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-lg transition-colors ${locale === 'en' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              English
            </button>
          </div>
        </div>

        {/* Currency Settings */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <DollarSign size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">{t('currency')}</h3>
              <p className="text-muted-foreground text-sm">{t('currency_desc')}</p>
            </div>
          </div>
          <div className="flex bg-muted p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
            {(['VND', 'USD', 'EUR'] as Currency[]).map(c => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`flex-none px-6 py-2 text-sm font-medium rounded-lg transition-colors ${currency === c ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
