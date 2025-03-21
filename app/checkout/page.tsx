"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, CreditCard, Building2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { SteamInventoryWarningDialog } from "@/components/steam-inventory-warning-dialog"

export default function CheckoutPage() {
  const { cart, cartTotalPrice } = useCart()
  const [paymentMethod, setPaymentMethod] = useState<"mercadopago" | "transfer">()
  const router = useRouter()
  const [showSteamWarning, setShowSteamWarning] = useState(false)
  const [isSteamInventoryPublic, setIsSteamInventoryPublic] = useState(true)

  // Simular verificación del inventario de Steam
  useEffect(() => {
    // En un caso real, aquí verificarías con una API si el inventario es público
    // Para este ejemplo, simulamos que no es público
    const checkSteamInventory = async () => {
      // Simulación: 70% de probabilidad de que el inventario sea privado
      const isPublic = Math.random() > 0.7
      setIsSteamInventoryPublic(isPublic)
    }

    checkSteamInventory()
  }, [])

  const handlePayment = () => {
    // Verificar si el inventario de Steam es público antes de proceder
    if (!isSteamInventoryPublic) {
      setShowSteamWarning(true)
      return
    }

    if (paymentMethod === "mercadopago") {
      // Simular redirección a MercadoPago
      router.push("/purchase-summary")
    } else if (paymentMethod === "transfer") {
      // Redireccionar a la página de confirmación de transferencia
      router.push("/transfer-confirmation")
    }
  }

  if (cart.length === 0) {
    router.push("/")
    return null
  }

  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold">Checkout</h1>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Resumen del carrito */}
          <Card className="p-6 space-y-4">
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
            <div className="pt-4 border-t">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>ARS {cartTotalPrice.toLocaleString("es-AR")}</span>
              </div>
            </div>
          </Card>

          {/* Método de pago */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="font-semibold mb-4">Método de pago</h2>
              <RadioGroup onValueChange={(value: "mercadopago" | "transfer") => setPaymentMethod(value)}>
                <div className="flex items-center space-x-2 mb-4">
                  <RadioGroupItem value="mercadopago" id="mercadopago" />
                  <Label htmlFor="mercadopago" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    MercadoPago
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="transfer" id="transfer" />
                  <Label htmlFor="transfer" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Transferencia bancaria
                  </Label>
                </div>
              </RadioGroup>
            </Card>

            {paymentMethod === "transfer" && (
              <div className="space-y-4">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Datos bancarios</h3>
                  <div className="space-y-4 text-sm">
                    <p>Banco: Santander</p>
                    <p>Titular: MagicMarket SA</p>
                    <p>CBU: 0720000720000000000000</p>
                    <p>Alias: MAGIC.MARKET.SA</p>
                  </div>
                </Card>

                <Card className="p-6 space-y-4">
                  <h3 className="font-semibold">Comprobante de pago</h3>
                  <Input type="file" accept="image/*" />
                </Card>

                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Advertencia</AlertTitle>
                  <AlertDescription>
                    El envío de un comprobante falso o inválido resultará en el cierre permanente de su cuenta.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <Button className="w-full" disabled={!paymentMethod} onClick={handlePayment}>
              {paymentMethod === "mercadopago" ? "Continuar con MercadoPago" : "Enviar comprobante"}
            </Button>
          </div>
        </div>
      </div>

      {/* Diálogo de advertencia de inventario privado */}
      <SteamInventoryWarningDialog open={showSteamWarning} onOpenChange={setShowSteamWarning} />
    </div>
  )
}

