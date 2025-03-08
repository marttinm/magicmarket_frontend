"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  avatar?: string
}

type AuthContextType = {
  isLoggedIn: boolean
  user: User | null
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Verificar el estado de autenticación al cargar
    const checkAuth = async () => {
      try {
        // Aquí iría la lógica real para verificar la autenticación con Steam
        const hasSession = document.cookie.includes("steam_session=true")
        if (hasSession) {
          setIsLoggedIn(true)
          // Simular datos del usuario de Steam
          setUser({
            id: "76561198000000000",
            name: "SteamUser123",
            avatar: "/placeholder.svg?height=32&width=32",
          })
        }
      } catch (error) {
        console.error("Error checking auth:", error)
      }
    }
    checkAuth()
  }, [])

  const login = () => {
    // Aquí iría la lógica real de autenticación con Steam
    document.cookie = "steam_session=true; path=/"
    setIsLoggedIn(true)
    // Simular datos del usuario de Steam
    setUser({
      id: "76561198000000000",
      name: "SteamUser123",
      avatar: "/placeholder.svg?height=32&width=32",
    })
    router.push("/dashboard")
  }

  const logout = () => {
    document.cookie = "steam_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    setIsLoggedIn(false)
    setUser(null)
    router.push("/")
  }

  return <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

