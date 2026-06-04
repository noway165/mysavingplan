"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Target, PieChart, Sparkles, Trophy, Settings, User as UserIcon, LogOut, Wallet, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSettings } from "@/context/SettingsContext"
import { useAuth } from "@/components/AuthProvider"

export function Sidebar() {
  const pathname = usePathname()
  const { t } = useSettings()
  const { user, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: t('dashboard'), href: "/", icon: Home },
    { name: t('transactions'), href: "/transactions", icon: PieChart },
    { name: t('goals'), href: "/goals", icon: Target },
    { name: t('budget'), href: "/budget", icon: Wallet },
    { name: t('gamification'), href: "/gamification", icon: Trophy },
    { name: t('ai_insights'), href: "/insights", icon: Sparkles },
  ]

  const bottomNavigation = [
    { name: t('profile'), href: "/profile", icon: UserIcon },
    { name: t('settings'), href: "/settings", icon: Settings },
  ]

  // Bottom nav tabs for mobile (show 5 main + more)
  const mobileNavTabs = navigation.slice(0, 5)

  return (
    <>
      {/* ===== DESKTOP SIDEBAR (hidden on mobile/tablet) ===== */}
      <div className="hidden lg:flex h-full w-64 flex-col bg-card border-r border-border shadow-sm text-foreground shrink-0">
        <div className="flex h-16 items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white">
              <Sparkles size={18} />
            </div>
            MySavingsPlan
          </Link>
        </div>
        
        <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon 
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors duration-200",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} 
                />
                {item.name}
              </Link>
            )
          })}

          <div className="pt-6 mt-6 border-t border-border">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Hệ thống
            </p>
            {bottomNavigation.map((item) => {
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon 
                    className={cn(
                      "h-5 w-5 shrink-0 transition-colors duration-200",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )} 
                  />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>
        
        {/* User profile & logout */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon size={18} />}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.displayName || "Người dùng"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button 
              onClick={signOut}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors shrink-0"
              title={t('logout')}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ===== MOBILE TOP HEADER (visible on mobile/tablet) ===== */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white">
              <Sparkles size={14} />
            </div>
            MySavingsPlan
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ===== MOBILE SLIDE-DOWN MENU ===== */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 pt-14" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div 
            className="relative bg-card border-b border-border shadow-xl animate-in slide-in-from-top-2 duration-200 max-h-[70vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 space-y-1">
              {/* AI Insights (the 6th tab not in bottom bar) */}
              <Link
                href="/insights"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all",
                  pathname === "/insights"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Sparkles className="h-5 w-5 shrink-0" />
                {t('ai_insights')}
              </Link>

              <div className="border-t border-border my-3" />
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Hệ thống
              </p>
              {bottomNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all",
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {item.name}
                </Link>
              ))}
              
              <div className="border-t border-border my-3" />
              {/* User info + logout */}
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                    {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon size={16} />}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.displayName || "Người dùng"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => { signOut(); setMobileMenuOpen(false) }}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors shrink-0"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MOBILE BOTTOM NAVIGATION BAR ===== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <nav className="flex items-center justify-around h-16 px-1">
          {mobileNavTabs.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-xl min-w-[3.5rem] transition-all duration-200",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "scale-110")} />
                <span className={cn("text-[10px] font-medium leading-tight", isActive && "font-semibold")}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
