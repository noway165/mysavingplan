"use client"

import { Sidebar } from "@/components/Sidebar"
import { useAuth } from "@/components/AuthProvider"
import { LoginScreen } from "@/components/LoginScreen"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoginScreen />
  }

  if (!user) {
    return <LoginScreen />
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      {/* Main content: add padding for mobile top/bottom bars */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 pt-[4.5rem] pb-20 lg:pt-8 lg:pb-8">
        <div className="mx-auto max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  )
}
