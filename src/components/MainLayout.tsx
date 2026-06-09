"use client"

import { Sidebar } from "@/components/Sidebar"
import { useAuth } from "@/components/AuthProvider"
import { LoginScreen } from "@/components/LoginScreen"
import { ThemeBackground } from "@/components/ThemeBackground"

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
    <div className="min-h-screen w-full relative bg-background text-foreground transition-colors duration-500 selection:bg-primary/30">
      {/* Nền động tương ứng với Chủ đề (Theme) */}
      <ThemeBackground />

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
