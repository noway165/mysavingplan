"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Target, PieChart, Sparkles, Trophy, Settings, User as UserIcon, LogOut, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSettings } from "@/context/SettingsContext"
import { useAuth } from "@/components/AuthProvider"

export function Sidebar() {
  const pathname = usePathname()
  const { t } = useSettings()
  const { user, signOut } = useAuth()

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

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border shadow-sm text-foreground">
      <div className="flex h-16 items-center px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white">
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
  )
}
