"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export function TestingModeSync() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Esta función se ejecutará cuando cambie el localStorage en otras pestañas
    const handleStorageChange = (e: StorageEvent) => {
      // Si cambia el modo testing
      if (e.key === "testing-mode") {
        const newTestingMode = e.newValue === "true"

        // Si estamos desactivando el modo testing
        if (!newTestingMode) {
          // Asegurar que el usuario tenga acceso al sitio
          localStorage.setItem("site-access", "true")

          // Si estamos en la página de inicio, redirigir a /market
          if (pathname === "/") {
            router.push("/market")
          }
        } else {
          // Si estamos activando el modo testing, quitamos el acceso al sitio
          // SOLO si no estamos en el panel de administración
          if (!pathname.startsWith("/admin")) {
            localStorage.setItem("site-access", "false")
          }
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [pathname, router])

  return null
}

