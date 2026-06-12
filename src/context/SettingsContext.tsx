"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "@/components/AuthProvider"

import { db } from "@/lib/firebase"
import { Locale, TranslationKeys, t as i18n_t } from "@/lib/i18n"
import { doc as firestoreDoc, getDoc as firestoreGetDoc, setDoc as firestoreSetDoc } from "firebase/firestore"

export type Theme = "light" | "dark"
export type ColorTheme = "default" | "pastelpink" | "worldcup" | "limegreen" | "whitesmoke" | "amethyst" | "spring" | "summer" | "autumn" | "winter" | "vietnam"
export type Currency = "VND" | "USD" | "EUR"

type SettingsContextType = {
  theme: Theme
  colorTheme: ColorTheme
  locale: Locale
  currency: Currency
  setTheme: (theme: Theme) => void
  setColorTheme: (colorTheme: ColorTheme) => void
  setLocale: (locale: Locale) => void
  setCurrency: (currency: Currency) => void
  t: (key: keyof TranslationKeys) => string
  formatCurrency: (amount: number) => string
}

const SettingsContext = createContext<SettingsContextType>({
  theme: "light",
  colorTheme: "default",
  locale: "vi",
  currency: "VND",
  setTheme: () => {},
  setColorTheme: () => {},
  setLocale: () => {},
  setCurrency: () => {},
  t: (key) => key,
  formatCurrency: (amount) => amount.toString()
})

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [theme, setThemeState] = useState<Theme>("dark") // Always default to dark
  const [colorTheme, setColorThemeState] = useState<ColorTheme>("default")
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
          if (data.theme) setThemeState("dark") // Force dark
          if (data.colorTheme) {
            // Migrate peachpuff to pastelpink
            setColorThemeState(data.colorTheme === "peachpuff" ? "pastelpink" : data.colorTheme as ColorTheme)
          }
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
    const html = document.documentElement
    
    // Remove old classes
    html.classList.remove("dark", "theme-peachpuff", "theme-pastelpink", "theme-slate", "theme-limegreen", "theme-orangered", "theme-whitesmoke", "theme-amethyst", "theme-spring", "theme-summer", "theme-autumn", "theme-winter", "theme-vietnam")
    
    // Always add dark mode
    html.classList.add("dark")
    if (colorTheme !== "default") {
      html.classList.add(`theme-${colorTheme}`)
    }
  }, [theme, colorTheme])

  const saveSettings = async (newTheme: Theme, newColorTheme: ColorTheme, newLocale: Locale, newCurrency: Currency) => {
    if (!user) return
    try {
      const docRef = firestoreDoc(db, "users", user.uid, "settings", "preferences")
      await firestoreSetDoc(docRef, {
        theme: newTheme,
        colorTheme: newColorTheme,
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
    saveSettings(newTheme, colorTheme, locale, currency)
  }

  const setColorTheme = (newColorTheme: ColorTheme) => {
    setColorThemeState(newColorTheme)
    saveSettings(theme, newColorTheme, locale, currency)
  }

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    saveSettings(theme, colorTheme, newLocale, currency)
  }

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    saveSettings(theme, colorTheme, locale, newCurrency)
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
    <SettingsContext.Provider value={{ theme, colorTheme, locale, currency, setTheme, setColorTheme, setLocale, setCurrency, t, formatCurrency }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
