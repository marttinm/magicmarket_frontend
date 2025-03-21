"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle2, Clock, Truck, CreditCard, MapPin, Copy } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { Spinner } from "@/components/ui/spinner"

// Función para formatear precios
const formatPrice = (price: number) => {
  return price.toLocaleString("es-AR")
}

// Datos de ejemplo para las compras
const purchaseData = [
  {
    id: "ORD-2023-001",
    date: "15/03/2023",
    time: "14:32",
    items: [
      {
        id: 1,
        name: "AWP | Neo-Noir",
        price: 125000,
        image: "/placeholder.svg?height=60&width=60",
        float: 0.081651553535,
        pattern: 110,
        quality: "De tipo clasificado",
      },
    ],
    status: "completed",
    total: 125000,
    paymentMethod: "MercadoPago",
    paymentId: "MP-12345678",
    shippingMethod: "Entrega digital",
    address: null,
    notes: "Entrega inmediata al inventario",
  },
  {
    id: "ORD-2023-002",
    date: "22/04/2023",
    time: "09:15",
    items: [
      {
        id: 2,
        name: "AK-47 | Vulcan",
        price: 87500,
        image: "/placeholder.svg?height=60&width=60",
        float: 0.0345678912,
        pattern: 223,
        quality: "De tipo clasificado",
      },
      {
        id: 3,
        name: "USP-S | Kill Confirmed",
        price: 45000,
        image: "/placeholder.svg?height=60&width=60",
        float: 0.123456789,
        pattern: 432,
        quality: "De tipo clasificado",
      },
    ],
    status: "completed",
    total: 132500,
    paymentMethod: "Transferencia bancaria",
    paymentId: "TB-87654321",
    shippingMethod: "Entrega digital",
    address: null,
    notes: "Pago verificado manualmente",
  },
  {
    id: "ORD-2023-003",
    date: "10/05/2023",
    time: "18:45",
    items: [
      {
        id: 4,
        name: "Butterfly Knife | Fade",
        price: 750000,
        image: "/placeholder.svg?height=60&width=60",
        float: 0.0098765432,
        pattern: 876,
        quality: "★ De aspecto extraordinario",
      },
    ],
    status: "pending",
    total: 750000,
    paymentMethod: "MercadoPago",
    paymentId: "MP-98765432",
    shippingMethod: "Entrega digital",
    address: null,
    notes: "Esperando confirmación de pago",
  },
]

export default function PurchaseDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [purchase, setPurchase] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga de datos
    setLoading(true)
    const orderId = params.id as string

    // Buscar la compra por ID
    const foundPurchase = purchaseData.find((p) => p.id === orderId)

    setTimeout(() => {
      if (foundPurchase) {
        setPurchase(foundPurchase)
      } else {
        // Si no se encuentra la compra, redirigir al perfil
        router.push("/profile")
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se encontró la compra solicitada",
        })
      }
      setLoading(false)
    }, 800)
  }, [params.id, router, toast])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/50">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completada
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado al portapapeles",
      description: "El texto ha sido copiado correctamente",
    })
  }

  if (loading) {
    return (
      <div className="container py-10 flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!purchase) return null

  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/profile?tab=purchases")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Detalles de la compra</h1>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Orden #{purchase.id}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Realizada el {purchase.date} a las {purchase.time}
              </p>
            </div>
            {getStatusBadge(purchase.status)}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Productos */}
            <div>
              <h3 className="font-medium mb-4">Productos</h3>
              <div className="space-y-4">
                {purchase.items.map((item: any) => (
                  <div key={item.id} className="flex gap-4 border rounded-lg p-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                        <p className="text-muted-foreground">
                          Float: <span className="text-foreground">{item.float}</span>
                        </p>
                        <p className="text-muted-foreground">
                          Patrón: <span className="text-foreground">{item.pattern}</span>
                        </p>
                        <p className="text-muted-foreground">
                          Calidad: <span className="text-foreground">{item.quality}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">ARS {formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Información de pago */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-4">Información de pago</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Método de pago:</span>
                    <span className="font-medium">{purchase.paymentMethod}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">ID de pago:</span>
                      <span className="font-medium">{purchase.paymentId}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(purchase.paymentId)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Información de entrega</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Método de entrega:</span>
                    <span className="font-medium">{purchase.shippingMethod}</span>
                  </div>
                  {purchase.address ? (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="text-muted-foreground">Dirección de entrega:</span>
                        <p className="font-medium">{purchase.address}</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <Separator />

            {/* Resumen */}
            <div>
              <h3 className="font-medium mb-4">Resumen</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>ARS {formatPrice(purchase.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Comisión</span>
                  <span>ARS 0.00</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>ARS {formatPrice(purchase.total)}</span>
                </div>
              </div>
            </div>

            {/* Notas */}
            {purchase.notes && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium mb-2">Notas</h3>
                  <p className="text-muted-foreground">{purchase.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

