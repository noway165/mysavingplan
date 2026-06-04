import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { useAuth } from '@/components/AuthProvider'

export type Subscription = {
  id: string
  name: string
  amount: number
  frequency: 'monthly' | 'yearly'
  nextBillingDate: string // YYYY-MM-DD
  category: string
  createdAt?: unknown
}

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setSubscriptions([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'users', user.uid, 'subscriptions'),
      orderBy('nextBillingDate', 'asc')
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const subs: Subscription[] = []
      querySnapshot.forEach((doc) => {
        subs.push({ id: doc.id, ...doc.data() } as Subscription)
      })
      setSubscriptions(subs)
      setLoading(false)
    }, (error) => {
      console.error("Error fetching subscriptions:", error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const addSubscription = async (sub: Omit<Subscription, 'id' | 'createdAt'>) => {
    if (!user) return
    try {
      await addDoc(collection(db, 'users', user.uid, 'subscriptions'), {
        ...sub,
        createdAt: new Date()
      })
    } catch (e) {
      console.error("Error adding subscription: ", e)
    }
  }

  const updateSubscription = async (id: string, sub: Partial<Omit<Subscription, 'id' | 'createdAt'>>) => {
    if (!user) return
    try {
      const subRef = doc(db, 'users', user.uid, 'subscriptions', id)
      await updateDoc(subRef, sub)
    } catch (e) {
      console.error("Error updating subscription: ", e)
    }
  }

  const deleteSubscription = async (id: string) => {
    if (!user) return
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'subscriptions', id))
    } catch (e) {
      console.error("Error deleting subscription: ", e)
    }
  }

  return { subscriptions, loading, addSubscription, updateSubscription, deleteSubscription }
}
