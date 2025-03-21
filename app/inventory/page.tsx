"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ComputerIcon as Steam, Trash2, AlertCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { SteamLoginDialog } from "@/components/steam-login-dialog"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

// Función para generar inventario de placeholder
const generatePlaceholderInventory = (count: number) => {
  const weapons = ["AK-47", "M4A4", "AWP", "Desert Eagle", "USP-S", "Glock-18", "Knife"]
  const skins = ["Case Hardened", "Dragon Lore", "Fade", "Hyper Beast", "Neo-Noir", "Vulcan"]
  const wears = ["Factory New", "Minimal Wear", "Field-Tested", "Well-Worn", "Battle-Scarred"]

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `${weapons[Math.floor(Math.random() * weapons.length)]} | ${skins[Math.floor(Math.random() * skins.length)]}`,
    type: `${wears[Math.floor(Math.random() * wears.length)]} / ${(Math.random() * 0.99 + 0.01).toFixed(4)}`,
    price: Math.floor(Math.random() * 1000000) + 10000,
    image: "/placeholder.svg?height=200&width=200",
    float: Math.random(),
    quality: "De tipo clasificado",
    pattern: Math.floor(Math.random() * 999) + 1,
    recommendedPrice: Math.floor(Math.random() * 1000000) + 10000,
    priceChange: Math.floor(Math.random() * 20) - 10,
  }))
}

// Función para formatear precios de manera consistente
const formatPrice = (price: number) => {
  return price.toLocaleString("es-AR", { minimumFractionDigits: 2 })
}

export default function InventoryPage() {
  const { isSteamConnected } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isInventoryLoading, setIsInventoryLoading] = useState(false)
  const [showSteamLogin, setShowSteamLogin] = useState(false)
  const [inventory, setInventory] = useState<any[]>([])
  const [selectedItems, setSelectedItems] = useState<any[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"mercadopago" | "transfer">()
  const router = useRouter()

  // Calcular el total de los items seleccionados
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0)

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

  // Cargar inventario cuando el usuario está conectado con Steam
  useEffect(() => {
    if (isSteamConnected) {
      loadInventory()
    }
  }, [isSteamConnected])

  const loadInventory = () => {
    setIsInventoryLoading(true)
    // Simular carga de inventario
    setTimeout(() => {
      setInventory(generatePlaceholderInventory(24))
      setIsInventoryLoading(false)
    }, 1500)
  }

  const handleItemSelect = (item: any) => {
    // Verificar si el item ya está seleccionado
    const isSelected = selectedItems.some((selectedItem) => selectedItem.id === item.id)

    if (isSelected) {
      // Si ya está seleccionado, quitarlo de la selección
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem.id !== item.id))
    } else {
      // Si no está seleccionado, agregarlo a la selección
      setSelectedItems([...selectedItems, item])
    }
  }

  const handleRemoveItem = (itemId: number) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== itemId))
  }

  const handleSellItems = () => {
    if (selectedItems.length === 0) return
    setShowConfirmation(true)
  }

  const confirmSell = () => {
    setShowConfirmation(false)
    setShowCheckout(true)
  }

  const handlePayment = () => {
    if (!paymentMethod) return

    // Simular procesamiento de pago
    router.push("/inventory/sell-confirmation")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="container py-8">
      {!isSteamConnected ? (
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Sincroniza tu inventario de Steam</h1>
          <p className="text-muted-foreground mb-8">
            Conecta tu cuenta de Steam para importar automáticamente tu inventario y empezar a comerciar.
          </p>
          <Button size="lg" onClick={() => setShowSteamLogin(true)}>
            <Steam className="mr-2 h-5 w-5" />
            Conectar con Steam
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Tu inventario de Steam</h1>
              <p className="text-muted-foreground">Selecciona los items que deseas vender a MagicMarket</p>
            </div>
            <Button onClick={loadInventory} disabled={isInventoryLoading}>
              {isInventoryLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <Steam className="mr-2 h-4 w-4" />
                  Sincronizar con Steam
                </>
              )}
            </Button>
          </div>

          {isInventoryLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Spinner className="h-8 w-8 mb-4" />
              <p className="text-muted-foreground">Sincronizando tu inventario con Steam...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Panel izquierdo: Inventario del usuario */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Tus items disponibles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {inventory.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No se encontraron items en tu inventario.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {inventory.map((item) => {
                          const isSelected = selectedItems.some((selectedItem) => selectedItem.id === item.id)
                          return (
                            <div
                              key={item.id}
                              className={`relative border rounded-lg overflow-hidden cursor-pointer transition-all ${
                                isSelected
                                  ? "ring-2 ring-primary border-primary bg-primary/5"
                                  : "hover:border-muted-foreground"
                              }`}
                              onClick={() => handleItemSelect(item)}
                            >
                              <div className="aspect-square relative bg-card">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  fill
                                  className="object-contain p-2"
                                />
                              </div>
                              <div className="p-2 bg-card">
                                <h3 className="text-sm font-medium truncate">{item.name}</h3>
                                <p className="text-xs text-muted-foreground truncate">{item.type}</p>
                                <p className="text-sm font-medium mt-1">ARS {formatPrice(item.price)}</p>
                              </div>
                              {isSelected && (
                                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                  ✓
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Panel derecho: Items seleccionados */}
              <div className="space-y-4">
                <Card className="sticky top-20">
                  <CardHeader className="pb-3">
                    <CardTitle>Items seleccionados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedItems.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Selecciona items de tu inventario para venderlos.</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {selectedItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 border rounded-lg p-2">
                            <div className="relative w-12 h-12 flex-shrink-0">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium truncate">{item.name}</h3>
                              <p className="text-xs text-muted-foreground">{item.type}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">ARS {formatPrice(item.price)}</p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemoveItem(item.id)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <Separator />
                  <CardFooter className="flex flex-col items-stretch pt-4">
                    <div className="flex justify-between mb-4">
                      <span className="font-medium">Total a recibir:</span>
                      <span className="font-bold text-lg">ARS {formatPrice(totalPrice)}</span>
                    </div>
                    <Button className="w-full" disabled={selectedItems.length === 0} onClick={handleSellItems}>
                      Vender items seleccionados
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Diálogo de confirmación de venta */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar venta</DialogTitle>
            <DialogDescription>
              Estás a punto de vender los siguientes items por un total de ARS {formatPrice(totalPrice)}?
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {selectedItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 border rounded-lg p-2">
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium truncate">{item.name}</h3>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">ARS {formatPrice(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmSell}>Estoy seguro</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de checkout */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Método de pago</DialogTitle>
            <DialogDescription>Selecciona cómo quieres recibir el pago por tus items.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <RadioGroup onValueChange={(value: "mercadopago" | "transfer") => setPaymentMethod(value)}>
              <div className="flex items-center space-x-2 mb-4">
                <RadioGroupItem value="mercadopago" id="mercadopago" />
                <Label htmlFor="mercadopago" className="flex items-center gap-2">
                  MercadoPago
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="transfer" id="transfer" />
                <Label htmlFor="transfer" className="flex items-center gap-2">
                  Transferencia bancaria
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === "transfer" && (
              <div className="bg-muted p-3 rounded-md text-sm space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <p>Necesitarás proporcionar tus datos bancarios para recibir la transferencia.</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCheckout(false)}>
              Cancelar
            </Button>
            <Button onClick={handlePayment} disabled={!paymentMethod}>
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SteamLoginDialog open={showSteamLogin} onOpenChange={setShowSteamLogin} />
    </div>
  )
}

