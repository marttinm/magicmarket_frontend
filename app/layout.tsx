"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { useEffect, useState } from "react"
import "./globals.css"
import Header from "@/components/header"
import { CartProvider } from "@/components/cart-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/toaster"
import { ThemeContextProvider } from "@/components/theme-context"
import { Spinner } from "@/components/ui/spinner"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [hasSiteAccess, setHasSiteAccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    // Verificar si el usuario tiene acceso al sitio
    const checkAccess = () => {
      const siteAccess = localStorage.getItem("site-access") === "true"

      // Si el estado cambia, marcar como en transición
      if (hasSiteAccess !== siteAccess) {
        setIsTransitioning(true)
      }

      setHasSiteAccess(siteAccess)

      // Pequeño retraso para evitar parpadeos
      setTimeout(() => {
        setIsLoading(false)
        setIsTransitioning(false)
      }, 100)
    }

    // Verificar al montar
    checkAccess()

    // Verificar cuando cambia el almacenamiento local
    const handleStorageChange = () => {
      checkAccess()
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [hasSiteAccess])

  // Renderizar con un estado de carga suave
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeContextProvider>
          <AuthProvider>
            <CartProvider>
              <div className="flex min-h-screen flex-col bg-background">
                {hasSiteAccess && <Header />}
                <main className="flex-1 relative">
                  {isLoading || isTransitioning ? (
                    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
                      <Spinner className="h-8 w-8" />
                    </div>
                  ) : (
                    children
                  )}
                </main>
              </div>
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeContextProvider>
      </body>
    </html>
  )
}



// import './globals.css'

// export const metadata = {
//       generator: 'v0.dev'
//     };
