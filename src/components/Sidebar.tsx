"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Target, PieChart, Sparkles, Trophy, Settings, User as UserIcon, LogOut, Wallet, Menu } from "lucide-react"
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
    { name: t('profile'), href: "/profile", icon: UserIcon },
    { name: t('settings'), href: "/settings", icon: Settings },
  ]

  // Mobile Floating Bar shows first 4 items
  const mobileNavTabs = navigation.slice(0, 4)
  // Menu contains the rest
  const mobileMenuTabs = navigation.slice(4)

  return (
    <>
      {/* ===== DESKTOP FLOATING DOCK ===== */}
      <div className="hidden sm:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-card/70 backdrop-blur-2xl border border-border/50 shadow-2xl shadow-black/10 rounded-[2rem] p-2 items-center gap-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center justify-center h-14 w-14 rounded-2xl transition-all duration-300 hover:-translate-y-3",
                isActive 
                  ? "bg-primary/20 text-primary shadow-sm" 
                  : "bg-transparent text-muted-foreground hover:bg-card hover:text-foreground shadow-sm hover:shadow-md border border-transparent hover:border-border/50"
              )}
            >
              <item.icon className={cn("h-6 w-6 transition-transform duration-300", isActive && "scale-110")} />
              
              {/* Tooltip */}
              <span className="absolute -top-12 scale-0 group-hover:scale-100 transition-all duration-200 origin-bottom bg-foreground text-background text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl">
                {item.name}
              </span>
              
              {/* Active Dot */}
              {isActive && (
                <span className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
              )}
            </Link>
          )
        })}
        
        <div className="w-px h-8 bg-border/80 mx-2" />
        
        <button
          onClick={signOut}
          className="group relative flex items-center justify-center h-14 w-14 rounded-2xl transition-all duration-300 hover:-translate-y-3 bg-transparent text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 border border-transparent"
        >
          <LogOut className="h-6 w-6" />
          <span className="absolute -top-12 scale-0 group-hover:scale-100 transition-all duration-200 origin-bottom bg-destructive text-destructive-foreground text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl">
            {t('logout')}
          </span>
        </button>
      </div>

      {/* ===== MOBILE BOTTOM SHEET MENU ===== */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-[60] flex items-end justify-center" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" />
          <div 
            className="relative w-full bg-card/95 backdrop-blur-xl rounded-t-[2.5rem] border-t border-border/50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-full duration-300 max-h-[85vh] overflow-y-auto pb-safe pt-2"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full mx-auto mb-6 mt-2" />
            
            <div className="p-4 space-y-2">
              <div className="grid grid-cols-2 gap-3">
                {mobileMenuTabs.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 rounded-2xl p-4 text-sm font-medium transition-all border border-border/50 shadow-sm",
                      pathname === item.href
                        ? "bg-primary/20 text-primary border-primary/20"
                        : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-6 w-6" />
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="border-t border-border/50 my-6" />
              
              {/* User info + logout */}
              <div className="flex items-center justify-between px-2 pb-6">
                <div className="flex items-center gap-4 overflow-hidden bg-muted/50 p-3 rounded-2xl flex-1 mr-4 border border-border/50">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                    {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon size={16} />}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-foreground truncate">
                      {user?.displayName || "Người dùng"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => { signOut(); setMobileMenuOpen(false) }}
                  className="h-16 w-16 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-2xl transition-all flex items-center justify-center shrink-0 border border-destructive/20 shadow-sm"
                >
                  <LogOut size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MOBILE BOTTOM FLOATING NAVIGATION BAR ===== */}
      <div className="sm:hidden fixed bottom-6 left-4 right-4 z-50 bg-card/80 backdrop-blur-2xl border border-border/50 shadow-2xl shadow-black/10 rounded-[2rem] transition-all duration-300">
        <nav className="flex items-center justify-around h-[4.5rem] px-2">
          {mobileNavTabs.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1.5 px-2 py-1 rounded-2xl min-w-[4rem] transition-all duration-300",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl scale-100 animate-in zoom-in-90 duration-300" />
                )}
                <item.icon className={cn("h-6 w-6 z-10 transition-transform duration-300", isActive && "scale-110")} />
                <span className={cn("text-[10px] font-medium leading-none z-10", isActive && "font-bold")}>
                  {item.name}
                </span>
              </Link>
            )
          })}
          
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center gap-1.5 px-2 py-1 rounded-2xl min-w-[4rem] transition-all duration-300 text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            <Menu className="h-6 w-6" />
            <span className="text-[10px] font-medium leading-none">Menu</span>
          </button>
        </nav>
      </div>
    </>
  )
}
