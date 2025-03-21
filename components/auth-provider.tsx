"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  avatar?: string
  role: "admin" | "user"
}

type AuthContextType = {
  isLoggedIn: boolean
  user: User | null
  login: (role: "admin" | "user", withSteam?: boolean) => void
  logout: () => void
  isAdmin: boolean
  isSteamConnected: boolean
  hasSiteAccess: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isSteamConnected, setIsSteamConnected] = useState(false)
  const [hasSiteAccess, setHasSiteAccess] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Verificar el estado de autenticación al cargar
    const checkAuth = () => {
      try {
        const userSession = localStorage.getItem("user-session")
        const isAdminSession = localStorage.getItem("admin-session") === "true"
        const steamConnected = localStorage.getItem("steam-connected") === "true"
        const siteAccess = localStorage.getItem("site-access") === "true"

        // Establecer acceso al sitio
        setHasSiteAccess(siteAccess)

        // Solo establecer usuario logueado si está conectado con Steam
        if (steamConnected) {
          setIsLoggedIn(true)
          setIsAdmin(isAdminSession)
          setIsSteamConnected(true)

          // Simular datos del usuario
          setUser({
            id: "76561198000000000",
            name: userSession === "admin" ? "Admin" : "Steam User",
            avatar: "/placeholder.svg?height=32&width=32",
            role: isAdminSession ? "admin" : "user",
          })
        } else {
          setIsLoggedIn(false)
          setUser(null)
          setIsAdmin(false)
        }

        // Marcar como inicializado después de la primera verificación
        if (!isInitialized) {
          setIsInitialized(true)
        }
      } catch (error) {
        console.error("Error checking auth:", error)
        if (!isInitialized) {
          setIsInitialized(true)
        }
      }
    }

    // Verificar al montar
    checkAuth()

    // Verificar cuando cambia el almacenamiento local
    const handleStorageChange = () => {
      checkAuth()
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [isInitialized])

  const login = (role: "admin" | "user", withSteam = false) => {
    const userType = role === "admin" ? "admin" : "user"

    // Siempre establecer acceso al sitio
    localStorage.setItem("site-access", "true")
    setHasSiteAccess(true)

    if (role === "admin") {
      localStorage.setItem("admin-session", "true")
      localStorage.setItem("user-session", "admin")
    }

    if (withSteam) {
      localStorage.setItem("steam-connected", "true")
      setIsSteamConnected(true)
      setIsLoggedIn(true)

      // Establecer datos del usuario solo si se conecta con Steam
      setUser({
        id: "76561198000000000",
        name: role === "admin" ? "Admin" : "Steam User",
        avatar: "/placeholder.svg?height=32&width=32",
        role,
      })

      setIsAdmin(role === "admin")
    }
  }

  const logout = () => {
    // Primero actualizamos el estado local para evitar parpadeos
    setIsLoggedIn(false)
    setUser(null)
    setIsAdmin(false)
    setIsSteamConnected(false)

    // Luego actualizamos localStorage
    localStorage.removeItem("user-session")
    localStorage.removeItem("admin-session")
    localStorage.removeItem("steam-connected")

    // Usamos router.push en lugar de window.location para evitar recargas completas
    router.push("/market")
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, isAdmin, isSteamConnected, hasSiteAccess }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

