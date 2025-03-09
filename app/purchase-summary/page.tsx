"use client"

import { useEffect } from "react"
import { useCart } from "@/components/cart-provider"
import { Card } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function PurchaseSummaryPage() {
  const { cart, cartTotalPrice } = useCart()
  const router = useRouter()

  useEffect(() => {
    if (cart.length === 0) {
      router.push("/")
    }
  }, [cart.length, router])

  if (cart.length === 0) return null

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold">¡Compra exitosa!</h1>
          <p className="text-muted-foreground">
            Gracias por tu compra. Recibirás un email con los detalles de tu pedido.
          </p>
        </div>

        <Card className="p-6 space-y-6">
          <h2 className="font-semibold">Resumen de la compra</h2>

          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-16 h-16">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                  <p className="text-sm">ARS {item.price.toLocaleString("es-AR")}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Método de pago</span>
              <span>MercadoPago</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>ARS {cartTotalPrice.toLocaleString("es-AR")}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

