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
    <div className="h-screen w-full overflow-hidden relative bg-background text-foreground transition-colors duration-500 aurora-background">
      {/* Aurora glow overlays */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-60 mix-blend-screen">
        <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-primary/10 blur-[120px] mix-blend-plus-lighter" />
        <div className="absolute top-[20%] -right-[10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-blue-500/10 blur-[150px] mix-blend-plus-lighter" />
        <div className="absolute -bottom-[20%] left-[20%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full bg-emerald-500/10 blur-[130px] mix-blend-plus-lighter" />
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
