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
import { PauseCircle, PlayCircle } from "lucide-react"
import Image from "next/image"

type ConfirmProductStatusDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: { id: number; name: string; status: string; image: string } | null
  onConfirm: () => void
}

export function ConfirmProductStatusDialog({
  open,
  onOpenChange,
  product,
  onConfirm,
}: ConfirmProductStatusDialogProps) {
  if (!product) return null

  const isPausing = product.status === "active"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isPausing ? (
              <PauseCircle className="h-5 w-5 text-yellow-500" />
            ) : (
              <PlayCircle className="h-5 w-5 text-green-500" />
            )}
            {isPausing ? "Pausar producto" : "Activar producto"}
          </DialogTitle>
          <DialogDescription>
            {isPausing
              ? `¿Estás seguro de que deseas pausar el producto "${product.name}"?`
              : `¿Estás seguro de que deseas activar el producto "${product.name}"?`}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain" />
          </div>
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-muted-foreground">
              {isPausing
                ? "Al pausar este producto, no será visible para los usuarios en el marketplace."
                : "Al activar este producto, será visible para los usuarios en el marketplace."}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant={isPausing ? "default" : "default"}
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            {isPausing ? "Pausar producto" : "Activar producto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

