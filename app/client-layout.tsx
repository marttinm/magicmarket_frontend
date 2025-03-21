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
import { usePathname, useRouter } from "next/navigation"
import { TestingModeSync } from "@/components/admin/testing-mode-sync"
// Importar el FavoritesProvider
import { FavoritesProvider } from "@/components/favorites-provider"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [hasSiteAccess, setHasSiteAccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isTestingMode, setIsTestingMode] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Verificar si estamos en el panel de administración
  const isAdminPanel = pathname?.startsWith("/admin") || false

  // Efecto para verificar el acceso al sitio y el modo testing
  useEffect(() => {
    // Verificar si el modo testing está configurado en localStorage
    const testingModeStored = localStorage.getItem("testing-mode")

    // Si no está configurado, activarlo por defecto
    if (testingModeStored === null) {
      localStorage.setItem("testing-mode", "true")
      setIsTestingMode(true)
    } else {
      setIsTestingMode(testingModeStored === "true")
    }

    // Verificar si el usuario tiene acceso al sitio
    const checkAccess = () => {
      // Si estamos en el panel de administración, siempre tenemos acceso
      if (isAdminPanel) {
        setHasSiteAccess(true)
        setIsLoading(false)
        return
      }

      const testingMode = localStorage.getItem("testing-mode") === "true"

      // Si el modo testing está desactivado, automáticamente damos acceso al sitio
      // Si está activado, respetamos el valor actual de site-access
      if (!testingMode && localStorage.getItem("site-access") !== "true") {
        localStorage.setItem("site-access", "true")
      }

      const siteAccess = localStorage.getItem("site-access") === "true"

      // Si el estado cambia, marcar como en transición
      if (hasSiteAccess !== siteAccess || isTestingMode !== testingMode) {
        setIsTransitioning(true)
      }

      setHasSiteAccess(siteAccess)
      setIsTestingMode(testingMode)

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
  }, [hasSiteAccess, isTestingMode, isAdminPanel])

  // Modificar el efecto de redirección para que vaya a /home en lugar de /market
  useEffect(() => {
    // Solo ejecutar cuando la carga inicial ha terminado
    if (!isLoading && !isTransitioning) {
      // No redirigir si estamos en el panel de administración
      if (isAdminPanel) return

      // Si el modo testing está desactivado y estamos en la página de inicio, redirigir a /home
      if (!isTestingMode && pathname === "/") {
        console.log("Redirigiendo a /home porque el modo testing está desactivado")
        router.push("/home")
      }
    }
  }, [isLoading, isTransitioning, isTestingMode, pathname, router, isAdminPanel])

  // Renderizar con un estado de carga suave
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeContextProvider>
          <AuthProvider>
            <CartProvider>
              <FavoritesProvider>
                <TestingModeSync />
                <div className="flex min-h-screen flex-col bg-background">
                  {(hasSiteAccess || isAdminPanel) && <Header />}
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
              </FavoritesProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeContextProvider>
      </body>
    </html>
  )
}

