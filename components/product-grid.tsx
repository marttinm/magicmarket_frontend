"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Flame, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-provider"
import { Spinner } from "@/components/ui/spinner"
import { ItemDetailDialog } from "@/components/item-detail-dialog"
import { useFavorites } from "@/components/favorites-provider"

// Función para generar productos de placeholder
const generatePlaceholderProducts = (count: number, startId: number) => {
  const weapons = ["AK-47", "M4A4", "AWP", "Desert Eagle", "USP-S", "Glock-18", "Knife"]
  const skins = ["Case Hardened", "Dragon Lore", "Fade", "Hyper Beast", "Neo-Noir", "Vulcan"]
  const wears = ["Factory New", "Minimal Wear", "Field-Tested", "Well-Worn", "Battle-Scarred"]

  return Array.from({ length: count }, (_, index) => ({
    id: startId + index,
    name: `${weapons[Math.floor(Math.random() * weapons.length)]} | ${skins[Math.floor(Math.random() * skins.length)]}`,
    type: `${wears[Math.floor(Math.random() * wears.length)]} / ${(Math.random() * 0.99 + 0.01).toFixed(4)}`,
    price: Math.floor(Math.random() * 1000000) + 10000,
    image: "/placeholder.svg?height=200&width=200",
    hot: Math.random() > 0.8,
    float: Math.random(),
    quality: "De tipo clasificado",
    pattern: Math.floor(Math.random() * 999) + 1,
    recommendedPrice: Math.floor(Math.random() * 1000000) + 10000,
    priceChange: Math.floor(Math.random() * 20) - 10,
    stickers: Array(Math.floor(Math.random() * 4))
      .fill(null)
      .map(() => ({
        name: "Sticker",
        price: Math.floor(Math.random() * 10000),
        wear: Math.random(),
      })),
  }))
}

export default function ProductGrid() {
  const { addToCart } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const [products, setProducts] = useState(generatePlaceholderProducts(24, 1))
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const loadMoreProducts = () => {
    setLoading(true)
    setTimeout(() => {
      const newProducts = generatePlaceholderProducts(24, products.length + 1)
      setProducts([...products, ...newProducts])
      setPage(page + 1)
      setLoading(false)
    }, 1000)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading)
        return
      loadMoreProducts()
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loading]) // Removed loadMoreProducts from dependencies

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative bg-background border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-muted-foreground cursor-pointer h-[300px] flex flex-col"
            onClick={() => setSelectedItem(product)}
          >
            <div className="relative aspect-square overflow-hidden bg-card">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={200}
                height={200}
                className="object-contain w-full h-full p-4"
              />
              {product.hot && (
                <Badge className="absolute top-2 right-2 bg-destructive hover:bg-destructive flex items-center gap-1">
                  <Flame className="h-3 w-3" />
                  Fire
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 left-2 bg-background/50 backdrop-blur-sm hover:bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  if (isFavorite(product.id)) {
                    removeFromFavorites(product.id)
                  } else {
                    addToFavorites(product)
                  }
                }}
              >
                <Heart className={`h-4 w-4 ${isFavorite(product.id) ? "fill-primary text-primary" : ""}`} />
              </Button>
            </div>

            <div className="p-3 flex flex-col flex-1">
              <div className="flex-1">
                <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{product.type}</p>
              </div>
              <div className="mt-2">
                <p className="font-medium">ARS {product.price.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</p>
                <Button
                  className="w-full mt-2"
                  variant="secondary"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    addToCart(product)
                  }}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span className="sr-only">Agregar al carrito</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {loading && (
        <div className="flex justify-center items-center mt-8 col-span-full">
          <Spinner className="w-8 h-8" />
        </div>
      )}

      <ItemDetailDialog isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} item={selectedItem || {}} />
    </>
  )
}

