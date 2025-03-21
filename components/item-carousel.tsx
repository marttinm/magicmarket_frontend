"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useCart } from "@/components/cart-provider"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ItemDetailDialog } from "@/components/item-detail-dialog"
import { useFavorites } from "@/components/favorites-provider"

type Item = {
  id: number
  name: string
  type: string
  price: number
  image: string
  hot?: boolean
  discount?: number
  oldPrice?: number
}

type ItemCarouselProps = {
  title: string
  items: Item[]
  className?: string
  viewAllLink?: string
}

export default function ItemCarousel({ title, items, className, viewAllLink }: ItemCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const { addToCart } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const updateArrowVisibility = () => {
    if (!carouselRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10) // 10px buffer
  }

  useEffect(() => {
    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener("scroll", updateArrowVisibility)
      // Initial check
      updateArrowVisibility()

      return () => {
        carousel.removeEventListener("scroll", updateArrowVisibility)
      }
    }
  }, [items])

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return

    const carousel = carouselRef.current
    const scrollAmount = carousel.clientWidth * 0.8

    if (direction === "left") {
      carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    } else {
      carousel.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString("es-AR")
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        {viewAllLink && (
          <Link href={viewAllLink} className="text-sm text-primary hover:underline">
            Ver todos
          </Link>
        )}
      </div>

      <div className="relative">
        {showLeftArrow && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm shadow-lg border"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        <div
          ref={carouselRef}
          className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="min-w-[220px] max-w-[220px] snap-start bg-background border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-muted-foreground cursor-pointer flex flex-col"
              onClick={() => {
                setSelectedItem(item)
                setIsDialogOpen(true)
              }}
            >
              <div className="relative aspect-square overflow-hidden bg-card">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-contain w-full h-full p-4"
                />
                {item.hot && (
                  <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
                    Hot
                  </div>
                )}
                {item.discount && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    -{item.discount}%
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-2 right-2 bg-background/50 backdrop-blur-sm hover:bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (isFavorite(item.id)) {
                      removeFromFavorites(item.id)
                    } else {
                      addToFavorites({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        type: item.type,
                      })
                    }
                  }}
                >
                  <Heart className={`h-4 w-4 ${isFavorite(item.id) ? "fill-primary text-primary" : ""}`} />
                </Button>
              </div>

              <div className="p-3 flex flex-col flex-1">
                <div className="flex-1">
                  <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{item.type}</p>
                </div>
                <div className="mt-2">
                  {item.oldPrice ? (
                    <div className="flex items-center gap-2">
                      <p className="font-medium">ARS {formatPrice(item.price)}</p>
                      <p className="text-sm text-muted-foreground line-through">ARS {formatPrice(item.oldPrice)}</p>
                    </div>
                  ) : (
                    <p className="font-medium">ARS {formatPrice(item.price)}</p>
                  )}
                  <Button
                    className="w-full mt-2"
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      addToCart(item)
                    }}
                  >
                    Añadir al carrito
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showRightArrow && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm shadow-lg border"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}
      </div>
      {/* Item Detail Dialog */}
      <ItemDetailDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} item={selectedItem} />
    </div>
  )
}

