"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Monitor, CuboidIcon as Cube, ComputerIcon as Steam, Heart, ExternalLink } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { useState, useEffect } from "react"
// Importar el hook de favoritos
import { useFavorites } from "@/components/favorites-provider"

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
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const { toast } = useToast()
  // Añadir un estado para controlar si el item es favorito
  // Después de las líneas anteriores, añade:
  const [isFav, setIsFav] = useState(false)

  // Actualizar el estado cuando cambia el item
  // Añade este useEffect después del estado:
  useEffect(() => {
    if (item?.id) {
      setIsFav(isFavorite(item.id))
    }
  }, [item, isFavorite])

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

  // Extraer el nombre base del item (sin el desgaste)
  const getBaseItemName = () => {
    if (!item.name) return ""
    // Asumimos que el formato es "Nombre | Skin"
    const parts = item.name.split(" | ")
    if (parts.length >= 2) {
      return parts[0] + " | " + parts[1].split(" ")[0]
    }
    return item.name
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
                  onClick={(e) => {
                    e.stopPropagation()
                    if (item?.id && item?.name && item?.price) {
                      if (isFav) {
                        removeFromFavorites(item.id)
                        setIsFav(false)
                      } else {
                        addToFavorites({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                          type: item.type,
                        })
                        setIsFav(true)
                      }
                    }
                  }}
                >
                  <Heart className={`h-5 w-5 ${isFav ? "fill-primary text-primary" : ""}`} />
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
                </div>

                {/* Botón Ver todas las variantes */}
                <Button variant="outline" className="w-full flex items-center justify-center gap-2" asChild>
                  <Link href={`/item/${item.id}`}>
                    <span>Ver todas las variantes</span>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* Price info */}
              <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
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

