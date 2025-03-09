"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import { CartProvider } from "@/components/cart-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/toaster"
import { ThemeContextProvider } from "@/components/theme-context"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Función para verificar la autenticación
    const checkAuth = () => {
      const authCookie = document.cookie.split(";").some((item) => item.trim().startsWith("auth=true"))
      console.log("Auth cookie detected:", authCookie)
      setIsLoggedIn(authCookie)
    }

    // Verificar al montar
    checkAuth()

    // Verificar cada vez que el documento cambie (por si se actualiza la cookie)
    const interval = setInterval(checkAuth, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    // Renderizado inicial del servidor
    return (
      <ThemeContextProvider>
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col bg-background">
              <main className="flex-1">{children}</main>
            </div>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </ThemeContextProvider>
    )
  }

  return (
    <ThemeContextProvider>
      <AuthProvider>
        <CartProvider>
          <div className="flex min-h-screen flex-col bg-background">
            {isLoggedIn && <Header />}
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </ThemeContextProvider>
  )
}

