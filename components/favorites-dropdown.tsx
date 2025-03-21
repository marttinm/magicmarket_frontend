"use client"

import type React from "react"

import { useState } from "react"
import { Heart, Trash2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useFavorites, type FavoriteItem } from "@/components/favorites-provider"
import { useCart } from "@/components/cart-provider"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ItemDetailDialog } from "@/components/item-detail-dialog"

export function FavoritesDropdown() {
  const { favorites, removeFromFavorites, favoritesCount } = useFavorites()
  const { addToCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const [selectedItem, setSelectedItem] = useState<FavoriteItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Ordenar favoritos por fecha (más recientes primero)
  const sortedFavorites = [...favorites].sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime())

  const handleItemClick = (item: FavoriteItem) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
    setIsOpen(false) // Cerrar el dropdown al abrir el diálogo
  }

  const handleAddToCart = (item: FavoriteItem, e: React.MouseEvent) => {
    e.stopPropagation()
    if (item.isAvailable) {
      addToCart({ id: item.id, name: item.name, price: item.price, image: item.image })
    }
  }

  const handleRemoveFromFavorites = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    removeFromFavorites(id)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Heart className="h-5 w-5" />
          {favoritesCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {favoritesCount}
            </span>
          )}
          <span className="sr-only">Favoritos</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel>Mis Favoritos</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[400px] overflow-y-auto">
          <DropdownMenuGroup>
            {sortedFavorites.length > 0 ? (
              sortedFavorites.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  className="flex flex-col items-start p-3 cursor-default"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex justify-between items-start w-full">
                    <div className="flex items-start gap-2">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                        {!item.isAvailable && (
                          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                            <Badge variant="destructive" className="text-xs">
                              Vendido
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        {item.type && <p className="text-xs text-muted-foreground">{item.type}</p>}
                        <p className="text-sm font-medium mt-1">ARS {item.price.toLocaleString("es-AR")}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={(e) => handleRemoveFromFavorites(item.id, e)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn("h-7 w-7 p-0", !item.isAvailable && "opacity-50 cursor-not-allowed")}
                        onClick={(e) => handleAddToCart(item, e)}
                        disabled={!item.isAvailable}
                      >
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="py-6 text-center">
                <Heart className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No tienes items favoritos</p>
                <p className="text-xs text-muted-foreground mt-1">Añade items a favoritos para verlos aquí</p>
              </div>
            )}
          </DropdownMenuGroup>
        </div>
      </DropdownMenuContent>
      <ItemDetailDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} item={selectedItem} />
    </DropdownMenu>
  )
}

