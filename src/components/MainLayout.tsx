"use client"

import { Sidebar } from "@/components/Sidebar"
import { useAuth } from "@/components/AuthProvider"
import { LoginScreen } from "@/components/LoginScreen"

import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()

  if (loading) {
    return <LoginScreen />
  }

  if (!user) {
    return <LoginScreen />
  }

  return (
    <div className="h-screen w-full overflow-hidden relative bg-background/50 dark:bg-background/90 text-foreground transition-colors duration-500">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-50 dark:opacity-20 mix-blend-screen dark:mix-blend-lighten">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary/20 blur-[100px] animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-blue-500/20 blur-[100px] animate-[pulse_8s_ease-in-out_infinite]" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-emerald-500/10 blur-[120px] animate-[pulse_10s_ease-in-out_infinite]" style={{ animationDelay: '4s' }} />
      </div>

      {/* Main content area */}
      <main className="relative z-10 h-full overflow-y-auto overflow-x-hidden p-4 pb-28 sm:p-6 sm:pl-28 lg:p-8 lg:pl-32 pt-6 scroll-smooth">
        <div className="mx-auto max-w-6xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Dock Navigation */}
      <Sidebar />
    </div>
  )
}
