"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/components/ui/use-toast"
import {
  Heart,
  ArrowLeft,
  ShoppingCart,
  Camera,
  Monitor,
  CuboidIcon as Cube,
  ComputerIcon as Steam,
  SlidersHorizontal,
  X,
  Check,
} from "lucide-react"

// Función para generar variantes de ejemplo
const generateVariants = (baseId: number, baseName: string) => {
  const wears = ["Factory New", "Minimal Wear", "Field-Tested", "Well-Worn", "Battle-Scarred"]
  const floatRanges = [
    { min: 0.0, max: 0.07 },
    { min: 0.07, max: 0.15 },
    { min: 0.15, max: 0.38 },
    { min: 0.38, max: 0.45 },
    { min: 0.45, max: 1.0 },
  ]

  // Extraer el nombre base (sin el desgaste)
  const parts = baseName.split(" | ")
  const baseItemName = parts.length >= 2 ? parts[0] + " | " + parts[1].split(" ")[0] : baseName

  return wears.map((wear, index) => {
    const float = (Math.random() * (floatRanges[index].max - floatRanges[index].min) + floatRanges[index].min).toFixed(
      12,
    )
    const price = Math.floor(Math.random() * 500000) + 50000 - index * 50000 // Precios decrecientes según desgaste

    return {
      id: baseId * 10 + index,
      name: `${baseItemName} (${wear})`,
      type: `${wear} / ${float}`,
      price: price,
      image: "/placeholder.svg?height=200&width=200",
      float: Number.parseFloat(float),
      quality: "De tipo clasificado",
      pattern: Math.floor(Math.random() * 999) + 1,
      stickers: Array(Math.floor(Math.random() * 4))
        .fill(null)
        .map(() => ({
          name: "Sticker " + Math.floor(Math.random() * 100),
          price: Math.floor(Math.random() * 10000),
          wear: Math.random(),
        })),
    }
  })
}

// Datos de ejemplo para el item principal
const getItemDetails = (id: string) => {
  const itemId = Number.parseInt(id)
  const baseNames = [
    "AK-47 | Vulcan",
    "AWP | Dragon Lore",
    "M4A4 | Howl",
    "Butterfly Knife | Fade",
    "Sport Gloves | Superconductor",
  ]

  const baseName = baseNames[itemId % baseNames.length]

  return {
    id: itemId,
    name: baseName,
    description: `El ${baseName.split(" | ")[0]} es una de las armas más populares en CS2. La skin ${baseName.split(" | ")[1]} es muy valorada por los coleccionistas debido a su diseño único y su rareza.`,
    image: "/placeholder.svg?height=400&width=400",
    minFloat: 0.0,
    maxFloat: 1.0,
    variants: generateVariants(itemId, baseName),
  }
}

export default function ItemVariantsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { addToCart } = useCart()
  const [isLoading, setIsLoading] = useState(true)
  const [item, setItem] = useState<any>(null)
  const [filteredVariants, setFilteredVariants] = useState<any[]>([])
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [floatRange, setFloatRange] = useState([0, 1])
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [showFilters, setShowFilters] = useState(false)
  const [wearFilters, setWearFilters] = useState({
    "Factory New": true,
    "Minimal Wear": true,
    "Field-Tested": true,
    "Well-Worn": true,
    "Battle-Scarred": true,
  })

  // Cargar datos del item
  useEffect(() => {
    if (!params.id) return

    // Simular carga de datos
    setIsLoading(true)

    setTimeout(() => {
      const itemData = getItemDetails(params.id as string)
      setItem(itemData)
      setFilteredVariants(itemData.variants)
      setSelectedVariant(itemData.variants[0])

      // Establecer rangos de precio basados en las variantes
      const prices = itemData.variants.map((v) => v.price)
      setPriceRange([0, Math.max(...prices)])

      setIsLoading(false)
    }, 1000)
  }, [params.id])

  // Aplicar filtros
  useEffect(() => {
    if (!item) return

    const filtered = item.variants.filter((variant: any) => {
      // Filtrar por float
      if (variant.float < floatRange[0] || variant.float > floatRange[1]) return false

      // Filtrar por precio
      if (variant.price < priceRange[0] || variant.price > priceRange[1]) return false

      // Filtrar por desgaste
      const wear = variant.type.split(" / ")[0]
      if (!wearFilters[wear as keyof typeof wearFilters]) return false

      return true
    })

    setFilteredVariants(filtered)
  }, [item, floatRange, priceRange, wearFilters])

  const handleAddToCart = (variant: any) => {
    addToCart(variant)
    toast({
      title: "Item agregado al carrito",
      description: `${variant.name} se ha agregado al carrito`,
    })
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString("es-AR")
  }

  const toggleWearFilter = (wear: string) => {
    setWearFilters((prev) => ({
      ...prev,
      [wear]: !prev[wear as keyof typeof prev],
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Item no encontrado</h1>
          <Button onClick={() => router.push("/market")}>Volver al mercado</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      {/* Botón de volver */}
      <Button variant="outline" size="sm" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver
      </Button>

      {/* Sección principal del item */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Columna izquierda - Imagen */}
        <div className="relative">
          <div className="relative aspect-square bg-secondary/30 rounded-lg overflow-hidden">
            <Image
              src={selectedVariant?.image || item.image}
              alt={selectedVariant?.name || item.name}
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

          {/* Botones de acción */}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1">
              <Camera className="mr-2 h-4 w-4" />
              Captura
            </Button>
            <Button variant="outline" className="flex-1">
              <Monitor className="mr-2 h-4 w-4" />
              En Juego
            </Button>
            <Button variant="outline" className="flex-1">
              <Cube className="mr-2 h-4 w-4" />
              Vista 3D
            </Button>
            <Button variant="outline" className="flex-1">
              <Steam className="mr-2 h-4 w-4" />
              Steam
            </Button>
          </div>
        </div>

        {/* Columna derecha - Información */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{item.name}</h1>
            <p className="text-muted-foreground mt-2">{item.description}</p>
          </div>

          <Tabs defaultValue="variants" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="variants">Variantes</TabsTrigger>
              <TabsTrigger value="details">Detalles</TabsTrigger>
            </TabsList>

            <TabsContent value="variants" className="space-y-4 pt-4">
              {selectedVariant && (
                <Card className="bg-muted/30">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{selectedVariant.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedVariant.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">ARS {formatPrice(selectedVariant.price)}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Float</span>
                        <span>{selectedVariant.float.toFixed(12)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500">
                        <div
                          className="w-1 h-full bg-white rounded-full relative"
                          style={{
                            left: `${selectedVariant.float * 100}%`,
                            transform: "translateX(-50%)",
                          }}
                        />
                      </div>
                    </div>

                    <Button className="w-full" onClick={() => handleAddToCart(selectedVariant)}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Añadir al carrito
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Filtros */}
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Todas las variantes ({filteredVariants.length})</h3>
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                  {showFilters ? (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Ocultar filtros
                    </>
                  ) : (
                    <>
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Mostrar filtros
                    </>
                  )}
                </Button>
              </div>

              {showFilters && (
                <Card className="bg-muted/20">
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Desgaste</h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(wearFilters).map(([wear, checked]) => (
                          <Button
                            key={wear}
                            variant={checked ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleWearFilter(wear)}
                            className="flex items-center gap-1"
                          >
                            {checked && <Check className="h-3 w-3" />}
                            {wear}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Float</h4>
                      <div className="px-2">
                        <Slider
                          defaultValue={[0, 1]}
                          min={0}
                          max={1}
                          step={0.01}
                          value={floatRange}
                          onValueChange={setFloatRange}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{floatRange[0].toFixed(2)}</span>
                        <span>{floatRange[1].toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Precio (ARS)</h4>
                      <div className="px-2">
                        <Slider
                          defaultValue={[0, 1000000]}
                          min={0}
                          max={1000000}
                          step={10000}
                          value={priceRange}
                          onValueChange={setPriceRange}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>{formatPrice(priceRange[1])}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Lista de variantes */}
              <div className="space-y-2">
                {filteredVariants.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No se encontraron variantes con los filtros seleccionados.</p>
                  </div>
                ) : (
                  filteredVariants.map((variant) => (
                    <div
                      key={variant.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-primary ${
                        selectedVariant?.id === variant.id ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setSelectedVariant(variant)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={variant.image || "/placeholder.svg"}
                            alt={variant.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium">{variant.name}</h3>
                          <p className="text-sm text-muted-foreground">Float: {variant.float.toFixed(12)}</p>
                          {variant.stickers && variant.stickers.length > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <Badge variant="outline" className="bg-purple-500/20 text-purple-400 text-xs">
                                {variant.stickers.length} pegatinas
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold">ARS {formatPrice(variant.price)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-1 h-8 px-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAddToCart(variant)
                            }}
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6 pt-4">
              <div className="space-y-4">
                <h3 className="font-medium">Información general</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Tipo</p>
                    <p>{item.name.split(" | ")[0]}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Skin</p>
                    <p>{item.name.split(" | ")[1]}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Float mínimo</p>
                    <p>{item.minFloat.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Float máximo</p>
                    <p>{item.maxFloat.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Descripción</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Rangos de desgaste</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Factory New</span>
                    <span className="text-sm text-muted-foreground">0.00 - 0.07</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Minimal Wear</span>
                    <span className="text-sm text-muted-foreground">0.07 - 0.15</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Field-Tested</span>
                    <span className="text-sm text-muted-foreground">0.15 - 0.38</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Well-Worn</span>
                    <span className="text-sm text-muted-foreground">0.38 - 0.45</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Battle-Scarred</span>
                    <span className="text-sm text-muted-foreground">0.45 - 1.00</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Sección de items similares */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Items similares</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => {
            const similarItem = {
              id: item.id * 100 + index,
              name: `${item.name.split(" | ")[0]} | ${["Asiimov", "Redline", "Hyper Beast", "Neo-Noir"][index]}`,
              type: "Factory New / 0.01234567890",
              price: Math.floor(Math.random() * 500000) + 50000,
              image: "/placeholder.svg?height=200&width=200",
            }

            return (
              <div
                key={similarItem.id}
                className="border rounded-lg overflow-hidden transition-all hover:shadow-lg hover:border-muted-foreground cursor-pointer"
                onClick={() => router.push(`/item/${similarItem.id}`)}
              >
                <div className="relative aspect-square bg-card">
                  <Image
                    src={similarItem.image || "/placeholder.svg"}
                    alt={similarItem.name}
                    fill
                    className="object-contain p-4"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sm line-clamp-1">{similarItem.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{similarItem.type}</p>
                  <p className="font-medium mt-2">ARS {formatPrice(similarItem.price)}</p>
                  <Button
                    className="w-full mt-2"
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddToCart(similarItem)
                    }}
                  >
                    Añadir al carrito
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

