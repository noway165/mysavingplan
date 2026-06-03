/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore"
import { useAuth } from "@/components/AuthProvider"

export type Transaction = {
  id: string
  title: string
  amount: number
  type: "income" | "expense"
  category: string
  date: string
  time: string
  createdAt?: unknown
}

export function useTransactions() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setTransactions([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, "users", user.uid, "transactions"),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[]
      setTransactions(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const addTransaction = async (data: Omit<Transaction, "id" | "createdAt">) => {
    if (!user) return
    await addDoc(collection(db, "users", user.uid, "transactions"), {
      ...data,
      createdAt: serverTimestamp()
    })
  }

  const deleteTransaction = async (id: string) => {
    if (!user) return
    await deleteDoc(doc(db, "users", user.uid, "transactions", id))
  }

  return { transactions, loading, addTransaction, deleteTransaction }
}
