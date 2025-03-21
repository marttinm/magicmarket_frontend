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
import { AlertTriangle, RefreshCw } from "lucide-react"

type ConfirmSyncAllDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function ConfirmSyncAllDialog({ open, onOpenChange, onConfirm }: ConfirmSyncAllDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Sincronizar todos los productos
          </DialogTitle>
          <DialogDescription>¿Estás seguro de que deseas sincronizar todos los productos?</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Esta acción actualizará los datos de todos los productos con la información más reciente de las fuentes
            externas.
          </p>

          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm font-medium">Información importante:</p>
            <ul className="text-sm mt-2 space-y-1 list-disc pl-5">
              <li>
                Esta tarea tiene un tiempo estimado de <span className="font-medium">5-10 minutos</span> para finalizar.
              </li>
              <li>Durante este proceso, los precios de los productos pueden cambiar.</li>
              <li>La sincronización no puede cancelarse una vez iniciada.</li>
              <li>Se recomienda realizar esta acción en horarios de baja actividad.</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Iniciar sincronización
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

