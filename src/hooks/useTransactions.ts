/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { useAuth } from "@/components/AuthProvider"

export type Transaction = {
  id: string
  title: string
  amount: number
  type: "income" | "expense"
  category: string
  date: string
  time?: string
  isImpulse?: boolean
  createdAt?: unknown
}

export function useTransactions() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const normalizeDateForDB = (dateStr: string) => {
    if (!dateStr) return new Date().toLocaleDateString("vi-VN");
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-')
      if (parts[0].length === 4) { // YYYY-MM-DD
        return `${parts[2]}/${parts[1]}/${parts[0]}`
      }
    }
    return dateStr
  }

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
      const data = snapshot.docs.map(doc => {
        const d = doc.data()
        return {
          id: doc.id,
          ...d,
          date: normalizeDateForDB(d.date as string)
        }
      }) as Transaction[]
      setTransactions(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const addTransaction = async (data: Omit<Transaction, "id" | "createdAt">) => {
    if (!user) return
    const normalizedData = { ...data, date: normalizeDateForDB(data.date) }
    await addDoc(collection(db, "users", user.uid, "transactions"), {
      ...normalizedData,
      createdAt: serverTimestamp()
    })
  }

  const deleteTransaction = async (id: string) => {
    if (!user) return
    try {
      const txRef = doc(db, 'users', user.uid, 'transactions', id)
      await deleteDoc(txRef)
    } catch (error) {
      console.error("Error deleting transaction:", error)
    }
  }

  const updateTransaction = async (id: string, data: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => {
    if (!user) return
    try {
      const txRef = doc(db, 'users', user.uid, 'transactions', id)
      // Loại bỏ các trường undefined để tránh lỗi Firestore
      const cleanedData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined)
      )
      if (cleanedData.date) {
        cleanedData.date = normalizeDateForDB(cleanedData.date as string)
      }
      await updateDoc(txRef, cleanedData)
    } catch (error) {
      console.error("Error updating transaction:", error)
      alert("Đã có lỗi xảy ra khi lưu: " + (error as Error).message)
    }
  }

  return { transactions, loading, addTransaction, deleteTransaction, updateTransaction }
}
