/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { useAuth } from "@/components/AuthProvider"

export type Goal = {
  id: string
  name: string
  target: number
  saved: number
  color: string
  deadline?: string
  createdAt?: unknown
}

export type GoalHistoryEntry = {
  id: string
  type: 'deposit' | 'withdraw'
  amount: number
  date: string
  createdAt?: unknown
}

export function useGoals() {
  const { user } = useAuth()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setGoals([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, "users", user.uid, "goals"),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Goal[]
      setGoals(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const addGoal = async (data: Omit<Goal, "id" | "createdAt">) => {
    if (!user) return
    await addDoc(collection(db, "users", user.uid, "goals"), {
      ...data,
      createdAt: serverTimestamp()
    })
  }

  const updateGoal = async (id: string, data: Partial<Omit<Goal, "id" | "createdAt" | "saved">>) => {
    if (!user) return
    const goalRef = doc(db, "users", user.uid, "goals", id)
    await updateDoc(goalRef, data)
  }
  
  const updateGoalSavedAmount = async (id: string, amount: number) => {
    if (!user) return
    const goalRef = doc(db, "users", user.uid, "goals", id)
    await updateDoc(goalRef, {
      saved: amount
    })
  }

  const withdrawFromGoal = async (id: string, amount: number, currentSaved: number) => {
    if (!user) return
    const goalRef = doc(db, "users", user.uid, "goals", id)
    await updateDoc(goalRef, {
      saved: Math.max(0, currentSaved - amount)
    })
  }

  const deleteGoal = async (id: string) => {
    if (!user) return
    await deleteDoc(doc(db, "users", user.uid, "goals", id))
  }

  const addGoalHistory = async (goalId: string, entry: Omit<GoalHistoryEntry, 'id' | 'createdAt'>) => {
    if (!user) return
    await addDoc(collection(db, "users", user.uid, "goals", goalId, "history"), {
      ...entry,
      createdAt: serverTimestamp()
    })
  }

  return { goals, loading, addGoal, updateGoal, updateGoalSavedAmount, withdrawFromGoal, deleteGoal, addGoalHistory }
}

export function useGoalHistory(goalId: string) {
  const { user } = useAuth()
  const [history, setHistory] = useState<GoalHistoryEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !goalId) {
      setHistory([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, "users", user.uid, "goals", goalId, "history"),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GoalHistoryEntry[]
      setHistory(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user, goalId])

  return { history, loading }
}
