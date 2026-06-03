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
  
  const updateGoalSavedAmount = async (id: string, amount: number) => {
    if (!user) return
    const goalRef = doc(db, "users", user.uid, "goals", id)
    await updateDoc(goalRef, {
      saved: amount
    })
  }

  const deleteGoal = async (id: string) => {
    if (!user) return
    await deleteDoc(doc(db, "users", user.uid, "goals", id))
  }

  return { goals, loading, addGoal, updateGoalSavedAmount, deleteGoal }
}
