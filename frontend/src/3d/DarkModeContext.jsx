// src/contexts/DarkModeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'

// 1. Création du contexte avec valeur par défaut
const DarkModeContext = createContext({
  darkMode: true,
  toggleDarkMode: () => {}
})

// 2. Provider
export function DarkModeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(true)

  // Optionnel : persister dans localStorage et appliquer une classe <html>
  useEffect(() => {
    const stored = localStorage.getItem('darkMode')
    if (stored !== null) setDarkMode(stored === 'true')
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(prev => !prev)

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}

// 3. Hook personnalisé pour consommer le contexte
export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider')
  }
  return context
}
