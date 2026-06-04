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
    <div className="flex h-screen overflow-hidden relative">
      <Sidebar />
      {/* Main content: add bottom padding for floating mobile bar */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 pt-6 pb-24 lg:pt-8 lg:pb-8">
        <div className="mx-auto max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
