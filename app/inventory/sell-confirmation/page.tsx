"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"

// Función para formatear precios de manera consistente
const formatPrice = (price: number) => {
  return price.toLocaleString("es-AR", { minimumFractionDigits: 2 })
}

export default function SellConfirmationPage() {
  const [isLoading, setIsLoading] = useState(true)
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
    <div className="container py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold">¡Venta exitosa!</h1>
          <p className="text-muted-foreground">Hemos recibido tu solicitud de venta. Procesaremos el pago en breve.</p>
        </div>

        <Card className="p-6 space-y-6">
          <h2 className="font-semibold">Resumen de la venta</h2>

          <div className="pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Método de pago</span>
              <span>MercadoPago</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total a recibir</span>
              <span>ARS {formatPrice(1234567.0)}</span>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
            <p className="font-medium">Próximos pasos:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Nuestro equipo verificará los items en tu inventario.</li>
              <li>Una vez verificados, procesaremos el pago a tu cuenta.</li>
              <li>Recibirás una notificación cuando el pago haya sido realizado.</li>
            </ol>
          </div>
        </Card>

        <div className="flex justify-center">
          <Button onClick={() => router.push("/inventory")}>Volver a mi inventario</Button>
        </div>
      </div>
    </div>
  )
}

