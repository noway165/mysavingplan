"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "@/components/AuthProvider"

import { db } from "@/lib/firebase"
import { Locale, TranslationKeys, t as i18n_t } from "@/lib/i18n"
import { doc as firestoreDoc, getDoc as firestoreGetDoc, setDoc as firestoreSetDoc } from "firebase/firestore"

export type Theme = "light" | "dark"
export type Currency = "VND" | "USD" | "EUR"

type SettingsContextType = {
  theme: Theme
  locale: Locale
  currency: Currency
  setTheme: (theme: Theme) => void
  setLocale: (locale: Locale) => void
  setCurrency: (currency: Currency) => void
  t: (key: keyof TranslationKeys) => string
  formatCurrency: (amount: number) => string
}

const SettingsContext = createContext<SettingsContextType>({
  theme: "light",
  locale: "vi",
  currency: "VND",
  setTheme: () => {},
  setLocale: () => {},
  setCurrency: () => {},
  t: (key) => key,
  formatCurrency: (amount) => amount.toString()
})

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [theme, setThemeState] = useState<Theme>("light")
  const [locale, setLocaleState] = useState<Locale>("vi")
  const [currency, setCurrencyState] = useState<Currency>("VND")
  const [loading, setLoading] = useState(true)

  // Load from firestore
  useEffect(() => {
    async function loadSettings() {
      if (!user) {
        setLoading(false)
        return
      }
      try {
        const docRef = firestoreDoc(db, "users", user.uid, "settings", "preferences")
        const docSnap = await firestoreGetDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data.theme) setThemeState(data.theme as Theme)
          if (data.locale) setLocaleState(data.locale as Locale)
          if (data.currency) setCurrencyState(data.currency as Currency)
        }
      } catch (e) {
        console.error("Failed to load settings", e)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [user])

  // Apply theme to document
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  const saveSettings = async (newTheme: Theme, newLocale: Locale, newCurrency: Currency) => {
    if (!user) return
    try {
      const docRef = firestoreDoc(db, "users", user.uid, "settings", "preferences")
      await firestoreSetDoc(docRef, {
        theme: newTheme,
        locale: newLocale,
        currency: newCurrency,
        updatedAt: new Date()
      }, { merge: true })
    } catch (e) {
      console.error("Failed to save settings", e)
    }
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    saveSettings(newTheme, locale, currency)
  }

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    saveSettings(theme, newLocale, currency)
  }

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    saveSettings(theme, locale, newCurrency)
  }

  const t = (key: keyof TranslationKeys) => {
    return i18n_t(key, locale)
  }

  const formatCurrency = (amount: number) => {
    if (currency === "VND") {
      return amount.toLocaleString("vi-VN") + " ₫"
    } else if (currency === "USD") {
      return "$" + (amount / 25000).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    } else {
      return "€" + (amount / 27000).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  }

  // Prevent flash of incorrect theme
  if (loading && user) {
    return null // or a loading spinner
  }

  return (
    <SettingsContext.Provider value={{ theme, locale, currency, setTheme, setLocale, setCurrency, t, formatCurrency }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
