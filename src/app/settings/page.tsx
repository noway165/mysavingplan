"use client"

import { useSettings, Theme, Currency } from "@/context/SettingsContext"
import { Locale } from "@/lib/i18n"
import { Moon, Sun, Globe, DollarSign, Palette } from "lucide-react"

export default function SettingsPage() {
  const { t, theme, setTheme, colorTheme, setColorTheme, locale, setLocale, currency, setCurrency } = useSettings()

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('settings')}</h1>
        <p className="text-muted-foreground mt-1">Cấu hình trải nghiệm ứng dụng của bạn.</p>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border divide-y divide-border">
        
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
              { id: 'default', name: 'Hổ phách', color: 'bg-amber-500' },
              { id: 'pastelpink', name: 'Hồng phấn', color: 'bg-[#FFC0CB]' },
              { id: 'slate', name: 'Xám đá', color: 'bg-slate-500' },
              { id: 'limegreen', name: 'Xanh chanh', color: 'bg-[#32CD32]' },
              { id: 'orangered', name: 'Cam đỏ', color: 'bg-[#FF4500]' },
              { id: 'whitesmoke', name: 'Trắng khói', color: 'bg-[#F5F5F5] border border-gray-300' },
              { id: 'amethyst', name: 'Tím ngọc', color: 'bg-[#9966CC]' },
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
