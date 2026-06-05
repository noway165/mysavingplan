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
    <div className="h-screen w-full overflow-hidden relative bg-background dark:bg-background text-foreground transition-colors duration-500 bg-scifi-grid">
      {/* Noise Overlay */}
      <div className="noise-overlay" />
      {/* Wireframe 3D Sphere & Glow */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-30 mix-blend-screen dark:mix-blend-lighten perspective-[1000px]">
        <motion.div 
          animate={{ rotateY: 360, rotateX: 360 }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          className="absolute -right-[20vw] top-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`y-${i}`} className="absolute inset-0 rounded-full border-[1px] border-primary/30" style={{ transform: `rotateY(${i * 15}deg)` }} />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`x-${i}`} className="absolute inset-0 rounded-full border-[1px] border-primary/30" style={{ transform: `rotateX(${i * 15}deg)` }} />
          ))}
          <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl shadow-[0_0_100px_rgba(var(--color-primary),0.2)]" />
        </motion.div>

        {/* Ambient Glow */}
        <div className="absolute -top-[10%] -left-[10%] w-[40vw] h-[40vw] rounded-full bg-primary/10 blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
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
