"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ComputerIcon as Steam } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { SteamLoginDialog } from "@/components/steam-login-dialog"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"

export default function InventoryPage() {
  const { isSteamConnected } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [showSteamLogin, setShowSteamLogin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Verificar si el usuario tiene acceso al sitio
    const siteAccess = localStorage.getItem("site-access")

    if (siteAccess !== "true") {
      // Si no tiene acceso, redirigir a la página de inicio
      router.push("/")
    } else {
      // Si tiene acceso, mostrar la página
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto text-center">
        {isSteamConnected ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Tu inventario de Steam</h1>
            <p className="text-muted-foreground mb-8">
              Tu cuenta de Steam está conectada. Ahora puedes ver y comerciar tus items.
            </p>
            <Button size="lg">
              <Steam className="mr-2 h-5 w-5" />
              Ver inventario
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Sincroniza tu inventario de Steam</h1>
            <p className="text-muted-foreground mb-8">
              Conecta tu cuenta de Steam para importar automáticamente tu inventario y empezar a comerciar.
            </p>
            <Button size="lg" onClick={() => setShowSteamLogin(true)}>
              <Steam className="mr-2 h-5 w-5" />
              Conectar con Steam
            </Button>
          </>
        )}
      </div>

      <SteamLoginDialog open={showSteamLogin} onOpenChange={setShowSteamLogin} />
    </div>
  )
}

