"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"

type EditProductDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: any
  onSave: (product: any) => void
}

export function EditProductDialog({ open, onOpenChange, product, onSave }: EditProductDialogProps) {
  const [editedProduct, setEditedProduct] = useState<any>(null)

  // Actualizar el estado cuando cambia el producto o se abre el diálogo
  useEffect(() => {
    if (open && product) {
      setEditedProduct({ ...product })
    }
  }, [open, product])

  const handleChange = (field: string, value: any) => {
    setEditedProduct((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    onSave(editedProduct)
    onOpenChange(false)
  }

  // No renderizar nada si no hay producto o datos editados
  if (!editedProduct) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Item</DialogTitle>
          <DialogDescription>Actualiza la información del item seleccionado.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-12 gap-4">
          {/* Imagen y detalles básicos */}
          <div className="col-span-4 flex flex-col items-center">
            <div className="relative w-32 h-32 mb-2">
              <Image
                src={editedProduct.image || "/placeholder.svg"}
                alt={editedProduct.name}
                fill
                className="object-contain"
              />
            </div>
            <p className="text-xs text-center text-muted-foreground">ID: #{editedProduct.id}</p>
          </div>

          <div className="col-span-8 grid grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="col-span-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" value={editedProduct.name} onChange={(e) => handleChange("name", e.target.value)} />
            </div>

            {/* Categoría y Estado en la misma línea */}
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select value={editedProduct.category} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AWP">AWP</SelectItem>
                  <SelectItem value="Rifle">Rifle</SelectItem>
                  <SelectItem value="Pistola">Pistola</SelectItem>
                  <SelectItem value="Cuchillo">Cuchillo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Estado</Label>
              <Select value={editedProduct.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="paused">Pausado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Precio y Stock */}
            <div>
              <Label htmlFor="price">Precio (ARS)</Label>
              <Input
                id="price"
                type="number"
                value={editedProduct.price}
                onChange={(e) => handleChange("price", Number(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={editedProduct.stock}
                onChange={(e) => handleChange("stock", Number(e.target.value))}
              />
            </div>

            {/* Float y Pattern en la misma línea */}
            <div>
              <Label htmlFor="float">Float</Label>
              <Input
                id="float"
                type="number"
                step="0.000000001"
                value={editedProduct.float}
                onChange={(e) => handleChange("float", Number(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="pattern">Pattern</Label>
              <Input
                id="pattern"
                type="number"
                value={editedProduct.pattern}
                onChange={(e) => handleChange("pattern", Number(e.target.value))}
              />
            </div>
          </div>

          {/* Calidad y Descripción */}
          <div className="col-span-12 grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="quality">Calidad</Label>
              <Select value={editedProduct.quality} onValueChange={(value) => handleChange("quality", value)}>
                <SelectTrigger id="quality">
                  <SelectValue placeholder="Seleccionar calidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="De tipo clasificado">De tipo clasificado</SelectItem>
                  <SelectItem value="★ De aspecto extraordinario">★ De aspecto extraordinario</SelectItem>
                  <SelectItem value="De contrabando">De contrabando</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={editedProduct.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={2}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

