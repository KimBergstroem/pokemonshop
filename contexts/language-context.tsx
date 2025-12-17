'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations } from '@/lib/translations'

type Language = 'en' | 'es' | 'ca' | 'sv'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: any
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLang = localStorage?.getItem('language') as Language
    if (savedLang && ['en', 'es', 'ca', 'sv'].includes(savedLang)) {
      setLanguageState(savedLang)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (mounted) {
      localStorage?.setItem('language', lang)
    }
  }

  const t = translations?.[language] ?? translations.en

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
