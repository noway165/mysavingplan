/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { useAuth } from "@/components/AuthProvider"

export type Budget = {
  id: string
  category: string
  limit: number
  month: string // format: 'YYYY-MM'
  createdAt?: unknown
}

export function useBudgets() {
  const { user } = useAuth()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setBudgets([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, "users", user.uid, "budgets"),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Budget[]
      setBudgets(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const addBudget = async (data: Omit<Budget, "id" | "createdAt">) => {
    if (!user) return
    await addDoc(collection(db, "users", user.uid, "budgets"), {
      ...data,
      createdAt: serverTimestamp()
    })
  }

  const updateBudget = async (id: string, data: Partial<Omit<Budget, "id" | "createdAt">>) => {
    if (!user) return
    const budgetRef = doc(db, "users", user.uid, "budgets", id)
    await updateDoc(budgetRef, data)
  }

  const deleteBudget = async (id: string) => {
    if (!user) return
    await deleteDoc(doc(db, "users", user.uid, "budgets", id))
  }

  return { budgets, loading, addBudget, updateBudget, deleteBudget }
}
