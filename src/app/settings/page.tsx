"use client"

import { useSettings, Theme, Currency } from "@/context/SettingsContext"
import { Locale } from "@/lib/i18n"
import { Moon, Sun, Globe, DollarSign } from "lucide-react"

export default function SettingsPage() {
  const { t, theme, setTheme, locale, setLocale, currency, setCurrency } = useSettings()

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('settings')}</h1>
        <p className="text-muted-foreground mt-1">Cấu hình trải nghiệm ứng dụng của bạn.</p>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border divide-y divide-border">
        
        {/* Theme Settings */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">{t('dark_mode')}</h3>
              <p className="text-muted-foreground text-sm">{t('dark_mode_desc')}</p>
            </div>
          </div>
          <div className="flex bg-muted p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 sm:flex-none px-6 py-2 text-sm font-medium rounded-lg transition-colors ${theme === 'light' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Sáng
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 sm:flex-none px-6 py-2 text-sm font-medium rounded-lg transition-colors ${theme === 'dark' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Tối
            </button>
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
