"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type Theme = "dark" | "vibrant"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {},
})

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")

  // Apply theme when it changes
  useEffect(() => {
    // Load theme from localStorage on initial mount
    const storedTheme = localStorage.getItem("magicmarket-theme") as Theme | null
    if (storedTheme) {
      setTheme(storedTheme)
    }
  }, [])

  // Apply theme class when theme changes
  useEffect(() => {
    // Apply theme class to document element
    if (theme === "vibrant") {
      document.documentElement.classList.add("vibrant-theme")
    } else {
      document.documentElement.classList.remove("vibrant-theme")
    }

    // Save theme to localStorage
    localStorage.setItem("magicmarket-theme", theme)

    console.log("Theme changed to:", theme)
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useThemeContext() {
  return useContext(ThemeContext)
}

