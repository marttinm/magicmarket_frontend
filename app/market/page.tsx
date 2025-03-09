"use client"

import { useEffect, useState } from "react"
import ProductGrid from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar si el usuario tiene acceso al sitio
    const siteAccess = localStorage.getItem("site-access")

    if (siteAccess !== "true") {
      // Si no tiene acceso, redirigir a la página de inicio
      router.push("/")
    } else {
      // Pequeño retraso para evitar parpadeo
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 100)

      return () => clearTimeout(timer)
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
    <div className="flex">
      {/* Sidebar Filters - Fixed position */}
      <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] overflow-y-auto bg-background border-r">
        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-medium text-lg mb-4">Filtros</h3>
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="exterior">
                <AccordionTrigger>Exterior</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {["Field-Tested", "Minimal Wear", "Battle-Scarred", "Well-Worn", "Factory New", "Not Painted"].map(
                      (exterior) => (
                        <div key={exterior} className="flex items-center space-x-2">
                          <Checkbox id={`exterior-${exterior}`} />
                          <Label htmlFor={`exterior-${exterior}`}>{exterior}</Label>
                        </div>
                      ),
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="weapon">
                <AccordionTrigger>Arma</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {["AK-47", "AUG", "AWP", "BAYONET"].map((weapon) => (
                      <div key={weapon} className="flex items-center space-x-2">
                        <Checkbox id={`weapon-${weapon}`} />
                        <Label htmlFor={`weapon-${weapon}`}>{weapon}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="category">
                <AccordionTrigger>Categoría</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {["Normal", "Recuerdo", "StatTrak™", "★", "★ StatTrak™"].map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox id={`category-${category}`} />
                        <Label htmlFor={`category-${category}`}>{category}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="quality">
                <AccordionTrigger>Calidad</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {[
                      "de grado de consumidor",
                      "de grado militar",
                      "de grado industrial",
                      "de tipo restringido",
                      "de tipo clasificado",
                      "de aspecto encubierto",
                      "de grado alto",
                      "de grado básico",
                      "singular",
                      "Distinguido",
                      "Superior",
                      "de aspecto extraordinario",
                      "de aspecto exótico",
                      "Excepcional",
                      "Maestro",
                      "de contrabando",
                    ].map((quality) => (
                      <div key={quality} className="flex items-center space-x-2">
                        <Checkbox id={`quality-${quality}`} />
                        <Label htmlFor={`quality-${quality}`}>{quality}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="price">
                <AccordionTrigger>Precio</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6 pt-2">
                    <Slider defaultValue={[0, 100]} max={100} step={1} />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">$0</span>
                      <span className="text-sm">$1000</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <Separator />

          <div>
            <Button className="w-full">Aplicar filtros</Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Sticky search and sort bar */}
        <div className="sticky top-16 z-40 bg-background border-b">
          <div className="container py-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="search" placeholder="Buscar items..." className="pl-9 w-full" />
              </div>
              <select className="text-sm border rounded-md px-3 py-2 bg-background min-w-[200px]">
                <option>Clasificación por defecto</option>
                <option>Precio: Menor a mayor</option>
                <option>Precio: Mayor a menor</option>
                <option>Más recientes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid - Añadido padding-top para evitar superposición */}
        <div className="container py-6 pt-16">
          <ProductGrid />
        </div>
      </div>
    </div>
  )
}

