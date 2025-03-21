"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import Image from "next/image"

type ConfirmSyncProductDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: { id: number; name: string; image: string } | null
  onConfirm: () => void
}

export function ConfirmSyncProductDialog({ open, onOpenChange, product, onConfirm }: ConfirmSyncProductDialogProps) {
  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            Sincronizar producto
          </DialogTitle>
          <DialogDescription>¿Estás seguro de que deseas sincronizar el producto "{product.name}"?</DialogDescription>
        </DialogHeader>

        <div className="py-4 flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain" />
          </div>
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-muted-foreground">
              Esta acción actualizará los datos del producto con la información más reciente de las fuentes externas.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            Sincronizar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

