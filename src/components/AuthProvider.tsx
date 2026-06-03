"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from "firebase/auth"

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return {}
    } catch (error: unknown) {
      const e = error as { code?: string }
      if (e.code === "auth/invalid-credential" || e.code === "auth/wrong-password" || e.code === "auth/user-not-found") {
        return { error: "Email hoặc mật khẩu không đúng." }
      }
      if (e.code === "auth/too-many-requests") {
        return { error: "Quá nhiều lần thử. Vui lòng đợi một lát." }
      }
      return { error: "Đã có lỗi xảy ra. Vui lòng thử lại." }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName: name })
      return {}
    } catch (error: unknown) {
      const e = error as { code?: string }
      if (e.code === "auth/email-already-in-use") {
        return { error: "Email này đã được sử dụng." }
      }
      if (e.code === "auth/weak-password") {
        return { error: "Mật khẩu phải có ít nhất 6 ký tự." }
      }
      if (e.code === "auth/invalid-email") {
        return { error: "Email không hợp lệ." }
      }
      return { error: "Đã có lỗi xảy ra. Vui lòng thử lại." }
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error("Lỗi đăng xuất:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
