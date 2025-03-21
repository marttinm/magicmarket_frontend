"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ItemCarousel from "@/components/item-carousel"
import XFeed from "@/components/x-feed"
import GuidesSection from "@/components/guides-section"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Zap, Star } from "lucide-react"
import Link from "next/link"

// Función para generar productos de placeholder
const generatePlaceholderProducts = (
  count: number,
  startId: number,
  options: { hot?: boolean; discount?: boolean } = {},
) => {
  const weapons = ["AK-47", "M4A4", "AWP", "Desert Eagle", "USP-S", "Glock-18", "Knife", "Butterfly Knife", "Karambit"]
  const skins = [
    "Case Hardened",
    "Dragon Lore",
    "Fade",
    "Hyper Beast",
    "Neo-Noir",
    "Vulcan",
    "Asiimov",
    "Redline",
    "Doppler",
  ]
  const wears = ["Factory New", "Minimal Wear", "Field-Tested", "Well-Worn", "Battle-Scarred"]

  return Array.from({ length: count }, (_, index) => {
    const price = Math.floor(Math.random() * 1000000) + 10000
    const hasDiscount = options.discount && Math.random() > 0.7
    const discountPercent = hasDiscount ? Math.floor(Math.random() * 30) + 5 : 0
    const oldPrice = hasDiscount ? Math.floor(price * (100 / (100 - discountPercent))) : undefined

    return {
      id: startId + index,
      name: `${weapons[Math.floor(Math.random() * weapons.length)]} | ${skins[Math.floor(Math.random() * skins.length)]}`,
      type: `${wears[Math.floor(Math.random() * wears.length)]} / ${(Math.random() * 0.99 + 0.01).toFixed(4)}`,
      price: price,
      image: "/placeholder.svg?height=200&width=200",
      hot: options.hot && Math.random() > 0.7,
      discount: hasDiscount ? discountPercent : undefined,
      oldPrice: oldPrice,
    }
  })
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [latestItems, setLatestItems] = useState<any[]>([])
  const [newArrivals, setNewArrivals] = useState<any[]>([])
  const [featuredItems, setFeaturedItems] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    // Verificar si el usuario tiene acceso al sitio
    const siteAccess = localStorage.getItem("site-access")

    if (siteAccess !== "true") {
      // Si no tiene acceso, redirigir a la página de inicio
      router.push("/")
    } else {
      // Generar datos de ejemplo
      setLatestItems(generatePlaceholderProducts(10, 1, { hot: true }))
      setNewArrivals(generatePlaceholderProducts(10, 100, { discount: true }))
      setFeaturedItems(generatePlaceholderProducts(10, 200, { hot: true, discount: true }))

      // Pequeño retraso para simular carga
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="container py-8">
      {/* Hero Banner */}
      <div className="w-full bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-8 mb-12">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Bienvenido a MagicMarket</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Tu marketplace de confianza para comprar y vender skins de CS2. Precios competitivos, transacciones seguras
            y miles de items disponibles.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/market">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Explorar Marketplace
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/inventory">
                <Zap className="mr-2 h-5 w-5" />
                Vender mis items
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Últimas unidades */}
      <section className="mb-16">
        <ItemCarousel title="Últimas unidades" items={latestItems} viewAllLink="/market?filter=latest" />
      </section>

      {/* Nuevos ingresos */}
      <section className="mb-16">
        <ItemCarousel title="Nuevos ingresos" items={newArrivals} viewAllLink="/market?filter=new" />
      </section>

      {/* Destacados */}
      <section className="mb-16">
        <ItemCarousel title="Destacados" items={featuredItems} viewAllLink="/market?filter=featured" />
      </section>

      {/* Twitter Feed */}
      <section className="mb-16">
        <XFeed />
      </section>

      {/* Guías y tutoriales */}
      <section className="mb-16">
        <GuidesSection />
      </section>

      {/* CTA Final - Eliminar el botón de tendencias */}
      <section className="bg-primary/5 rounded-xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">¿Listo para mejorar tu inventario?</h2>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
          Miles de jugadores ya confían en MagicMarket para sus transacciones de skins. Únete a la comunidad y descubre
          por qué somos la opción preferida.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/market">
              <Star className="mr-2 h-5 w-5" />
              Ver items destacados
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

