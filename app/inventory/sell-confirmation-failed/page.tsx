"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft, HelpCircle, RefreshCw, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

// Tipos de errores posibles
type ErrorType =
  | "payment_verification"
  | "inventory_sync"
  | "item_unavailable"
  | "price_changed"
  | "system_error"
  | "timeout"
  | "unknown"

// Información detallada para cada tipo de error
const errorDetails: Record<
  ErrorType,
  {
    title: string
    description: string
    solutions: string[]
    canRetry: boolean
  }
> = {
  payment_verification: {
    title: "Error de verificación de pago",
    description: "No pudimos verificar tu método de pago o la transacción fue rechazada.",
    solutions: [
      "Verifica que tu método de pago esté activo y tenga fondos suficientes",
      "Comprueba que no haya restricciones en tu cuenta bancaria",
      "Intenta con un método de pago alternativo",
    ],
    canRetry: true,
  },
  inventory_sync: {
    title: "Error de sincronización de inventario",
    description: "No pudimos sincronizar correctamente tu inventario con Steam.",
    solutions: [
      "Verifica que tu inventario de Steam sea público",
      "Asegúrate de que los items seleccionados estén disponibles en tu inventario",
      "Intenta reconectar tu cuenta de Steam",
    ],
    canRetry: true,
  },
  item_unavailable: {
    title: "Items no disponibles",
    description: "Uno o más items seleccionados ya no están disponibles en tu inventario.",
    solutions: [
      "Verifica que no hayas intercambiado los items recientemente",
      "Comprueba que tu inventario de Steam esté público",
      "Selecciona otros items para vender",
    ],
    canRetry: false,
  },
  price_changed: {
    title: "Cambio de precios",
    description: "Los precios de los items han cambiado desde que iniciaste la transacción.",
    solutions: ["Revisa los nuevos precios de los items", "Inicia una nueva venta con los precios actualizados"],
    canRetry: true,
  },
  system_error: {
    title: "Error del sistema",
    description: "Ha ocurrido un error en nuestros servidores al procesar tu solicitud.",
    solutions: [
      "Espera unos minutos e intenta nuevamente",
      "Si el problema persiste, contacta a nuestro equipo de soporte",
    ],
    canRetry: true,
  },
  timeout: {
    title: "Tiempo de espera agotado",
    description: "La operación ha tardado demasiado tiempo y se ha cancelado automáticamente.",
    solutions: ["Verifica tu conexión a internet", "Intenta nuevamente en un momento de menor tráfico"],
    canRetry: true,
  },
  unknown: {
    title: "Error desconocido",
    description: "Ha ocurrido un error inesperado durante el proceso de venta.",
    solutions: [
      "Intenta nuevamente más tarde",
      "Si el problema persiste, contacta a nuestro equipo de soporte con el código de referencia",
    ],
    canRetry: true,
  },
}

export default function SellConfirmationFailedPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Obtener el tipo de error y el código de referencia de los parámetros de URL
  const errorType = (searchParams?.get("type") as ErrorType) || "unknown"
  const referenceCode = searchParams?.get("ref") || `ERR-${Date.now().toString(36).toUpperCase()}`

  // Obtener los detalles del error
  const error = errorDetails[errorType in errorDetails ? errorType : "unknown"]

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

  const handleRetry = () => {
    // Redirigir al usuario a la página de inventario para intentar nuevamente
    router.push("/inventory")
  }

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
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/inventory")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Venta no completada</h1>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{error.title}</AlertTitle>
          <AlertDescription>{error.description}</AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Información del error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Código de referencia:</p>
              <p className="font-mono bg-muted p-2 rounded text-sm">{referenceCode}</p>
              <p className="text-xs text-muted-foreground">
                Guarda este código para referencia si necesitas contactar a soporte.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="font-medium">Posibles soluciones:</p>
              <ul className="space-y-1 list-disc pl-5 text-sm">
                {error.solutions.map((solution, index) => (
                  <li key={index}>{solution}</li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="flex flex-wrap gap-4 w-full">
              {error.canRetry && (
                <Button className="flex-1" onClick={handleRetry}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Intentar nuevamente
                </Button>
              )}
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/support">
                  <Mail className="mr-2 h-4 w-4" />
                  Contactar soporte
                </Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Si necesitas ayuda adicional, puedes contactarnos en{" "}
              <span className="font-medium">soporte@magicmarket.com</span> o a través de nuestro{" "}
              <Link href="/support" className="text-primary hover:underline">
                centro de ayuda
              </Link>
              .
            </p>
          </CardFooter>
        </Card>

        <div className="flex justify-center">
          <Button variant="ghost" onClick={() => router.push("/home")}>
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  )
}

