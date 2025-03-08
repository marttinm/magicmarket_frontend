"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Monitor, CuboidIcon as Cube, ComputerIcon as Steam, Heart } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/components/ui/use-toast"

type ItemDetailProps = {
  isOpen: boolean
  onClose: () => void
  item: {
    id?: number
    name?: string
    type?: string
    price?: number
    image?: string
    float?: number
    quality?: string
    pattern?: number
    bluePercentage?: number
    floatValue?: number
    stickerValue?: number
    stickers?: Array<{
      name: string
      price: number
      wear: number
    }>
    recommendedPrice?: number
    priceChange?: number
  } | null
}

export function ItemDetailDialog({ isOpen, onClose, item }: ItemDetailProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()

  if (!item) {
    return null
  }

  const formatPrice = (price?: number) => {
    return price ? price.toLocaleString("es-AR") : "N/A"
  }

  const handleAddToCart = () => {
    if (item.id && item.name && item.price) {
      addToCart({ id: item.id, name: item.name, price: item.price })
      toast({
        title: "Item agregado al carrito",
        description: `${item.name} se ha agregado al carrito`,
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0">
        <div className="flex flex-col">
          {/* Header - Eliminamos completamente el botón X de aquí */}
          <div className="flex items-center p-6 pb-2">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">{item.name || "Nombre del item"}</h2>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                Pegatinas raras
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Left column - Image */}
            <div className="relative">
              <div className="relative aspect-square bg-secondary/30 rounded-lg overflow-hidden">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name || "Item image"}
                  fill
                  className="object-contain p-8"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-background/50 backdrop-blur-sm hover:bg-background/80"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Right column - Info */}
            <div className="space-y-8">
              {/* Float info */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Float</span>
                    <span>{item.float?.toFixed(12) || "0.081651553535"}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500">
                    <div
                      className="w-1 h-full bg-white rounded-full relative"
                      style={{
                        left: `${(item.float || 0) * 100}%`,
                        transform: "translateX(-50%)",
                      }}
                    />
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Calidad</span>
                    <span>{item.quality || "De tipo clasificado"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Patrón</span>
                    <span>{item.pattern || "110"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Azul</span>
                    <span className="text-blue-400">17% / 17%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Float</span>
                    <span className="text-secondary-foreground">+ ARS {formatPrice(2552.84)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pegatinas</span>
                    <span className="text-secondary-foreground">+ ARS {formatPrice(106.37)}</span>
                  </div>
                </div>
              </div>

              {/* Price info */}
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-muted-foreground">Precio recomendado</span>
                  <p className="text-xl font-medium text-green-500">
                    ARS {formatPrice(item.recommendedPrice || 312095.77)}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    El precio que recomendamos basado en los precios de cs.money
                  </span>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground">Precio actual</span>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">ARS {formatPrice(item.price || 294151.41)}</p>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                      -6%
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Action buttons */}
          <div className="flex gap-2 p-6 pt-0">
            <Button variant="outline" className="flex-1">
              <Camera className="mr-2 h-4 w-4" />
              Obtener captura de pantalla
            </Button>
            <Button variant="outline" className="flex-1">
              <Monitor className="mr-2 h-4 w-4" />
              En el Juego
            </Button>
            <Button variant="outline" className="flex-1">
              <Cube className="mr-2 h-4 w-4" />
              Vista 3D
            </Button>
            <Button variant="outline" className="flex-1">
              <Steam className="mr-2 h-4 w-4" />
              En Steam
            </Button>
            <Button className="flex-1" onClick={handleAddToCart}>
              Añadir al carro
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

